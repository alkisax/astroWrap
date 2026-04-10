// backend\src\login\types\user.types.sql.ts
import type { Request } from "express";

// ROLES
export type Roles = "ADMIN" | "STAFF" | "USER";

export interface IUser {
  id: number;

  username: string;
  name?: string;
  email?: string;
  role: Roles;
  hashedPassword: string;
  natalChart?: string; // JSON string
  natalDelineation?: string; // text
  createdAt?: string;
  updatedAt?: string;
}

// SAFE USER VIEW (no password)
export interface UserView {
  id: number;
  username: string;
  name?: string;
  email?: string;
  role: Roles;
  natalChart?: string; // JSON string
  natalDelineation?: string; // text
  createdAt?: string;
  updatedAt?: string;
}

// CREATE / UPDATE TYPES
export interface CreateUser {
  username: string;
  name?: string;
  email?: string;
  password: string;
  role?: Roles;
  natalChart?: string; // JSON string
  natalDelineation?: string; // text
}

export interface CreateUserHash {
  username: string;
  name?: string;
  email?: string;
  hashedPassword: string;
  role?: Roles;
  natalChart?: string; // JSON string
  natalDelineation?: string; // text
}

export interface UpdateUser {
  username?: string;
  name?: string;
  role?: Roles;
  password?: string;
  hashedPassword?: string;
  natalChart?: string; // JSON string
  natalDelineation?: string; // text
}

// AUTH REQUEST (for middleware)
export interface AuthRequest extends Request {
  user?: {
    id: number;
    username: string;
    role: Roles;
  };
}

export interface DBUserRow {
  id: number
  username: string
  name?: string
  email?: string
  role: Roles
  hashedPassword: string
  natal_chart?: string
  natal_delineation?: string
  created_at?: string
  updated_at?: string
}
