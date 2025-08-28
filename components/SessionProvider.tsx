'use client'

import { SessionProvider as NextAuthSessionProvider } from 'next-auth/react'

export function SessionProvider({ children }: { readonly children: React.ReactNode }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>
}
