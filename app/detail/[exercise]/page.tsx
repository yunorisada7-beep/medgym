'use client'

import { useState, useEffect, Suspense } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { MedicalDetail } from '@/components/MedicalDetail'
import { QuizQuestion } from '@/components/QuizQuestion'
import { addViewedQuestion } from '@/lib/storage'
import medicalContent from '@/data/medical-content.json'
import { motion } from 'framer-motion'
import { ArrowLeft, AlertTriangle, Dumbbell } from 'lucide-react'

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

function dateToDayIndex(dateStr: string): number {
  const parts = dateStr.split('-')
  const y = parseInt(parts[0])
  const m = parseInt(parts[1])
  const d = parseInt(parts[2])
  return y * 366 + m * 31 + d
}

interface MedicalInfo {
  muscles: { primary: string[]; secondary: string[] }
  origin: string
  insertion: string
  nerve: string
  diseases: string[]
  clinical_note: string
}

interface QuestionInfo {
  source: string
  question: string
  choices: string[]
  answer: number
  explanation: string
}

function DetailContent() {
  const params = useParams()
  const searchParams = useSearchParams()
  const exerciseId = params.exercise as string
  const exerciseName = searchParams.get('exercise_name') || ''
  const date = searchParams.get('date') || ''

  const [medical, setMedical] = useState<MedicalInfo | null>(null)
  const [question, setQuestion] = useState<QuestionInfo | null>(null)
  const [error, setError] = useState('')

  const isCustom = exerciseId.startsWith('custom_')

  useEffect(() => {
    if (isCustom) return

    const content = contentMap[exerciseId]
    if (!content) {
      setError('このメニューの医学情報はありません。')
      return
    }

    setMedical(content.medical)

    if (date && content.questions.length > 0) {
      const dayIndex = dateToDayIndex(date)
      const questionIndex = dayIndex % content.questions.length
      setQuestion(content.questions[questionIndex])
      addViewedQuestion(date, exerciseId)
    }
  }, [exerciseId, date, isCustom])

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <button onClick={() => window.history.back()} className="p-1.5 rounded-lg hover:bg-[var(--muted)] transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div>
          <h1 className="text-lg font-bold">{exerciseName}</h1>
          <p className="text-xs text-[var(--muted-foreground)]">医学情報・国試問題</p>
        </div>
      </div>

      {isCustom && (
        <div className="card-base p-4 flex items-center gap-3 text-sm text-[var(--muted-foreground)]">
          <AlertTriangle size={18} className="text-yellow-500 flex-shrink-0" />
          このメニューはカスタム登録のため、医学情報はありません
        </div>
      )}

      {error && (
        <div className="card-base p-4 text-sm text-red-500 flex items-center gap-2">
          <AlertTriangle size={16} />
          {error}
        </div>
      )}

      {medical && <MedicalDetail medical={medical} exerciseId={exerciseId} />}

      {question && (
        <div className="card-base p-5 space-y-3">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <span className="text-accent">Q.</span> 今日の国試問題
          </h3>
          <QuizQuestion question={question} exerciseId={exerciseId} date={date} />
        </div>
      )}
    </motion.div>
  )
}

export default function DetailPage() {
  return (
    <Suspense fallback={
      <div className="flex items-center justify-center py-12">
        <Dumbbell size={32} className="text-accent animate-pulse" />
      </div>
    }>
      <DetailContent />
    </Suspense>
  )
}
