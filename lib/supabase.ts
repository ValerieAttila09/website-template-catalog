import { createClient } from '@supabase/supabase-js'

// Mengambil variabel lingkungan dari file .env.local
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY!

// Klien untuk penggunaan di sisi klien (Client Component) dan server standar
export const supabase = createClient(supabaseUrl, supabaseAnonKey)