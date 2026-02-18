import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://moymmjmzugeojsbhenkj.supabase.co'
const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im1veW1tam16dWdlb2pzYmhlbmtqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzEzNzY1MTQsImV4cCI6MjA4Njk1MjUxNH0.LD7fLMe3gE2JS5mFk2gtYIPUDUJgAjRipzG-W_fbOMQ'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// =============================================
// DATABASE TYPES
// =============================================

// Student Interface
export interface Student {
  id: string
  full_name: string
  father_name: string
  guardian_name?: string
  phone: string
  alternate_phone?: string
  address?: string
  email?: string
  date_of_joining: string
  academic_year: string
  class_level: string
  roll_number: number
  status: 'active' | 'left' | 'completed'
  monthly_fee_amount: number
  admission_fee_amount?: number
  created_at: string
  updated_at: string
}

// Fee Payment Interface
export interface FeePayment {
  id: string
  student_id: string
  fee_type: 'monthly' | 'admission' | 'other'
  amount: number
  month_name: string
  year: number
  payment_status: 'paid' | 'pending' | 'partial'
  payment_date?: string
  payment_mode?: 'cash' | 'online' | 'bank_transfer' | 'cheque'
  partial_amount?: number
  remarks?: string
  receipt_number?: string
  created_at: string
  updated_at: string
  // Joined data
  student?: Student
}

// Fee Reminder Interface
export interface FeeReminder {
  id: string
  student_id: string
  payment_id?: string
  reminder_type: 'sms' | 'email' | 'manual'
  sent_to: string
  message?: string
  status: 'sent' | 'failed' | 'pending'
  sent_at: string
  created_by?: string
  created_at: string
  // Joined data
  student?: Student
}

// Academic Year Interface
export interface AcademicYear {
  id: string
  year_name: string
  start_date: string
  end_date: string
  is_current: boolean
  created_at: string
}

// Class Level Interface
export interface ClassLevel {
  id: string
  name: string
  description?: string
  order_index: number
  monthly_fee: number
  created_at: string
}

// Notice Interface
export interface Notice {
  id: string
  title: string
  content: string
  is_published: boolean
  publish_date: string
  expiry_date?: string
  created_at: string
  updated_at: string
}

// Contact Inquiry Interface
export interface ContactInquiry {
  id: string
  name: string
  email?: string
  phone: string
  subject?: string
  message: string
  is_read: boolean
  created_at: string
}

// Reminder Settings Interface
export interface ReminderSettings {
  id: string
  reminder_frequency: 'weekly' | 'monthly' | 'manual'
  sms_enabled: boolean
  email_enabled: boolean
  reminder_day: number
  reminder_message_template: string
  updated_at: string
}

// View Types
export interface StudentWithPendingDues {
  id: string
  full_name: string
  father_name: string
  phone: string
  class_level: string
  monthly_fee_amount: number
  pending_months: number
  total_pending_amount: number
}

export interface MonthlyCollection {
  month_name: string
  year: number
  students_paid: number
  total_collected: number
  total_pending: number
}

// Helper Constants
export const MONTHS = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
]

export const PAYMENT_MODES = [
  { value: 'cash', label: 'Cash' },
  { value: 'online', label: 'Online' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'cheque', label: 'Cheque' }
]

export const STUDENT_STATUSES = [
  { value: 'active', label: 'Active', color: 'green' },
  { value: 'left', label: 'Left', color: 'red' },
  { value: 'completed', label: 'Completed', color: 'blue' }
]

export const PAYMENT_STATUSES = [
  { value: 'paid', label: 'Paid', color: 'green' },
  { value: 'pending', label: 'Pending', color: 'red' },
  { value: 'partial', label: 'Partial', color: 'yellow' }
]
