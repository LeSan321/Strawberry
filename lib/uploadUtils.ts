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
    
    // 1. Upload audio file
    const filePath = `${Date.now()}-${trackData.file.name}`;
    console.log("📂 UPLOAD ATTEMPT:");
    console.log("Bucket: 'uploads'");
    console.log("File path:", filePath);
    console.log("File object being uploaded:", trackData.file);
    
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
      console.error("Error details:", uploadError);
      console.error("Error stack:", uploadError.stack);
      toast.error(`Upload failed: ${uploadError.message}`);
      if (setIsLoading) setIsLoading(false);
      return false;
    }

    // 2. Verify the uploaded file
    console.log("🔍 VERIFYING UPLOADED FILE:");
    const { data: listData, error: listError } = await supabase
      .storage
      .from('uploads')
      .list('', { search: filePath });
    
    console.log("File list result:", listData);
    console.log("File list error:", listError);

    // 3. Get public URL
    const { data: urlData } = supabase.storage.from('uploads').getPublicUrl(filePath);
    const audioUrl = urlData?.publicUrl;
    console.log("🌐 PUBLIC URL:", audioUrl);
    
    if (!audioUrl) {
      toast.error("Failed to retrieve public URL.");
      if (setIsLoading) setIsLoading(false);
      return false;
    }

    // 4. Test the uploaded file by attempting to fetch it
    try {
      const response = await fetch(audioUrl);
      console.log("🌐 URL FETCH TEST:");
      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries(response.headers.entries()));
      console.log("Content-Type:", response.headers.get('content-type'));
      console.log("Content-Length:", response.headers.get('content-length'));
    } catch (fetchError) {
      console.error("❌ URL fetch failed:", fetchError);
    }

    // Continue with metadata insertion...
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
    console.error("❌ UNEXPECTED ERROR:", err);
    console.error("Error type:", typeof err);
    console.error("Error constructor:", err?.constructor?.name);
    console.error("Error stack:", err?.stack);
    toast.error("Something went wrong during upload.");
    return false;
  } finally {
    if (setIsLoading) setIsLoading(false);
  }
}
