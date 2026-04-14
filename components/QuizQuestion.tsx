'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle, XCircle } from 'lucide-react'

interface Question {
  source: string
  question: string
  choices: string[]
  answer: number
  explanation: string
}

interface Props {
  question: Question
  exerciseId: string
  date: string
  onAnswered?: (isCorrect: boolean) => void
}

export function QuizQuestion({ question, exerciseId, date, onAnswered }: Props) {
  const [selected, setSelected] = useState<number | null>(null)
  const [submitted, setSubmitted] = useState(false)

  const handleSelect = async (index: number) => {
    if (submitted) return
    setSelected(index)
    setSubmitted(true)

    const isCorrect = index === question.answer

    // 結果を保存
    await fetch('/api/quiz-results', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        date,
        exercise_id: exerciseId,
        selected_answer: index,
        is_correct: isCorrect,
      }),
    })

    onAnswered?.(isCorrect)
  }

  const isCorrect = selected === question.answer

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
          {question.source}
        </span>
      </div>

      <p className="text-sm font-medium leading-relaxed">{question.question}</p>

      <div className="space-y-2">
        {question.choices.map((choice, i) => {
          let btnClass = 'border-[var(--border)] hover:border-accent'
          if (submitted) {
            if (i === question.answer) {
              btnClass = 'border-green-500 bg-green-50 dark:bg-green-900/20'
            } else if (i === selected && !isCorrect) {
              btnClass = 'border-red-500 bg-red-50 dark:bg-red-900/20'
            } else {
              btnClass = 'border-[var(--border)] opacity-50'
            }
          } else if (i === selected) {
            btnClass = 'border-accent bg-accent/10'
          }

          return (
            <button
              key={i}
              onClick={() => handleSelect(i)}
              disabled={submitted}
              className={`w-full text-left px-4 py-3 rounded-lg border text-sm transition-all ${btnClass}`}
            >
              <span className="font-medium mr-2 text-[var(--muted-foreground)]">
                {String.fromCharCode(65 + i)}.
              </span>
              {choice}
            </button>
          )
        })}
      </div>

      <AnimatePresence>
        {submitted && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className={`p-4 rounded-lg ${isCorrect ? 'bg-green-50 dark:bg-green-900/20' : 'bg-red-50 dark:bg-red-900/20'}`}>
              <div className="flex items-center gap-2 mb-2">
                {isCorrect ? (
                  <CheckCircle size={18} className="text-green-500" />
                ) : (
                  <XCircle size={18} className="text-red-500" />
                )}
                <span className={`text-sm font-semibold ${isCorrect ? 'text-green-700 dark:text-green-300' : 'text-red-700 dark:text-red-300'}`}>
                  {isCorrect ? '正解!' : '不正解'}
                </span>
              </div>
              <p className="text-sm leading-relaxed text-gray-700 dark:text-gray-300">
                {question.explanation}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
