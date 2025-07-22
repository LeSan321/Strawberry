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
  
  console.log('Starting upload process for:', { title, tags, customMood, visibility })
  
  const { data: { user }, error: authError } = await supabase.auth.getUser()
  
  if (authError) {
    console.error('Auth error:', authError)
    throw new Error(`Authentication failed: ${authError.message}`)
  }
  
  if (!user?.id) {
    console.error('No authenticated user found')
    throw new Error('You must be logged in to upload tracks')
  }
  
  console.log('Authenticated user ID:', user.id)
  
  const fileExt = file.name.split('.').pop()
  const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`
  const filePath = `uploads/${fileName}`

  console.log('Uploading file to Storage:', filePath)
  
  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('uploads')
    .upload(filePath, file)

  if (uploadError) {
    console.error('Storage upload error:', uploadError)
    throw new Error(`Upload failed: ${uploadError.message}`)
  }

  console.log('File uploaded successfully to Storage:', uploadData)

  const allTags = customMood ? [...tags, customMood] : tags

  const trackData = {
    user_id: user.id,
    title: title,
    audio_url: filePath,
    tags: allTags,
    visibility: visibility,
    likes: 0,
    plays: 0,
    created_at: new Date().toISOString()
  }

  console.log('Inserting track data:', trackData)

  const { data: track, error: dbError } = await supabase
    .from('tracks')
    .insert([trackData])
    .select()
    .single()

  if (dbError) {
    console.error('Database insertion error:', dbError)
    throw new Error(`Database insertion failed: ${dbError.message}`)
  }

  console.log('Track inserted successfully:', track)
  return track
}
