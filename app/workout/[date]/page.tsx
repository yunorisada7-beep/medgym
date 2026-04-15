'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { WorkoutForm } from '@/components/WorkoutForm'
import { ExerciseCard } from '@/components/ExerciseCard'
import { getWorkouts, deleteWorkout, type Workout } from '@/lib/storage'
import { motion } from 'framer-motion'
import { ArrowLeft, CheckCircle } from 'lucide-react'
import Link from 'next/link'

export default function WorkoutPage() {
  const params = useParams()
  const router = useRouter()
  const date = params.date as string
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [showEndDialog, setShowEndDialog] = useState(false)

  const loadWorkouts = useCallback(() => {
    setWorkouts(getWorkouts(date))
  }, [date])

  useEffect(() => {
    loadWorkouts()
  }, [loadWorkouts])

  const handleDelete = (id: number) => {
    deleteWorkout(id)
    loadWorkouts()
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="flex items-center gap-3">
        <Link href="/" className="p-1.5 rounded-lg hover:bg-[var(--muted)] transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-lg font-bold">{date}</h1>
          <p className="text-xs text-[var(--muted-foreground)]">トレーニング記録</p>
        </div>
      </div>

      <WorkoutForm date={date} onSaved={loadWorkouts} />

      {workouts.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-sm font-semibold text-[var(--muted-foreground)]">
            本日の記録 ({workouts.length}件)
          </h2>
          {workouts.map((w) => (
            <ExerciseCard key={w.id} workout={w} date={date} onDelete={handleDelete} />
          ))}

          <button
            onClick={() => setShowEndDialog(true)}
            className="w-full py-2.5 border border-accent text-accent rounded-xl font-medium text-sm flex items-center justify-center gap-2 hover:bg-accent/10 transition-colors"
          >
            <CheckCircle size={16} />
            本日のトレーニング終了
          </button>
        </div>
      )}

      {/* 終了ダイアログ */}
      {showEndDialog && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="card-base p-6 w-full max-w-sm space-y-4 text-center"
          >
            <h3 className="font-semibold text-lg">お疲れさまでした!</h3>
            <p className="text-sm text-[var(--muted-foreground)]">
              {workouts.length}件のトレーニングを記録しました
            </p>
            <div className="space-y-2">
              <button
                onClick={() => router.push(`/quiz/${date}`)}
                className="w-full py-2.5 bg-accent text-white rounded-lg font-medium text-sm hover:opacity-90 transition-opacity"
              >
                復習テストを受ける
              </button>
              <button
                onClick={() => router.push('/')}
                className="w-full py-2.5 border border-[var(--border)] rounded-lg text-sm hover:bg-[var(--muted)] transition-colors"
              >
                終了する
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </motion.div>
  )
}
