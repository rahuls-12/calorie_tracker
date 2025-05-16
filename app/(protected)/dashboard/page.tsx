import { cookies } from "next/headers"
import { format } from "date-fns"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { EntryList } from "@/components/food-entry/entry-list"
import { DailySummaryCard } from "@/components/dashboard/daily-summary"
import { Button } from "@/components/ui/button"
import Link from "next/link"
import { PlusCircle } from "lucide-react"
import type { FoodEntry, DailySummary, DailyGoal } from "@/lib/types"

export default async function Dashboard() {
  const cookieStore = cookies()
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) return null

  const today = new Date()
  const todayFormatted = format(today, "yyyy-MM-dd")

  // Get today's entries
  const { data: entries } = await supabase
    .from("food_entries")
    .select("*")
    .eq("user_id", session.user.id)
    .eq("date", todayFormatted)
    .order("created_at", { ascending: false })

  // Get user's goals
  const { data: goals } = await supabase.from("daily_goals").select("*").eq("user_id", session.user.id).single()

  const defaultGoals: DailyGoal = {
    id: "",
    user_id: session.user.id,
    calorie_goal: 2000,
    protein_goal: 50,
    carbs_goal: 250,
    fat_goal: 70,
  }

  const userGoals = goals || defaultGoals

  // Calculate daily summary
  const foodEntries: FoodEntry[] = entries || []

  const summary: DailySummary = {
    date: todayFormatted,
    totalCalories: foodEntries.reduce((sum, entry) => sum + entry.calories, 0),
    totalProtein: foodEntries.reduce((sum, entry) => sum + (entry.protein_grams || 0), 0),
    totalCarbs: foodEntries.reduce((sum, entry) => sum + (entry.carbs_grams || 0), 0),
    totalFat: foodEntries.reduce((sum, entry) => sum + (entry.fat_grams || 0), 0),
    remainingCalories: userGoals.calorie_goal - foodEntries.reduce((sum, entry) => sum + entry.calories, 0),
    entries: foodEntries,
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link href="/add-entry">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Food
          </Link>
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <DailySummaryCard summary={summary} goals={userGoals} />
        <EntryList entries={foodEntries} date={todayFormatted} />
      </div>
    </div>
  )
}
