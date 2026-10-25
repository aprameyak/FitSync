'use client'

import { useCallback, useEffect, useState } from 'react'
import Link from 'next/link'
import { Trash2 } from 'lucide-react'
import { PageShell } from '@/components/PageShell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { apiRequest } from '@/lib/api'

interface WeightEntry {
  id: string
  value: number
  date: string
  notes: string | null
}

interface Profile {
  bmr: number | null
  tdee: number | null
  targetWeight: number | null
}

const todayInputValue = () => {
  const now = new Date()
  const offset = now.getTimezoneOffset() * 60000
  return new Date(now.getTime() - offset).toISOString().slice(0, 10)
}

const formatKg = (value: number) => `${Math.round(value * 10) / 10} kg`

export default function ProgressPage() {
  const [entries, setEntries] = useState<WeightEntry[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [weight, setWeight] = useState('')
  const [date, setDate] = useState(todayInputValue)
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const load = useCallback(async () => {
    const [weights, profileData] = await Promise.all([
      apiRequest<WeightEntry[]>('/api/weight'),
      apiRequest<Profile>('/api/profile'),
    ])
    setEntries(weights)
    setProfile(profileData)
  }, [])

  useEffect(() => {
    load()
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [load])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    try {
      const [year, month, day] = date.split('-').map(Number)
      const now = new Date()
      const entryDate = date === todayInputValue() ? now : new Date(year, month - 1, day, 12)
      await apiRequest('/api/weight', {
        method: 'POST',
        body: JSON.stringify({ value: weight, date: entryDate.toISOString() }),
      })
      setWeight('')
      await load()
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsSaving(false)
    }
  }

  const handleDelete = async (id: string) => {
    setError('')
    try {
      await apiRequest(`/api/weight/${id}`, { method: 'DELETE' })
      await load()
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const current = entries[0]?.value ?? null
  const start = entries.length > 0 ? entries[entries.length - 1].value : null
  const target = profile?.targetWeight ?? null
  const change = current != null && start != null ? current - start : null

  let goalPercent: number | null = null
  if (current != null && start != null && target != null) {
    goalPercent = start === target ? 100 : Math.min(Math.max(((start - current) / (start - target)) * 100, 0), 100)
  }

  return (
    <PageShell>
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Progress</h1>
        <p className="text-gray-600">Track your weight over time</p>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-600">Current weight</p>
          <p className="text-2xl font-bold text-gray-900">{current != null ? formatKg(current) : '--'}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-600">Change</p>
          <p className="text-2xl font-bold text-gray-900">
            {change != null ? `${change > 0 ? '+' : ''}${formatKg(change)}` : '--'}
          </p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-600">BMR</p>
          <p className="text-2xl font-bold text-gray-900">{profile?.bmr ? `${profile.bmr.toLocaleString()} kcal` : '--'}</p>
        </div>
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <p className="text-sm font-medium text-gray-600">TDEE</p>
          <p className="text-2xl font-bold text-gray-900">{profile?.tdee ? `${profile.tdee.toLocaleString()} kcal` : '--'}</p>
        </div>
      </section>

      {target != null && goalPercent != null && current != null && (
        <section className="bg-white p-6 rounded-lg border border-gray-200 mb-8">
          <div className="flex items-center justify-between mb-2">
            <h2 className="text-lg font-semibold text-gray-900">Goal: {formatKg(target)}</h2>
            <span className="text-sm font-medium text-gray-600">{Math.round(goalPercent)}%</span>
          </div>
          <div className="h-2 w-full rounded-full bg-gray-100">
            <div className="h-2 rounded-full bg-blue-600" style={{ width: `${goalPercent}%` }} />
          </div>
          <p className="mt-2 text-sm text-gray-500">{formatKg(Math.abs(current - target))} to go</p>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg border border-gray-200 space-y-4 h-fit">
          <h2 className="text-lg font-semibold text-gray-900">Log weight</h2>
          <div>
            <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
            <Input id="weight" type="number" min={20} max={500} step="0.1" value={weight} onChange={(e) => setWeight(e.target.value)} required />
          </div>
          <div>
            <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <Input id="date" type="date" max={todayInputValue()} value={date} onChange={(e) => setDate(e.target.value)} required />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" disabled={isSaving} className="w-full">
            {isSaving ? 'Saving...' : 'Log weight'}
          </Button>
          {target == null && (
            <p className="text-sm text-gray-500">
              Set a target weight on your <Link href="/profile" className="text-blue-600 hover:underline">profile</Link> to track your goal.
            </p>
          )}
        </form>

        <section className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">History</h2>
          {isLoading ? (
            <p className="text-gray-500">Loading...</p>
          ) : entries.length === 0 ? (
            <p className="text-sm text-gray-500">No weight entries yet</p>
          ) : (
            <ul className="divide-y divide-gray-100">
              {entries.map((entry, index) => {
                const previous = entries[index + 1]
                const diff = previous ? entry.value - previous.value : null
                return (
                  <li key={entry.id} className="flex items-center justify-between py-2">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{formatKg(entry.value)}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                        {diff != null && diff !== 0 && ` · ${diff > 0 ? '+' : ''}${formatKg(diff)}`}
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      aria-label="Delete entry"
                      onClick={() => handleDelete(entry.id)}
                    >
                      <Trash2 className="h-4 w-4 text-gray-500" />
                    </Button>
                  </li>
                )
              })}
            </ul>
          )}
        </section>
      </div>
    </PageShell>
  )
}
