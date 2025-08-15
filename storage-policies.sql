
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow authenticated uploads" ON storage.objects
FOR INSERT WITH CHECK (
    auth.role() = 'authenticated'
    AND bucket_id = 'audio-uploads'
);

CREATE POLICY "Allow users to view own files" ON storage.objects
FOR SELECT USING (
    auth.role() = 'authenticated'
    AND bucket_id = 'audio-uploads'
    AND (auth.uid()::text = (storage.foldername(name))[1])
);

CREATE POLICY "Allow users to update own files" ON storage.objects
FOR UPDATE USING (
    auth.role() = 'authenticated'
    AND bucket_id = 'audio-uploads'
    AND (auth.uid()::text = (storage.foldername(name))[1])
);

CREATE POLICY "Allow users to delete own files" ON storage.objects
FOR DELETE USING (
    auth.role() = 'authenticated'
    AND bucket_id = 'audio-uploads'
    AND (auth.uid()::text = (storage.foldername(name))[1])
);

CREATE POLICY "Allow public read access for audio files" ON storage.objects
FOR SELECT USING (
    bucket_id = 'audio-uploads'
);

SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual 
FROM pg_policies 
WHERE tablename = 'objects' AND schemaname = 'storage';
