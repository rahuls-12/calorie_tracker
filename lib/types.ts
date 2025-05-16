export interface User {
  id: string
  email: string
}

export interface FoodEntry {
  id: string
  food_name: string
  calories: number
  protein_grams: number | null
  carbs_grams: number | null
  fat_grams: number | null
  date: string
  created_at: string
}

export interface DailyGoal {
  id: string
  user_id: string
  calorie_goal: number
  protein_goal: number | null
  carbs_goal: number | null
  fat_goal: number | null
}

export interface DailySummary {
  date: string
  totalCalories: number
  totalProtein: number
  totalCarbs: number
  totalFat: number
  remainingCalories: number
  entries: FoodEntry[]
}
