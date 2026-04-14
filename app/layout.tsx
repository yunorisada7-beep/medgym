import type { Metadata } from 'next'
import { Noto_Sans_JP } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/components/ThemeProvider'
import { ThemeToggle } from '@/components/ThemeToggle'
import { Footer } from '@/components/Footer'
import { Dumbbell } from 'lucide-react'
import Link from 'next/link'

const notoSansJP = Noto_Sans_JP({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'MedGym — 筋トレ × 医学学習',
  description: '医療系学生のための筋トレ記録 × 医学学習アプリ',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ja" suppressHydrationWarning>
      <body className={`${notoSansJP.className} min-h-screen flex flex-col`}>
        <ThemeProvider>
          <header className="sticky top-0 z-50 backdrop-blur-md bg-[var(--background)]/80 border-b border-[var(--border)]">
            <div className="max-w-mobile mx-auto px-4 h-14 flex items-center justify-between">
              <Link href="/" className="flex items-center gap-2 font-bold text-lg">
                <Dumbbell size={22} className="text-accent" />
                <span>MedGym</span>
              </Link>
              <nav className="flex items-center gap-1">
                <Link href="/history" className="px-3 py-1.5 text-sm rounded-lg hover:bg-[var(--muted)] transition-colors">
                  記録
                </Link>
                <ThemeToggle />
              </nav>
            </div>
          </header>

          <main className="flex-1 max-w-mobile mx-auto w-full px-4 py-6">
            {children}
          </main>

          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}
