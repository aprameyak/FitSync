import { useCallback, useState } from 'react'
import { Text, View } from 'react-native'
import type { BottomTabScreenProps } from '@react-navigation/bottom-tabs'
import { apiRequest } from '../api'
import { useAuth } from '../auth'
import { Button, Card, CardTitle, Loading, Message, Screen, Stat, styles } from '../components/ui'
import { formatKg, localDayRange } from '../fitness'
import type { TabParamList } from '../navigation'
import { useFocusLoad } from '../useFocusLoad'

interface Summary {
  profileComplete: boolean
  tdee: number | null
  currentWeight: number | null
  targetWeight: number | null
  workoutsThisWeek: number
  today: { calories: number; protein: number; carbs: number; fat: number }
  recentMeals: { id: string; name: string; calories: number; mealType: string }[]
  recentWeights: { id: string; value: number; date: string }[]
}

export default function DashboardScreen({ navigation }: BottomTabScreenProps<TabParamList, 'Dashboard'>) {
  const { user, signOut } = useAuth()
  const [summary, setSummary] = useState<Summary | null>(null)

  const load = useCallback(async () => {
    const { from, to } = localDayRange()
    setSummary(await apiRequest<Summary>(`/api/summary?from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`))
  }, [])
  const { isLoading, error, reload } = useFocusLoad(load)

  return (
    <Screen title={`Welcome back, ${user?.name || 'User'}!`} subtitle="Track your fitness journey and stay motivated" onRefresh={reload}>
      <Message text={error} />
      {isLoading && !summary ? <Loading /> : null}

      {summary && !summary.profileComplete ? (
        <Card>
          <CardTitle>Set up your profile</CardTitle>
          <Text style={styles.muted}>Add your age, height, weight, and activity level to get your daily calorie target.</Text>
          <Button title="Complete profile" onPress={() => navigation.navigate('Profile')} />
        </Card>
      ) : null}

      {summary ? (
        <>
          <View style={styles.statsGrid}>
            <Stat label="Today's Calories" value={summary.today.calories.toLocaleString()} />
            <Stat label="Daily Target" value={summary.tdee ? `${summary.tdee.toLocaleString()} kcal` : '--'} />
            <Stat label="Current Weight" value={summary.currentWeight != null ? formatKg(summary.currentWeight) : '--'} />
            <Stat label="Workouts This Week" value={String(summary.workoutsThisWeek)} />
          </View>

          <Card>
            <CardTitle right={<Button title="Log Food" small variant="outline" onPress={() => navigation.navigate('Nutrition')} />}>
              Today&apos;s Meals
            </CardTitle>
            {summary.recentMeals.length === 0 ? (
              <Text style={styles.muted}>No meals logged today</Text>
            ) : (
              <View>
                {summary.recentMeals.map((meal) => (
                  <View key={meal.id} style={styles.listRow}>
                    <Text style={styles.listTitle}>{meal.name}</Text>
                    <Text style={styles.muted}>{meal.calories} kcal</Text>
                  </View>
                ))}
                <Text style={[styles.muted, { marginTop: 8 }]}>
                  Protein {Math.round(summary.today.protein)} g · Carbs {Math.round(summary.today.carbs)} g · Fat{' '}
                  {Math.round(summary.today.fat)} g
                </Text>
              </View>
            )}
          </Card>

          <Card>
            <CardTitle right={<Button title="View" small variant="outline" onPress={() => navigation.navigate('Progress')} />}>
              Progress Overview
            </CardTitle>
            {summary.recentWeights.length === 0 ? (
              <Text style={styles.muted}>Log your weight to see progress</Text>
            ) : (
              <View>
                {summary.recentWeights.map((entry) => (
                  <View key={entry.id} style={styles.listRow}>
                    <Text style={styles.listTitle}>{formatKg(entry.value)}</Text>
                    <Text style={styles.muted}>
                      {new Date(entry.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                    </Text>
                  </View>
                ))}
                {summary.targetWeight != null && summary.currentWeight != null ? (
                  <Text style={[styles.muted, { marginTop: 8 }]}>
                    {formatKg(Math.abs(summary.currentWeight - summary.targetWeight))} to your goal of {formatKg(summary.targetWeight)}
                  </Text>
                ) : null}
              </View>
            )}
          </Card>
        </>
      ) : null}

      <Button title="Sign out" variant="outline" onPress={signOut} />
    </Screen>
  )
}
