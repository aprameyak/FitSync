'use client'

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'
import { Activity, BarChart3, Bot, Dumbbell, Flame, Target, Utensils } from 'lucide-react'
import { PageShell } from '@/components/PageShell'
import { Button } from '@/components/ui/button'
import { apiRequest } from '@/lib/api'
import { localDayRange } from '@/lib/fitness'

interface Summary {
  profileComplete: boolean
  bmr: number | null
  tdee: number | null
  currentWeight: number | null
  targetWeight: number | null
  workoutsThisWeek: number
  today: { calories: number; protein: number; carbs: number; fat: number }
  recentMeals: { id: string; name: string; calories: number; mealType: string }[]
  recentWeights: { id: string; value: number; date: string }[]
}

const formatKg = (value: number) => `${Math.round(value * 10) / 10} kg`

export default function DashboardPage() {
  const { data: session } = useSession()
  const [summary, setSummary] = useState<Summary | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    const { from, to } = localDayRange()
    apiRequest<Summary>(`/api/summary?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)
      .then(setSummary)
      .catch((err: Error) => setError(err.message))
  }, [])

  const stats = [
    {
      label: "Today's Calories",
      value: summary ? summary.today.calories.toLocaleString() : '--',
      icon: Activity,
      color: 'bg-blue-100 text-blue-600',
    },
    {
      label: 'Daily Target',
      value: summary?.tdee ? `${summary.tdee.toLocaleString()} kcal` : '--',
      icon: Flame,
      color: 'bg-orange-100 text-orange-600',
    },
    {
      label: 'Current Weight',
      value: summary?.currentWeight != null ? formatKg(summary.currentWeight) : '--',
      icon: Target,
      color: 'bg-purple-100 text-purple-600',
    },
    {
      label: 'Workouts This Week',
      value: summary ? String(summary.workoutsThisWeek) : '--',
      icon: Dumbbell,
      color: 'bg-green-100 text-green-600',
    },
  ]

  return (
    <PageShell>
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Welcome back, {session?.user?.name || 'User'}!
        </h1>
        <p className="text-gray-600">Track your fitness journey and stay motivated</p>
      </section>

      {error && <p className="mb-6 text-sm text-red-600">{error}</p>}

      {summary && !summary.profileComplete && (
        <section className="mb-8 bg-white p-6 rounded-lg border border-blue-200 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Set up your profile</h2>
            <p className="text-gray-600">Add your age, height, weight, and activity level to get your daily calorie target.</p>
          </div>
          <Link href="/profile">
            <Button>Complete profile</Button>
          </Link>
        </section>
      )}

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => (
          <div key={stat.label} className="bg-white p-6 rounded-lg border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${stat.color}`}>
                <stat.icon className="h-6 w-6" />
              </div>
            </div>
          </div>
        ))}
      </section>

      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Today&apos;s Meals</h2>
            <Link href="/nutrition">
              <Button variant="ghost" size="sm">Log Food</Button>
            </Link>
          </div>
          {summary && summary.recentMeals.length > 0 ? (
            <>
              <ul className="divide-y divide-gray-100">
                {summary.recentMeals.map((meal) => (
                  <li key={meal.id} className="flex items-center justify-between py-2 text-sm">
                    <span className="text-gray-900">{meal.name}</span>
                    <span className="text-gray-500">{meal.calories} kcal</span>
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-sm text-gray-600">
                Protein {Math.round(summary.today.protein)} g · Carbs {Math.round(summary.today.carbs)} g · Fat{' '}
                {Math.round(summary.today.fat)} g
              </p>
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Utensils className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No meals logged today</p>
              <p className="text-sm">Log your first meal to track calories</p>
            </div>
          )}
        </div>

        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Progress Overview</h2>
            <Link href="/progress">
              <Button variant="ghost" size="sm">View Details</Button>
            </Link>
          </div>
          {summary && summary.recentWeights.length > 0 ? (
            <>
              <ul className="divide-y divide-gray-100">
                {summary.recentWeights.map((entry) => (
                  <li key={entry.id} className="flex items-center justify-between py-2 text-sm">
                    <span className="text-gray-900">{formatKg(entry.value)}</span>
                    <span className="text-gray-500">
                      {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </span>
                  </li>
                ))}
              </ul>
              {summary.targetWeight != null && summary.currentWeight != null && (
                <p className="mt-4 text-sm text-gray-600">
                  {formatKg(Math.abs(summary.currentWeight - summary.targetWeight))} to your goal of{' '}
                  {formatKg(summary.targetWeight)}
                </p>
              )}
            </>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <BarChart3 className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>No progress data yet</p>
              <p className="text-sm">Log your weight to see progress</p>
            </div>
          )}
        </div>
      </section>

      <section className="mt-8 bg-blue-600 rounded-lg p-6 text-white">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold mb-2">Need Fitness Advice?</h2>
            <p className="text-blue-100">Get personalized guidance from our AI coach powered by Gemini</p>
          </div>
          <Link href="/chat">
            <Button variant="secondary" size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
              <Bot className="h-5 w-5 mr-2" />
              Chat with AI Coach
            </Button>
          </Link>
        </div>
      </section>
    </PageShell>
  )
}
