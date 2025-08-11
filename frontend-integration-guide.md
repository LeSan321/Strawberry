# Frontend Integration Guide

This guide covers the integration of the Supabase Edge Function with the React frontend for secure audio uploads.

## 🔄 Changes Made

### 1. Updated Upload Workflow

The upload process has been completely refactored to use the new signed URL workflow:

**Before (Direct Upload):**
```typescript
// Direct upload to Supabase storage
const { data, error } = await supabase.storage
  .from('uploads')
  .upload(filePath, file);
```

**After (Signed URL Workflow):**
```typescript
// Step 1: Get signed URL from edge function
const response = await fetch('/functions/v1/create-upload-url', {
  method: 'POST',
  headers: {
    'Authorization': `Bearer ${session.access_token}`,
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    fileName: file.name,
    fileSize: file.size,
    contentType: file.type
  })
});

// Step 2: Upload directly to storage
const { uploadUrl, fileUrl } = await response.json();
await fetch(uploadUrl, {
  method: 'PUT',
  headers: { 'Content-Type': file.type },
  body: file
});
```

### 2. Updated Track Interface

Enhanced the Track interface to support the new upload data structure:

```typescript
export interface Track {
  id: string
  user_id: string
  title: string
  artist?: string        // Added
  genre?: string         // Added
  description?: string
  audio_url: string
  tags?: string[]        // Made optional
  custom_mood?: string
  visibility: 'private' | 'inner-circle' | 'public'
  duration?: string
  likes: number
  plays: number
  created_at: string
  gradient?: string
}
```

### 3. Updated Upload Component

Modified `UploadMusicPage.tsx` to include the required `user_id` field:

```typescript
const uploadData = {
  title: formData.title || formData.file.name.replace(/\.[^/.]+$/, ''),
  artist: user.user_metadata?.display_name || user.email || 'Unknown Artist', 
  genre: formData.selectedMoods.join(', ') + (formData.customMood ? `, ${formData.customMood}` : ''), 
  visibility: formData.visibility,
  user_id: user.id,  // Added this line
  file: formData.file,
};
```

## 🔧 Key Benefits

### Security Improvements
- **JWT Validation**: Only authenticated users can upload
- **User Isolation**: Files stored in user-specific directories
- **File Validation**: Server-side validation of file types and sizes
- **Time-Limited URLs**: Signed URLs expire after 1 hour

### Performance Improvements
- **Direct Client Uploads**: Files upload directly to storage, bypassing server
- **Reduced Server Load**: No file processing on the server
- **Better Error Handling**: Comprehensive error responses

### Scalability
- **Bucket Migration**: Changed from 'uploads' to 'audio-uploads' bucket
- **Structured File Paths**: `{user_id}/{timestamp}-{filename}` format
- **Policy-Based Access**: Row Level Security policies control access

## 🧪 Testing

### Local Testing

1. **Start the development server:**
   ```bash
   ./test-frontend-integration.sh
   ```

2. **Test the upload flow:**
   - Navigate to the upload page
   - Select an audio file (MP3, WAV, AAC, etc.)
   - Fill in track details
   - Upload and verify success

### Manual Testing Checklist

- [ ] Authentication required for uploads
- [ ] File type validation works
- [ ] File size validation (100MB limit)
- [ ] Progress indicator shows during upload
- [ ] Success message displays after upload
- [ ] Error handling for failed uploads
- [ ] Track metadata saved correctly
- [ ] Audio file accessible via public URL

## 🔍 Troubleshooting

### Common Issues

1. **"Authentication error"**
   - Ensure user is logged in
   - Check JWT token validity
   - Verify edge function is deployed

2. **"Failed to get signed URL"**
   - Check edge function deployment
   - Verify environment variables are set
   - Check function logs: `supabase functions logs create-upload-url`

3. **"File upload failed"**
   - Verify storage bucket exists (`audio-uploads`)
   - Check storage policies are configured
   - Ensure file size is under 100MB

4. **"Metadata insert error"**
   - Check database table structure
   - Verify user_id is included in upload data
   - Check RLS policies on tracks table

### Debug Mode

Enable detailed logging by adding this to your `.env.local`:
```env
VITE_DEBUG_UPLOADS=true
```

## 🚀 Deployment

### Prerequisites

1. **Edge function deployed:**
   ```bash
   ./deploy.sh
   ```

2. **Storage bucket created:**
   - Name: `audio-uploads`
   - Type: Private
   - Size limit: 100MB

3. **Storage policies configured:**
   ```bash
   # Run the SQL in storage-policies.sql
   ```

### Environment Variables

Ensure these are set in your production environment:

```env
# Frontend
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Edge Function (set via supabase secrets)
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
FRONTEND_URL=https://yourdomain.com
```

## 📊 Monitoring

### Edge Function Logs
```bash
supabase functions logs create-upload-url
```

### Storage Usage
Monitor storage usage in the Supabase dashboard under Storage > audio-uploads.

### Database Queries
Track upload success rates by monitoring the tracks table inserts.

## 🔄 Migration from Old System

If you have existing uploads in the 'uploads' bucket:

1. **Create migration script** to move files to 'audio-uploads'
2. **Update existing track records** with new audio URLs
3. **Update storage policies** for the new bucket structure

## 📝 Next Steps

- Test the complete workflow end-to-end
- Monitor edge function performance
- Set up alerts for upload failures
- Consider implementing upload progress tracking
- Add retry logic for failed uploads
