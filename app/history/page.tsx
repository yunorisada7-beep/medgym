'use client'

import { useState, useEffect } from 'react'
import { WeightChart } from '@/components/WeightChart'
import { MuscleBalanceChart } from '@/components/MuscleBalanceChart'
import { motion } from 'framer-motion'
import { ArrowLeft, BarChart3, List } from 'lucide-react'
import Link from 'next/link'
import { muscleGroupMap } from '@/lib/exercises'

interface Workout {
  id: number
  date: string
  muscle_group: string
  exercise_id: string
  exercise_name: string
  reps: number
  sets: number
  weight_kg: number
}

type Tab = 'list' | 'chart'

export default function HistoryPage() {
  const [tab, setTab] = useState<Tab>('list')
  const [workouts, setWorkouts] = useState<Workout[]>([])
  const [selectedExercise, setSelectedExercise] = useState('')

  useEffect(() => {
    const fetchAll = async () => {
      // 全日付を取得してから各日付のワークアウトを取得
      const datesRes = await fetch('/api/workouts')
      const dates: string[] = await datesRes.json()

      const all: Workout[] = []
      for (const date of dates) {
        const res = await fetch(`/api/workouts?date=${date}`)
        const data = await res.json()
        all.push(...data)
      }
      setWorkouts(all)

      // デフォルトのエクササイズ選択
      if (all.length > 0) {
        setSelectedExercise(all[0].exercise_id)
      }
    }

    fetchAll()
  }, [])

  // ユニークなエクササイズリスト
  const uniqueExercises = workouts.reduce<{ id: string; name: string }[]>((acc, w) => {
    if (!acc.find((e) => e.id === w.exercise_id)) {
      acc.push({ id: w.exercise_id, name: w.exercise_name })
    }
    return acc
  }, [])

  // 重量推移データ
  const weightData = workouts
    .filter((w) => w.exercise_id === selectedExercise)
    .sort((a, b) => a.date.localeCompare(b.date))
    .map((w) => ({ date: w.date, weight_kg: w.weight_kg }))

  // 部位バランスデータ（過去30日）
  const thirtyDaysAgo = new Date()
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
  const thirtyDaysStr = thirtyDaysAgo.toISOString().slice(0, 10)

  const recentWorkouts = workouts.filter((w) => w.date >= thirtyDaysStr)
  const balanceMap: Record<string, number> = {}
  recentWorkouts.forEach((w) => {
    balanceMap[w.muscle_group] = (balanceMap[w.muscle_group] || 0) + w.sets
  })
  const balanceData = Object.entries(balanceMap).map(([muscle_group, volume]) => ({
    muscle_group,
    volume,
  }))

  // 日付ごとにグループ化
  const grouped: Record<string, Workout[]> = {}
  workouts
    .sort((a, b) => b.date.localeCompare(a.date))
    .forEach((w) => {
      if (!grouped[w.date]) grouped[w.date] = []
      grouped[w.date].push(w)
    })

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
        <h1 className="text-lg font-bold">振り返り</h1>
      </div>

      {/* タブ */}
      <div className="flex gap-1 bg-[var(--muted)] rounded-lg p-1">
        <button
          onClick={() => setTab('list')}
          className={`flex-1 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${
            tab === 'list' ? 'bg-[var(--card)] shadow-sm' : ''
          }`}
        >
          <List size={14} /> 記録一覧
        </button>
        <button
          onClick={() => setTab('chart')}
          className={`flex-1 py-2 rounded-md text-sm font-medium flex items-center justify-center gap-1.5 transition-colors ${
            tab === 'chart' ? 'bg-[var(--card)] shadow-sm' : ''
          }`}
        >
          <BarChart3 size={14} /> グラフ
        </button>
      </div>

      {tab === 'list' && (
        <div className="space-y-4">
          {Object.keys(grouped).length === 0 ? (
            <p className="text-center text-sm text-[var(--muted-foreground)] py-8">
              まだ記録がありません
            </p>
          ) : (
            Object.entries(grouped).map(([date, wks]) => (
              <div key={date} className="space-y-2">
                <h3 className="text-xs font-semibold text-[var(--muted-foreground)]">{date}</h3>
                {wks.map((w) => (
                  <div key={w.id} className="card-base p-3 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs px-1.5 py-0.5 rounded bg-accent/20 text-accent">
                          {muscleGroupMap[w.muscle_group] || w.muscle_group}
                        </span>
                        <span className="text-sm font-medium">{w.exercise_name}</span>
                      </div>
                    </div>
                    <span className="text-xs text-[var(--muted-foreground)]">
                      {w.weight_kg}kg × {w.reps} × {w.sets}
                    </span>
                  </div>
                ))}
              </div>
            ))
          )}
        </div>
      )}

      {tab === 'chart' && (
        <div className="space-y-6">
          {/* 重量推移 */}
          <div className="card-base p-4 space-y-3">
            <h3 className="text-sm font-semibold">重量推移</h3>
            <select
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-sm"
            >
              {uniqueExercises.map((ex) => (
                <option key={ex.id} value={ex.id}>
                  {ex.name}
                </option>
              ))}
            </select>
            <WeightChart data={weightData} />
          </div>

          {/* 部位バランス */}
          <div className="card-base p-4 space-y-3">
            <h3 className="text-sm font-semibold">部位バランス（過去30日）</h3>
            <MuscleBalanceChart data={balanceData} />
          </div>
        </div>
      )}
    </motion.div>
  )
}
