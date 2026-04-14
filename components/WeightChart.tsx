'use client'

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

interface DataPoint {
  date: string
  weight_kg: number
}

interface Props {
  data: DataPoint[]
}

export function WeightChart({ data }: Props) {
  if (data.length === 0) {
    return (
      <div className="text-center py-8 text-sm text-[var(--muted-foreground)]">
        データがありません
      </div>
    )
  }

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data} margin={{ top: 5, right: 10, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
          <XAxis
            dataKey="date"
            tick={{ fontSize: 10 }}
            tickFormatter={(v) => v.slice(5)}
          />
          <YAxis tick={{ fontSize: 10 }} unit="kg" />
          <Tooltip
            contentStyle={{
              backgroundColor: 'var(--card)',
              border: '1px solid var(--border)',
              borderRadius: '8px',
              fontSize: '12px',
            }}
            formatter={(value: number) => [`${value} kg`, '重量']}
            labelFormatter={(label) => `日付: ${label}`}
          />
          <Line
            type="monotone"
            dataKey="weight_kg"
            stroke="#00d26a"
            strokeWidth={2}
            dot={{ fill: '#00d26a', r: 4 }}
            activeDot={{ r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}
