"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/components/auth/auth-provider"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription } from "@/components/ui/alert"
import type { DailyGoal } from "@/lib/types"

export function GoalsForm() {
  const { user } = useAuth()
  const router = useRouter()
  const [goals, setGoals] = useState<DailyGoal | null>(null)
  const [calorieGoal, setCalorieGoal] = useState("")
  const [proteinGoal, setProteinGoal] = useState("")
  const [carbsGoal, setCarbsGoal] = useState("")
  const [fatGoal, setFatGoal] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [initialLoading, setInitialLoading] = useState(true)

  useEffect(() => {
    const fetchGoals = async () => {
      if (!user) return

      try {
        const { data, error } = await supabase.from("daily_goals").select("*").eq("user_id", user.id).single()

        if (error) throw error

        if (data) {
          setGoals(data)
          setCalorieGoal(data.calorie_goal.toString())
          setProteinGoal(data.protein_goal?.toString() || "")
          setCarbsGoal(data.carbs_goal?.toString() || "")
          setFatGoal(data.fat_goal?.toString() || "")
        }
      } catch (error) {
        console.error("Error fetching goals:", error)
      } finally {
        setInitialLoading(false)
      }
    }

    fetchGoals()
  }, [user])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return

    setLoading(true)
    setError(null)

    try {
      const { error } = await supabase.from("daily_goals").upsert({
        user_id: user.id,
        calorie_goal: Number.parseInt(calorieGoal),
        protein_goal: proteinGoal ? Number.parseFloat(proteinGoal) : null,
        carbs_goal: carbsGoal ? Number.parseFloat(carbsGoal) : null,
        fat_goal: fatGoal ? Number.parseFloat(fatGoal) : null,
        updated_at: new Date().toISOString(),
      })

      if (error) throw error

      router.refresh()
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  if (initialLoading) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Loading...</CardTitle>
        </CardHeader>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Nutrition Goals</CardTitle>
        <CardDescription>Set your daily nutrition targets</CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="calorie-goal">Daily Calorie Goal</Label>
            <Input
              id="calorie-goal"
              type="number"
              value={calorieGoal}
              onChange={(e) => setCalorieGoal(e.target.value)}
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="protein-goal">Protein Goal (g)</Label>
            <Input
              id="protein-goal"
              type="number"
              step="0.1"
              value={proteinGoal}
              onChange={(e) => setProteinGoal(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="carbs-goal">Carbs Goal (g)</Label>
            <Input
              id="carbs-goal"
              type="number"
              step="0.1"
              value={carbsGoal}
              onChange={(e) => setCarbsGoal(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="fat-goal">Fat Goal (g)</Label>
            <Input
              id="fat-goal"
              type="number"
              step="0.1"
              value={fatGoal}
              onChange={(e) => setFatGoal(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Saving..." : "Save Goals"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
