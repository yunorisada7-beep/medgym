'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { MedicalDetail } from '@/components/MedicalDetail'
import { QuizQuestion } from '@/components/QuizQuestion'
import { LoadingCard } from '@/components/LoadingCard'
import { motion } from 'framer-motion'
import { ArrowLeft, AlertTriangle } from 'lucide-react'
import Link from 'next/link'

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

export default function DetailPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const exerciseId = params.exercise as string
  const exerciseName = searchParams.get('exercise_name') || ''
  const muscleGroup = searchParams.get('muscle_group') || ''
  const date = searchParams.get('date') || ''

  const [medical, setMedical] = useState<MedicalInfo | null>(null)
  const [question, setQuestion] = useState<QuestionInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  const isCustom = exerciseId.startsWith('custom_')

  useEffect(() => {
    if (isCustom) {
      setLoading(false)
      return
    }

    const fetchContent = async () => {
      try {
        const res = await fetch(
          `/api/generate-content?exercise_id=${exerciseId}&exercise_name=${encodeURIComponent(exerciseName)}&muscle_group=${muscleGroup}&date=${date}`
        )
        const data = await res.json()

        if (data.error) {
          setError(data.error)
        } else {
          setMedical(data.medical)
          setQuestion(data.question)
        }
      } catch {
        setError('情報を取得できませんでした。再度お試しください。')
      } finally {
        setLoading(false)
      }
    }

    if (exerciseId && exerciseName && muscleGroup && date) {
      fetchContent()
    }
  }, [exerciseId, exerciseName, muscleGroup, date, isCustom])

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

      {loading && !isCustom && (
        <div className="space-y-4">
          <LoadingCard />
          <LoadingCard />
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
