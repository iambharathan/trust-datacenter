import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://moymmjmzugeojsbhenkj.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1veW1tam16dWdlb2pzYmhlbmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNzY1MTQsImV4cCI6MjA4Njk1MjUxNH0.LD7fLMe3gE2JS5mFk2gtYIPUDUJgAjRipzG-W_fbOMQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface Student {
  id: string
  name: string
  age: number
  class: string
  father_name: string
  mother_name: string
  address: string
  phone: string
  email?: string
  admission_date: string
  created_at: string
  updated_at: string
}

export interface StudentDocument {
  id: string
  student_id: string
  document_name: string
  document_url: string
  uploaded_at: string
}

export interface Staff {
  id: string
  name: string
  staff_type: 'teacher' | 'servant' | 'trustee'
  position?: string
  department?: string
  phone: string
  email?: string
  address: string
  salary?: number
  joining_date: string
  qualification?: string
  experience_years: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface StaffDocument {
  id: string
  staff_id: string
  document_name: string
  document_url: string
  uploaded_at: string
}
