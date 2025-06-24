// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

// Validate environment variables
if (!supabaseUrl) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_URL environment variable')
}

if (!supabaseAnonKey) {
  throw new Error('Missing NEXT_PUBLIC_SUPABASE_ANON_KEY environment variable')
}

if (!supabaseServiceKey) {
  throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY environment variable')
}

// Client-side Supabase client (for browser/frontend)
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  },
})

// Server-side Supabase client (for API routes/backend)
export const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
  },
})

// TypeScript interface for our tasks - MAKE SURE IT'S EXPORTED!
export interface Task {
  id: number
  title: string
  description: string | null
  completed: boolean
  priority: 'low' | 'medium' | 'high'
  created_at: string
  updated_at: string
}

// Helper function for error handling
export const handleSupabaseError = (error: any) => {
  console.error('Supabase error:', error)
  return {
    error: error.message || 'An unexpected error occurred',
    details: error.details || null,
  }
}