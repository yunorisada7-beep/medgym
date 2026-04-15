// Supabase ベースのデータ層
import { supabase } from './supabase'

export interface User {
  id: string
  email: string
  name: string
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
  created_at?: string
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
  created_at?: string
}

async function uid(): Promise<string | null> {
  const { data } = await supabase.auth.getUser()
  return data.user?.id ?? null
}

// ── Workouts ──
export async function getWorkouts(date?: string): Promise<Workout[]> {
  const userId = await uid()
  if (!userId) return []
  let q = supabase.from('workouts').select('*').eq('user_id', userId).order('id', { ascending: false })
  if (date) q = q.eq('date', date)
  const { data, error } = await q
  if (error) {
    console.error('getWorkouts', error)
    return []
  }
  return (data ?? []) as Workout[]
}

export async function getWorkoutDates(): Promise<string[]> {
  const userId = await uid()
  if (!userId) return []
  const { data, error } = await supabase
    .from('workouts')
    .select('date')
    .eq('user_id', userId)
  if (error) {
    console.error('getWorkoutDates', error)
    return []
  }
  const set = new Set<string>()
  ;(data ?? []).forEach((r: { date: string }) => set.add(r.date))
  return Array.from(set).sort((a, b) => b.localeCompare(a))
}

export async function addWorkout(data: Omit<Workout, 'id' | 'created_at'>): Promise<Workout | null> {
  const userId = await uid()
  if (!userId) return null
  const { data: row, error } = await supabase
    .from('workouts')
    .insert({ ...data, user_id: userId })
    .select()
    .single()
  if (error) {
    console.error('addWorkout', error)
    return null
  }
  return row as Workout
}

export async function deleteWorkout(id: number): Promise<void> {
  const { error } = await supabase.from('workouts').delete().eq('id', id)
  if (error) console.error('deleteWorkout', error)
}

// ── Custom Exercises ──
export async function getCustomExercises(muscleGroup?: string): Promise<CustomExercise[]> {
  const userId = await uid()
  if (!userId) return []
  let q = supabase.from('custom_exercises').select('*').eq('user_id', userId)
  if (muscleGroup) q = q.eq('muscle_group', muscleGroup)
  const { data, error } = await q
  if (error) {
    console.error('getCustomExercises', error)
    return []
  }
  return (data ?? []) as CustomExercise[]
}

export async function addCustomExercise(muscle_group: string, name: string): Promise<CustomExercise | null> {
  const userId = await uid()
  if (!userId) return null
  const { data, error } = await supabase
    .from('custom_exercises')
    .insert({ user_id: userId, muscle_group, name })
    .select()
    .single()
  if (error) {
    console.error('addCustomExercise', error)
    return null
  }
  return data as CustomExercise
}

// ── Viewed Questions ──
export async function getViewedQuestions(date: string): Promise<ViewedQuestion[]> {
  const userId = await uid()
  if (!userId) return []
  const { data, error } = await supabase
    .from('viewed_questions')
    .select('*')
    .eq('user_id', userId)
    .eq('date', date)
  if (error) {
    console.error('getViewedQuestions', error)
    return []
  }
  return (data ?? []) as ViewedQuestion[]
}

export async function addViewedQuestion(date: string, exercise_id: string): Promise<void> {
  const userId = await uid()
  if (!userId) return
  const question_id = `${exercise_id}_${date}`
  const { error } = await supabase
    .from('viewed_questions')
    .upsert({ user_id: userId, date, exercise_id, question_id }, { onConflict: 'user_id,question_id' })
  if (error) console.error('addViewedQuestion', error)
}

// ── Quiz Results ──
export async function getQuizResults(date?: string): Promise<QuizResult[]> {
  const userId = await uid()
  if (!userId) return []
  let q = supabase.from('quiz_results').select('*').eq('user_id', userId)
  if (date) q = q.eq('date', date)
  const { data, error } = await q
  if (error) {
    console.error('getQuizResults', error)
    return []
  }
  return (data ?? []) as QuizResult[]
}

export async function addQuizResult(data: Omit<QuizResult, 'id' | 'created_at'>): Promise<void> {
  const userId = await uid()
  if (!userId) return
  const { error } = await supabase
    .from('quiz_results')
    .insert({ ...data, user_id: userId })
  if (error) console.error('addQuizResult', error)
}
