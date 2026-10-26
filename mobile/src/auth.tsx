import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { apiRequest, setAuthToken, setUnauthorizedHandler } from './api'
import { getItem, removeItem, setItem } from './storage'

const TOKEN_KEY = 'fitsync.token'
const USER_KEY = 'fitsync.user'

export interface AuthUser {
  id: string
  name: string | null
  email: string
}

interface AuthContextValue {
  user: AuthUser | null
  isReady: boolean
  signIn: (email: string, password: string) => Promise<void>
  signUp: (name: string, email: string, password: string) => Promise<void>
  signOut: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

export function AuthProvider({ children }: { readonly children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null)
  const [isReady, setIsReady] = useState(false)

  const signOut = useCallback(async () => {
    setAuthToken(null)
    setUser(null)
    await Promise.all([removeItem(TOKEN_KEY), removeItem(USER_KEY)])
  }, [])

  useEffect(() => {
    setUnauthorizedHandler(() => {
      signOut()
    })
    Promise.all([getItem(TOKEN_KEY), getItem(USER_KEY)])
      .then(([token, storedUser]) => {
        if (token && storedUser) {
          setAuthToken(token)
          setUser(JSON.parse(storedUser))
        }
      })
      .catch(() => undefined)
      .finally(() => setIsReady(true))
    return () => setUnauthorizedHandler(null)
  }, [signOut])

  const signIn = useCallback(async (email: string, password: string) => {
    const result = await apiRequest<{ token: string; user: AuthUser }>('/api/mobile/login', {
      method: 'POST',
      body: JSON.stringify({ email, password }),
    })
    setAuthToken(result.token)
    await Promise.all([setItem(TOKEN_KEY, result.token), setItem(USER_KEY, JSON.stringify(result.user))])
    setUser(result.user)
  }, [])

  const signUp = useCallback(
    async (name: string, email: string, password: string) => {
      await apiRequest('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      })
      await signIn(email, password)
    },
    [signIn]
  )

  const value = useMemo(() => ({ user, isReady, signIn, signUp, signOut }), [user, isReady, signIn, signUp, signOut])

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
