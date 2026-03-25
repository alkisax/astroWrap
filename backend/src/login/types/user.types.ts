// backend/src/login/types/user.types.ts
import { Document, Types } from "mongoose";
import type { Request } from "express";

// ROLES (Cafe Context)
export type Roles = "ADMIN" | "STAFF" | "USER";

// FULL MONGOOSE USER
export interface IUser extends Document {
  _id: Types.ObjectId;

  username: string;
  name?: string;
  email?: string;
  roles: Roles[];
  hashedPassword: string;
  favorites?: Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
}

// SAFE USER VIEW (no password)
export interface UserView {
  id: string;
  username: string;
  name?: string;
  email?: string;
  roles: Roles[];
  favorites?: string[];
  createdAt: Date;
  updatedAt: Date;
}

// CREATE / UPDATE TYPES
export interface CreateUser {
  username: string;
  name?: string;
  email?: string;
  password: string;
  roles?: Roles[];
}

export interface CreateUserHash {
  username: string;
  name?: string;
  email?: string;
  hashedPassword: string;
  roles?: Roles[];
}

export interface UpdateUser {
  username?: string;
  name?: string;
  roles?: Roles[];
  password?: string;
  hashedPassword?: string;
  favorites?: string[];
}

// AUTH REQUEST (for middleware)
export interface AuthRequest extends Request {
  user?: {
    id: string;
    username: string;
    roles: Roles[];
  };
}
