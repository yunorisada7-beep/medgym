'use client'

import { AuthProvider, useAuth } from './AuthProvider'
import { LoginScreen } from './LoginScreen'
import { ThemeToggle } from './ThemeToggle'
import { Footer } from './Footer'
import { Dumbbell, LogOut } from 'lucide-react'
import Link from 'next/link'
import { type ReactNode } from 'react'

function AuthGate({ children }: { children: ReactNode }) {
  const { user, signOut, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Dumbbell size={32} className="text-accent animate-pulse" />
      </div>
    )
  }

  if (!user) {
    return <LoginScreen />
  }

  return (
    <>
      <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--background)]/80 border-b border-[var(--border)]">
        <div className="max-w-mobile mx-auto px-4 h-14 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg">
            <Dumbbell size={22} className="text-accent" />
            <span>MedGym</span>
          </Link>
          <nav className="flex items-center gap-1">
            <span className="text-xs text-[var(--muted-foreground)] mr-1">
              {user.name}
            </span>
            <Link href="/history" className="px-3 py-1.5 text-sm rounded-lg hover:bg-[var(--muted)] transition-colors">
              記録
            </Link>
            <ThemeToggle />
            <button
              onClick={() => signOut()}
              className="p-2 rounded-lg hover:bg-[var(--muted)] transition-colors text-[var(--muted-foreground)]"
              title="ログアウト"
            >
              <LogOut size={16} />
            </button>
          </nav>
        </div>
      </header>

      <main className="flex-1 max-w-mobile mx-auto w-full px-4 py-6">
        {children}
      </main>

      <Footer />
    </>
  )
}

export function AppShell({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <AuthGate>{children}</AuthGate>
    </AuthProvider>
  )
}
