'use client'

import { motion } from 'framer-motion'
import Image from 'next/image'
import { svgMap } from '@/lib/exercises'
import { Activity, Zap, MapPin, Brain, AlertCircle, Stethoscope } from 'lucide-react'

interface MedicalInfo {
  muscles: {
    primary: string[]
    secondary: string[]
  }
  origin: string
  insertion: string
  nerve: string
  diseases: string[]
  clinical_note: string
}

interface Props {
  medical: MedicalInfo
  exerciseId: string
}

export function MedicalDetail({ medical, exerciseId }: Props) {
  const svgPath = svgMap[exerciseId]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="space-y-4"
    >
      {/* カルテ風カード */}
      <div className="bg-white dark:bg-gray-100 text-gray-900 rounded-xl p-5 shadow-sm space-y-4">
        <div className="flex items-center gap-2 border-b border-gray-200 pb-3">
          <Stethoscope size={18} className="text-accent" />
          <h3 className="font-bold text-base">医学情報</h3>
        </div>

        {/* 筋肉SVG */}
        {svgPath && (
          <div className="flex justify-center">
            <Image src={svgPath} alt="筋肉図" width={160} height={320} className="opacity-90" />
          </div>
        )}

        {/* 筋肉 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Activity size={14} className="text-accent" />
            <span className="text-xs font-semibold text-gray-500">鍛えられる筋肉</span>
          </div>
          <div className="pl-5 space-y-1">
            <div>
              <span className="text-xs text-gray-500">主働筋:</span>
              <span className="ml-2 text-sm font-medium">{medical.muscles.primary.join('、')}</span>
            </div>
            <div>
              <span className="text-xs text-gray-500">補助筋:</span>
              <span className="ml-2 text-sm">{medical.muscles.secondary.join('、')}</span>
            </div>
          </div>
        </div>

        {/* 起始・停止 */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <MapPin size={12} className="text-red-400" />
              <span className="text-xs font-semibold text-gray-500">起始</span>
            </div>
            <p className="text-sm pl-4">{medical.origin}</p>
          </div>
          <div className="space-y-1">
            <div className="flex items-center gap-1">
              <MapPin size={12} className="text-blue-400" />
              <span className="text-xs font-semibold text-gray-500">停止</span>
            </div>
            <p className="text-sm pl-4">{medical.insertion}</p>
          </div>
        </div>

        {/* 支配神経 */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Zap size={14} className="text-yellow-500" />
            <span className="text-xs font-semibold text-gray-500">支配神経</span>
          </div>
          <p className="text-sm pl-5">{medical.nerve}</p>
        </div>

        {/* 関連疾患 */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle size={14} className="text-orange-400" />
            <span className="text-xs font-semibold text-gray-500">関連疾患</span>
          </div>
          <div className="flex flex-wrap gap-1.5 pl-5">
            {medical.diseases.map((d) => (
              <span key={d} className="text-xs px-2 py-0.5 rounded-full bg-orange-50 text-orange-700 border border-orange-200">
                {d}
              </span>
            ))}
          </div>
        </div>

        {/* 臨床メモ */}
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <Brain size={14} className="text-purple-400" />
            <span className="text-xs font-semibold text-gray-500">臨床メモ</span>
          </div>
          <p className="text-sm pl-5 text-gray-700 leading-relaxed">{medical.clinical_note}</p>
        </div>
      </div>
    </motion.div>
  )
}
