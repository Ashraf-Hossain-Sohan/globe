import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react'

export interface User {
  id: number
  name: string
  email: string
  role: string
  companyAccess: string
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (user: User) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  login: () => {},
  logout: () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is logged in
    fetch('http://localhost:8080/api/auth/me', {credentials: 'include'})
      .then(res => {
        if (res.ok) {
          return res.json()
        }
        throw new Error('Not authenticated')
      })
      .then(data => {
        setUser(data)
      })
      .catch(() => {
        setUser(null)
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  const login = (userData: User) => {
    setUser(userData)
  }

  const logout = () => {
    fetch('http://localhost:8080/api/auth/logout', { method: 'POST', credentials: 'include' })
      .finally(() => {
        setUser(null)
      })
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
