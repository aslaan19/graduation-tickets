import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export type TicketType = 'graduation' | 'honors_first' | 'honors_second' | 'honors_third'
export type OfferStatus = 'available' | 'sold'

export interface Offer {
  id: string
  name: string
  email: string
  phone: string
  ticket_type: TicketType
  quantity: number
  price_sar: number
  contact_methods: string
  status: OfferStatus
    gender: 'male' | 'female'   // ← زود السطر ده

  created_at: string
}
