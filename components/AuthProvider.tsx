'use client'

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react'
import { getUser, setUser as saveUser, clearUser, type User } from '@/lib/storage'

interface AuthContextType {
  user: User | null
  login: (name: string) => void
  logout: () => void
  loading: boolean
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  login: () => {},
  logout: () => {},
  loading: true,
})

export function useAuth() {
  return useContext(AuthContext)
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUserState] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setUserState(getUser())
    setLoading(false)
  }, [])

  const login = (name: string) => {
    const u = saveUser(name)
    setUserState(u)
  }

  const logout = () => {
    clearUser()
    setUserState(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}
