import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { supabase, Track } from './supabase';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Ensures light mode is always used by removing the dark class from the document element.
 * This can be called from any component that needs to ensure light mode.
 */
export function ensureLightMode() {
  if (typeof document !== 'undefined') {
    // Always set dark mode to false
    document.documentElement.classList.toggle('dark', false);
  }
}

/**
 * Removes any dark mode classes from a className string
 * @param className The class string to process
 * @returns The class string with dark mode classes removed
 */
export function removeDarkClasses(className: string): string {
  return className
    .split(' ')
    .filter(cls => !cls.startsWith('dark:'))
    .join(' ');
}

/**
 * Uploads a track to Supabase
 * @param trackData The track data to upload
 * @returns Promise that resolves when upload is complete
 */
export async function uploadTrackToSupabase(trackData: Omit<Track, 'id' | 'created_at' | 'likes' | 'plays'> & { file: File }): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase client not configured');
  }

  // Upload file to storage bucket
  const filePath = `uploads/${Date.now()}-${trackData.file.name}`;
  const { error: uploadError } = await supabase.storage.from('uploads').upload(filePath, trackData.file);

  if (uploadError) {
    throw new Error(`File upload failed: ${uploadError.message}`);
  }

  // Get public URL
  const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(filePath);
  const audioUrl = urlData?.publicUrl;

  if (!audioUrl) {
    throw new Error('Failed to retrieve public URL for uploaded file.');
  }

  // Insert track metadata
  const { file, ...metadata } = trackData; // exclude `file` from DB insert
  const { error: insertError } = await supabase.from('tracks').insert([
    {
      ...metadata,
      audio_url: audioUrl,
    },
  ]);

  if (insertError) {
    throw new Error(`Failed to insert track metadata: ${insertError.message}`);
  }
}

