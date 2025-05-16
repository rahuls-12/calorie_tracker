import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import type { FoodEntry } from "@/lib/types"

interface DailySummaryProps {
  entries: FoodEntry[]
}

export function DailySummary({ entries }: DailySummaryProps) {
  // Calculate totals
  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0)
  const totalProtein = entries.reduce((sum, entry) => sum + (entry.protein_grams || 0), 0)
  const totalCarbs = entries.reduce((sum, entry) => sum + (entry.carbs_grams || 0), 0)
  const totalFat = entries.reduce((sum, entry) => sum + (entry.fat_grams || 0), 0)

  // Default goals
  const calorieGoal = 2000
  const proteinGoal = 50
  const carbsGoal = 250
  const fatGoal = 70

  // Calculate percentages
  const caloriePercentage = Math.min(Math.round((totalCalories / calorieGoal) * 100), 100)
  const proteinPercentage = Math.min(Math.round((totalProtein / proteinGoal) * 100), 100)
  const carbsPercentage = Math.min(Math.round((totalCarbs / carbsGoal) * 100), 100)
  const fatPercentage = Math.min(Math.round((totalFat / fatGoal) * 100), 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Daily Summary</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Calories</span>
            <span>
              {totalCalories} / {calorieGoal}
            </span>
          </div>
          <Progress value={caloriePercentage} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Protein</span>
            <span>
              {totalProtein.toFixed(1)}g / {proteinGoal}g
            </span>
          </div>
          <Progress value={proteinPercentage} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Carbs</span>
            <span>
              {totalCarbs.toFixed(1)}g / {carbsGoal}g
            </span>
          </div>
          <Progress value={carbsPercentage} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Fat</span>
            <span>
              {totalFat.toFixed(1)}g / {fatGoal}g
            </span>
          </div>
          <Progress value={fatPercentage} className="h-2" />
        </div>

        <div className="pt-2 border-t">
          <div className="flex justify-between font-medium">
            <span>Remaining</span>
            <span>{Math.max(0, calorieGoal - totalCalories)} kcal</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
