import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || ''
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || ''

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export interface Track {
  id: string
  user_id: string
  title: string
  description?: string
  audio_url: string
  tags: string[]
  visibility: 'private' | 'inner-circle' | 'public'
  duration?: string
  likes: number
  plays: number
  created_at: string
  gradient?: string
}
