export interface Profile {
    id?: string;
    userId?: string;
    weight?: number;
    height?: number;
    age?: number;
    gender?: "male" | "female" | "other";
    activityLevel?: "sedentary" | "light" | "moderate" | "active" | "very_active";
    goal?: "lose_weight" | "maintain" | "gain_weight";
}
  
export interface Workout {
    exercise: string;
    sets: number;
    reps: number;
    weight: number;
    pr?: boolean;
    date?: string;
    notes?: string;
}
  
export interface NutritionEntry {
    food: string;
    calories: number;
    protein?: number;
    carbs?: number;
    fat?: number;
    mealType?: string;
    date?: string;
}
  
export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
}
export interface ChatResponse {
    message: string;
}
  