import exercisesData from '@/data/exercises.json'

export type MuscleGroup = 'chest' | 'arm' | 'shoulder' | 'back' | 'leg'

export interface Exercise {
  id: string
  name: string
}

export const muscleGroups: { key: MuscleGroup; label: string }[] = [
  { key: 'chest', label: '胸' },
  { key: 'arm', label: '腕' },
  { key: 'shoulder', label: '肩' },
  { key: 'back', label: '背中' },
  { key: 'leg', label: '脚' },
]

export const exercises: Record<MuscleGroup, Exercise[]> = exercisesData as Record<MuscleGroup, Exercise[]>

export const muscleGroupMap: Record<string, string> = {
  chest: '胸',
  arm: '腕',
  shoulder: '肩',
  back: '背中',
  leg: '脚',
}

export const svgMap: Record<string, string> = {
  bench_press: '/muscles/chest.svg',
  dumbbell_press: '/muscles/chest.svg',
  chest_press: '/muscles/chest.svg',
  dips: '/muscles/chest.svg',
  pec_fly: '/muscles/chest.svg',
  bicep_curl: '/muscles/arm_bicep.svg',
  hammer_curl: '/muscles/arm_bicep.svg',
  tricep_pressdown: '/muscles/arm_tricep.svg',
  skull_crusher: '/muscles/arm_tricep.svg',
  shoulder_press: '/muscles/shoulder.svg',
  side_raise: '/muscles/shoulder.svg',
  front_raise: '/muscles/shoulder.svg',
  face_pull: '/muscles/shoulder.svg',
  deadlift: '/muscles/back.svg',
  lat_pulldown: '/muscles/back.svg',
  bent_over_row: '/muscles/back.svg',
  chin_up: '/muscles/back.svg',
  squat: '/muscles/leg_front.svg',
  leg_press: '/muscles/leg_front.svg',
  leg_curl: '/muscles/leg_back.svg',
  calf_raise: '/muscles/leg_back.svg',
}

export function findExercise(exerciseId: string): { exercise: Exercise; muscleGroup: MuscleGroup } | null {
  for (const [group, exs] of Object.entries(exercises)) {
    const found = exs.find((e) => e.id === exerciseId)
    if (found) return { exercise: found, muscleGroup: group as MuscleGroup }
  }
  return null
}
