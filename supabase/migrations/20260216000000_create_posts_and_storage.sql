-- Create posts table (sticker sightings)
CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  latitude DOUBLE PRECISION NOT NULL,
  longitude DOUBLE PRECISION NOT NULL,
  location_name TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;

-- Anyone can read posts
CREATE POLICY "Posts are viewable by everyone"
  ON posts FOR SELECT USING (true);

-- Authenticated users can create posts
CREATE POLICY "Authenticated users can create posts"
  ON posts FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Users can update their own posts
CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE USING (auth.uid() = user_id);

-- Users can delete their own posts
CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE USING (auth.uid() = user_id);

-- Create sticker-images storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('sticker-images', 'sticker-images', true);

-- Storage policies: anyone can read
CREATE POLICY "Public read access for sticker images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'sticker-images');

-- Authenticated users can upload to their own folder
CREATE POLICY "Authenticated users can upload sticker images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'sticker-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

-- Users can delete their own images
CREATE POLICY "Users can delete own sticker images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'sticker-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
