import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserId, unauthorized, badRequest } from '@/lib/session'
import { isMealType, parseDate, parseNumber } from '@/lib/fitness'

export async function GET(request: NextRequest) {
  const userId = await getUserId()
  if (!userId) return unauthorized()

  const from = parseDate(request.nextUrl.searchParams.get('from'))
  const to = parseDate(request.nextUrl.searchParams.get('to'))
  if (!from || !to || from >= to) return badRequest('A valid from and to date are required')

  const entries = await prisma.nutrition.findMany({
    where: { userId, date: { gte: from, lt: to } },
    orderBy: { date: 'asc' },
    take: 200,
  })
  return NextResponse.json(entries)
}

export async function POST(request: NextRequest) {
  const userId = await getUserId()
  if (!userId) return unauthorized()

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') return badRequest('Invalid request body')

  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 120) : ''
  const calories = parseNumber(body.calories, 0, 10000)
  const protein = body.protein === '' || body.protein == null ? null : parseNumber(body.protein, 0, 1000)
  const carbs = body.carbs === '' || body.carbs == null ? null : parseNumber(body.carbs, 0, 1000)
  const fat = body.fat === '' || body.fat == null ? null : parseNumber(body.fat, 0, 1000)
  const date = body.date == null ? new Date() : parseDate(body.date)

  if (!name) return badRequest('Food name is required')
  if (calories === null) return badRequest('Calories must be between 0 and 10000')
  if (!isMealType(body.mealType)) return badRequest('Select a meal')
  if ([body.protein, body.carbs, body.fat].some((value, index) => value !== '' && value != null && [protein, carbs, fat][index] === null)) {
    return badRequest('Protein, carbs, and fat must be between 0 and 1000 g')
  }
  if (!date) return badRequest('Invalid date')

  const entry = await prisma.nutrition.create({
    data: { userId, name, calories: Math.round(calories), protein, carbs, fat, mealType: body.mealType, date },
  })
  return NextResponse.json(entry, { status: 201 })
}
