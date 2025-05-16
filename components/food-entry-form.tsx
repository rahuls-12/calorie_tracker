"use client"

import { useState } from "react"
import { useFormStatus } from "react-dom"
import { addFoodEntry } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Toaster } from "@/components/ui/toaster"

function SubmitButton() {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Adding..." : "Add Food Entry"}
    </Button>
  )
}

export function FoodEntryForm() {
  const [formState, setFormState] = useState({
    food_name: "",
    calories: "",
    protein: "",
    carbs: "",
    fat: "",
  })

  async function handleSubmit(formData: FormData) {
    const result = await addFoodEntry(formData)

    if (result.success) {
      toast({
        title: "Success",
        description: result.message,
      })
      // Reset form
      setFormState({
        food_name: "",
        calories: "",
        protein: "",
        carbs: "",
        fat: "",
      })
    } else {
      toast({
        title: "Error",
        description: result.message,
        variant: "destructive",
      })
    }
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Add Food Entry</CardTitle>
        </CardHeader>
        <CardContent>
          <form action={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="food_name">Food Name</Label>
              <Input
                id="food_name"
                name="food_name"
                value={formState.food_name}
                onChange={(e) => setFormState({ ...formState, food_name: e.target.value })}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="calories">Calories</Label>
              <Input
                id="calories"
                name="calories"
                type="number"
                value={formState.calories}
                onChange={(e) => setFormState({ ...formState, calories: e.target.value })}
                required
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="protein">Protein (g)</Label>
                <Input
                  id="protein"
                  name="protein"
                  type="number"
                  step="0.1"
                  value={formState.protein}
                  onChange={(e) => setFormState({ ...formState, protein: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="carbs">Carbs (g)</Label>
                <Input
                  id="carbs"
                  name="carbs"
                  type="number"
                  step="0.1"
                  value={formState.carbs}
                  onChange={(e) => setFormState({ ...formState, carbs: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="fat">Fat (g)</Label>
                <Input
                  id="fat"
                  name="fat"
                  type="number"
                  step="0.1"
                  value={formState.fat}
                  onChange={(e) => setFormState({ ...formState, fat: e.target.value })}
                />
              </div>
            </div>
            <SubmitButton />
          </form>
        </CardContent>
      </Card>
      <Toaster />
    </>
  )
}
