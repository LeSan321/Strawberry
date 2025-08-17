import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'
import { corsHeaders } from '../_shared/cors.ts'

const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
const FRONTEND_URL = Deno.env.get('FRONTEND_URL') || 'http://localhost:5173'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

const SUPPORTED_AUDIO_FORMATS = [
  'audio/mpeg',        // MP3
  'audio/wav',         // WAV
  'audio/x-wav',       // WAV (alternative)
  'audio/aac',         // AAC
  'audio/ogg',         // OGG
  'audio/flac',        // FLAC
  'audio/webm',        // WebM Audio
  'audio/mp4',         // MP4 Audio
  'audio/m4a',         // M4A
]

const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

interface UploadRequest {
  fileName: string
  fileSize: number
  contentType: string
  visibility?: 'private' | 'inner-circle' | 'public'
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const authHeader = req.headers.get('Authorization')
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ error: 'Missing or invalid authorization header' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      console.error('Authentication error:', authError)
      return new Response(
        JSON.stringify({ error: 'Invalid or expired token' }),
        { 
          status: 401, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const requestBody: UploadRequest = await req.json()
    const { fileName, fileSize, contentType, visibility = 'private' } = requestBody

    if (fileSize > MAX_FILE_SIZE) {
      return new Response(
        JSON.stringify({ 
          error: `File size exceeds maximum limit of ${MAX_FILE_SIZE / (1024 * 1024)}MB` 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!SUPPORTED_AUDIO_FORMATS.includes(contentType)) {
      return new Response(
        JSON.stringify({ 
          error: `Unsupported file type: ${contentType}. Supported formats: ${SUPPORTED_AUDIO_FORMATS.join(', ')}` 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    if (!fileName || fileName.trim().length === 0) {
      return new Response(
        JSON.stringify({ error: 'File name is required' }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    const timestamp = Date.now()
    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9.-]/g, '_')
    const filePath = `${user.id}/${timestamp}-${sanitizedFileName}`

    console.log('Creating signed upload URL for:', {
      userId: user.id,
      fileName: sanitizedFileName,
      filePath,
      fileSize,
      contentType,
      visibility
    })

    const uploadOptions = visibility === 'public' 
      ? { upsert: false }
      : { upsert: false }

    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('audio-uploads')
      .createSignedUploadUrl(filePath, uploadOptions)

    if (uploadError) {
      console.error('Error creating signed upload URL:', uploadError)
      return new Response(
        JSON.stringify({ 
          error: 'Failed to create upload URL',
          details: uploadError.message 
        }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    let fileUrl: string
    
    if (visibility === 'public') {
      const { data: publicUrlData } = supabase
        .storage
        .from('audio-uploads')
        .getPublicUrl(filePath)
      fileUrl = publicUrlData.publicUrl
    } else {
      const { data: signedUrlData, error: signedUrlError } = await supabase
        .storage
        .from('audio-uploads')
        .createSignedUrl(filePath, 3600) // 1 hour expiry
      
      if (signedUrlError) {
        console.error('Error creating signed URL for private track:', signedUrlError)
        const { data: publicUrlData } = supabase
          .storage
          .from('audio-uploads')
          .getPublicUrl(filePath)
        fileUrl = publicUrlData.publicUrl
      } else {
        fileUrl = signedUrlData.signedUrl
      }
    }

    const response = {
      uploadUrl: uploadData.signedUrl,
      fileUrl: fileUrl,
      filePath: filePath,
      visibility: visibility,
      expiresIn: 3600, // 1 hour
      bucket: 'audio-uploads'
    }

    console.log('Successfully created signed upload URL:', {
      filePath,
      expiresIn: response.expiresIn
    })

    return new Response(
      JSON.stringify(response),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error in create-upload-url function:', error)
    return new Response(
      JSON.stringify({ 
        error: 'Internal server error',
        details: error instanceof Error ? error.message : 'Unknown error'
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})
