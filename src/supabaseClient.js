import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'YOUR_SUPABASE_URL_HERE'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'YOUR_SUPABASE_ANON_KEY_HERE'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database table names
export const TABLES = {
  USERS: 'users',
  TASKS: 'tasks', 
  TASK_DATA: 'task_data',
  SETTINGS: 'user_settings'
}

// Helper function to check if Supabase is configured
export const isSupabaseConfigured = () => {
  return supabaseUrl !== 'YOUR_SUPABASE_URL_HERE' && 
         supabaseAnonKey !== 'YOUR_SUPABASE_ANON_KEY_HERE' &&
         supabaseUrl && supabaseAnonKey
}