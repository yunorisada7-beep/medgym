'use client'

export function LoadingCard() {
  return (
    <div className="card-base p-6 animate-pulse space-y-4">
      <div className="h-4 bg-[var(--muted)] rounded w-3/4" />
      <div className="h-4 bg-[var(--muted)] rounded w-1/2" />
      <div className="h-20 bg-[var(--muted)] rounded" />
      <div className="h-4 bg-[var(--muted)] rounded w-2/3" />
    </div>
  )
}
