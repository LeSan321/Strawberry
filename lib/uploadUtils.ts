import { toast } from "react-hot-toast";
import { supabase, Track } from "./supabase";

/**
 * Uploads a track to Supabase with full user feedback and error handling
 * @param trackData - The track data including the audio file
 */
export async function uploadTrackToSupabase(
  trackData: Omit<Track, 'id' | 'created_at' | 'likes' | 'plays'> & { file: File },
  setIsLoading?: (loading: boolean) => void
): Promise<boolean> {
  if (!supabase) {
    toast.error("Upload failed: Supabase client not configured.");
    return false;
  }

  try {
    if (setIsLoading) setIsLoading(true);

    // 1. Upload audio file
    const filePath = `${Date.now()}-${trackData.file.name}`;
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('uploads')
      .upload(filePath, trackData.file, { upsert: false });

    if (uploadError) {
      console.error("🚨 Supabase upload error:", uploadError);
      toast.error(`Upload failed: ${uploadError.message}`);
      if (setIsLoading) setIsLoading(false);
      return false;
    }

    // 2. Get public URL
    const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(filePath);
    const audioUrl = urlData?.publicUrl;

    if (!audioUrl) {
      toast.error("Failed to retrieve public URL.");
      if (setIsLoading) setIsLoading(false);
      return false;
    }

    // 3. Insert track metadata (excluding the file itself)
    const { file, ...metadata } = trackData;
    const { error: insertError } = await supabase.from('tracks').insert([
      {
        ...metadata,
        audio_url: audioUrl,
      }
    ]);

    if (insertError) {
      console.error("🚨 Supabase metadata insert error:", insertError);
      toast.error(`Failed to save track info: ${insertError.message}`);
      if (setIsLoading) setIsLoading(false);
      return false;
    }

    toast.success("Track uploaded successfully! 🍓");
    return true;
  } catch (err) {
    console.error("Unexpected upload error:", err);
    toast.error("Something went wrong during upload.");
    return false;
  } finally {
    if (setIsLoading) setIsLoading(false);
  }
}

