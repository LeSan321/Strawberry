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
export async function uploadTrackToSupabase(trackData: Omit<Track, 'id' | 'created_at' | 'likes' | 'plays'>): Promise<void> {
  if (!supabase) {
    throw new Error('Supabase client not configured');
  }

  const { error } = await supabase
    .from('tracks')
    .insert([trackData]);

  if (error) {
    throw new Error(`Failed to upload track: ${error.message}`);
  }
}
