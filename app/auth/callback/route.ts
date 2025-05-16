import { NextResponse } from "next/server"
import { cookies } from "next/headers"
import { createServerSupabaseClient } from "@/lib/supabase/server"

export const dynamic = 'force-dynamic'

export async function GET(request: Request) {
  const requestUrl = new URL(request.url)
  const code = requestUrl.searchParams.get("code")

  if (code) {
    const cookieStore = cookies()
    const supabase = createServerSupabaseClient()
    await supabase.auth.exchangeCodeForSession(code)
  }

  return NextResponse.redirect(new URL("/dashboard", request.url))
}
