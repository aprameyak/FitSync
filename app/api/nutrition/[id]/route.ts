import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getUserId, unauthorized } from '@/lib/session'

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const userId = await getUserId()
  if (!userId) return unauthorized()

  const { id } = await params
  const { count } = await prisma.nutrition.deleteMany({ where: { id, userId } })
  if (count === 0) return NextResponse.json({ error: 'Entry not found' }, { status: 404 })
  return NextResponse.json({ success: true })
}
