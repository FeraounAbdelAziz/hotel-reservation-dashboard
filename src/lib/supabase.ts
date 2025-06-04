import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://grforlcinnaiugeiwhwa.supabase.co'
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdyZm9ybGNpbm5haXVnZWl3aHdhIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDg4MDg1MDksImV4cCI6MjA2NDM4NDUwOX0.k3FVlp_665YRWTxXlnqtR0U_r-ICn5SIBTh9w-E-bkI'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Initialize database tables and policies
export async function initDatabase() {
  try {
    // Check if tables exist by trying to select from them
    const tables = ['profiles', 'tasks', 'stock', 'reservations']
    for (const table of tables) {
      const { error } = await supabase
        .from(table)
        .select('id')
        .limit(1)
        .maybeSingle()

      if (error?.code === 'PGRST116') {
        console.error(`Table '${table}' does not exist. Please create it in the Supabase dashboard.`)
      }
    }

    // Insert admin user if not exists
    const { error: adminError } = await supabase
      .from('profiles')
      .upsert({
        name: 'Admin',
        role: 'admin',
        code: '9999999'
      }, {
        onConflict: 'code'
      })
    if (adminError) throw adminError

  } catch (error) {
    console.error('Database initialization error:', error)
  }
} 