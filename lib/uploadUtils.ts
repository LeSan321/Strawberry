import { supabase, Track } from './supabase'

export interface UploadTrackData {
  file: File
  title: string
  tags: string[]
  customMood?: string
  visibility: 'private' | 'inner-circle' | 'public'
}

export async function uploadTrackToSupabase(data: UploadTrackData): Promise<Track> {
  if (!supabase) {
    throw new Error('Supabase client not configured. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.')
  }

  const { file, title, tags, customMood, visibility } = data
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`
  const filePath = `uploads/${fileName}`

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('uploads')
    .upload(filePath, file)

  if (uploadError) {
    throw new Error(`Upload failed: ${uploadError.message}`)
  }

  const userId = 'temp-user-id'

  const allTags = customMood ? [...tags, customMood] : tags

  const trackData = {
    user_id: userId,
    title: title,
    audio_url: filePath,
    tags: allTags,
    visibility: visibility,
    likes: 0,
    plays: 0,
    created_at: new Date().toISOString()
  }

  const { data: track, error: dbError } = await supabase
    .from('tracks')
    .insert([trackData])
    .select()
    .single()

  if (dbError) {
    throw new Error(`Database insertion failed: ${dbError.message}`)
  }

  return track
}
