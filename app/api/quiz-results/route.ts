import { getDB, saveDB } from '@/lib/db'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')

  const db = await getDB()

  if (date) {
    const rows = db.exec(
      'SELECT * FROM quiz_results WHERE date = ? ORDER BY id',
      [date]
    )
    return Response.json(formatRows(rows))
  }

  const rows = db.exec('SELECT * FROM quiz_results ORDER BY id DESC LIMIT 100')
  return Response.json(formatRows(rows))
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { date, exercise_id, selected_answer, is_correct } = body

  if (!date || !exercise_id || selected_answer === undefined || is_correct === undefined) {
    return Response.json({ error: '必須項目が不足しています' }, { status: 400 })
  }

  const db = await getDB()
  db.run(
    `INSERT INTO quiz_results (date, exercise_id, selected_answer, is_correct)
     VALUES (?, ?, ?, ?)`,
    [date, exercise_id, selected_answer, is_correct ? 1 : 0]
  )
  saveDB()

  return Response.json({ success: true })
}

function formatRows(rows: { columns: string[]; values: unknown[][] }[]) {
  if (rows.length === 0) return []
  const cols = rows[0].columns
  return rows[0].values.map((row: unknown[]) => {
    const obj: Record<string, unknown> = {}
    cols.forEach((col: string, i: number) => {
      obj[col] = row[i]
    })
    return obj
  })
}
