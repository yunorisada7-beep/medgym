'use client'

import { useState, useEffect } from 'react'
import { exercises, muscleGroups, type MuscleGroup, type Exercise } from '@/lib/exercises'
import { getCustomExercises, addCustomExercise, addWorkout, type CustomExercise } from '@/lib/storage'
import { Plus, Save } from 'lucide-react'

interface Props {
  date: string
  onSaved: () => void
}

export function WorkoutForm({ date, onSaved }: Props) {
  const [selectedGroup, setSelectedGroup] = useState<MuscleGroup>('chest')
  const [selectedExercise, setSelectedExercise] = useState('')
  const [reps, setReps] = useState(10)
  const [sets, setSets] = useState(3)
  const [weight, setWeight] = useState(0)
  const [customExercises, setCustomExercises] = useState<CustomExercise[]>([])
  const [showCustomModal, setShowCustomModal] = useState(false)
  const [customName, setCustomName] = useState('')
  const [saving, setSaving] = useState(false)

  const loadCustomExercises = async () => {
    const list = await getCustomExercises()
    setCustomExercises(list)
  }

  useEffect(() => {
    loadCustomExercises()
  }, [])

  useEffect(() => {
    const allExs = getAllExercises(selectedGroup)
    if (allExs.length > 0) setSelectedExercise(allExs[0].id)
  }, [selectedGroup, customExercises])

  const getAllExercises = (group: MuscleGroup): Exercise[] => {
    const builtIn = exercises[group] || []
    const custom = customExercises
      .filter((c) => c.muscle_group === group)
      .map((c) => ({ id: `custom_${c.id}`, name: c.name }))
    return [...builtIn, ...custom]
  }

  const handleSave = async () => {
    if (!selectedExercise) return
    setSaving(true)

    const allExs = getAllExercises(selectedGroup)
    const ex = allExs.find((e) => e.id === selectedExercise)

    await addWorkout({
      date,
      muscle_group: selectedGroup,
      exercise_id: selectedExercise,
      exercise_name: ex?.name || selectedExercise,
      reps,
      sets,
      weight_kg: weight,
    })

    setSaving(false)
    onSaved()
  }

  const handleAddCustom = async () => {
    if (!customName.trim()) return
    await addCustomExercise(selectedGroup, customName.trim())
    setCustomName('')
    setShowCustomModal(false)
    await loadCustomExercises()
  }

  return (
    <div className="card-base p-4 space-y-4">
      {/* 部位タブ */}
      <div className="flex gap-1 overflow-x-auto pb-1">
        {muscleGroups.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setSelectedGroup(key)}
            className={`
              px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-colors
              ${selectedGroup === key
                ? 'bg-accent text-white'
                : 'bg-[var(--muted)] hover:bg-[var(--border)]'}
            `}
          >
            {label}
          </button>
        ))}
      </div>

      {/* メニュー選択 */}
      <div className="flex gap-2">
        <select
          value={selectedExercise}
          onChange={(e) => setSelectedExercise(e.target.value)}
          className="flex-1 px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-sm"
        >
          {getAllExercises(selectedGroup).map((ex) => (
            <option key={ex.id} value={ex.id}>
              {ex.name}
            </option>
          ))}
        </select>
        <button
          onClick={() => setShowCustomModal(true)}
          className="p-2 rounded-lg border border-[var(--border)] hover:bg-[var(--muted)] transition-colors"
          title="メニューを追加"
        >
          <Plus size={18} />
        </button>
      </div>

      {/* 入力フォーム */}
      <div className="grid grid-cols-3 gap-3">
        <div>
          <label className="text-xs text-[var(--muted-foreground)] block mb-1">回数</label>
          <input
            type="number"
            value={reps}
            onChange={(e) => setReps(Number(e.target.value))}
            min={1}
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-sm text-center"
          />
        </div>
        <div>
          <label className="text-xs text-[var(--muted-foreground)] block mb-1">セット</label>
          <input
            type="number"
            value={sets}
            onChange={(e) => setSets(Number(e.target.value))}
            min={1}
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-sm text-center"
          />
        </div>
        <div>
          <label className="text-xs text-[var(--muted-foreground)] block mb-1">重量(kg)</label>
          <input
            type="number"
            value={weight}
            onChange={(e) => setWeight(Number(e.target.value))}
            min={0}
            step={0.5}
            className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-sm text-center"
          />
        </div>
      </div>

      {/* 記録ボタン */}
      <button
        onClick={handleSave}
        disabled={saving}
        className="w-full py-2.5 bg-accent text-white rounded-lg font-medium text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-50"
      >
        <Save size={16} />
        {saving ? '保存中...' : '記録する'}
      </button>

      {/* カスタムメニュー追加モーダル */}
      {showCustomModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <div className="card-base p-6 w-full max-w-sm space-y-4">
            <h3 className="font-semibold">メニューを追加</h3>
            <p className="text-xs text-[var(--muted-foreground)]">
              部位: {muscleGroups.find((g) => g.key === selectedGroup)?.label}
            </p>
            <input
              type="text"
              value={customName}
              onChange={(e) => setCustomName(e.target.value)}
              placeholder="メニュー名を入力"
              className="w-full px-3 py-2 rounded-lg border border-[var(--border)] bg-[var(--card)] text-sm"
              autoFocus
            />
            <div className="flex gap-2">
              <button
                onClick={() => setShowCustomModal(false)}
                className="flex-1 py-2 rounded-lg border border-[var(--border)] text-sm hover:bg-[var(--muted)] transition-colors"
              >
                キャンセル
              </button>
              <button
                onClick={handleAddCustom}
                className="flex-1 py-2 bg-accent text-white rounded-lg text-sm hover:opacity-90 transition-opacity"
              >
                追加
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
