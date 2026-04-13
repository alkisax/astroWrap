// backend\src\config\sqlite.ts

import sqlite3 from "sqlite3";

// ενεργοποιούμε verbose για καλύτερα logs/debug
const sql3 = sqlite3.verbose();

// ανοίγουμε/δημιουργούμε το αρχείο db
export const DB = new sql3.Database(
  "./data.db",
  sqlite3.OPEN_READWRITE | sqlite3.OPEN_CREATE,
  (err) => {
    if (err) {
      console.log("❌ sqlite error:", err.message);
      return;
    }
    console.log("✅ connected to sqlite");
  },
);

// init tables (τρέχει μία φορά στο startup)
export const initSqlite = (): void => {
  // 1️⃣ ενεργοποιούμε foreign keys (by default είναι off στο sqlite)
  DB.run("PRAGMA foreign_keys = ON");

  // 2️⃣ ορίζουμε SQL για κάθε table (μόνο definition, όχι εκτέλεση ακόμα)

  const userTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,

      username TEXT NOT NULL UNIQUE,
      name TEXT,
      email TEXT UNIQUE,

      role TEXT NOT NULL DEFAULT 'USER'
        CHECK(role IN ('ADMIN', 'STAFF', 'USER')),

      hashedPassword TEXT NOT NULL,

      natal_chart TEXT,
      natal_delineation TEXT,

      created_at TEXT DEFAULT CURRENT_TIMESTAMP,
      updated_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `;

  const synastryTable = `
    CREATE TABLE IF NOT EXISTS synastry (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,                     -- reference στον user
      text TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id) -- σχέση με users
    )
  `;

  const questionTable = `
    CREATE TABLE IF NOT EXISTS questions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER,
      text TEXT,
      FOREIGN KEY(user_id) REFERENCES users(id)
    )
  `;

  // 3️⃣ εκτελούμε τα CREATE TABLE (σειριακά αλλά async)

  DB.run(userTable, [], (err) => {
    if (err) {
      console.log("❌ error creating users table", err.message);
      return;
    }
    // console.log("✅ users table ready");
  });

  DB.run(synastryTable, [], (err) => {
    if (err) {
      console.log("❌ error creating synastry table", err.message);
      return;
    }
    // console.log("✅ synastry table ready");
  });

  DB.run(questionTable, [], (err) => {
    if (err) {
      console.log("❌ error creating questions table", err.message);
      return;
    }

    // console.log("✅ questions table ready");
  });

  // 4️⃣ αυτό τρέχει sync (δεν περιμένει τα callbacks)
  console.log("✅ sqlite init triggered");
};
