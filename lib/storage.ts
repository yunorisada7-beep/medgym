// localStorage ベースのデータ永続化ユーティリティ

export interface User {
  name: string
  createdAt: string
}

export interface Workout {
  id: number
  date: string
  muscle_group: string
  exercise_id: string
  exercise_name: string
  reps: number
  sets: number
  weight_kg: number
  created_at: string
}

export interface CustomExercise {
  id: number
  muscle_group: string
  name: string
}

export interface ViewedQuestion {
  date: string
  exercise_id: string
  question_id: string
}

export interface QuizResult {
  id: number
  date: string
  exercise_id: string
  selected_answer: number
  is_correct: boolean
  created_at: string
}

const KEYS = {
  user: 'medgym_user',
  workouts: 'medgym_workouts',
  customExercises: 'medgym_custom_exercises',
  viewedQuestions: 'medgym_viewed_questions',
  quizResults: 'medgym_quiz_results',
  nextId: 'medgym_next_id',
}

function getItem<T>(key: string, fallback: T): T {
  if (typeof window === 'undefined') return fallback
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function setItem(key: string, value: unknown): void {
  if (typeof window === 'undefined') return
  localStorage.setItem(key, JSON.stringify(value))
}

function nextId(): number {
  const id = getItem<number>(KEYS.nextId, 1)
  setItem(KEYS.nextId, id + 1)
  return id
}

// ── User ──
export function getUser(): User | null {
  return getItem<User | null>(KEYS.user, null)
}

export function setUser(name: string): User {
  const user: User = { name, createdAt: new Date().toISOString() }
  setItem(KEYS.user, user)
  return user
}

export function clearUser(): void {
  if (typeof window === 'undefined') return
  localStorage.removeItem(KEYS.user)
}

// ── Workouts ──
export function getWorkouts(date?: string): Workout[] {
  const all = getItem<Workout[]>(KEYS.workouts, [])
  if (date) return all.filter((w) => w.date === date).sort((a, b) => b.id - a.id)
  return all.sort((a, b) => b.id - a.id)
}

export function getWorkoutDates(): string[] {
  const all = getItem<Workout[]>(KEYS.workouts, [])
  const dates = Array.from(new Set(all.map((w) => w.date)))
  return dates.sort((a, b) => b.localeCompare(a))
}

export function addWorkout(data: Omit<Workout, 'id' | 'created_at'>): Workout {
  const all = getItem<Workout[]>(KEYS.workouts, [])
  const workout: Workout = {
    ...data,
    id: nextId(),
    created_at: new Date().toISOString(),
  }
  all.push(workout)
  setItem(KEYS.workouts, all)
  return workout
}

export function deleteWorkout(id: number): void {
  const all = getItem<Workout[]>(KEYS.workouts, [])
  setItem(KEYS.workouts, all.filter((w) => w.id !== id))
}

// ── Custom Exercises ──
export function getCustomExercises(muscleGroup?: string): CustomExercise[] {
  const all = getItem<CustomExercise[]>(KEYS.customExercises, [])
  if (muscleGroup) return all.filter((c) => c.muscle_group === muscleGroup)
  return all
}

export function addCustomExercise(muscle_group: string, name: string): CustomExercise {
  const all = getItem<CustomExercise[]>(KEYS.customExercises, [])
  const ex: CustomExercise = { id: nextId(), muscle_group, name }
  all.push(ex)
  setItem(KEYS.customExercises, all)
  return ex
}

// ── Viewed Questions ──
export function getViewedQuestions(date: string): ViewedQuestion[] {
  const all = getItem<ViewedQuestion[]>(KEYS.viewedQuestions, [])
  return all.filter((v) => v.date === date)
}

export function addViewedQuestion(date: string, exercise_id: string): void {
  const all = getItem<ViewedQuestion[]>(KEYS.viewedQuestions, [])
  const questionId = `${exercise_id}_${date}`
  if (all.some((v) => v.question_id === questionId)) return
  all.push({ date, exercise_id, question_id: questionId })
  setItem(KEYS.viewedQuestions, all)
}

// ── Quiz Results ──
export function getQuizResults(date?: string): QuizResult[] {
  const all = getItem<QuizResult[]>(KEYS.quizResults, [])
  if (date) return all.filter((r) => r.date === date)
  return all
}

export function addQuizResult(data: Omit<QuizResult, 'id' | 'created_at'>): QuizResult {
  const all = getItem<QuizResult[]>(KEYS.quizResults, [])
  const result: QuizResult = {
    ...data,
    id: nextId(),
    created_at: new Date().toISOString(),
  }
  all.push(result)
  setItem(KEYS.quizResults, all)
  return result
}
