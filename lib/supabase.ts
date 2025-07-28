import { createClient } from '@supabase/supabase-js'

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string) || ''
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || ''

console.log('🔍 DIAGNOSTIC: Supabase client initialization');
console.log('🔍 DIAGNOSTIC: VITE_SUPABASE_URL from env:', import.meta.env.VITE_SUPABASE_URL);
console.log('🔍 DIAGNOSTIC: VITE_SUPABASE_ANON_KEY from env:', import.meta.env.VITE_SUPABASE_ANON_KEY);
console.log('🔍 DIAGNOSTIC: Processed supabaseUrl:', supabaseUrl);
console.log('🔍 DIAGNOSTIC: Processed supabaseAnonKey:', supabaseAnonKey ? '[PRESENT]' : '[MISSING]');

export const supabase = supabaseUrl && supabaseAnonKey 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null

export default supabase

console.log('🔍 DIAGNOSTIC: Final supabase client instance:', supabase ? '[CREATED]' : '[NULL]');

export interface Track {
  id: string
  user_id: string
  title: string
  description?: string
  audio_url: string
  tags: string[]
  custom_mood?: string
  visibility: 'private' | 'inner-circle' | 'public'
  duration?: string
  likes: number
  plays: number
  created_at: string
  gradient?: string
}
