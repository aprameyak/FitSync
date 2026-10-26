import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { encode } from 'next-auth/jwt'
import { prisma } from '@/lib/db'
import { badRequest } from '@/lib/session'

const TOKEN_MAX_AGE = 30 * 24 * 60 * 60

export async function POST(request: NextRequest) {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) return NextResponse.json({ error: 'Server is not configured' }, { status: 500 })

  const body = await request.json().catch(() => null)
  const email = typeof body?.email === 'string' ? body.email.trim() : ''
  const password = typeof body?.password === 'string' ? body.password : ''
  if (!email || !password) return badRequest('Email and password are required')

  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, name: true, email: true, password: true },
  })
  if (!user?.password || !(await bcrypt.compare(password, user.password))) {
    return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 })
  }

  const token = await encode({
    token: { id: user.id, sub: user.id, name: user.name, email: user.email },
    secret,
    maxAge: TOKEN_MAX_AGE,
  })

  return NextResponse.json({ token, user: { id: user.id, name: user.name, email: user.email } })
}
