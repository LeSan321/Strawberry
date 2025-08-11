# Strawberry Riff - Supabase Edge Function Infrastructure

A complete Supabase Edge Function infrastructure for secure audio file uploads in the Strawberry music sharing platform.

## 🌟 Features

- **Secure Upload URLs**: Generate signed URLs for direct client uploads
- **JWT Authentication**: Validate user tokens before generating upload URLs
- **File Validation**: Support for multiple audio formats with size limits
- **User Isolation**: User-specific file paths for security
- **CORS Support**: Proper frontend integration
- **Comprehensive Error Handling**: Detailed error responses and logging

## 📁 Project Structure

```
strawberry/
├── supabase/
│   ├── functions/
│   │   ├── create-upload-url/
│   │   │   ├── index.ts           # Main Edge Function
│   │   │   ├── deno.json          # Deno configuration
│   │   │   └── import_map.json    # Import mappings
│   │   └── _shared/
│   │       └── cors.ts            # CORS configuration
│   └── config.toml                # Supabase project config
├── .env.example                   # Environment template
├── deploy.sh                      # Deployment script
├── test-function.sh              # Testing script
└── README.md                     # This file
```

## 🚀 Quick Start

### Prerequisites

1. **Install Supabase CLI**
   ```bash
   npm install -g supabase
   ```

2. **Login to Supabase**
   ```bash
   supabase login
   ```

3. **Link to your project**
   ```bash
   supabase link --project-ref YOUR_PROJECT_REF
   ```

### Deployment

1. **Set environment variables**
   ```bash
   supabase secrets set SUPABASE_SERVICE_ROLE_KEY="your-service-role-key"
   supabase secrets set FRONTEND_URL="https://yourdomain.com"
   ```

2. **Deploy the function**
   ```bash
   ./deploy.sh
   ```

3. **Set up storage bucket**
   - Create bucket named `audio-uploads` in Supabase dashboard
   - Set as Private bucket
   - Set file size limit to 100MB

4. **Configure storage policies**
   ```sql
   -- Enable RLS
   ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

   -- Allow authenticated uploads
   CREATE POLICY "Allow authenticated uploads" ON storage.objects
   FOR INSERT WITH CHECK (
       auth.role() = 'authenticated'
       AND bucket_id = 'audio-uploads'
   );

   -- Allow users to view their own files
   CREATE POLICY "Allow users to view own files" ON storage.objects
   FOR SELECT USING (
       auth.role() = 'authenticated'
       AND bucket_id = 'audio-uploads'
       AND (auth.uid()::text = (storage.foldername(name))[1])
   );
   ```

## 🧪 Testing

Test the deployed function:

```bash
./test-function.sh "YOUR_JWT_TOKEN"
```

For production testing:
```bash
SUPABASE_PROJECT_REF=your-ref ./test-function.sh "YOUR_JWT_TOKEN" production
```

## 🔧 API Usage

### Request

**Endpoint:** `POST /functions/v1/create-upload-url`

**Headers:**
```
Authorization: Bearer YOUR_JWT_TOKEN
Content-Type: application/json
```

**Body:**
```json
{
  "fileName": "my-song.mp3",
  "fileSize": 5242880,
  "contentType": "audio/mpeg"
}
```

### Response

**Success (200):**
```json
{
  "uploadUrl": "https://signed-upload-url...",
  "fileUrl": "https://public-file-url...",
  "filePath": "user-id/timestamp-filename.mp3",
  "expiresIn": 3600,
  "bucket": "audio-uploads"
}
```

**Error (400/401/500):**
```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

## 🎵 Supported Audio Formats

- MP3 (`audio/mpeg`)
- WAV (`audio/wav`, `audio/x-wav`)
- AAC (`audio/aac`)
- OGG (`audio/ogg`)
- FLAC (`audio/flac`)
- WebM Audio (`audio/webm`)
- MP4 Audio (`audio/mp4`)
- M4A (`audio/m4a`)

## 📏 File Size Limits

- Maximum file size: 100MB
- Configurable in the edge function code

## 🔒 Security Features

- **JWT Validation**: All requests require valid authentication
- **User Isolation**: Files are stored in user-specific directories
- **File Type Validation**: Only supported audio formats allowed
- **Size Limits**: Prevents abuse with large file uploads
- **Signed URLs**: Time-limited access for secure uploads

## 🔧 Frontend Integration

### React/TypeScript Example

```typescript
const uploadAudioFile = async (file: File) => {
  try {
    // Step 1: Get signed upload URL
    const { data: session } = await supabase.auth.getSession();
    
    const response = await fetch(`${process.env.VITE_SUPABASE_URL}/functions/v1/create-upload-url`, {
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
    
    const { uploadUrl, fileUrl, filePath } = await response.json();
    
    // Step 2: Upload directly to storage
    const uploadResponse = await fetch(uploadUrl, {
      method: 'PUT',
      headers: { 'Content-Type': file.type },
      body: file
    });
    
    if (uploadResponse.ok) {
      console.log('Upload successful!', fileUrl);
      return { success: true, url: fileUrl, path: filePath };
    }
  } catch (error) {
    console.error('Upload failed:', error);
    return { success: false, error: error.message };
  }
};
```

## 🛠️ Local Development

1. **Start Supabase locally**
   ```bash
   supabase start
   ```

2. **Serve functions locally**
   ```bash
   supabase functions serve create-upload-url
   ```

3. **Test locally**
   ```bash
   ./test-function.sh "YOUR_LOCAL_JWT_TOKEN" local
   ```

## 📚 Environment Variables

### Required for Edge Function

- `SUPABASE_SERVICE_ROLE_KEY`: Service role key for Supabase operations
- `FRONTEND_URL`: Your frontend URL for CORS configuration

### Required for Frontend

- `VITE_SUPABASE_URL`: Your Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Your Supabase anonymous key

## 🐛 Troubleshooting

### Common Issues

1. **Authentication Errors**
   - Verify JWT token is valid and not expired
   - Check that user is properly authenticated

2. **CORS Errors**
   - Ensure `FRONTEND_URL` environment variable is set correctly
   - Check that your domain is included in CORS headers

3. **Upload Failures**
   - Verify storage bucket exists and is named `audio-uploads`
   - Check storage policies are properly configured
   - Ensure file size is under 100MB limit

4. **Function Not Found**
   - Verify function is deployed: `supabase functions list`
   - Check function logs: `supabase functions logs create-upload-url`

### Debugging

View function logs:
```bash
supabase functions logs create-upload-url
```

Test with verbose output:
```bash
curl -v -X POST \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fileName":"test.mp3","fileSize":1000,"contentType":"audio/mpeg"}' \
  "YOUR_FUNCTION_URL"
```

## 📄 License

This project is part of the Strawberry music sharing platform.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📞 Support

For issues and questions:
- Check the troubleshooting section above
- Review function logs for detailed error information
- Test locally first with `supabase start` and `supabase functions serve`
