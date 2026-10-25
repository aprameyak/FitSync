import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserId, unauthorized, badRequest } from '@/lib/session'
import { parseDate, parseNumber } from '@/lib/fitness'
import { syncLatestWeight } from '@/lib/weight'

export async function GET() {
  const userId = await getUserId()
  if (!userId) return unauthorized()

  const entries = await prisma.progress.findMany({
    where: { userId, metric: 'weight' },
    orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
    take: 100,
    select: { id: true, value: true, date: true, notes: true },
  })
  return NextResponse.json(entries)
}

export async function POST(request: NextRequest) {
  const userId = await getUserId()
  if (!userId) return unauthorized()

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') return badRequest('Invalid request body')

  const value = parseNumber(body.value, 20, 500)
  const date = body.date == null || body.date === '' ? new Date() : parseDate(body.date)
  const notes = typeof body.notes === 'string' && body.notes.trim() ? body.notes.trim().slice(0, 200) : null

  if (value === null) return badRequest('Weight must be between 20 and 500 kg')
  if (!date) return badRequest('Invalid date')
  if (date > new Date(Date.now() + 24 * 60 * 60 * 1000)) return badRequest('Date cannot be in the future')

  const entry = await prisma.$transaction(async (tx) => {
    const created = await tx.progress.create({
      data: { userId, metric: 'weight', value, date, notes },
      select: { id: true, value: true, date: true, notes: true },
    })
    await syncLatestWeight(tx, userId)
    return created
  })
  return NextResponse.json(entry, { status: 201 })
}
