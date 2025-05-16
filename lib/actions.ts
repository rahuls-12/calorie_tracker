"use server"

import { revalidatePath } from "next/cache"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { format } from "date-fns"

export async function addFoodEntry(formData: FormData) {
  try {
    const supabase = createServerSupabaseClient()
    const foodName = formData.get("food_name") as string
    const calories = Number.parseInt(formData.get("calories") as string)
    const protein = formData.get("protein") as string
    const carbs = formData.get("carbs") as string
    const fat = formData.get("fat") as string

    // Validate inputs
    if (!foodName || isNaN(calories)) {
      return { success: false, message: "Food name and calories are required" }
    }

    const { error } = await supabase.from("food_entries").insert({
      food_name: foodName,
      calories: calories,
      protein_grams: protein ? Number.parseFloat(protein) : null,
      carbs_grams: carbs ? Number.parseFloat(carbs) : null,
      fat_grams: fat ? Number.parseFloat(fat) : null,
      date: format(new Date(), "yyyy-MM-dd"),
    })

    if (error) throw error

    revalidatePath("/")
    return { success: true, message: "Food entry added successfully" }
  } catch (error: any) {
    console.error("Error adding food entry:", error)
    return { success: false, message: error.message }
  }
}

export async function deleteFoodEntry(id: string) {
  try {
    const supabase = createServerSupabaseClient()
    const { error } = await supabase.from("food_entries").delete().eq("id", id)

    if (error) throw error

    revalidatePath("/")
    return { success: true }
  } catch (error: any) {
    console.error("Error deleting food entry:", error)
    return { success: false, message: error.message }
  }
}
