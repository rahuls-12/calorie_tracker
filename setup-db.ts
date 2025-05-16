import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://kucsknymkdhszmmlbebc.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt1Y3Nrbnlta2Roc3ptbWxiZWJjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDczMzM5MTQsImV4cCI6MjA2MjkwOTkxNH0.mdWMtWEU8QPbYUatAE9YjZI5T7Zgm3JFGhsNwG78rpk'

const supabase = createClient(supabaseUrl, supabaseKey)

async function setupDatabase() {
  try {
    // Create users table
    const { error: usersError } = await supabase.rpc('create_users_table', {
      sql: `
        create table if not exists users (
          id uuid references auth.users primary key,
          email text unique not null,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null
        );
      `
    })
    if (usersError) throw usersError

    // Create daily_goals table
    const { error: goalsError } = await supabase.rpc('create_daily_goals_table', {
      sql: `
        create table if not exists daily_goals (
          id uuid default uuid_generate_v4() primary key,
          user_id uuid references users(id) not null,
          calorie_goal integer not null default 2000,
          protein_goal float,
          carbs_goal float,
          fat_goal float,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null,
          updated_at timestamp with time zone default timezone('utc'::text, now())
        );
      `
    })
    if (goalsError) throw goalsError

    // Create food_entries table
    const { error: entriesError } = await supabase.rpc('create_food_entries_table', {
      sql: `
        create table if not exists food_entries (
          id uuid default uuid_generate_v4() primary key,
          user_id uuid references users(id),
          food_name text not null,
          calories integer not null,
          protein_grams float,
          carbs_grams float,
          fat_grams float,
          date date not null,
          created_at timestamp with time zone default timezone('utc'::text, now()) not null
        );
      `
    })
    if (entriesError) throw entriesError

    console.log('Database setup completed successfully!')
  } catch (error) {
    console.error('Error setting up database:', error)
  }
}

setupDatabase() 