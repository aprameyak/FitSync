import { useCallback, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { apiRequest } from '../api'
import { Button, Card, CardTitle, Field, Loading, Message, ProgressBar, Screen, Stat, colors, styles } from '../components/ui'
import { formatKg } from '../fitness'
import { useFocusLoad } from '../useFocusLoad'

interface WeightEntry {
  id: string
  value: number
  date: string
}

interface Profile {
  bmr: number | null
  tdee: number | null
  targetWeight: number | null
}

export default function ProgressScreen() {
  const [entries, setEntries] = useState<WeightEntry[]>([])
  const [profile, setProfile] = useState<Profile | null>(null)
  const [weight, setWeight] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const load = useCallback(async () => {
    const [weights, profileData] = await Promise.all([
      apiRequest<WeightEntry[]>('/api/weight'),
      apiRequest<Profile>('/api/profile'),
    ])
    setEntries(weights)
    setProfile(profileData)
  }, [])
  const { isLoading, error, setError, reload } = useFocusLoad(load)

  const handleSubmit = async () => {
    if (!weight.trim()) {
      setError('Enter your weight')
      return
    }
    setIsSaving(true)
    setError('')
    try {
      await apiRequest('/api/weight', {
        method: 'POST',
        body: JSON.stringify({ value: weight, date: new Date().toISOString() }),
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
    <Screen title="Progress" subtitle="Track your weight over time" onRefresh={reload}>
      <View style={styles.statsGrid}>
        <Stat label="Current weight" value={current != null ? formatKg(current) : '--'} />
        <Stat label="Change" value={change != null ? `${change > 0 ? '+' : ''}${formatKg(change)}` : '--'} />
        <Stat label="BMR" value={profile?.bmr ? `${profile.bmr.toLocaleString()} kcal` : '--'} />
        <Stat label="TDEE" value={profile?.tdee ? `${profile.tdee.toLocaleString()} kcal` : '--'} />
      </View>

      {target != null && goalPercent != null && current != null ? (
        <Card>
          <CardTitle right={<Text style={styles.muted}>{Math.round(goalPercent)}%</Text>}>Goal: {formatKg(target)}</CardTitle>
          <ProgressBar percent={goalPercent} />
          <Text style={styles.muted}>{formatKg(Math.abs(current - target))} to go</Text>
        </Card>
      ) : null}

      <Card>
        <CardTitle>Log today&apos;s weight</CardTitle>
        <Field label="Today's weight (kg)" value={weight} onChangeText={setWeight} keyboardType="decimal-pad" onSubmitEditing={handleSubmit} />
        <Message text={error} />
        <Button title="Log weight" onPress={handleSubmit} loading={isSaving} />
        {target == null ? <Text style={styles.muted}>Set a target weight on your profile to track your goal.</Text> : null}
      </Card>

      <Card>
        <CardTitle>History</CardTitle>
        {isLoading && entries.length === 0 ? (
          <Loading />
        ) : entries.length === 0 ? (
          <Text style={styles.muted}>No weight entries yet</Text>
        ) : (
          entries.map((entry, index) => {
            const previous = entries[index + 1]
            const diff = previous ? entry.value - previous.value : null
            return (
              <View key={entry.id} style={styles.listRow}>
                <View>
                  <Text style={styles.listTitle}>{formatKg(entry.value)}</Text>
                  <Text style={styles.listMeta}>
                    {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                    {diff != null && diff !== 0 ? ` · ${diff > 0 ? '+' : ''}${formatKg(diff)}` : ''}
                  </Text>
                </View>
                <Pressable accessibilityLabel="Delete entry" onPress={() => handleDelete(entry.id)} hitSlop={8}>
                  <Ionicons name="trash-outline" size={20} color={colors.textSubtle} />
                </Pressable>
              </View>
            )
          })
        )}
      </Card>
    </Screen>
  )
}
