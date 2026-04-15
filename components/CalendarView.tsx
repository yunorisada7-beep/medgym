'use client'

import { useState, useEffect } from 'react'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { getWorkoutDates } from '@/lib/storage'
import Link from 'next/link'

export function CalendarView() {
  const [currentDate, setCurrentDate] = useState(new Date())
  const [workoutDates, setWorkoutDates] = useState<string[]>([])

  const year = currentDate.getFullYear()
  const month = currentDate.getMonth()

  useEffect(() => {
    setWorkoutDates(getWorkoutDates())
  }, [])

  const firstDay = new Date(year, month, 1).getDay()
  const daysInMonth = new Date(year, month + 1, 0).getDate()
  const today = formatDate(new Date())

  const days: (number | null)[] = []
  for (let i = 0; i < firstDay; i++) days.push(null)
  for (let i = 1; i <= daysInMonth; i++) days.push(i)

  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1))
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1))

  const weekDays = ['日', '月', '火', '水', '木', '金', '土']

  return (
    <div className="card-base p-4">
      <div className="flex items-center justify-between mb-4">
        <button onClick={prevMonth} className="p-2 hover:bg-[var(--muted)] rounded-lg transition-colors">
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold">
          {year}年 {month + 1}月
        </h2>
        <button onClick={nextMonth} className="p-2 hover:bg-[var(--muted)] rounded-lg transition-colors">
          <ChevronRight size={20} />
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-sm">
        {weekDays.map((d) => (
          <div key={d} className="py-1 text-[var(--muted-foreground)] font-medium text-xs">
            {d}
          </div>
        ))}
        {days.map((day, i) => {
          if (day === null) return <div key={`empty-${i}`} />
          const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
          const hasWorkout = workoutDates.includes(dateStr)
          const isToday = dateStr === today

          return (
            <Link
              key={dateStr}
              href={`/workout/${dateStr}`}
              className={`
                relative py-2 rounded-lg text-sm transition-colors hover:bg-[var(--muted)]
                ${isToday ? 'font-bold ring-2 ring-accent' : ''}
              `}
            >
              {day}
              {hasWorkout && (
                <span className="absolute bottom-0.5 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-accent rounded-full" />
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
