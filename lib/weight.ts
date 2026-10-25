import type { Prisma } from '@prisma/client'
import { TARGET_WEIGHT_GOAL, energyFor } from '@/lib/fitness'

export async function syncLatestWeight(tx: Prisma.TransactionClient, userId: string) {
  const latest = await tx.progress.findFirst({
    where: { userId, metric: 'weight' },
    orderBy: [{ date: 'desc' }, { createdAt: 'desc' }],
  })
  if (!latest) return

  const user = await tx.user.findUnique({
    where: { id: userId },
    select: { age: true, gender: true, height: true, activityLevel: true },
  })
  if (!user) return

  const { bmr, tdee } = energyFor({ ...user, weight: latest.value })
  await tx.user.update({ where: { id: userId }, data: { weight: latest.value, bmr, tdee } })
  await tx.goal.updateMany({ where: { userId, title: TARGET_WEIGHT_GOAL }, data: { current: latest.value } })
}
