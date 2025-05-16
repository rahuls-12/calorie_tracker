import type React from "react"
import { redirect } from "next/navigation"
import { cookies } from "next/headers"
import { createServerSupabaseClient } from "@/lib/supabase/server"
import { Navbar } from "@/components/layout/navbar"

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const cookieStore = cookies()
  const supabase = createServerSupabaseClient()

  const {
    data: { session },
  } = await supabase.auth.getSession()

  if (!session) {
    redirect("/")
  }

  return (
    <>
      <Navbar />
      <main className="container py-6">{children}</main>
    </>
  )
}
