import { supabase, Track } from "./supabase";

/**
 * Uploads a track to Supabase using the new signed URL workflow
 * @param trackData - The track data including the audio file
 */
export async function uploadTrackToSupabase(
  trackData: Omit<Track, 'id' | 'created_at' | 'likes' | 'plays'> & { file: File },
  setIsLoading?: (loading: boolean) => void
): Promise<boolean> {
  
  console.log("🔥 UPLOAD FUNCTION CALLED - NEW SIGNED URL WORKFLOW");
  console.log("🔥 TrackData received:", trackData);
  
  if (!supabase) {
    console.error("Upload failed: Supabase client not configured.");
    return false;
  }

  try {
    if (setIsLoading) setIsLoading(true);
    
    const { data: session, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError || !session?.session?.access_token) {
      console.error("Authentication error:", sessionError);
      return false;
    }

    console.log("🎵 FILE DEBUG INFO:");
    console.log("File type:", trackData.file.type);
    console.log("File size:", trackData.file.size, "bytes");
    console.log("File name:", trackData.file.name);
    
    console.log("📡 REQUESTING SIGNED UPLOAD URL...");
    const functionUrl = `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-upload-url`;
    
    const response = await fetch(functionUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${session.session.access_token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        fileName: trackData.file.name,
        fileSize: trackData.file.size,
        contentType: trackData.file.type
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
      console.error("❌ Failed to get signed URL:", errorData);
      return false;
    }

    const { uploadUrl, fileUrl, filePath } = await response.json();
    console.log("✅ RECEIVED SIGNED URL:", { uploadUrl, fileUrl, filePath });

    console.log("📤 UPLOADING FILE TO STORAGE...");
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 
        'Content-Type': trackData.file.type || 'audio/mpeg'
      },
      body: trackData.file
    });

    if (!uploadResponse.ok) {
      console.error("❌ File upload failed:", uploadResponse.status, uploadResponse.statusText);
      return false;
    }

    console.log("✅ FILE UPLOADED SUCCESSFULLY!");

    console.log("💾 INSERTING METADATA...");
    const { file, ...metadata } = trackData;
    const insertData = {
      ...metadata,
      audio_url: fileUrl,
    };
    console.log("Metadata to insert:", insertData);
    
    const { error: insertError } = await supabase.from('tracks').insert([insertData]);

    if (insertError) {
      console.error("🚨 Supabase metadata insert error:", insertError);
      return false;
    }

    console.log("✅ TRACK UPLOADED AND SAVED SUCCESSFULLY!");
    return true;

  } catch (err) {
    console.error("❌ UNEXPECTED ERROR:", err);
    return false;
  } finally {
    if (setIsLoading) setIsLoading(false);
  }
}
