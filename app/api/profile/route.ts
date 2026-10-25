import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserId, unauthorized, badRequest } from '@/lib/session'
import { TARGET_WEIGHT_GOAL, energyFor, isActivityLevel, isGender, parseNumber } from '@/lib/fitness'

async function loadProfile(userId: string) {
  const [user, goal] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: {
        name: true,
        email: true,
        age: true,
        gender: true,
        height: true,
        weight: true,
        activityLevel: true,
        bmr: true,
        tdee: true,
      },
    }),
    prisma.goal.findFirst({
      where: { userId, title: TARGET_WEIGHT_GOAL },
      orderBy: { createdAt: 'desc' },
      select: { target: true },
    }),
  ])
  if (!user) return null
  return { ...user, targetWeight: goal?.target ?? null }
}

export async function GET() {
  const userId = await getUserId()
  if (!userId) return unauthorized()

  const profile = await loadProfile(userId)
  if (!profile) return unauthorized()
  return NextResponse.json(profile)
}

export async function PUT(request: NextRequest) {
  const userId = await getUserId()
  if (!userId) return unauthorized()

  const body = await request.json().catch(() => null)
  if (!body || typeof body !== 'object') return badRequest('Invalid request body')

  const name = typeof body.name === 'string' ? body.name.trim().slice(0, 100) : ''
  const age = parseNumber(body.age, 10, 120)
  const height = parseNumber(body.height, 50, 275)
  const weight = parseNumber(body.weight, 20, 500)
  const targetWeight = body.targetWeight === '' || body.targetWeight == null ? null : parseNumber(body.targetWeight, 20, 500)

  if (!name) return badRequest('Name is required')
  if (age === null || !Number.isInteger(age)) return badRequest('Age must be a whole number between 10 and 120')
  if (height === null) return badRequest('Height must be between 50 and 275 cm')
  if (weight === null) return badRequest('Weight must be between 20 and 500 kg')
  if (!isGender(body.gender)) return badRequest('Select a gender')
  if (!isActivityLevel(body.activityLevel)) return badRequest('Select an activity level')
  if (body.targetWeight !== '' && body.targetWeight != null && targetWeight === null) {
    return badRequest('Target weight must be between 20 and 500 kg')
  }

  const { bmr, tdee } = energyFor({ age, gender: body.gender, height, weight, activityLevel: body.activityLevel })

  await prisma.$transaction(async (tx) => {
    const current = await tx.user.findUnique({ where: { id: userId }, select: { weight: true } })
    await tx.user.update({
      where: { id: userId },
      data: { name, age, gender: body.gender, height, weight, activityLevel: body.activityLevel, bmr, tdee },
    })
    if (current?.weight !== weight) {
      await tx.progress.create({ data: { userId, metric: 'weight', value: weight } })
    }

    const existing = await tx.goal.findFirst({ where: { userId, title: TARGET_WEIGHT_GOAL } })
    if (targetWeight === null) {
      if (existing) await tx.goal.deleteMany({ where: { userId, title: TARGET_WEIGHT_GOAL } })
    } else if (existing) {
      await tx.goal.update({ where: { id: existing.id }, data: { target: targetWeight, current: weight } })
    } else {
      await tx.goal.create({ data: { userId, title: TARGET_WEIGHT_GOAL, target: targetWeight, current: weight, unit: 'kg' } })
    }
  })

  return NextResponse.json(await loadProfile(userId))
}
