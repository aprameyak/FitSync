import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserId, unauthorized, badRequest } from '@/lib/session'
import { TARGET_WEIGHT_GOAL, parseDate } from '@/lib/fitness'

export async function GET(request: NextRequest) {
  const userId = await getUserId()
  if (!userId) return unauthorized()

  const from = parseDate(request.nextUrl.searchParams.get('from'))
  const to = parseDate(request.nextUrl.searchParams.get('to'))
  if (!from || !to || from >= to) return badRequest('A valid from and to date are required')

  const weekStart = new Date(from)
  weekStart.setDate(weekStart.getDate() - 6)

  const [user, totals, meals, workoutsThisWeek, weights, goal] = await Promise.all([
    prisma.user.findUnique({
      where: { id: userId },
      select: { weight: true, bmr: true, tdee: true, age: true, height: true, gender: true, activityLevel: true },
    }),
    prisma.nutrition.aggregate({
      where: { userId, date: { gte: from, lt: to } },
      _sum: { calories: true, protein: true, carbs: true, fat: true },
    }),
    prisma.nutrition.findMany({
      where: { userId, date: { gte: from, lt: to } },
      orderBy: { date: 'desc' },
      take: 5,
      select: { id: true, name: true, calories: true, mealType: true },
    }),
    prisma.workout.count({ where: { userId, date: { gte: weekStart, lt: to } } }),
    prisma.progress.findMany({
      where: { userId, metric: 'weight' },
      orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
      take: 5,
      select: { id: true, value: true, date: true },
    }),
    prisma.goal.findFirst({
      where: { userId, title: TARGET_WEIGHT_GOAL },
      orderBy: { createdAt: 'desc' },
      select: { target: true },
    }),
  ])
  if (!user) return unauthorized()

  const profileComplete = [user.age, user.height, user.weight, user.gender, user.activityLevel].every((value) => value != null)

  return NextResponse.json({
    profileComplete,
    bmr: user.bmr,
    tdee: user.tdee,
    currentWeight: user.weight,
    targetWeight: goal?.target ?? null,
    workoutsThisWeek,
    today: {
      calories: totals._sum.calories ?? 0,
      protein: totals._sum.protein ?? 0,
      carbs: totals._sum.carbs ?? 0,
      fat: totals._sum.fat ?? 0,
    },
    recentMeals: meals,
    recentWeights: weights,
  })
}
