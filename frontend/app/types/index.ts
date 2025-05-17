export interface Profile {
    userId?: string;
    weight?: number;
    height?: number;
    age?: number;
    gender?: string;
    activityLevel?: 'sedentary' | 'light' | 'moderate' | 'active' | 'very active';
    goal?: 'lose' | 'maintain' | 'gain';
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
  