import { useCallback, useState } from 'react'
import { Text, View } from 'react-native'
import { apiRequest } from '../api'
import { useAuth } from '../auth'
import { Button, Card, CardTitle, Choice, Field, Loading, Message, Screen, styles } from '../components/ui'
import { ACTIVITY_LEVELS, GENDERS, type ActivityLevel, type Gender } from '../fitness'
import { useFocusLoad } from '../useFocusLoad'

interface Profile {
  name: string | null
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
  gender: Gender | ''
  height: string
  weight: string
  activityLevel: ActivityLevel
  targetWeight: string
}

const toField = (value: number | string | null) => (value == null ? '' : String(value))

export default function ProfileScreen() {
  const { signOut } = useAuth()
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
  const [message, setMessage] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const applyProfile = (data: Profile) => {
    setProfile(data)
    setForm({
      name: toField(data.name),
      age: toField(data.age),
      gender: data.gender === 'male' || data.gender === 'female' ? data.gender : '',
      height: toField(data.height),
      weight: toField(data.weight),
      activityLevel: ACTIVITY_LEVELS.some((level) => level.value === data.activityLevel)
        ? (data.activityLevel as ActivityLevel)
        : 'moderate',
      targetWeight: toField(data.targetWeight),
    })
  }

  const load = useCallback(async () => {
    applyProfile(await apiRequest<Profile>('/api/profile'))
  }, [])
  const { isLoading, error, setError } = useFocusLoad(load)

  const update = (field: keyof FormState) => (value: string) => setForm((current) => ({ ...current, [field]: value }))

  const handleSave = async () => {
    setIsSaving(true)
    setError('')
    setMessage('')
    try {
      applyProfile(await apiRequest<Profile>('/api/profile', { method: 'PUT', body: JSON.stringify(form) }))
      setMessage('Profile saved')
    } catch (err) {
      setError((err as Error).message)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <Screen title="Profile" subtitle="Your stats are used to calculate your daily calorie needs">
      <Card>
        <CardTitle>Daily energy</CardTitle>
        {profile?.bmr && profile?.tdee ? (
          <View style={styles.row}>
            <View style={{ flex: 1 }}>
              <Text style={styles.statLabel}>BMR (at rest)</Text>
              <Text style={styles.statValue}>{profile.bmr.toLocaleString()} kcal</Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.statLabel}>TDEE (per day)</Text>
              <Text style={styles.statValue}>{profile.tdee.toLocaleString()} kcal</Text>
            </View>
          </View>
        ) : (
          <Text style={styles.muted}>Fill in your profile to see your BMR and daily calorie target.</Text>
        )}
      </Card>

      {isLoading && !profile ? (
        <Loading />
      ) : (
        <Card>
          <Field label="Name" value={form.name} onChangeText={update('name')} />
          <View style={styles.row}>
            <Field label="Age" value={form.age} onChangeText={update('age')} keyboardType="number-pad" />
            <Field label="Height (cm)" value={form.height} onChangeText={update('height')} keyboardType="decimal-pad" />
          </View>
          <View style={styles.row}>
            <Field label="Weight (kg)" value={form.weight} onChangeText={update('weight')} keyboardType="decimal-pad" />
            <Field label="Target (kg)" value={form.targetWeight} onChangeText={update('targetWeight')} keyboardType="decimal-pad" placeholder="Optional" />
          </View>
          <Text style={styles.label}>Gender</Text>
          <Choice horizontal options={GENDERS} value={form.gender} onChange={(value) => setForm((current) => ({ ...current, gender: value }))} />
          <Text style={styles.label}>Activity level</Text>
          <Choice
            options={ACTIVITY_LEVELS}
            value={form.activityLevel}
            onChange={(value) => setForm((current) => ({ ...current, activityLevel: value }))}
          />
          <Message text={error} />
          <Message text={message} tone="success" />
          <Button title="Save profile" onPress={handleSave} loading={isSaving} />
        </Card>
      )}

      <Button title="Sign out" variant="outline" onPress={signOut} />
    </Screen>
  )
}
