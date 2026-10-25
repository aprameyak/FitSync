'use client'

import { useCallback, useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import { PageShell } from '@/components/PageShell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { apiRequest } from '@/lib/api'
import { COMMON_FOODS, MEAL_TYPES, localDayRange, type MealType } from '@/lib/fitness'

interface Entry {
  id: string
  name: string
  calories: number
  protein: number | null
  carbs: number | null
  fat: number | null
  mealType: MealType
  date: string
}

interface Profile {
  tdee: number | null
}

const emptyForm = { name: '', calories: '', protein: '', carbs: '', fat: '' }

const mealLabel = (meal: string) => meal.charAt(0).toUpperCase() + meal.slice(1)

const formatGrams = (value: number) => `${Math.round(value * 10) / 10} g`

export default function NutritionPage() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [tdee, setTdee] = useState<number | null>(null)
  const [mealType, setMealType] = useState<MealType>('breakfast')
  const [form, setForm] = useState(emptyForm)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const loadEntries = useCallback(async () => {
    const { from, to } = localDayRange()
    const data = await apiRequest<Entry[]>(`/api/nutrition?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`)
    setEntries(data)
  }, [])

  useEffect(() => {
    Promise.all([loadEntries(), apiRequest<Profile>('/api/profile').then((profile) => setTdee(profile.tdee))])
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [loadEntries])

  const addEntry = async (values: typeof emptyForm) => {
    setIsSaving(true)
    setError('')
    try {
      await apiRequest<Entry>('/api/nutrition', {
        method: 'POST',
        body: JSON.stringify({ ...values, mealType, date: new Date().toISOString() }),
      })
      await loadEntries()
      return true
    } catch (err) {
      setError((err as Error).message)
      return false
    } finally {
      setIsSaving(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (await addEntry(form)) setForm(emptyForm)
  }

  const handleQuickAdd = (food: (typeof COMMON_FOODS)[number]) =>
    addEntry({
      name: food.name,
      calories: String(food.calories),
      protein: String(food.protein),
      carbs: String(food.carbs),
      fat: String(food.fat),
    })

  const handleDelete = async (id: string) => {
    setError('')
    try {
      await apiRequest(`/api/nutrition/${id}`, { method: 'DELETE' })
      setEntries((current) => current.filter((entry) => entry.id !== id))
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const update = (field: keyof typeof emptyForm) => (e: React.ChangeEvent<HTMLInputElement>) =>
    setForm((current) => ({ ...current, [field]: e.target.value }))

  const totals = entries.reduce(
    (sum, entry) => ({
      calories: sum.calories + entry.calories,
      protein: sum.protein + (entry.protein ?? 0),
      carbs: sum.carbs + (entry.carbs ?? 0),
      fat: sum.fat + (entry.fat ?? 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )
  const percentOfTarget = tdee ? Math.min(Math.round((totals.calories / tdee) * 100), 100) : 0

  return (
    <PageShell>
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Nutrition</h1>
        <p className="text-gray-600">Log what you eat today</p>
      </section>

      <section className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
        <div className="flex flex-wrap items-end justify-between gap-4 mb-4">
          <div>
            <p className="text-sm font-medium text-gray-600">Today&apos;s calories</p>
            <p className="text-3xl font-bold text-gray-900">
              {totals.calories.toLocaleString()}
              {tdee ? <span className="text-lg font-medium text-gray-500"> / {tdee.toLocaleString()} kcal</span> : ' kcal'}
            </p>
          </div>
          <div className="flex gap-6 text-sm">
            <div><p className="text-gray-600">Protein</p><p className="font-semibold text-gray-900">{formatGrams(totals.protein)}</p></div>
            <div><p className="text-gray-600">Carbs</p><p className="font-semibold text-gray-900">{formatGrams(totals.carbs)}</p></div>
            <div><p className="text-gray-600">Fat</p><p className="font-semibold text-gray-900">{formatGrams(totals.fat)}</p></div>
          </div>
        </div>
        {tdee ? (
          <div className="h-2 w-full rounded-full bg-gray-100">
            <div className="h-2 rounded-full bg-blue-600" style={{ width: `${percentOfTarget}%` }} />
          </div>
        ) : (
          <p className="text-sm text-gray-500">Complete your profile to see your daily calorie target.</p>
        )}
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="space-y-8">
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-gray-200 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900">Add food</h2>
            <div className="flex flex-wrap gap-2">
              {MEAL_TYPES.map((meal) => (
                <Button
                  key={meal}
                  type="button"
                  size="sm"
                  variant={mealType === meal ? 'default' : 'outline'}
                  onClick={() => setMealType(meal)}
                >
                  {mealLabel(meal)}
                </Button>
              ))}
            </div>
            <div>
              <label htmlFor="food-name" className="block text-sm font-medium text-gray-700 mb-1">Food</label>
              <Input id="food-name" value={form.name} onChange={update('name')} required />
            </div>
            <div>
              <label htmlFor="calories" className="block text-sm font-medium text-gray-700 mb-1">Calories</label>
              <Input id="calories" type="number" min={0} max={10000} value={form.calories} onChange={update('calories')} required />
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label htmlFor="protein" className="block text-sm font-medium text-gray-700 mb-1">Protein (g)</label>
                <Input id="protein" type="number" min={0} step="0.1" value={form.protein} onChange={update('protein')} />
              </div>
              <div>
                <label htmlFor="carbs" className="block text-sm font-medium text-gray-700 mb-1">Carbs (g)</label>
                <Input id="carbs" type="number" min={0} step="0.1" value={form.carbs} onChange={update('carbs')} />
              </div>
              <div>
                <label htmlFor="fat" className="block text-sm font-medium text-gray-700 mb-1">Fat (g)</label>
                <Input id="fat" type="number" min={0} step="0.1" value={form.fat} onChange={update('fat')} />
              </div>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <Button type="submit" disabled={isSaving} className="w-full">
              {isSaving ? 'Adding...' : `Add to ${mealLabel(mealType).toLowerCase()}`}
            </Button>
          </form>

          <div className="bg-white p-6 rounded-lg border border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Quick add</h2>
            <p className="text-sm text-gray-500 mb-4">Adds to {mealLabel(mealType).toLowerCase()}</p>
            <ul className="divide-y divide-gray-100">
              {COMMON_FOODS.map((food) => (
                <li key={food.name}>
                  <button
                    type="button"
                    disabled={isSaving}
                    onClick={() => handleQuickAdd(food)}
                    className="w-full flex items-center justify-between py-2 text-left text-sm hover:text-blue-600 disabled:opacity-50"
                  >
                    <span>{food.name}</span>
                    <span className="text-gray-500">{food.calories} kcal</span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="lg:col-span-2 space-y-6">
          {isLoading ? (
            <p className="text-gray-500">Loading...</p>
          ) : (
            MEAL_TYPES.map((meal) => {
              const mealEntries = entries.filter((entry) => entry.mealType === meal)
              const mealCalories = mealEntries.reduce((sum, entry) => sum + entry.calories, 0)
              return (
                <section key={meal} className="bg-white p-6 rounded-lg border border-gray-200">
                  <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-gray-900">{mealLabel(meal)}</h2>
                    <span className="text-sm text-gray-600">{mealCalories.toLocaleString()} kcal</span>
                  </div>
                  {mealEntries.length === 0 ? (
                    <p className="text-sm text-gray-500">Nothing logged</p>
                  ) : (
                    <ul className="divide-y divide-gray-100">
                      {mealEntries.map((entry) => (
                        <li key={entry.id} className="flex items-center justify-between py-2">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{entry.name}</p>
                            <p className="text-xs text-gray-500">
                              {entry.calories} kcal
                              {entry.protein != null && ` · P ${formatGrams(entry.protein)}`}
                              {entry.carbs != null && ` · C ${formatGrams(entry.carbs)}`}
                              {entry.fat != null && ` · F ${formatGrams(entry.fat)}`}
                            </p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            aria-label={`Delete ${entry.name}`}
                            onClick={() => handleDelete(entry.id)}
                          >
                            <Trash2 className="h-4 w-4 text-gray-500" />
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}
                </section>
              )
            })
          )}
        </div>
      </div>
    </PageShell>
  )
}
