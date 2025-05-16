"use client"

import { Progress } from "@/components/ui/progress"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { DailySummary, DailyGoal } from "@/lib/types"

interface DailySummaryProps {
  summary: DailySummary
  goals: DailyGoal
}

export function DailySummaryCard({ summary, goals }: DailySummaryProps) {
  const caloriePercentage = Math.min(Math.round((summary.totalCalories / goals.calorie_goal) * 100), 100)

  const proteinPercentage = goals.protein_goal
    ? Math.min(Math.round((summary.totalProtein / goals.protein_goal) * 100), 100)
    : 0

  const carbsPercentage = goals.carbs_goal
    ? Math.min(Math.round((summary.totalCarbs / goals.carbs_goal) * 100), 100)
    : 0

  const fatPercentage = goals.fat_goal ? Math.min(Math.round((summary.totalFat / goals.fat_goal) * 100), 100) : 0

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
              {summary.totalCalories} / {goals.calorie_goal}
            </span>
          </div>
          <Progress value={caloriePercentage} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Protein</span>
            <span>
              {summary.totalProtein.toFixed(1)}g / {goals.protein_goal}g
            </span>
          </div>
          <Progress value={proteinPercentage} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Carbs</span>
            <span>
              {summary.totalCarbs.toFixed(1)}g / {goals.carbs_goal}g
            </span>
          </div>
          <Progress value={carbsPercentage} className="h-2" />
        </div>

        <div className="space-y-2">
          <div className="flex justify-between">
            <span>Fat</span>
            <span>
              {summary.totalFat.toFixed(1)}g / {goals.fat_goal}g
            </span>
          </div>
          <Progress value={fatPercentage} className="h-2" />
        </div>

        <div className="pt-2 border-t">
          <div className="flex justify-between font-medium">
            <span>Remaining</span>
            <span>{Math.max(0, goals.calorie_goal - summary.totalCalories)} kcal</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
