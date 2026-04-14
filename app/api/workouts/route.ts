import { getDB, saveDB } from '@/lib/db'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const date = searchParams.get('date')

  const db = await getDB()

  if (date) {
    const rows = db.exec(
      'SELECT * FROM workouts WHERE date = ? ORDER BY id DESC',
      [date]
    )
    return Response.json(formatRows(rows))
  }

  // 記録のある日付リストを返す
  const rows = db.exec('SELECT DISTINCT date FROM workouts ORDER BY date DESC')
  const dates = rows.length > 0 ? rows[0].values.map((r: unknown[]) => r[0] as string) : []
  return Response.json(dates)
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { date, muscle_group, exercise_id, exercise_name, reps, sets, weight_kg } = body

  if (!date || !muscle_group || !exercise_id || !exercise_name || !reps || !sets) {
    return Response.json({ error: '必須項目が不足しています' }, { status: 400 })
  }

  const db = await getDB()
  db.run(
    `INSERT INTO workouts (date, muscle_group, exercise_id, exercise_name, reps, sets, weight_kg)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [date, muscle_group, exercise_id, exercise_name, reps, sets, weight_kg || 0]
  )
  saveDB()

  return Response.json({ success: true })
}

export async function DELETE(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get('id')

  if (!id) {
    return Response.json({ error: 'IDが必要です' }, { status: 400 })
  }

  const db = await getDB()
  db.run('DELETE FROM workouts WHERE id = ?', [Number(id)])
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
