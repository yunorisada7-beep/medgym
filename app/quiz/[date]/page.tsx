'use client'

import { useState, useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { QuizQuestion } from '@/components/QuizQuestion'
import { LoadingCard } from '@/components/LoadingCard'
import { getWorkouts } from '@/lib/storage'
import medicalContent from '@/data/medical-content.json'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowLeft, ArrowRight, RotateCcw, Home, Trophy } from 'lucide-react'

const contentMap = medicalContent as Record<string, {
  medical: unknown
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

interface QuestionData {
  exercise_id: string
  exercise_name: string
  question: {
    source: string
    question: string
    choices: string[]
    answer: number
    explanation: string
  }
}

export default function QuizPage() {
  const params = useParams()
  const router = useRouter()
  const date = params.date as string

  const [questions, setQuestions] = useState<QuestionData[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [results, setResults] = useState<boolean[]>([])
  const [loading, setLoading] = useState(true)
  const [showScore, setShowScore] = useState(false)
  const [answered, setAnswered] = useState(false)

  useEffect(() => {
    getWorkouts(date).then((workouts) => {
      if (!workouts || workouts.length === 0) {
        setLoading(false)
        return
      }

      const qList: QuestionData[] = []
      const dayIndex = dateToDayIndex(date)

      for (const w of workouts) {
        if (w.exercise_id.startsWith('custom_')) continue
        const content = contentMap[w.exercise_id]
        if (!content || !content.questions.length) continue
        const questionIndex = dayIndex % content.questions.length
        qList.push({
          exercise_id: w.exercise_id,
          exercise_name: w.exercise_name,
          question: content.questions[questionIndex],
        })
      }

      // 重複除外
      const unique = qList.filter(
        (q, i, arr) => arr.findIndex((x) => x.exercise_id === q.exercise_id) === i
      )
      setQuestions(unique)
      setLoading(false)
    })
  }, [date])

  const handleAnswered = (isCorrect: boolean) => {
    setResults((prev) => [...prev, isCorrect])
    setAnswered(true)
  }

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((prev) => prev + 1)
      setAnswered(false)
    } else {
      setShowScore(true)
    }
  }

  const handleRetryWrong = () => {
    const wrongQuestions = questions.filter((_, i) => !results[i])
    if (wrongQuestions.length > 0) {
      setQuestions(wrongQuestions)
      setCurrentIndex(0)
      setResults([])
      setShowScore(false)
      setAnswered(false)
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <LoadingCard />
        <LoadingCard />
      </div>
    )
  }

  if (questions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-center space-y-4 py-12"
      >
        <p className="text-[var(--muted-foreground)]">
          本日はまだ詳細を確認していません
        </p>
        <button
          onClick={() => router.push('/')}
          className="inline-flex items-center gap-2 px-4 py-2 bg-accent text-white rounded-lg text-sm hover:opacity-90 transition-opacity"
        >
          <Home size={16} />
          ホームへ戻る
        </button>
      </motion.div>
    )
  }

  if (showScore) {
    const correct = results.filter(Boolean).length
    const total = results.length
    const wrongCount = total - correct

    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center space-y-6 py-8"
      >
        <Trophy size={48} className="mx-auto text-accent" />
        <div>
          <h2 className="text-2xl font-bold">
            {correct} / {total} 問正解
          </h2>
          <p className="text-sm text-[var(--muted-foreground)] mt-1">
            正答率: {Math.round((correct / total) * 100)}%
          </p>
        </div>

        <div className="space-y-2">
          {wrongCount > 0 && (
            <button
              onClick={handleRetryWrong}
              className="w-full py-2.5 bg-accent text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
            >
              <RotateCcw size={16} />
              間違えた問題をもう一度 ({wrongCount}問)
            </button>
          )}
          <button
            onClick={() => router.push('/')}
            className="w-full py-2.5 border border-[var(--border)] rounded-lg text-sm flex items-center justify-center gap-2 hover:bg-[var(--muted)] transition-colors"
          >
            <Home size={16} />
            ホームへ戻る
          </button>
        </div>
      </motion.div>
    )
  }

  const current = questions[currentIndex]

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <button onClick={() => router.push('/')} className="p-1.5 rounded-lg hover:bg-[var(--muted)] transition-colors">
          <ArrowLeft size={20} />
        </button>
        <div className="flex-1">
          <h1 className="text-lg font-bold">復習テスト</h1>
          <p className="text-xs text-[var(--muted-foreground)]">
            {currentIndex + 1} / {questions.length} 問目 — {current.exercise_name}
          </p>
        </div>
      </div>

      {/* プログレスバー */}
      <div className="w-full h-1.5 bg-[var(--muted)] rounded-full overflow-hidden">
        <div
          className="h-full bg-accent rounded-full transition-all duration-300"
          style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.2 }}
        >
          <div className="card-base p-5">
            <QuizQuestion
              question={current.question}
              exerciseId={current.exercise_id}
              date={date}
              onAnswered={handleAnswered}
            />
          </div>
        </motion.div>
      </AnimatePresence>

      {answered && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          <button
            onClick={handleNext}
            className="w-full py-2.5 bg-accent text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
          >
            {currentIndex < questions.length - 1 ? (
              <>次の問題 <ArrowRight size={16} /></>
            ) : (
              '結果を見る'
            )}
          </button>
        </motion.div>
      )}
    </motion.div>
  )
}
