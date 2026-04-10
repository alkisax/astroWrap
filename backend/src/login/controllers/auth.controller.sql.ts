// backend\src\login\controllers\auth.controller.sql.ts
import type { Request, Response } from 'express'
import bcrypt from 'bcrypt'

import { loginSchema, registerSchema } from '../validation/auth.schema'
import { userDAO } from '../dao/user.dao.sql'
import { authServiceSqlite } from '../services/auth.service.sql'
import { handleControllerError } from '../../utils/error/errorHandler'

/* =========================
   LOGIN
========================= */
const login = async (req: Request, res: Response) => {
  try {
    const parsed = loginSchema.parse(req.body)

    const user = await userDAO.readByUsername(parsed.username)

    if (!user) {
      return res.status(401).json({
        status: false,
        message: 'Invalid username or password',
      })
    }

    const isMatch = await authServiceSqlite.verifyPassword(
      parsed.password,
      user.hashedPassword,
    )

    if (!isMatch) {
      return res.status(401).json({
        status: false,
        message: 'Invalid username or password',
      })
    }

    const token = authServiceSqlite.generateAccessToken(user)

    return res.status(200).json({
      status: true,
      data: {
        token,
        user: {
          id: user.id,
          username: user.username,
          name: user.name,
          email: user.email,
          role: user.role,
        },
      },
    })
  } catch (err) {
    return handleControllerError(res, err)
  }
}

/* =========================
   REGISTER
========================= */
const register = async (req: Request, res: Response) => {
  try {
    const parsed = registerSchema.parse(req.body)

    const existing = await userDAO.readByUsername(parsed.username)
    if (existing) {
      return res.status(409).json({
        status: false,
        message: 'Username already taken',
      })
    }

    const hashedPassword = await bcrypt.hash(parsed.password, 10)

    const newUser = await userDAO.create({
      username: parsed.username,
      name: parsed.name,
      email: parsed.email,
      hashedPassword,
      role: 'USER',
    })

    return res.status(201).json({
      status: true,
      data: newUser,
    })
  } catch (err) {
    return handleControllerError(res, err)
  }
}

/* =========================
   REFRESH TOKEN
========================= */
const refreshToken = async (req: Request, res: Response) => {
  try {
    const token = req.get('authorization')?.replace('Bearer ', '')

    if (!token) {
      return res.status(401).json({ status: false })
    }

    const verification = authServiceSqlite.verifyAccessToken(token)

    if (!verification.verified) {
      return res.status(401).json({ status: false })
    }

    const payload = verification.data as {
      username: string
    }

    const dbUser = await userDAO.readByUsername(payload.username)

    if (!dbUser) {
      return res.status(401).json({ status: false })
    }

    const newToken = authServiceSqlite.generateAccessToken(dbUser)

    return res.status(200).json({
      status: true,
      data: { token: newToken },
    })
  } catch (err) {
    return handleControllerError(res, err)
  }
}

export const authControllerSqlite = {
  login,
  register,
  refreshToken,
}