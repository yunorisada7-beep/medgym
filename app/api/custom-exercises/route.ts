import { getDB, saveDB } from '@/lib/db'
import { NextRequest } from 'next/server'

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url)
  const muscleGroup = searchParams.get('muscle_group')

  const db = await getDB()

  if (muscleGroup) {
    const rows = db.exec(
      'SELECT * FROM custom_exercises WHERE muscle_group = ? ORDER BY name',
      [muscleGroup]
    )
    return Response.json(formatRows(rows))
  }

  const rows = db.exec('SELECT * FROM custom_exercises ORDER BY muscle_group, name')
  return Response.json(formatRows(rows))
}

export async function POST(req: NextRequest) {
  const body = await req.json()
  const { muscle_group, name } = body

  if (!muscle_group || !name) {
    return Response.json({ error: '部位と名前は必須です' }, { status: 400 })
  }

  const db = await getDB()
  db.run(
    'INSERT INTO custom_exercises (muscle_group, name) VALUES (?, ?)',
    [muscle_group, name]
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
