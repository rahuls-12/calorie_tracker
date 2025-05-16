"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { supabase } from "@/lib/supabase/client"
import { useAuth } from "@/components/auth/auth-provider"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2 } from "lucide-react"
import type { FoodEntry } from "@/lib/types"

interface EntryListProps {
  entries: FoodEntry[]
  date: string
}

export function EntryList({ entries, date }: EntryListProps) {
  const { user } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)

  const handleDelete = async (id: string) => {
    if (!user) return

    setLoading(id)

    try {
      const { error } = await supabase.from("food_entries").delete().eq("id", id).eq("user_id", user.id)

      if (error) throw error

      router.refresh()
    } catch (error) {
      console.error("Error deleting entry:", error)
    } finally {
      setLoading(null)
    }
  }

  const formattedDate = new Date(date).toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>{formattedDate}</CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">
            No entries for this day. Add some food to start tracking!
          </p>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Food</TableHead>
                <TableHead className="text-right">Calories</TableHead>
                <TableHead className="text-right">Protein</TableHead>
                <TableHead className="text-right">Carbs</TableHead>
                <TableHead className="text-right">Fat</TableHead>
                <TableHead className="w-[50px]"></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {entries.map((entry) => (
                <TableRow key={entry.id}>
                  <TableCell>{entry.food_name}</TableCell>
                  <TableCell className="text-right">{entry.calories}</TableCell>
                  <TableCell className="text-right">{entry.protein_grams || "-"}</TableCell>
                  <TableCell className="text-right">{entry.carbs_grams || "-"}</TableCell>
                  <TableCell className="text-right">{entry.fat_grams || "-"}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(entry.id)}
                      disabled={loading === entry.id}
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Delete</span>
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  )
}
