'use client'

import { useEffect, useState } from 'react'
import { PageShell } from '@/components/PageShell'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { apiRequest } from '@/lib/api'
import { ACTIVITY_LEVELS, GENDERS } from '@/lib/fitness'

interface Profile {
  name: string | null
  email: string
  age: number | null
  gender: string | null
  height: number | null
  weight: number | null
  activityLevel: string | null
  bmr: number | null
  tdee: number | null
  targetWeight: number | null
}

interface FormState {
  name: string
  age: string
  gender: string
  height: string
  weight: string
  activityLevel: string
  targetWeight: string
}

const toField = (value: number | string | null) => (value == null ? '' : String(value))

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null)
  const [form, setForm] = useState<FormState>({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: 'moderate',
    targetWeight: '',
  })
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  const applyProfile = (data: Profile) => {
    setProfile(data)
    setForm({
      name: toField(data.name),
      age: toField(data.age),
      gender: toField(data.gender),
      height: toField(data.height),
      weight: toField(data.weight),
      activityLevel: data.activityLevel || 'moderate',
      targetWeight: toField(data.targetWeight),
    })
  }

  useEffect(() => {
    apiRequest<Profile>('/api/profile')
      .then(applyProfile)
      .catch((err: Error) => setError(err.message))
      .finally(() => setIsLoading(false))
  }, [])

  const update = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((current) => ({ ...current, [field]: e.target.value }))

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSaving(true)
    setError('')
    setMessage('')
    try {
      const data = await apiRequest<Profile>('/api/profile', { method: 'PUT', body: JSON.stringify(form) })
      applyProfile(data)
      setMessage('Profile saved')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <PageShell>
      <section className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Profile</h1>
        <p className="text-gray-600">Your stats are used to calculate your daily calorie needs</p>
      </section>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white p-6 rounded-lg border border-gray-200 space-y-5">
          {isLoading ? (
            <p className="text-gray-500">Loading profile...</p>
          ) : (
            <>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <Input id="name" value={form.name} onChange={update('name')} required />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-1">Age</label>
                  <Input id="age" type="number" min={10} max={120} step={1} value={form.age} onChange={update('age')} required />
                </div>
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
                  <select
                    id="gender"
                    value={form.gender}
                    onChange={update('gender')}
                    required
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                  >
                    <option value="" disabled>Select</option>
                    {GENDERS.map((gender) => (
                      <option key={gender.value} value={gender.value}>{gender.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label htmlFor="height" className="block text-sm font-medium text-gray-700 mb-1">Height (cm)</label>
                  <Input id="height" type="number" min={50} max={275} step="0.1" value={form.height} onChange={update('height')} required />
                </div>
                <div>
                  <label htmlFor="weight" className="block text-sm font-medium text-gray-700 mb-1">Current weight (kg)</label>
                  <Input id="weight" type="number" min={20} max={500} step="0.1" value={form.weight} onChange={update('weight')} required />
                </div>
                <div>
                  <label htmlFor="targetWeight" className="block text-sm font-medium text-gray-700 mb-1">Target weight (kg, optional)</label>
                  <Input id="targetWeight" type="number" min={20} max={500} step="0.1" value={form.targetWeight} onChange={update('targetWeight')} />
                </div>
              </div>

              <fieldset>
                <legend className="block text-sm font-medium text-gray-700 mb-2">Activity level</legend>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {ACTIVITY_LEVELS.map((level) => (
                    <label
                      key={level.value}
                      className={`flex items-start gap-3 rounded-md border p-3 cursor-pointer ${
                        form.activityLevel === level.value ? 'border-blue-600 bg-blue-50' : 'border-gray-200'
                      }`}
                    >
                      <input
                        type="radio"
                        name="activityLevel"
                        value={level.value}
                        checked={form.activityLevel === level.value}
                        onChange={update('activityLevel')}
                        className="mt-1"
                      />
                      <span>
                        <span className="block text-sm font-medium text-gray-900">{level.label}</span>
                        <span className="block text-sm text-gray-500">{level.description}</span>
                      </span>
                    </label>
                  ))}
                </div>
              </fieldset>

              {error && <p className="text-sm text-red-600">{error}</p>}
              {message && <p className="text-sm text-green-600">{message}</p>}

              <Button type="submit" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save profile'}
              </Button>
            </>
          )}
        </form>

        <aside className="bg-white p-6 rounded-lg border border-gray-200 h-fit">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Daily energy</h2>
          {profile?.bmr && profile?.tdee ? (
            <dl className="space-y-4">
              <div>
                <dt className="text-sm text-gray-600">BMR (calories at rest)</dt>
                <dd className="text-2xl font-bold text-gray-900">{profile.bmr.toLocaleString()} kcal</dd>
              </div>
              <div>
                <dt className="text-sm text-gray-600">TDEE (calories per day)</dt>
                <dd className="text-2xl font-bold text-gray-900">{profile.tdee.toLocaleString()} kcal</dd>
              </div>
              <p className="text-sm text-gray-500">
                Calculated with the Mifflin-St Jeor equation and your activity level.
              </p>
            </dl>
          ) : (
            <p className="text-sm text-gray-500">Fill in your profile to see your BMR and daily calorie target.</p>
          )}
        </aside>
      </div>
    </PageShell>
  )
}
