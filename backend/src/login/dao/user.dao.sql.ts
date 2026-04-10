// backend\src\login\dao\user.dao.sql.ts

/**
 * NOTE:
 * Τα inline σχόλια σε αυτό το αρχείο είναι σκόπιμα και αποτελούν μέρος documentation/εκμάθησης.
 * Εξηγούν το flow της sqlite, τα Promises και το mapping DB → app.
 * Οποιαδήποτε μελλοντική τροποποίηση (refactor / auto-edit / AI tools)
 * θα πρέπει να διατηρεί αυτά τα σχόλια εκτός αν υπάρχει σαφής λόγος αλλαγής.
 * Μην αφαιρείς ή απλοποιείς τα σχόλια χωρίς να διατηρείς την επεξηγηματική τους αξία.
 */

// σε ολα κάνουμε κατι σαν db.all(sql(select),[],()) για να βρούμε τις σχετικές τιμές και μετά μέσα στο callback τις αλλάζουμε με νεο DB.all/get/run.

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
// παίρνει sql γραμμές και μου τις κάνει ένα αντικείμενο που μπορεί να το διαχειριστεί το Node
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
// απλώς μου το επιστρέφει χωρίς pass
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

//  CREATE
const create = (userData: CreateUserHash): Promise<UserView> => {
  return new Promise((resolve, reject) => {
    const sql = `
      INSERT INTO users 
      (username, name, email, role, hashedPassword, natal_chart, natal_delineation)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    // DB.run → write (INSERT / UPDATE / DELETE)
    DB.run(
      // η DB.run παίρνει 3 params (sql,[],callback())
      sql,
      [
        // εδω μπαίνουν οι τιμές που αντιστοιχούν στο VALUES (?, ?, ?, ?, ?, ?, ?)
        userData.username,
        userData.name ?? null,
        userData.email ?? null,
        userData.role ?? "USER",
        userData.hashedPassword,
        userData.natalChart ?? null,
        userData.natalDelineation ?? null,
      ],
      function (err) {
        // η callback κανει fire με το τέλος της sql. Αν err -> handle else παίρνω full row με select
        if (err) {
          console.log("SQL ERROR:", err.message);

          if (err.message?.includes("UNIQUE")) {
            return reject(
              new ValidationError("Username or email already exists"),
            );
          }
          return reject(new DatabaseError("Error creating user"));
        }

        //DB.get → ένα αποτέλεσμα (single row)
        DB.get(
          // αν δεν έχω err
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

//  READ
const readAll = (): Promise<UserView[]> => {
  return new Promise((resolve, reject) => {
    // DB.all → πολλά αποτελέσματα (array)
    DB.all(
      `SELECT * FROM users ORDER BY id DESC`,
      [],
      (err, rows: DBUserRow[]) => {
        // reject(...) = αποτυγχάνει το Promise και πετάει error προς τον caller (π.χ. θα πιαστεί σε try/catch στο await)
        // εδώ αν η sqlite επιστρέψει error, το μετατρέπουμε σε DatabaseError και το προωθούμε
        if (err) return reject(new DatabaseError("Error reading users"));

        // αν οχι err
        // resolve(...) = ολοκληρώνει το Promise επιτυχώς και επιστρέφει τα δεδομένα στον caller (π.χ. await userDAO.readAll())
        // εδώ μετατρέπουμε τα raw DB rows → σε καθαρά UserView objects και τα επιστρέφουμε
        resolve(rows.map((r) => toUserDAO(mapRowToUser(r))));
      },
    );
  });
};

const readById = (userId: number): Promise<UserView> => {
  return new Promise((resolve, reject) => {
    //DB.get → ένα αποτέλεσμα (single row)
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

//  UPDATE
const update = (userId: number, userData: UpdateUser): Promise<UserView> => {
  return new Promise((resolve, reject) => {
    // username = COALESCE(?, username)
    // σημαίνει: - αν δώσεις νέο username → θα γίνει update - αν δώσεις null/undefined → θα μείνει το παλιό
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

    // DB.run → write (INSERT / UPDATE / DELETE)
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

//  UPDATE ROLE
// den γράψαμε ιδικό dao αλλα το επαναχρησιμοποιήσαμε
const updateRoleById = (userId: number, role: Roles): Promise<UserView> => {
  return update(userId, { role });
};

//  DELETE
const deleteById = (userId: number): Promise<UserView> => {
  return new Promise((resolve, reject) => {
    DB.get(
      `SELECT * FROM users WHERE id = ?`,
      [userId],
      (err, row: DBUserRow) => {
        if (err) return reject(new DatabaseError("Error finding user"));
        if (!row) return reject(new NotFoundError("User not found"));

        // DB.run → write (INSERT / UPDATE / DELETE)
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
