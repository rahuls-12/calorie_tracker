"use client"

import { deleteFoodEntry } from "@/lib/actions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Trash2 } from "lucide-react"
import type { FoodEntry } from "@/lib/types"
import { toast } from "@/components/ui/use-toast"

interface FoodEntryListProps {
  entries: FoodEntry[]
}

export function FoodEntryList({ entries }: FoodEntryListProps) {
  const handleDelete = async (id: string) => {
    const result = await deleteFoodEntry(id)

    if (!result.success) {
      toast({
        title: "Error",
        description: result.message || "Failed to delete entry",
        variant: "destructive",
      })
    }
  }

  // Calculate totals
  const totalCalories = entries.reduce((sum, entry) => sum + entry.calories, 0)
  const totalProtein = entries.reduce((sum, entry) => sum + (entry.protein_grams || 0), 0)
  const totalCarbs = entries.reduce((sum, entry) => sum + (entry.carbs_grams || 0), 0)
  const totalFat = entries.reduce((sum, entry) => sum + (entry.fat_grams || 0), 0)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Food Entries</CardTitle>
      </CardHeader>
      <CardContent>
        {entries.length === 0 ? (
          <p className="text-center text-muted-foreground py-4">No entries yet. Add some food to start tracking!</p>
        ) : (
          <>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Food</TableHead>
                  <TableHead className="text-right">Calories</TableHead>
                  <TableHead className="text-right">Protein (g)</TableHead>
                  <TableHead className="text-right">Carbs (g)</TableHead>
                  <TableHead className="text-right">Fat (g)</TableHead>
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
                      <Button variant="ghost" size="icon" onClick={() => handleDelete(entry.id)}>
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Delete</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

                {/* Totals row */}
                <TableRow className="font-medium">
                  <TableCell>Total</TableCell>
                  <TableCell className="text-right">{totalCalories}</TableCell>
                  <TableCell className="text-right">{totalProtein.toFixed(1)}</TableCell>
                  <TableCell className="text-right">{totalCarbs.toFixed(1)}</TableCell>
                  <TableCell className="text-right">{totalFat.toFixed(1)}</TableCell>
                  <TableCell></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </>
        )}
      </CardContent>
    </Card>
  )
}
