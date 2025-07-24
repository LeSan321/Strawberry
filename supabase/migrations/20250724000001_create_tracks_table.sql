CREATE TABLE public.tracks (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  audio_url TEXT NOT NULL,
  tags TEXT[] DEFAULT '{}',
  visibility TEXT CHECK (visibility IN ('private', 'inner-circle', 'public')) DEFAULT 'private',
  duration TEXT,
  likes INTEGER DEFAULT 0,
  plays INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  gradient TEXT
);

ALTER TABLE public.tracks ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view public tracks" ON public.tracks
  FOR SELECT USING (visibility = 'public');

CREATE POLICY "Users can view their own tracks" ON public.tracks
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own tracks" ON public.tracks
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own tracks" ON public.tracks
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own tracks" ON public.tracks
  FOR DELETE USING (auth.uid() = user_id);

CREATE INDEX tracks_user_id_idx ON public.tracks(user_id);
CREATE INDEX tracks_visibility_idx ON public.tracks(visibility);
CREATE INDEX tracks_created_at_idx ON public.tracks(created_at DESC);
