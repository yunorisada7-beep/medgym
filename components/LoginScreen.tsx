'use client'

import { useState } from 'react'
import { useAuth } from './AuthProvider'
import { Dumbbell, Loader2 } from 'lucide-react'
import { motion } from 'framer-motion'

type Mode = 'signin' | 'signup'

export function LoginScreen() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<Mode>('signin')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [submitting, setSubmitting] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)
    setInfo(null)
    if (!email.trim() || !password) return
    setSubmitting(true)
    try {
      if (mode === 'signin') {
        const { error: err } = await signIn(email.trim(), password)
        if (err) setError(translateAuthError(err))
      } else {
        if (!name.trim()) {
          setError('ニックネームを入力してください')
          setSubmitting(false)
          return
        }
        if (password.length < 6) {
          setError('パスワードは6文字以上にしてください')
          setSubmitting(false)
          return
        }
        const { error: err } = await signUp(email.trim(), password, name.trim())
        if (err) {
          setError(translateAuthError(err))
        } else {
          setInfo('登録メールを送信しました。メール内のリンクをクリックしてからログインしてください。')
        }
      }
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[var(--background)] px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="card-base p-8 w-full max-w-sm space-y-6"
      >
        <div className="text-center space-y-2">
          <Dumbbell size={40} className="mx-auto text-accent" />
          <h1 className="text-2xl font-bold">MedGym</h1>
          <p className="text-sm text-[var(--muted-foreground)]">筋トレ × 医学学習</p>
        </div>

        <div className="flex gap-1 bg-[var(--muted)] rounded-lg p-1">
          <button
            type="button"
            onClick={() => { setMode('signin'); setError(null); setInfo(null) }}
            className={`flex-1 py-1.5 text-sm rounded-md font-medium transition-colors ${
              mode === 'signin' ? 'bg-[var(--card)] shadow-sm' : ''
            }`}
          >
            ログイン
          </button>
          <button
            type="button"
            onClick={() => { setMode('signup'); setError(null); setInfo(null) }}
            className={`flex-1 py-1.5 text-sm rounded-md font-medium transition-colors ${
              mode === 'signup' ? 'bg-[var(--card)] shadow-sm' : ''
            }`}
          >
            新規登録
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="text-xs text-[var(--muted-foreground)] block mb-1.5">ニックネーム</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="例: ゆうのり"
                maxLength={20}
                className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--card)] text-sm focus:outline-none focus:ring-2 focus:ring-accent"
              />
            </div>
          )}

          <div>
            <label className="text-xs text-[var(--muted-foreground)] block mb-1.5">メールアドレス</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
              className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--card)] text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          <div>
            <label className="text-xs text-[var(--muted-foreground)] block mb-1.5">
              パスワード{mode === 'signup' && '(6文字以上)'}
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete={mode === 'signin' ? 'current-password' : 'new-password'}
              required
              className="w-full px-4 py-2.5 rounded-lg border border-[var(--border)] bg-[var(--card)] text-sm focus:outline-none focus:ring-2 focus:ring-accent"
            />
          </div>

          {error && (
            <p className="text-xs text-red-500 bg-red-50 dark:bg-red-900/20 px-3 py-2 rounded-lg">
              {error}
            </p>
          )}
          {info && (
            <p className="text-xs text-green-700 dark:text-green-300 bg-green-50 dark:bg-green-900/20 px-3 py-2 rounded-lg">
              {info}
            </p>
          )}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-accent text-white rounded-lg font-semibold text-sm hover:opacity-90 transition-opacity disabled:opacity-40 flex items-center justify-center gap-2"
          >
            {submitting && <Loader2 size={14} className="animate-spin" />}
            {mode === 'signin' ? 'ログイン' : 'アカウント作成'}
          </button>
        </form>

        <p className="text-xs text-[var(--muted-foreground)] text-center">
          データはクラウドに保存され、複数デバイスで共有できます
        </p>
      </motion.div>
    </div>
  )
}

function translateAuthError(msg: string): string {
  if (/Invalid login credentials/i.test(msg)) return 'メールアドレスかパスワードが違います'
  if (/User already registered/i.test(msg)) return 'このメールアドレスは既に登録されています'
  if (/Email not confirmed/i.test(msg)) return 'メール認証が完了していません。受信メールのリンクをクリックしてください'
  if (/Password should be/i.test(msg)) return 'パスワードは6文字以上にしてください'
  return msg
}
