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
  
  // Enhanced Supabase client verification
  console.log("🔍 SUPABASE CLIENT DEBUG:");
  console.log("Supabase client exists:", !!supabase);
  console.log("Supabase URL:", supabase?.supabaseUrl);
  console.log("Supabase Key (first 20 chars):", supabase?.supabaseKey?.substring(0, 20) + "...");
  
  if (!supabase) {
    toast.error("Upload failed: Supabase client not configured.");
    return false;
  }

  try {
    if (setIsLoading) setIsLoading(true);
    
    // Detailed file inspection
    console.log("🎵 FILE DEBUG INFO:");
    console.log("File instanceof File:", trackData.file instanceof File);
    console.log("File type:", trackData.file.type);
    console.log("File size:", trackData.file.size, "bytes");
    console.log("File name:", trackData.file.name);
    console.log("File lastModified:", new Date(trackData.file.lastModified));
    console.log("File constructor:", trackData.file.constructor.name);
    
    // Test if we can read the file
    const fileReader = new FileReader();
    fileReader.onload = (e) => {
      console.log("✅ File is readable, first 100 bytes:", 
        new Uint8Array(e.target?.result as ArrayBuffer).slice(0, 100));
    };
    fileReader.readAsArrayBuffer(trackData.file.slice(0, 1000));
    
    // 1. Upload audio file - Generate filename
    const filePath = `${Date.now()}-${trackData.file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    // 🔍 FILENAME DEBUG (Policy Validation)
    console.log("🔍 FILENAME DEBUG:");
    console.log("Original filename:", trackData.file.name);
    console.log("Generated filePath:", filePath);
    console.log("Last 4 chars:", filePath.slice(-4));
    console.log("File extension check:", filePath.toLowerCase().endsWith('.mp3') || filePath.toLowerCase().endsWith('.wav') || filePath.toLowerCase().endsWith('.m4a'));
    console.log("Policy-style check - right(4):", filePath.slice(-4));
    console.log("Lowercase extension:", filePath.slice(-4).toLowerCase());
    
    // Upload attempt logging
    console.log("📂 UPLOAD ATTEMPT:");
    console.log("Bucket: 'uploads'");
    console.log("File path:", filePath);
    console.log("File object being uploaded:", trackData.file);
    console.log("Upload options:", {
      cacheControl: '3600',
      upsert: false,
      contentType: trackData.file.type || 'audio/mpeg'
    });
    
    // Try the upload with additional options
    const { data: uploadData, error: uploadError } = await supabase
      .storage
      .from('uploads')
      .upload(filePath, trackData.file, { 
        cacheControl: '3600',
        upsert: false,
        contentType: trackData.file.type || 'audio/mpeg'
      });

    console.log("📤 UPLOAD RESPONSE:");
    console.log("Upload data:", uploadData);
    console.log("Upload error:", uploadError);

    if (uploadError) {
      console.error("🚨 DETAILED UPLOAD ERROR:");
      console.error("Error message:", uploadError.message);
      console.error("Error code:", uploadError.statusCode);
      console.error("Error details:", uploadError);
      console.error("Error stack:", uploadError.stack);
      
      // Check for common policy-related errors
      if (uploadError.message?.includes('Policy') || uploadError.message?.includes('policy')) {
        console.error("🚫 POLICY ERROR DETECTED - This is likely a bucket policy issue!");
      }
      if (uploadError.message?.includes('permission') || uploadError.message?.includes('Permission')) {
        console.error("🚫 PERMISSION ERROR DETECTED - Check your RLS policies!");
      }
      
      toast.error(`Upload failed: ${uploadError.message}`);
      if (setIsLoading) setIsLoading(false);
      return false;
    }

    console.log("✅ UPLOAD SUCCESS - File should now be in bucket!");

    // 2. Verify the uploaded file exists in bucket
    console.log("🔍 VERIFYING UPLOADED FILE:");
    const { data: listData, error: listError } = await supabase
      .storage
      .from('uploads')
      .list('', { search: filePath.split('-')[0] }); // Search by timestamp part
    
    console.log("File list result:", listData);
    console.log("File list error:", listError);
    
    if (listData) {
      const uploadedFile = listData.find(file => file.name === filePath);
      if (uploadedFile) {
        console.log("✅ FILE CONFIRMED IN BUCKET:", uploadedFile);
        console.log("File size in bucket:", uploadedFile.metadata?.size);
      } else {
        console.warn("⚠️ FILE NOT FOUND IN BUCKET LIST!");
      }
    }

    // 3. Get public URL
    console.log("🌐 GETTING PUBLIC URL:");
    const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(filePath);
    const audioUrl = urlData?.publicUrl;
    console.log("🌐 PUBLIC URL:", audioUrl);
    
    if (!audioUrl) {
      console.error("❌ Failed to get public URL");
      toast.error("Failed to retrieve public URL.");
      if (setIsLoading) setIsLoading(false);
      return false;
    }

    // 4. Test the uploaded file by attempting to fetch it
    try {
      console.log("🌐 TESTING URL ACCESSIBILITY:");
      const response = await fetch(audioUrl);
      console.log("🌐 URL FETCH TEST:");
      console.log("Response status:", response.status);
      console.log("Response ok:", response.ok);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));
      console.log("Content-Type:", response.headers.get('content-type'));
      console.log("Content-Length:", response.headers.get('content-length'));
      
      if (!response.ok) {
        console.error("❌ URL not accessible:", response.status, response.statusText);
      } else {
        console.log("✅ URL is accessible!");
      }
    } catch (fetchError) {
      console.error("❌ URL fetch failed:", fetchError);
    }

    // 5. Insert track metadata
    console.log("💾 INSERTING METADATA:");
    const { file, ...metadata } = trackData;
    const insertData = {
      ...metadata,
      audio_url: audioUrl,
    };
    console.log("Metadata to insert:", insertData);
    
    const { error: insertError } = await supabase.from('tracks').insert([insertData]);

    if (insertError) {
      console.error("🚨 Supabase metadata insert error:", insertError);
      toast.error(`Failed to save track info: ${insertError.message}`);
      if (setIsLoading) setIsLoading(false);
      return false;
    }

    console.log("✅ METADATA INSERTED SUCCESSFULLY!");
    toast.success("Track uploaded successfully! 🍓");
    return true;

  } catch (err) {
    console.error("❌ UNEXPECTED ERROR:", err);
    console.error("Error type:", typeof err);
    console.error("Error constructor:", err?.constructor?.name);
    console.error("Error message:", err?.message);
    console.error("Error stack:", err?.stack);
    toast.error("Something went wrong during upload.");
    return false;
  } finally {
    if (setIsLoading) setIsLoading(false);
  }
}
