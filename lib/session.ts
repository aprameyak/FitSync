import { getServerSession } from 'next-auth'
import { decode } from 'next-auth/jwt'
import { headers } from 'next/headers'
import { NextResponse } from 'next/server'
import { authOptions } from '@/lib/auth'

async function getBearerUserId() {
  const authorization = (await headers()).get('authorization')
  if (!authorization?.startsWith('Bearer ')) return null
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) return null
  try {
    const token = await decode({ token: authorization.slice(7), secret })
    return typeof token?.id === 'string' ? token.id : null
  } catch {
    return null
  }
}

export async function getUserId() {
  const bearerUserId = await getBearerUserId()
  if (bearerUserId) return bearerUserId
  const session = await getServerSession(authOptions)
  return session?.user?.id ?? null
}

export function unauthorized() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}

export function badRequest(error: string) {
  return NextResponse.json({ error }, { status: 400 })
}
