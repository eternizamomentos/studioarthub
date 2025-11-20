// db/client.ts
import Database from "better-sqlite3";
import path from "path";

// Caminho absoluto para o arquivo SQLite local
const dbPath = path.join(process.cwd(), "apps", "legal-panel", "db", "legal.sqlite");

// Instância única
let db: Database.Database;

export function getDB() {
  if (!db) {
    db = new Database(dbPath);
    db.pragma("journal_mode = WAL");
    db.pragma("foreign_keys = ON");
  }
  return db;
}

// Pequeno helper para consultas seguras
export function query<T = any>(sql: string, params?: any[]): T[] {
  const stmt = getDB().prepare(sql);
  return params ? stmt.all(params) : stmt.all();
}

// Para inserts/update/delete retornando metadata
export function run(sql: string, params?: any[]) {
  const stmt = getDB().prepare(sql);
  return params ? stmt.run(params) : stmt.run();
}