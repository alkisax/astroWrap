// backend/src/login/controllers/user.controller.ts

import bcrypt from "bcrypt";
import type { Request, Response } from "express";
import type { UpdateUser, AuthRequest, Roles } from "../types/user.types";

import { userDAO } from "../dao/user.dao";
import { handleControllerError } from "../../utils/error/errorHandler";
import { createUserSchema, updateUserSchema } from "../validation/auth.schema";

import { UserModel } from "../models/users.models";
import { validateIdParam } from "../../utils/validation/validateObjectIdParam";
import { Types } from "mongoose";

// CREATE USER (ADMIN ONLY)
const create = async (req: Request, res: Response) => {
  try {
    const parsed = createUserSchema.parse(req.body);

    const existing = await UserModel.findOne({
      username: parsed.username,
    });

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
      roles: parsed.roles ?? ["USER"], // default USER
      hashedPassword,
    });

    return res.status(201).json({
      status: true,
      data: newUser,
    });
  } catch (err) {
    return handleControllerError(res, err);
  }
};

// READ
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

const findById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    if (!validateIdParam(id, res, "User ID")) return;

    const user = await userDAO.readById(id);

    return res.status(200).json({
      status: true,
      data: user,
    });
  } catch (err) {
    return handleControllerError(res, err);
  }
};

// UPDATE BASIC FIELDS
const updateById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const requester = req.user;

    if (!requester) {
      return res.status(401).json({
        status: false,
        message: "Unauthorized",
      });
    }

    if (!requester.roles.includes("ADMIN") && requester.id !== id) {
      return res.status(403).json({
        status: false,
        message: "Forbidden",
      });
    }

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

    if (!validateIdParam(id, res, "User ID")) return;

    const updated = await userDAO.update(id, data);

    return res.status(200).json({
      status: true,
      data: updated,
    });
  } catch (err) {
    return handleControllerError(res, err);
  }
};

// UPDATE ROLES (ADMIN ONLY)
const updateRoles = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { roles } = req.body;
    const requester = req.user;

    if (!requester) {
      return res.status(401).json({ status: false });
    }

    if (!requester.roles.includes("ADMIN")) {
      return res.status(403).json({ status: false });
    }

    if (!Array.isArray(roles) || roles.length === 0) {
      return res.status(400).json({
        status: false,
        message: "Roles array required",
      });
    }

    if (!validateIdParam(id, res, "User ID")) return;

    const targetUser = await UserModel.findById(id);
    if (!targetUser) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    // Prevent removing last ADMIN
    if (targetUser.roles.includes("ADMIN") && !roles.includes("ADMIN")) {
      const adminCount = await UserModel.countDocuments({
        roles: "ADMIN",
      });

      if (adminCount <= 1) {
        return res.status(400).json({
          status: false,
          message: "Cannot remove the last ADMIN",
        });
      }
    }

    const updated = await userDAO.updateRolesById(id, roles as Roles[]);

    return res.status(200).json({
      status: true,
      data: updated,
    });
  } catch (err) {
    return handleControllerError(res, err);
  }
};

// DELETE (ADMIN ONLY)
const remove = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const requester = req.user;

    if (!requester) {
      return res.status(401).json({ status: false });
    }

    if (!requester.roles.includes("ADMIN")) {
      return res.status(403).json({ status: false });
    }

    if (!validateIdParam(id, res, "User ID")) return;

    const deleted = await userDAO.deleteById(id);

    return res.status(200).json({
      status: true,
      message: `User ${deleted.username} deleted`,
    });
  } catch (err) {
    return handleControllerError(res, err);
  }
};

const addToFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { commodityId } = req.body;

    if (!commodityId) {
      return res.status(400).json({
        status: false,
        message: "commodityId required",
      });
    }

    const user = await UserModel.findById(id);

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    const favorites = (user.favorites ?? []).map((f) => f.toString());

    if (!favorites.includes(commodityId)) {
      favorites.push(commodityId);
    }

    user.favorites = favorites.map((id) => new Types.ObjectId(id)); // ✅ fix

    await user.save();

    return res.status(200).json({
      status: true,
      data: user,
    });
  } catch (err) {
    return handleControllerError(res, err);
  }
};

const removeFromFavorites = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { commodityId } = req.body;

    const user = await UserModel.findById(id);
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User not found",
      });
    }

    const favorites = (user.favorites ?? []).filter(
      (f) => f.toString() !== commodityId,
    );

    user.favorites = favorites;
    await user.save();

    return res.status(200).json({
      status: true,
      data: user,
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
  updateRoles,
  remove,
  addToFavorites,
  removeFromFavorites,
};
