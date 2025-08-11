# Testing Guide for Strawberry Edge Function Infrastructure

This document provides comprehensive testing instructions for the Supabase Edge Function infrastructure implementation.

## 🧪 Test Overview

The testing strategy covers three main areas:
1. **Edge Function Testing** - Verify the create-upload-url function works correctly
2. **Frontend Integration Testing** - Ensure React components use the new upload workflow
3. **End-to-End Testing** - Complete user workflow from file selection to database storage

## 🚀 Quick Test Commands

### Complete Workflow Test
```bash
# Test everything (recommended)
./test-complete-workflow.sh

# Test with edge function (requires JWT token)
./test-complete-workflow.sh local YOUR_JWT_TOKEN

# Test production deployment
SUPABASE_PROJECT_REF=your-ref ./test-complete-workflow.sh production YOUR_JWT_TOKEN
```

### Individual Component Tests
```bash
# Test edge function only
./test-function.sh YOUR_JWT_TOKEN

# Test frontend build
./test-frontend-integration.sh

# Test local development
npm run dev
```

## 🔧 Detailed Testing Procedures

### 1. Edge Function Testing

#### Prerequisites
- Supabase CLI installed: `npm install -g supabase`
- Project linked: `supabase link --project-ref YOUR_REF`
- Function deployed: `./deploy.sh`

#### Test Cases

**Test 1: Authentication Validation**
```bash
# Should fail with 401
curl -X POST \
  -H "Content-Type: application/json" \
  -d '{"fileName":"test.mp3","fileSize":1000,"contentType":"audio/mpeg"}' \
  "YOUR_FUNCTION_URL"
```

**Test 2: Valid Upload Request**
```bash
# Should return 200 with signed URL
curl -X POST \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fileName":"test.mp3","fileSize":1000,"contentType":"audio/mpeg"}' \
  "YOUR_FUNCTION_URL"
```

**Test 3: File Size Validation**
```bash
# Should fail with 400 (file too large)
curl -X POST \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fileName":"huge.mp3","fileSize":200000000,"contentType":"audio/mpeg"}' \
  "YOUR_FUNCTION_URL"
```

**Test 4: File Type Validation**
```bash
# Should fail with 400 (unsupported type)
curl -X POST \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"fileName":"document.pdf","fileSize":1000,"contentType":"application/pdf"}' \
  "YOUR_FUNCTION_URL"
```

#### Expected Responses

**Success Response (200):**
```json
{
  "uploadUrl": "https://signed-upload-url...",
  "fileUrl": "https://public-file-url...",
  "filePath": "user-id/timestamp-filename.mp3",
  "expiresIn": 3600,
  "bucket": "audio-uploads"
}
```

**Error Response (400/401/500):**
```json
{
  "error": "Error message",
  "details": "Additional error details"
}
```

### 2. Frontend Integration Testing

#### Prerequisites
- Node.js 18+ installed
- Dependencies installed: `npm install --legacy-peer-deps`
- Environment variables configured

#### Test Cases

**Test 1: Build Verification**
```bash
npm run build
# Should complete without errors
```

**Test 2: Upload Component Integration**
```bash
# Start development server
npm run dev

# Navigate to upload page
# Test file selection and upload flow
```

**Test 3: Authentication Flow**
```bash
# Test with authenticated user
# Test with unauthenticated user (should show sign-in prompt)
```

#### Manual Testing Checklist

- [ ] Upload page loads without errors
- [ ] File drag-and-drop works
- [ ] File selection dialog works
- [ ] Audio file validation works
- [ ] Non-audio files are rejected
- [ ] Large files (>100MB) are rejected
- [ ] Upload progress indicator shows
- [ ] Success message displays after upload
- [ ] Error messages show for failures
- [ ] Track metadata is saved correctly
- [ ] Uploaded files are accessible

### 3. End-to-End Testing

#### Complete User Workflow

1. **User Authentication**
   - Sign in to the application
   - Verify user session is active

2. **File Selection**
   - Navigate to upload page
   - Select or drag an audio file
   - Verify file validation

3. **Track Information**
   - Fill in track title
   - Select mood tags
   - Choose visibility level

4. **Upload Process**
   - Click upload button
   - Monitor progress indicator
   - Wait for completion

5. **Verification**
   - Check success message
   - Verify file in storage bucket
   - Verify metadata in database
   - Test audio playback

#### Automated E2E Test Script

```bash
#!/bin/bash
# e2e-test.sh - Automated end-to-end test

# 1. Start local Supabase
supabase start

# 2. Deploy function
./deploy.sh

# 3. Start frontend
npm run dev &
FRONTEND_PID=$!

# 4. Run tests
# (Add your specific test commands here)

# 5. Cleanup
kill $FRONTEND_PID
supabase stop
```

## 🐛 Troubleshooting

### Common Issues and Solutions

#### Edge Function Issues

**Issue: Function not found (404)**
- Solution: Verify function is deployed with `supabase functions list`
- Check function name matches exactly: `create-upload-url`

**Issue: Authentication errors (401)**
- Solution: Verify JWT token is valid and not expired
- Check user is properly authenticated in frontend

**Issue: CORS errors**
- Solution: Verify `FRONTEND_URL` environment variable is set
- Check CORS headers in `_shared/cors.ts`

#### Frontend Issues

**Issue: Build failures**
- Solution: Check TypeScript errors in console
- Verify all dependencies are installed
- Run `npm install --legacy-peer-deps`

**Issue: Upload failures**
- Solution: Check browser network tab for errors
- Verify edge function is accessible
- Check authentication state

**Issue: File not appearing in storage**
- Solution: Verify storage bucket exists (`audio-uploads`)
- Check storage policies are configured
- Verify signed URL is working

#### Storage Issues

**Issue: Storage policies not working**
- Solution: Run SQL from `storage-policies.sql`
- Verify RLS is enabled on storage.objects
- Check user permissions

**Issue: Files not accessible**
- Solution: Verify bucket is configured correctly
- Check file paths match expected format
- Verify public URL generation

## 📊 Performance Testing

### Load Testing

Test the edge function with multiple concurrent requests:

```bash
# Install artillery for load testing
npm install -g artillery

# Create artillery config
cat > load-test.yml << EOF
config:
  target: 'YOUR_FUNCTION_URL'
  phases:
    - duration: 60
      arrivalRate: 10
scenarios:
  - name: "Upload URL generation"
    requests:
      - post:
          url: "/functions/v1/create-upload-url"
          headers:
            Authorization: "Bearer YOUR_JWT_TOKEN"
            Content-Type: "application/json"
          json:
            fileName: "test.mp3"
            fileSize: 5000000
            contentType: "audio/mpeg"
EOF

# Run load test
artillery run load-test.yml
```

### Performance Metrics

Monitor these metrics during testing:
- Edge function response time
- File upload speed
- Database insert performance
- Storage bucket performance
- Frontend responsiveness

## 🔍 Monitoring and Logging

### Edge Function Logs
```bash
# View real-time logs
supabase functions logs create-upload-url --follow

# View recent logs
supabase functions logs create-upload-url
```

### Frontend Debugging

Enable debug mode by adding to `.env.local`:
```env
VITE_DEBUG_UPLOADS=true
```

### Database Monitoring

Monitor the tracks table for successful inserts:
```sql
SELECT COUNT(*) as total_uploads, 
       DATE(created_at) as upload_date
FROM tracks 
WHERE created_at > NOW() - INTERVAL '24 hours'
GROUP BY DATE(created_at);
```

## ✅ Test Completion Checklist

### Pre-Deployment
- [ ] All unit tests pass
- [ ] Build completes successfully
- [ ] Lint checks pass (or acceptable warnings only)
- [ ] Edge function deploys without errors
- [ ] Storage bucket and policies configured

### Post-Deployment
- [ ] Edge function responds correctly
- [ ] Frontend integration works
- [ ] File uploads complete successfully
- [ ] Database records are created
- [ ] Files are accessible in storage
- [ ] Error handling works correctly

### Production Readiness
- [ ] Load testing completed
- [ ] Performance metrics acceptable
- [ ] Monitoring and logging configured
- [ ] Error tracking implemented
- [ ] Backup and recovery tested

## 📞 Support

If tests fail or you encounter issues:

1. Check the troubleshooting section above
2. Review function logs for detailed error information
3. Test locally first with `supabase start`
4. Verify all environment variables are set correctly
5. Check the deployment guide for setup instructions

For additional help, refer to:
- `deployment-guide.md` - Deployment instructions
- `frontend-integration-guide.md` - Integration details
- `README.md` - General project information
