'use client'

import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { Dumbbell } from 'lucide-react'
import { motion } from 'framer-motion'

export function LoginScreen() {
  const { login } = useAuth()
  const [name, setName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (name.trim()) login(name.trim())
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card-base p-8 w-full max-w-sm space-y-6 text-center"
      >
        <div className="space-y-2">
          <Dumbbell size={40} className="mx-auto text-accent" />
          <h1 className="text-2xl font-bold">MedGym</h1>
          <p className="text-sm text-[var(--muted-foreground)]">
            筋トレ × 医学学習
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="text-left">
            <label className="text-xs text-[var(--muted-foreground)] block mb-1.5">
              ニックネーム
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="名前を入力してください"
              className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--card)] text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              autoFocus
              maxLength={20}
            />
          </div>
          <button
            type="submit"
            disabled={!name.trim()}
            className="w-full py-2.5 bg-accent text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-40"
          >
            はじめる
          </button>
        </form>

        <p className="text-xs text-[var(--muted-foreground)]">
          データはこのブラウザに保存されます
        </p>
      </motion.div>
    </div>
  )
}
