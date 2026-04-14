'use client'

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts'
import { muscleGroupMap } from '@/lib/exercises'

interface BalanceData {
  muscle_group: string
  volume: number
}

interface Props {
  data: BalanceData[]
}

const COLORS = ['#00d26a', '#00b4d8', '#e63946', '#f4a261', '#7209b7']

export function MuscleBalanceChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-[var(--muted-foreground)]">
        データがありません
      </div>
    )
  }

  const chartData = data.map((d) => ({
    name: muscleGroupMap[d.muscle_group] || d.muscle_group,
    value: d.volume,
  }))

  return (
    <div className="w-full">
      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              innerRadius={50}
              outerRadius={80}
              dataKey="value"
              nameKey="name"
              paddingAngle={3}
            >
              {chartData.map((_, i) => (
                <Cell key={i} fill={COLORS[i % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: 'var(--card)',
                border: '1px solid var(--border)',
                borderRadius: '8px',
                fontSize: '12px',
              }}
              formatter={(value: number) => [`${value} セット`, 'ボリューム']}
            />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap justify-center gap-3 mt-2">
        {chartData.map((d, i) => (
          <div key={d.name} className="flex items-center gap-1.5 text-xs">
            <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
            {d.name}
          </div>
        ))}
      </div>
    </div>
  )
}
