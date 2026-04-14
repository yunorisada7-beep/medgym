'use client'

import { Trash2, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { muscleGroupMap } from '@/lib/exercises'

interface Workout {
  id: number
  exercise_id: string
  exercise_name: string
  muscle_group: string
  reps: number
  sets: number
  weight_kg: number
}

interface Props {
  workout: Workout
  date: string
  onDelete: (id: number) => void
}

export function ExerciseCard({ workout, date, onDelete }: Props) {
  const isCustom = workout.exercise_id.startsWith('custom_')
  const groupLabel = muscleGroupMap[workout.muscle_group] || workout.muscle_group

  return (
    <div className="card-base p-4">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent font-medium">
              {groupLabel}
            </span>
            {isCustom && (
              <span className="text-xs px-2 py-0.5 rounded-full bg-[var(--muted)] text-[var(--muted-foreground)]">
                カスタム
              </span>
            )}
          </div>
          <h3 className="font-semibold text-sm">{workout.exercise_name}</h3>
          <p className="text-xs text-[var(--muted-foreground)] mt-1">
            {workout.weight_kg}kg × {workout.reps}回 × {workout.sets}セット
          </p>
        </div>
        <button
          onClick={() => onDelete(workout.id)}
          className="p-1.5 rounded hover:bg-red-500/10 text-[var(--muted-foreground)] hover:text-red-500 transition-colors"
        >
          <Trash2 size={14} />
        </button>
      </div>

      {!isCustom && (
        <Link
          href={`/detail/${workout.exercise_id}?exercise_name=${encodeURIComponent(workout.exercise_name)}&muscle_group=${workout.muscle_group}&date=${date}`}
          className="mt-3 flex items-center gap-1 text-accent text-xs font-medium hover:underline"
        >
          詳細を見る <ArrowRight size={12} />
        </Link>
      )}
    </div>
  )
}
