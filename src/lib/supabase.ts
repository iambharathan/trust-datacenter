import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://wonhvsdhdprbwmickxip.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Indvbmh2c2RoZHByYndtaWNreGlwIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTc3NDY2NTAsImV4cCI6MjA3MzMyMjY1MH0.2sBEiBdjJ5mCH3jJQvb8mzZazy4oithfx_QOz_pI6ok'

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
