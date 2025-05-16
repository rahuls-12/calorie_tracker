"use client"

import { useState, useEffect } from "react"
import { format } from "date-fns"
import { createClient } from "@supabase/supabase-js"

// Add export const dynamic = 'force-dynamic' to prevent pre-rendering
export const dynamic = 'force-dynamic'

// Create a single supabase client for the browser
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL || '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '',
  {
    auth: {
      flowType: 'pkce',
      autoRefreshToken: true,
      persistSession: true
    }
  }
)

export default function Home() {
  const [entries, setEntries] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)

  // Fetch entries
  async function fetchEntries() {
    const today = format(new Date(), "yyyy-MM-dd")
    const { data, error } = await supabase
      .from("food_entries")
      .select("*")
      .eq("date", today)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching entries:", error)
      return
    }

    setEntries(data || [])
  }

  // Handle form submission
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)

    const form = e.currentTarget
    const formData = new FormData(form)
    
    try {
      const food_name = formData.get("food_name") as string
      const calories = parseInt(formData.get("calories") as string)
      const protein_grams = formData.get("protein_grams") ? parseFloat(formData.get("protein_grams") as string) : null
      const carbs_grams = formData.get("carbs_grams") ? parseFloat(formData.get("carbs_grams") as string) : null
      const fat_grams = formData.get("fat_grams") ? parseFloat(formData.get("fat_grams") as string) : null
      const date = format(new Date(), "yyyy-MM-dd")

      const { error } = await supabase.from("food_entries").insert({
        food_name,
        calories,
        protein_grams,
        carbs_grams,
        fat_grams,
        date
      })

      if (error) throw error

      // Clear form
      form.reset()
      
      // Refresh entries
      fetchEntries()
    } catch (error: any) {
      console.error("Error adding entry:", error)
      setError(error.message || "Error adding food entry")
    }
  }

  // Handle delete
  async function handleDelete(id: string) {
    try {
      const { error } = await supabase.from("food_entries").delete().eq("id", id)
      if (error) throw error
      
      // Refresh entries
      fetchEntries()
    } catch (error: any) {
      console.error("Error deleting entry:", error)
      setError(error.message || "Error deleting food entry")
    }
  }

  // Fetch entries on mount
  useEffect(() => {
    fetchEntries()
  }, [])

  // Calculate total calories and macros
  const totals = entries.reduce((acc, entry) => ({
    calories: acc.calories + entry.calories,
    protein: acc.protein + (entry.protein_grams || 0),
    carbs: acc.carbs + (entry.carbs_grams || 0),
    fat: acc.fat + (entry.fat_grams || 0)
  }), { calories: 0, protein: 0, carbs: 0, fat: 0 })

  return (
    <main className="min-h-screen bg-gradient-to-b from-zinc-900 to-black">
      <div className="container mx-auto py-8 px-4">
        <h1 className="text-4xl font-bold mb-12 text-center bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
          Calorie Calculator
        </h1>

        <div className="grid gap-8 md:grid-cols-2">
          <div className="space-y-8">
            <div className="p-6 rounded-xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 shadow-xl">
              <h2 className="text-xl font-semibold mb-6 text-zinc-100">Add Food Entry</h2>
              {error && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg text-red-500 text-sm">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit} className="space-y-5">
                <div>
                  <label htmlFor="food_name" className="block text-sm font-medium mb-2 text-zinc-300">
                    Food Name
                  </label>
                  <input
                    type="text"
                    id="food_name"
                    name="food_name"
                    required
                    className="w-full p-2.5 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-zinc-100"
                  />
                </div>
                <div>
                  <label htmlFor="calories" className="block text-sm font-medium mb-2 text-zinc-300">
                    Calories
                  </label>
                  <input
                    type="number"
                    id="calories"
                    name="calories"
                    required
                    className="w-full p-2.5 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-zinc-100"
                  />
                </div>
                <div>
                  <label htmlFor="protein_grams" className="block text-sm font-medium mb-2 text-zinc-300">
                    Protein (g)
                  </label>
                  <input
                    type="number"
                    id="protein_grams"
                    name="protein_grams"
                    step="0.1"
                    className="w-full p-2.5 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-zinc-100"
                  />
                </div>
                <div>
                  <label htmlFor="carbs_grams" className="block text-sm font-medium mb-2 text-zinc-300">
                    Carbs (g)
                  </label>
                  <input
                    type="number"
                    id="carbs_grams"
                    name="carbs_grams"
                    step="0.1"
                    className="w-full p-2.5 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-zinc-100"
                  />
                </div>
                <div>
                  <label htmlFor="fat_grams" className="block text-sm font-medium mb-2 text-zinc-300">
                    Fat (g)
                  </label>
                  <input
                    type="number"
                    id="fat_grams"
                    name="fat_grams"
                    step="0.1"
                    className="w-full p-2.5 bg-zinc-800 border border-zinc-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors text-zinc-100"
                  />
                </div>
                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-medium rounded-lg hover:from-blue-700 hover:to-purple-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-zinc-900 transition-all"
                >
                  Add Entry
                </button>
              </form>
            </div>
          </div>

          <div className="space-y-8">
            <div className="p-6 rounded-xl bg-zinc-900/50 backdrop-blur-sm border border-zinc-800 shadow-xl">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-zinc-100">Today's Entries</h2>
                <div className="text-sm text-zinc-400">
                  Total: {totals.calories} cal
                </div>
              </div>
              
              <div className="space-y-4">
                {entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="p-4 rounded-lg bg-zinc-800/50 border border-zinc-700 flex justify-between items-start hover:border-zinc-600 transition-colors"
                  >
                    <div>
                      <h3 className="font-medium text-zinc-100">{entry.food_name}</h3>
                      <p className="text-sm text-zinc-400">
                        {entry.calories} calories
                      </p>
                      {(entry.protein_grams || entry.carbs_grams || entry.fat_grams) && (
                        <p className="text-sm text-zinc-500 mt-1">
                          {entry.protein_grams && `${entry.protein_grams}g protein`}{" "}
                          {entry.carbs_grams && `${entry.carbs_grams}g carbs`}{" "}
                          {entry.fat_grams && `${entry.fat_grams}g fat`}
                        </p>
                      )}
                    </div>
                    <button
                      onClick={() => handleDelete(entry.id)}
                      className="text-zinc-500 hover:text-red-400 transition-colors"
                    >
                      Delete
                    </button>
                  </div>
                ))}
                {entries.length === 0 && (
                  <p className="text-center py-8 text-zinc-500">
                    No entries for today
                  </p>
                )}
              </div>

              {entries.length > 0 && (
                <div className="mt-6 pt-6 border-t border-zinc-800">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700">
                      <div className="text-zinc-400">Protein</div>
                      <div className="text-zinc-100 font-medium">{totals.protein.toFixed(1)}g</div>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700">
                      <div className="text-zinc-400">Carbs</div>
                      <div className="text-zinc-100 font-medium">{totals.carbs.toFixed(1)}g</div>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700">
                      <div className="text-zinc-400">Fat</div>
                      <div className="text-zinc-100 font-medium">{totals.fat.toFixed(1)}g</div>
                    </div>
                    <div className="p-3 rounded-lg bg-zinc-800/50 border border-zinc-700">
                      <div className="text-zinc-400">Total Calories</div>
                      <div className="text-zinc-100 font-medium">{totals.calories}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
