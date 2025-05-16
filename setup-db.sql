-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- Create food_entries table
create table if not exists public.food_entries (
  id uuid default uuid_generate_v4() primary key,
  food_name text not null,
  calories integer not null,
  protein_grams float,
  carbs_grams float,
  fat_grams float,
  date date not null default current_date,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Disable Row Level Security since we're not using authentication
alter table public.food_entries disable row level security; 