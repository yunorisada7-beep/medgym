import { getDB, saveDB } from '@/lib/db'
import medicalContent from '@/data/medical-content.json'

const contentMap = medicalContent as Record<string, {
  medical: {
    muscles: { primary: string[]; secondary: string[] }
    origin: string
    insertion: string
    nerve: string
    diseases: string[]
    clinical_note: string
  }
  questions: {
    source: string
    question: string
    choices: string[]
    answer: number
    explanation: string
  }[]
}>

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const exerciseId = searchParams.get('exercise_id')
  const date = searchParams.get('date')

  if (!exerciseId || !date) {
    return Response.json({ error: 'パラメータ不足' }, { status: 400 })
  }

  // 静的データから取得
  const content = contentMap[exerciseId]
  if (!content) {
    return Response.json(
      { error: 'このメニューの医学情報はありません。' },
      { status: 404 }
    )
  }

  // 日付に基づいて問題を選択（日替わり）
  const dayIndex = dateToDayIndex(date)
  const questionIndex = dayIndex % content.questions.length
  const question = content.questions[questionIndex]

  // viewed_questions に記録
  try {
    const db = await getDB()
    const questionId = `${exerciseId}_${date}`
    db.run(
      'INSERT INTO viewed_questions (date, exercise_id, question_id) VALUES (?, ?, ?)',
      [date, exerciseId, questionId]
    )
    saveDB()
  } catch {
    // DB エラーは無視（閲覧記録が残らないだけ）
  }

  return Response.json({
    medical: content.medical,
    question,
    cached: true,
  })
}

function dateToDayIndex(dateStr: string): number {
  const parts = dateStr.split('-')
  const y = parseInt(parts[0])
  const m = parseInt(parts[1])
  const d = parseInt(parts[2])
  return y * 366 + m * 31 + d
}
