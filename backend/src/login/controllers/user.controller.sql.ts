// backend\src\login\controllers\user.controller.sql.ts
import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import type { UpdateUser, AuthRequest, Roles } from "../types/user.types.sql";

import { userDAO } from "../dao/user.dao.sql";
import { handleControllerError } from "../../utils/error/errorHandler";
import {
  createUserSchema,
  updateUserSchema,
} from "../validation/auth.schema.sql";

// simple id validation (replace mongoose)
const validateId = (id: string): number | null => {
  const parsed = Number(id);
  if (Number.isNaN(parsed)) return null;
  return parsed;
};

/* =========================
   CREATE USER
========================= */
const create = async (req: Request, res: Response) => {
  try {
    const parsed = createUserSchema.parse(req.body);

    const existing = await userDAO.readByUsername(parsed.username);

    if (existing) {
      return res.status(409).json({
        status: false,
        message: "Username already taken",
      });
    }

    const hashedPassword = await bcrypt.hash(parsed.password, 10);

    const newUser = await userDAO.create({
      username: parsed.username,
      name: parsed.name,
      email: parsed.email,
      role: parsed.role ?? "USER",
      hashedPassword,
      natalChart: parsed.natalChart,
      natalDelineation: parsed.natalDelineation,
    });

    return res.status(201).json({
      status: true,
      data: newUser,
    });
  } catch (err) {
    return handleControllerError(res, err);
  }
};

/* =========================
   READ
========================= */
const findAll = async (_req: Request, res: Response) => {
  try {
    const users = await userDAO.readAll();

    return res.status(200).json({
      status: true,
      data: users,
    });
  } catch (err) {
    return handleControllerError(res, err);
  }
};

const findById = async (req: Request<{ id: string }>, res: Response) => {
  try {
    const id = validateId(req.params.id);
    if (!id) {
      return res.status(400).json({ status: false, message: "Invalid ID" });
    }

    const user = await userDAO.readById(id);

    return res.status(200).json({
      status: true,
      data: user,
    });
  } catch (err) {
    return handleControllerError(res, err);
  }
};

/* =========================
   UPDATE
========================= */
const updateById = async (
  req: AuthRequest & { params: { id: string } },
  res: Response,
) => {
  try {
    const id = validateId(req.params.id);
    if (!id) {
      return res.status(400).json({ status: false, message: "Invalid ID" });
    }

    // by pass for testing without auth
    // const requester = req.user;

    // if (!requester) {
    //   return res.status(401).json({ status: false });
    // }

    // if (requester.role !== "ADMIN" && requester.id !== id) {
    //   return res.status(403).json({ status: false });
    // }

    const parsed = updateUserSchema.safeParse(req.body);

    if (!parsed.success) {
      return res.status(400).json({
        status: false,
        details: parsed.error.issues.map((i) => i.message),
      });
    }

    const data = { ...parsed.data } as UpdateUser;

    if (data.password) {
      const hashed = await bcrypt.hash(data.password, 10);
      data.hashedPassword = hashed;
      delete data.password;
    }

    const updated = await userDAO.update(id, data);

    return res.status(200).json({
      status: true,
      data: updated,
    });
  } catch (err) {
    return handleControllerError(res, err);
  }
};

/* =========================
   UPDATE ROLE
========================= */
const updateRole = async (req: AuthRequest & { params: { id: string }}, res: Response) => {
  try {
    if (!req.params.id) throw new Error();

    const id = validateId(req.params.id);
    if (!id) {
      return res.status(400).json({ status: false });
    }

    const { role } = req.body as { role: Roles };
    const requester = req.user;

    if (!requester || requester.role !== "ADMIN") {
      return res.status(403).json({ status: false });
    }

    if (!role) {
      return res.status(400).json({
        status: false,
        message: "Role required",
      });
    }

    const updated = await userDAO.updateRoleById(id, role);

    return res.status(200).json({
      status: true,
      data: updated,
    });
  } catch (err) {
    return handleControllerError(res, err);
  }
};

/* =========================
   DELETE
========================= */
const remove = async (req: AuthRequest & { params: { id: string }}, res: Response) => {
  try {
    if (!req.params.id) throw new Error();
    const id = validateId(req.params.id);
    if (!id) {
      return res.status(400).json({ status: false });
    }

    const requester = req.user;

    if (!requester || requester.role !== "ADMIN") {
      return res.status(403).json({ status: false });
    }

    const deleted = await userDAO.deleteById(id);

    return res.status(200).json({
      status: true,
      message: `User ${deleted.username} deleted`,
    });
  } catch (err) {
    return handleControllerError(res, err);
  }
};

export const userController = {
  create,
  findAll,
  findById,
  updateById,
  updateRole,
  remove,
};
