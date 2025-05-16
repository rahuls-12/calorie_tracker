import { createClient } from "@supabase/supabase-js"

// For server components
export const createServerSupabaseClient = () => {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseKey = process.env.SUPABASE_ANON_KEY
  
  // During build time, we want to avoid throwing errors
  // Instead, we'll return a minimal client that won't actually work
  // but will allow the build to complete
  if (!supabaseUrl || !supabaseKey) {
    console.warn('Missing Supabase credentials - returning minimal client for build')
    // Return a dummy client during build time
    return createClient('https://placeholder-url.supabase.co', 'placeholder-key', {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    })
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      flowType: 'pkce',
      autoRefreshToken: true,
      persistSession: true
    }
  })
}
