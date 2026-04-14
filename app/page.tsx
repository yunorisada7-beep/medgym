'use client'

import { CalendarView } from '@/components/CalendarView'
import { Dumbbell } from 'lucide-react'
import Link from 'next/link'
import { formatDate } from '@/lib/utils'
import { motion } from 'framer-motion'

export default function HomePage() {
  const today = formatDate(new Date())

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="space-y-6"
    >
      <div className="text-center space-y-1">
        <h1 className="text-2xl font-bold">MedGym</h1>
        <p className="text-sm text-[var(--muted-foreground)]">
          筋トレ × 医学学習
        </p>
      </div>

      <CalendarView />

      <Link
        href={`/workout/${today}`}
        className="block w-full py-3 bg-accent text-white rounded-xl font-semibold text-center text-sm hover:opacity-90 transition-opacity"
      >
        <span className="inline-flex items-center gap-2">
          <Dumbbell size={18} />
          今日のトレーニングを始める
        </span>
      </Link>
    </motion.div>
  )
}
