// backend\src\login\dao\user.dao.sql.ts
import { DB } from "../../config/sqlite";
import type {
  IUser,
  UserView,
  CreateUserHash,
  UpdateUser,
  Roles,
  DBUserRow,
} from "../types/user.types.sql";

import {
  NotFoundError,
  DatabaseError,
  ValidationError,
} from "../../utils/error/errors.types";

// 🔄 mapper DB → app
const mapRowToUser = (row: DBUserRow): IUser => ({
  id: row.id,
  username: row.username,
  name: row.name,
  email: row.email,
  role: row.role,
  hashedPassword: row.hashedPassword,
  natalChart: row.natal_chart,
  natalDelineation: row.natal_delineation,
  createdAt: row.created_at,
  updatedAt: row.updated_at,
});

// SAFE VIEW
export const toUserDAO = (user: IUser): UserView => ({
  id: user.id,
  username: user.username,
  name: user.name,
  email: user.email,
  role: user.role,
  natalChart: user.natalChart,
  natalDelineation: user.natalDelineation,
  createdAt: user.createdAt,
  updatedAt: user.updatedAt,
});

/* =========================
   CREATE
========================= */
const create = (userData: CreateUserHash): Promise<UserView> => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO users 
      (username, name, email, role, hashedPassword, natal_chart, natal_delineation)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    DB.run(
      sql,
      [
        userData.username,
        userData.name ?? null,
        userData.email ?? null,
        userData.role ?? "USER",
        userData.hashedPassword,
        userData.natalChart ?? null,
        userData.natalDelineation ?? null,
      ],
      function (err) {
        if (err) {
          console.log("SQL ERROR:", err.message);

          if ((err as any).message?.includes("UNIQUE")) {
            return reject(
              new ValidationError("Username or email already exists"),
            );
          }
          return reject(new DatabaseError("Error creating user"));
        }

        DB.get(
          `SELECT * FROM users WHERE id = ?`,
          [this.lastID],
          (err2, row: DBUserRow) => {
            if (err2) return reject(new DatabaseError("Error fetching user"));
            resolve(toUserDAO(mapRowToUser(row)));
          },
        );
      },
    );
  });
};

/* =========================
   READ
========================= */

const readAll = (): Promise<UserView[]> => {
  return new Promise((resolve, reject) => {
    DB.all(
      `SELECT * FROM users ORDER BY id DESC`,
      [],
      (err, rows: DBUserRow[]) => {
        if (err) return reject(new DatabaseError("Error reading users"));

        resolve(rows.map((r) => toUserDAO(mapRowToUser(r))));
      },
    );
  });
};

const readById = (userId: number): Promise<UserView> => {
  return new Promise((resolve, reject) => {
    DB.get(
      `SELECT * FROM users WHERE id = ?`,
      [userId],
      (err, row: DBUserRow) => {
        if (err) return reject(new DatabaseError("Error reading user"));
        if (!row) return reject(new NotFoundError("User not found"));

        resolve(toUserDAO(mapRowToUser(row)));
      },
    );
  });
};

const readByUsername = (username: string): Promise<IUser | null> => {
  return new Promise((resolve, reject) => {
    DB.get(
      `SELECT * FROM users WHERE username = ?`,
      [username],
      (err, row: DBUserRow) => {
        if (err) return reject(new DatabaseError("Error reading user"));
        if (!row) return resolve(null);

        resolve(mapRowToUser(row));
      },
    );
  });
};

const readByEmail = (email: string): Promise<IUser | null> => {
  return new Promise((resolve, reject) => {
    DB.get(
      `SELECT * FROM users WHERE email = ?`,
      [email],
      (err, row: DBUserRow) => {
        if (err) return reject(new DatabaseError("Error reading user"));
        if (!row) return resolve(null);

        resolve(mapRowToUser(row));
      },
    );
  });
};

/* =========================
   UPDATE
========================= */

const update = (userId: number, userData: UpdateUser): Promise<UserView> => {
  return new Promise((resolve, reject) => {
    const sql = `
      UPDATE users SET
        username = COALESCE(?, username),
        name = COALESCE(?, name),
        role = COALESCE(?, role),
        hashedPassword = COALESCE(?, hashedPassword),
        natal_chart = COALESCE(?, natal_chart),
        natal_delineation = COALESCE(?, natal_delineation)
      WHERE id = ?
    `;

    DB.run(
      sql,
      [
        userData.username ?? null,
        userData.name ?? null,
        userData.role ?? null,
        userData.hashedPassword ?? null,
        userData.natalChart ?? null,
        userData.natalDelineation ?? null,
        userId,
      ],
      function (err) {
        if (err) return reject(new DatabaseError("Error updating user"));
        if (this.changes === 0)
          return reject(new NotFoundError("User not found"));

        DB.get(
          `SELECT * FROM users WHERE id = ?`,
          [userId],
          (err2, row: DBUserRow) => {
            if (err2) return reject(new DatabaseError("Error fetching user"));
            resolve(toUserDAO(mapRowToUser(row)));
          },
        );
      },
    );
  });
};

/* =========================
   UPDATE ROLE
========================= */

const updateRoleById = (userId: number, role: Roles): Promise<UserView> => {
  return update(userId, { role });
};

/* =========================
   DELETE
========================= */

const deleteById = (userId: number): Promise<UserView> => {
  return new Promise((resolve, reject) => {
    DB.get(
      `SELECT * FROM users WHERE id = ?`,
      [userId],
      (err, row: DBUserRow) => {
        if (err) return reject(new DatabaseError("Error finding user"));
        if (!row) return reject(new NotFoundError("User not found"));

        DB.run(`DELETE FROM users WHERE id = ?`, [userId], (err2) => {
          if (err2) return reject(new DatabaseError("Error deleting user"));
          resolve(toUserDAO(mapRowToUser(row)));
        });
      },
    );
  });
};

export const userDAO = {
  toUserDAO,
  create,
  readAll,
  readById,
  readByUsername,
  readByEmail,
  update,
  updateRoleById,
  deleteById,
};
