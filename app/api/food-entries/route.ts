import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"
import { format } from "date-fns"

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_ANON_KEY!,
  {
    auth: {
      flowType: 'pkce',
      autoRefreshToken: true,
      persistSession: true
    }
  }
)

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const food_name = formData.get("food_name") as string
    const calories = parseInt(formData.get("calories") as string)
    const protein_grams = formData.get("protein_grams") ? parseFloat(formData.get("protein_grams") as string) : null
    const carbs_grams = formData.get("carbs_grams") ? parseFloat(formData.get("carbs_grams") as string) : null
    const fat_grams = formData.get("fat_grams") ? parseFloat(formData.get("fat_grams") as string) : null
    const date = format(new Date(), "yyyy-MM-dd")

    const { data, error } = await supabase.from("food_entries").insert({
      food_name,
      calories,
      protein_grams,
      carbs_grams,
      fat_grams,
      date
    }).select()

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    return NextResponse.redirect(new URL("/", request.url))
  } catch (error) {
    console.error("Error adding food entry:", error)
    return NextResponse.json({ error: "Error adding food entry" }, { status: 500 })
  }
}

export async function DELETE(request: Request) {
  try {
    const id = request.url.split("/").pop()
    const { error } = await supabase.from("food_entries").delete().eq("id", id)

    if (error) {
      console.error("Supabase error:", error)
      throw error
    }

    return NextResponse.redirect(new URL("/", request.url))
  } catch (error) {
    console.error("Error deleting food entry:", error)
    return NextResponse.json({ error: "Error deleting food entry" }, { status: 500 })
  }
} 