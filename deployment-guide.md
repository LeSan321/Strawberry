# Supabase Edge Function Deployment Guide

This guide provides detailed instructions for deploying the Strawberry Riff Supabase Edge Function infrastructure.

## 📋 Prerequisites

### 1. System Requirements

- Node.js 16+ installed
- Git installed
- Access to your Supabase project
- Admin access to your Supabase dashboard

### 2. Install Supabase CLI

```bash
# Install globally via npm
npm install -g supabase

# Verify installation
supabase --version
```

### 3. Authentication Setup

```bash
# Login to Supabase (opens browser for authentication)
supabase login

# Verify login
supabase projects list
```

## 🔗 Project Setup

### 1. Link to Your Supabase Project

```bash
# Navigate to your project directory
cd /path/to/strawberry

# Link to your existing Supabase project
supabase link --project-ref YOUR_PROJECT_REF
```

**Finding your Project Reference:**
1. Go to your Supabase dashboard
2. Select your project
3. Go to Settings → General
4. Copy the "Reference ID"

### 2. Verify Project Structure

Ensure your project has the following structure:

```
strawberry/
├── supabase/
│   ├── functions/
│   │   ├── create-upload-url/
│   │   │   ├── index.ts
│   │   │   ├── deno.json
│   │   │   └── import_map.json
│   │   └── _shared/
│   │       └── cors.ts
│   └── config.toml
├── deploy.sh
├── test-function.sh
└── .env.example
```

## 🔐 Environment Configuration

### 1. Set Required Secrets

The edge function requires these environment variables:

```bash
# Set your service role key (found in Project Settings → API)
supabase secrets set SUPABASE_SERVICE_ROLE_KEY="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."

# Set your frontend URL
supabase secrets set FRONTEND_URL="https://yourdomain.com"

# For local development, use localhost
supabase secrets set FRONTEND_URL="http://localhost:5173"
```

**Finding your Service Role Key:**
1. Go to Supabase Dashboard → Project Settings → API
2. Copy the `service_role` key (not the `anon` key)
3. Keep this key secure - it has admin privileges

### 2. Verify Secrets

```bash
# List all secrets (values are hidden for security)
supabase secrets list
```

## 🚀 Deployment Process

### 1. Automated Deployment

Use the provided deployment script:

```bash
# Make the script executable
chmod +x deploy.sh

# Run deployment
./deploy.sh
```

### 2. Manual Deployment

If you prefer manual deployment:

```bash
# Deploy the edge function
supabase functions deploy create-upload-url

# Verify deployment
supabase functions list
```

### 3. Verify Deployment

Check that the function is deployed:

```bash
# List all functions
supabase functions list

# View function details
supabase functions inspect create-upload-url
```

## 🗄️ Storage Configuration

### 1. Create Storage Bucket

**Via Supabase Dashboard:**
1. Go to Storage in your Supabase dashboard
2. Click "Create Bucket"
3. Name: `audio-uploads`
4. Set as **Private** bucket
5. Set file size limit: `100MB`
6. Click "Create bucket"

**Via SQL (alternative):**
```sql
-- Create the bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'audio-uploads',
  'audio-uploads',
  false,
  104857600, -- 100MB in bytes
  ARRAY['audio/mpeg', 'audio/wav', 'audio/x-wav', 'audio/aac', 'audio/ogg', 'audio/flac', 'audio/webm', 'audio/mp4', 'audio/m4a']
);
```

### 2. Configure Storage Policies

**Enable Row Level Security:**
```sql
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;
```

**Create Upload Policy:**
```sql
CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (
    auth.role() = 'authenticated'
    AND bucket_id = 'audio-uploads'
);
```

**Create Read Policy:**
```sql
CREATE POLICY "Allow users to view own files" ON storage.objects
FOR SELECT USING (
    auth.role() = 'authenticated'
    AND bucket_id = 'audio-uploads'
    AND (auth.uid()::text = (storage.foldername(name))[1])
);
```

**Create Update Policy (optional):**
```sql
CREATE POLICY "Allow users to update own files" ON storage.objects
FOR UPDATE USING (
    auth.role() = 'authenticated'
    AND bucket_id = 'audio-uploads'
    AND (auth.uid()::text = (storage.foldername(name))[1])
);
```

**Create Delete Policy (optional):**
```sql
CREATE POLICY "Allow users to delete own files" ON storage.objects
FOR DELETE USING (
    auth.role() = 'authenticated'
    AND bucket_id = 'audio-uploads'
    AND (auth.uid()::text = (storage.foldername(name))[1])
);
```

### 3. Verify Storage Setup

Test storage access:
```sql
-- Check bucket exists
SELECT * FROM storage.buckets WHERE id = 'audio-uploads';

-- Check policies
SELECT * FROM pg_policies WHERE tablename = 'objects' AND schemaname = 'storage';
```

## 🧪 Testing Deployment

### 1. Get a Test JWT Token

**Via Supabase Dashboard:**
1. Go to Authentication → Users
2. Create a test user or use existing user
3. Copy the JWT token from the user details

**Via Frontend Application:**
```javascript
// In your app's console
const { data: { session } } = await supabase.auth.getSession();
console.log('JWT Token:', session.access_token);
```

### 2. Test the Edge Function

```bash
# Test with the provided script
./test-function.sh "YOUR_JWT_TOKEN"

# For production testing
SUPABASE_PROJECT_REF=your-ref ./test-function.sh "YOUR_JWT_TOKEN" production
```

### 3. Manual Testing

```bash
# Replace with your actual values
FUNCTION_URL="https://YOUR_PROJECT_REF.supabase.co/functions/v1/create-upload-url"
JWT_TOKEN="your-jwt-token"

curl -X POST \
  -H "Authorization: Bearer $JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "fileName": "test-song.mp3",
    "fileSize": 5242880,
    "contentType": "audio/mpeg"
  }' \
  "$FUNCTION_URL"
```

**Expected Response:**
```json
{
  "uploadUrl": "https://signed-upload-url...",
  "fileUrl": "https://public-file-url...",
  "filePath": "user-id/timestamp-test-song.mp3",
  "expiresIn": 3600,
  "bucket": "audio-uploads"
}
```

## 🔧 Local Development Setup

### 1. Start Local Supabase

```bash
# Initialize local Supabase (if not already done)
supabase init

# Start all services
supabase start
```

### 2. Serve Functions Locally

```bash
# Serve the edge function locally
supabase functions serve create-upload-url

# Or serve all functions
supabase functions serve
```

### 3. Test Locally

```bash
# Test against local instance
./test-function.sh "YOUR_LOCAL_JWT_TOKEN" local
```

**Local URLs:**
- Function: `http://127.0.0.1:54321/functions/v1/create-upload-url`
- Dashboard: `http://127.0.0.1:54323`
- Database: `postgresql://postgres:postgres@127.0.0.1:54322/postgres`

## 🐛 Troubleshooting

### Common Deployment Issues

**1. Function Not Found After Deployment**
```bash
# Check if function exists
supabase functions list

# Redeploy if missing
supabase functions deploy create-upload-url
```

**2. Authentication Errors**
```bash
# Verify you're logged in
supabase projects list

# Re-login if needed
supabase login
```

**3. Project Not Linked**
```bash
# Check current project
cat .supabase/config.toml

# Re-link if needed
supabase link --project-ref YOUR_PROJECT_REF
```

**4. Environment Variables Not Set**
```bash
# List current secrets
supabase secrets list

# Set missing secrets
supabase secrets set VARIABLE_NAME="value"
```

### Function Runtime Issues

**1. View Function Logs**
```bash
# View recent logs
supabase functions logs create-upload-url

# Follow logs in real-time
supabase functions logs create-upload-url --follow
```

**2. Common Error Messages**

| Error | Cause | Solution |
|-------|-------|----------|
| "Missing or invalid authorization header" | No JWT token provided | Include `Authorization: Bearer TOKEN` header |
| "Invalid or expired token" | JWT token is invalid/expired | Get a fresh token from your auth system |
| "Unsupported file type" | File type not in allowed list | Use supported audio formats only |
| "File size exceeds maximum limit" | File larger than 100MB | Reduce file size or increase limit in code |
| "Failed to create upload URL" | Storage bucket issues | Check bucket exists and policies are correct |

### Storage Issues

**1. Bucket Not Found**
```sql
-- Check if bucket exists
SELECT * FROM storage.buckets WHERE id = 'audio-uploads';

-- Create if missing
INSERT INTO storage.buckets (id, name, public) VALUES ('audio-uploads', 'audio-uploads', false);
```

**2. Policy Issues**
```sql
-- Check existing policies
SELECT * FROM pg_policies WHERE tablename = 'objects';

-- Drop and recreate if needed
DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
-- Then recreate the policy
```

**3. Permission Denied**
- Verify RLS is enabled on storage.objects
- Check that policies allow the specific operation
- Ensure user is authenticated

## 📊 Monitoring and Maintenance

### 1. Monitor Function Usage

```bash
# View function logs
supabase functions logs create-upload-url

# Check function metrics in dashboard
# Go to Edge Functions → create-upload-url → Metrics
```

### 2. Update Function

```bash
# Make changes to index.ts
# Then redeploy
supabase functions deploy create-upload-url
```

### 3. Update Environment Variables

```bash
# Update secrets
supabase secrets set VARIABLE_NAME="new-value"

# Restart function (automatic after secret update)
```

## 🔄 Rollback Procedures

### 1. Rollback Function Deployment

```bash
# View deployment history
supabase functions list

# If you need to rollback, redeploy previous version
# (Keep backups of your function code)
```

### 2. Rollback Storage Policies

```sql
-- Drop problematic policies
DROP POLICY "policy_name" ON storage.objects;

-- Recreate previous policies
-- (Keep backups of your SQL policies)
```

## 📈 Performance Optimization

### 1. Function Performance

- Monitor function execution time in logs
- Optimize file validation logic if needed
- Consider caching for repeated requests

### 2. Storage Performance

- Use appropriate file naming conventions
- Consider CDN for public file access
- Monitor storage usage and costs

## 🔒 Security Best Practices

### 1. Environment Variables

- Never commit secrets to version control
- Rotate service role keys regularly
- Use different keys for different environments

### 2. Storage Security

- Always use RLS on storage.objects
- Implement least-privilege policies
- Regular audit of storage access

### 3. Function Security

- Validate all input parameters
- Implement rate limiting if needed
- Monitor for unusual usage patterns

## 📞 Getting Help

### 1. Logs and Debugging

```bash
# Function logs
supabase functions logs create-upload-url

# Database logs
supabase logs db

# All logs
supabase logs
```

### 2. Supabase Support

- [Supabase Documentation](https://supabase.com/docs)
- [Supabase Discord](https://discord.supabase.com)
- [GitHub Issues](https://github.com/supabase/supabase/issues)

### 3. Project-Specific Support

- Check this repository's issues
- Review function code for comments
- Test with the provided test scripts

---

This deployment guide should help you successfully deploy and configure the Strawberry Riff Supabase Edge Function infrastructure. Follow each step carefully and refer to the troubleshooting section if you encounter any issues.
