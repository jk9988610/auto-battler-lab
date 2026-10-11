import fs from "node:fs";
import path from "node:path";
import Database from "better-sqlite3";
import { env } from "./env";
const dir = path.dirname(env.dbPath);
if (dir && dir !== "." && !fs.existsSync(dir)) {
fs.mkdirSync(dir, { recursive: true });
}
export const db = new Database(env.dbPath);
db.pragma("journal_mode = WAL");
db.exec(CREATE TABLE IF NOT EXISTS users ( id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT NOT NULL UNIQUE, password_hash TEXT NOT NULL, created_at INTEGER NOT NULL ););
