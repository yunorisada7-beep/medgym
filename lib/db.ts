import initSqlJs, { Database } from 'sql.js'
import fs from 'fs'
import path from 'path'

let db: Database | null = null

const DB_PATH = process.env.DATABASE_PATH || './medgym.db'

function getAbsoluteDbPath(): string {
  if (path.isAbsolute(DB_PATH)) return DB_PATH
  return path.join(process.cwd(), DB_PATH)
}

export async function getDB(): Promise<Database> {
  if (db) return db

  const SQL = await initSqlJs()
  const dbPath = getAbsoluteDbPath()

  try {
    if (fs.existsSync(dbPath)) {
      const buffer = fs.readFileSync(dbPath)
      db = new SQL.Database(buffer)
    } else {
      db = new SQL.Database()
    }
  } catch {
    db = new SQL.Database()
  }

  // テーブル作成
  db.run(`
    CREATE TABLE IF NOT EXISTS workouts (
      id            INTEGER PRIMARY KEY AUTOINCREMENT,
      date          TEXT    NOT NULL,
      muscle_group  TEXT    NOT NULL,
      exercise_id   TEXT    NOT NULL,
      exercise_name TEXT    NOT NULL,
      reps          INTEGER NOT NULL,
      sets          INTEGER NOT NULL,
      weight_kg     REAL    NOT NULL DEFAULT 0,
      created_at    TEXT    DEFAULT (datetime('now', 'localtime'))
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS custom_exercises (
      id           INTEGER PRIMARY KEY AUTOINCREMENT,
      muscle_group TEXT    NOT NULL,
      name         TEXT    NOT NULL,
      created_at   TEXT    DEFAULT (datetime('now', 'localtime'))
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS generated_content (
      id             INTEGER PRIMARY KEY AUTOINCREMENT,
      exercise_id    TEXT    NOT NULL,
      date           TEXT    NOT NULL,
      medical_json   TEXT    NOT NULL,
      question_json  TEXT    NOT NULL,
      created_at     TEXT    DEFAULT (datetime('now', 'localtime')),
      UNIQUE(exercise_id, date)
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS viewed_questions (
      id          INTEGER PRIMARY KEY AUTOINCREMENT,
      date        TEXT    NOT NULL,
      exercise_id TEXT    NOT NULL,
      question_id TEXT    NOT NULL
    )
  `)

  db.run(`
    CREATE TABLE IF NOT EXISTS quiz_results (
      id              INTEGER PRIMARY KEY AUTOINCREMENT,
      date            TEXT    NOT NULL,
      exercise_id     TEXT    NOT NULL,
      selected_answer INTEGER NOT NULL,
      is_correct      INTEGER NOT NULL,
      created_at      TEXT    DEFAULT (datetime('now', 'localtime'))
    )
  `)

  return db
}

export function saveDB(): void {
  if (!db) return
  try {
    const data = db.export()
    const buffer = Buffer.from(data)
    const dbPath = getAbsoluteDbPath()
    const dir = path.dirname(dbPath)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(dbPath, buffer)
  } catch (e) {
    console.error('DB保存エラー:', e)
  }
}
