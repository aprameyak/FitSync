export interface Workout {
  id: string;
  userId: string;
  exercise: string;
  sets: number;
  reps: number;
  weight: number;
  duration: number;
  notes?: string;
  date: string;
}

export interface NutritionEntry {
  id: string;
  userId: string;
  food: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  date: string;
}

export interface Profile {
  id: string;
  userId: string;
  weight: number;
  height: number;
  age: number;
  gender: "male" | "female" | "other";
  activityLevel: "sedentary" | "light" | "moderate" | "active" | "very_active";
  goal: "lose_weight" | "maintain" | "gain_weight";
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
} 