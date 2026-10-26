import { useCallback, useState } from 'react'
import { Pressable, Text, View } from 'react-native'
import { Ionicons } from '@expo/vector-icons'
import { apiRequest } from '../api'
import { Button, Card, CardTitle, Choice, Field, Loading, Message, ProgressBar, Screen, colors, styles } from '../components/ui'
import { COMMON_FOODS, MEAL_TYPES, formatGrams, localDayRange, mealLabel, type MealType } from '../fitness'
import { useFocusLoad } from '../useFocusLoad'

interface Entry {
  id: string
  name: string
  calories: number
  protein: number | null
  carbs: number | null
  fat: number | null
  mealType: MealType
}

const emptyForm = { name: '', calories: '', protein: '', carbs: '', fat: '' }

const mealOptions = MEAL_TYPES.map((meal) => ({ value: meal, label: mealLabel(meal) }))

export default function NutritionScreen() {
  const [entries, setEntries] = useState<Entry[]>([])
  const [tdee, setTdee] = useState<number | null>(null)
  const [mealType, setMealType] = useState<MealType>('breakfast')
  const [form, setForm] = useState(emptyForm)
  const [isSaving, setIsSaving] = useState(false)

  const loadEntries = useCallback(async () => {
    const { from, to } = localDayRange()
    setEntries(await apiRequest<Entry[]>(`/api/nutrition?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`))
  }, [])

  const load = useCallback(async () => {
    const [, profile] = await Promise.all([loadEntries(), apiRequest<{ tdee: number | null }>('/api/profile')])
    setTdee(profile.tdee)
  }, [loadEntries])
  const { isLoading, error, setError, reload } = useFocusLoad(load)

  const addEntry = async (values: typeof emptyForm) => {
    setIsSaving(true)
    setError('')
    try {
      await apiRequest('/api/nutrition', {
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

  const handleSubmit = async () => {
    if (!form.name.trim() || !form.calories.trim()) {
      setError('Enter a food name and calories')
      return
    }
    if (await addEntry(form)) setForm(emptyForm)
  }

  const handleDelete = async (id: string) => {
    setError('')
    try {
      await apiRequest(`/api/nutrition/${id}`, { method: 'DELETE' })
      setEntries((current) => current.filter((entry) => entry.id !== id))
    } catch (err) {
      setError((err as Error).message)
    }
  }

  const update = (field: keyof typeof emptyForm) => (value: string) => setForm((current) => ({ ...current, [field]: value }))

  const totals = entries.reduce(
    (sum, entry) => ({
      calories: sum.calories + entry.calories,
      protein: sum.protein + (entry.protein ?? 0),
      carbs: sum.carbs + (entry.carbs ?? 0),
      fat: sum.fat + (entry.fat ?? 0),
    }),
    { calories: 0, protein: 0, carbs: 0, fat: 0 }
  )

  return (
    <Screen title="Nutrition" subtitle="Log what you eat today" onRefresh={reload}>
      <Card>
        <Text style={styles.statLabel}>Today&apos;s calories</Text>
        <Text style={styles.statValue}>
          {totals.calories.toLocaleString()}
          <Text style={styles.muted}>{tdee ? ` / ${tdee.toLocaleString()} kcal` : ' kcal'}</Text>
        </Text>
        {tdee ? <ProgressBar percent={(totals.calories / tdee) * 100} /> : <Text style={styles.muted}>Complete your profile to see your daily calorie target.</Text>}
        <View style={styles.row}>
          <Text style={styles.muted}>Protein {formatGrams(totals.protein)}</Text>
          <Text style={styles.muted}>Carbs {formatGrams(totals.carbs)}</Text>
          <Text style={styles.muted}>Fat {formatGrams(totals.fat)}</Text>
        </View>
      </Card>

      <Card>
        <CardTitle>Add food</CardTitle>
        <Choice options={mealOptions} value={mealType} onChange={setMealType} horizontal />
        <Field label="Food" value={form.name} onChangeText={update('name')} />
        <Field label="Calories" value={form.calories} onChangeText={update('calories')} keyboardType="number-pad" />
        <View style={styles.row}>
          <Field label="Protein (g)" value={form.protein} onChangeText={update('protein')} keyboardType="decimal-pad" />
          <Field label="Carbs (g)" value={form.carbs} onChangeText={update('carbs')} keyboardType="decimal-pad" />
          <Field label="Fat (g)" value={form.fat} onChangeText={update('fat')} keyboardType="decimal-pad" />
        </View>
        <Message text={error} />
        <Button title={`Add to ${mealLabel(mealType).toLowerCase()}`} onPress={handleSubmit} loading={isSaving} />
      </Card>

      {isLoading && entries.length === 0 ? <Loading /> : null}
      {MEAL_TYPES.map((meal) => {
        const mealEntries = entries.filter((entry) => entry.mealType === meal)
        const mealCalories = mealEntries.reduce((sum, entry) => sum + entry.calories, 0)
        return (
          <Card key={meal}>
            <CardTitle right={<Text style={styles.muted}>{mealCalories.toLocaleString()} kcal</Text>}>{mealLabel(meal)}</CardTitle>
            {mealEntries.length === 0 ? (
              <Text style={styles.muted}>Nothing logged</Text>
            ) : (
              mealEntries.map((entry) => (
                <View key={entry.id} style={styles.listRow}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.listTitle}>{entry.name}</Text>
                    <Text style={styles.listMeta}>
                      {entry.calories} kcal
                      {entry.protein != null ? ` · P ${formatGrams(entry.protein)}` : ''}
                      {entry.carbs != null ? ` · C ${formatGrams(entry.carbs)}` : ''}
                      {entry.fat != null ? ` · F ${formatGrams(entry.fat)}` : ''}
                    </Text>
                  </View>
                  <Pressable accessibilityLabel={`Delete ${entry.name}`} onPress={() => handleDelete(entry.id)} hitSlop={8}>
                    <Ionicons name="trash-outline" size={20} color={colors.textSubtle} />
                  </Pressable>
                </View>
              ))
            )}
          </Card>
        )
      })}

      <Card>
        <CardTitle>Quick add</CardTitle>
        <Text style={styles.muted}>Adds to {mealLabel(mealType).toLowerCase()}</Text>
        {COMMON_FOODS.map((food) => (
          <Pressable
            key={food.name}
            accessibilityRole="button"
            disabled={isSaving}
            onPress={() =>
              addEntry({
                name: food.name,
                calories: String(food.calories),
                protein: String(food.protein),
                carbs: String(food.carbs),
                fat: String(food.fat),
              })
            }
            style={styles.listRow}
          >
            <Text style={styles.listTitle}>{food.name}</Text>
            <Text style={styles.muted}>{food.calories} kcal</Text>
          </Pressable>
        ))}
      </Card>
    </Screen>
  )
}
