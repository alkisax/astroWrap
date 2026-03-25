// backend/src/login/dao/user.dao.ts

import type {
  IUser,
  UserView,
  CreateUserHash,
  UpdateUser,
  Roles,
} from "../types/user.types";

import { UserModel } from "../models/users.models";

import {
  NotFoundError,
  DatabaseError,
  ValidationError,
} from "../../utils/error/errors.types";
import { Types } from "mongoose";

// SAFE MAPPER
export const toUserDAO = (user: IUser): UserView => {
  return {
    id: user._id.toString(),
    username: user.username,
    name: user.name,
    email: user.email,
    roles: user.roles,
    favorites: user.favorites?.map((f) => f.toString()) ?? [],
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
};

// CREATE
const create = async (userData: CreateUserHash): Promise<UserView> => {
  try {
    const user = new UserModel({
      username: userData.username,
      name: userData.name,
      email: userData.email,
      roles: userData.roles ?? ["USER"], // default USER
      hashedPassword: userData.hashedPassword,
    });

    const saved = await user.save();

    return toUserDAO(saved);
  } catch (err: unknown) {
    if (err instanceof Error && (err as any).code === 11000) {
      throw new ValidationError("Username or email already exists");
    }

    throw new DatabaseError("Error creating user");
  }
};

// READ
const readAll = async (): Promise<UserView[]> => {
  const users = await UserModel.find().sort({ createdAt: -1 });
  return users.map((u) => toUserDAO(u));
};

const readById = async (userId: string): Promise<UserView> => {
  const user = await UserModel.findById(userId);
  if (!user) throw new NotFoundError("User not found");
  return toUserDAO(user);
};

const readByUsername = async (username: string): Promise<IUser | null> => {
  return await UserModel.findOne({ username });
};

const readByEmail = async (email: string): Promise<IUser | null> => {
  return await UserModel.findOne({ email });
};

// UPDATE BASIC FIELDS
const update = async (
  userId: string,
  userData: UpdateUser,
): Promise<UserView> => {
  const updated = await UserModel.findByIdAndUpdate(userId, userData, {
    new: true,
  });

  if (!updated) throw new NotFoundError("User not found");

  return toUserDAO(updated);
};

// UPDATE ROLES (ADMIN ONLY ACTION)
const updateRolesById = async (
  userId: string,
  roles: Roles[],
): Promise<UserView> => {
  const user = await UserModel.findById(userId);
  if (!user) throw new NotFoundError("User not found");

  user.roles = roles;

  await user.save({ validateBeforeSave: false });

  return toUserDAO(user);
};

// DELETE
const deleteById = async (userId: string): Promise<UserView> => {
  const deleted = await UserModel.findByIdAndDelete(userId);
  if (!deleted) throw new NotFoundError("User not found");

  return toUserDAO(deleted);
};

const addFavorite = async (
  userId: string,
  menuItemId: string,
): Promise<UserView> => {
  const user = await UserModel.findById(userId);

  if (!user) throw new NotFoundError("User not found");

  const current = user.favorites?.map((f) => f.toString()) ?? [];

  if (!current.includes(menuItemId)) {
    user.favorites = [
      ...(user.favorites ?? []),
      new Types.ObjectId(menuItemId),
    ];
  }

  await user.save();

  return toUserDAO(user);
};

const removeFavorite = async (
  userId: string,
  menuItemId: string,
): Promise<UserView> => {
  const user = await UserModel.findById(userId);

  if (!user) throw new NotFoundError("User not found");

  const filtered = (user.favorites ?? []).filter(
    (id) => id.toString() !== menuItemId,
  );

  user.favorites = filtered;

  await user.save();

  return toUserDAO(user);
};

export const userDAO = {
  toUserDAO,
  create,
  readAll,
  readById,
  readByUsername,
  readByEmail,
  update,
  updateRolesById,
  deleteById,
  addFavorite,
  removeFavorite,
};
