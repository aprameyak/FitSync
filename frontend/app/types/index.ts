export interface Profile {
    userId?: string;
    weight?: number;
    height?: number;
    age?: number;
    gender?: string;
  }
  
  export interface Workout {
    name: string;
    sets: number;
    reps: number;
    weight: number;
  }
  
  export interface NutritionEntry {
    food: string;
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }
  
  export interface ChatMessage {
    role: "user" | "assistant";
    content: string;
  }
  export interface ChatResponse {
    message: string;
  }
  