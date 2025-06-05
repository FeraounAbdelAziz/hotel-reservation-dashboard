import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://grforlcinnaiugeiwhwa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyZm9ybGNpbm5haXVnZWl3aHdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MDg1MDksImV4cCI6MjA2NDM4NDUwOX0.k3FVlp_665YRWTxXlnqtR0U_r-ICn5SIBTh9w-E-bkI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type Reservation = {
  id: string
  first_name: string
  last_name: string
  email: string
  phone: string
  check_in: string
  check_out: string
  room_type: string
  guests: number
  special_requests: string | null
  status: 'pending' | 'confirmed' | 'cancelled'
  created_at: string
}

// Initialize database tables and policies
export async function initDatabase() {
  try {
    // Check if reservations table exists
    const { error } = await supabase
      .from('reservations')
      .select('id')
      .limit(1)
      .maybeSingle()

    if (error?.code === 'PGRST116') {
      console.error('Table "reservations" does not exist. Please create it in the Supabase dashboard.')
    }
  } catch (error) {
    console.error('Database initialization error:', error)
  }
} 