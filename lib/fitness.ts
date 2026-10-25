export const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary', description: 'Little or no exercise', multiplier: 1.2 },
  { value: 'light', label: 'Light', description: 'Exercise 1-3 days a week', multiplier: 1.375 },
  { value: 'moderate', label: 'Moderate', description: 'Exercise 3-5 days a week', multiplier: 1.55 },
  { value: 'active', label: 'Active', description: 'Exercise 6-7 days a week', multiplier: 1.725 },
  { value: 'very_active', label: 'Very active', description: 'Hard exercise or a physical job', multiplier: 1.9 },
] as const

export type ActivityLevel = (typeof ACTIVITY_LEVELS)[number]['value']

export const GENDERS = [
  { value: 'male', label: 'Male' },
  { value: 'female', label: 'Female' },
] as const

export type Gender = (typeof GENDERS)[number]['value']

export const MEAL_TYPES = ['breakfast', 'lunch', 'dinner', 'snack'] as const

export type MealType = (typeof MEAL_TYPES)[number]

export const COMMON_FOODS = [
  { name: 'Chicken Breast (100g)', calories: 165, protein: 31, carbs: 0, fat: 3.6 },
  { name: 'Brown Rice (100g)', calories: 123, protein: 2.6, carbs: 23, fat: 0.9 },
  { name: 'Broccoli (100g)', calories: 34, protein: 2.8, carbs: 7, fat: 0.4 },
  { name: 'Banana (medium)', calories: 105, protein: 1.3, carbs: 27, fat: 0.4 },
  { name: 'Oats (100g)', calories: 389, protein: 16.9, carbs: 66, fat: 6.9 },
  { name: 'Salmon (100g)', calories: 208, protein: 20, carbs: 0, fat: 13 },
  { name: 'Eggs (2 large)', calories: 140, protein: 12, carbs: 1, fat: 10 },
  { name: 'Greek Yogurt (100g)', calories: 59, protein: 10, carbs: 3.6, fat: 0.4 },
  { name: 'Almonds (30g)', calories: 173, protein: 6.4, carbs: 6.1, fat: 15 },
  { name: 'Sweet Potato (100g)', calories: 86, protein: 1.6, carbs: 20, fat: 0.1 },
]

export const TARGET_WEIGHT_GOAL = 'Target weight'

export function isActivityLevel(value: unknown): value is ActivityLevel {
  return ACTIVITY_LEVELS.some((level) => level.value === value)
}

export function isGender(value: unknown): value is Gender {
  return GENDERS.some((gender) => gender.value === value)
}

export function isMealType(value: unknown): value is MealType {
  return MEAL_TYPES.some((meal) => meal === value)
}

export function calculateBmr(weightKg: number, heightCm: number, age: number, gender: Gender) {
  const base = 10 * weightKg + 6.25 * heightCm - 5 * age
  return Math.round(gender === 'male' ? base + 5 : base - 161)
}

export function calculateTdee(bmr: number, activityLevel: ActivityLevel) {
  const level = ACTIVITY_LEVELS.find((item) => item.value === activityLevel)
  return Math.round(bmr * (level?.multiplier ?? 1.2))
}

export function energyFor(profile: {
  age: number | null
  gender: string | null
  height: number | null
  weight: number | null
  activityLevel: string | null
}) {
  const { age, gender, height, weight, activityLevel } = profile
  if (age == null || height == null || weight == null || !isGender(gender) || !isActivityLevel(activityLevel)) {
    return { bmr: null, tdee: null }
  }
  const bmr = calculateBmr(weight, height, age, gender)
  return { bmr, tdee: calculateTdee(bmr, activityLevel) }
}

export function parseNumber(value: unknown, min: number, max: number) {
  const number = typeof value === 'string' && value.trim() !== '' ? Number(value) : value
  if (typeof number !== 'number' || !Number.isFinite(number) || number < min || number > max) {
    return null
  }
  return number
}

export function parseDate(value: unknown) {
  if (typeof value !== 'string') return null
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? null : date
}

export function localDayRange(date = new Date()) {
  const start = new Date(date.getFullYear(), date.getMonth(), date.getDate())
  const end = new Date(start)
  end.setDate(end.getDate() + 1)
  return { from: start.toISOString(), to: end.toISOString() }
}
