-- ==============================================================================
-- STORAGE CONFIGURATION & POLICIES
-- ==============================================================================

-- 1. Create Buckets
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('question-diagrams', 'question-diagrams', true),
  ('generated-papers', 'generated-papers', false),
  ('user-uploads', 'user-uploads', true)
ON CONFLICT (id) DO NOTHING;

-- 2. Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- 3. Policies for 'question-diagrams' (Public Read, Authenticated Write)
CREATE POLICY "Public Read Access for Question Diagrams"
ON storage.objects FOR SELECT
USING ( bucket_id = 'question-diagrams' );

CREATE POLICY "Authenticated Users can upload Question Diagrams"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'question-diagrams' AND
    (storage.extension(name) = 'png' OR storage.extension(name) = 'jpg' OR storage.extension(name) = 'jpeg' OR storage.extension(name) = 'svg')
);

CREATE POLICY "Users can update their own Question Diagrams"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'question-diagrams' AND owner = auth.uid() );

CREATE POLICY "Users can delete their own Question Diagrams"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'question-diagrams' AND owner = auth.uid() );

-- 4. Policies for 'generated-papers' (Private Read/Write)
CREATE POLICY "Users can read their own Generated Papers"
ON storage.objects FOR SELECT
TO authenticated
USING ( 
  bucket_id = 'generated-papers' AND 
  (owner = auth.uid() OR exists (select 1 from public.users where id = auth.uid() and role in ('super_admin', 'admin')))
);

CREATE POLICY "Users can upload Generated Papers"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
    bucket_id = 'generated-papers' AND
    (storage.extension(name) = 'pdf' OR storage.extension(name) = 'docx')
);

CREATE POLICY "Users can delete their own Generated Papers"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'generated-papers' AND owner = auth.uid() );

-- 5. Policies for 'user-uploads' (Avatars, etc.)
CREATE POLICY "Public Read Access for User Uploads"
ON storage.objects FOR SELECT
USING ( bucket_id = 'user-uploads' );

CREATE POLICY "Users can upload their own assets"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK ( bucket_id = 'user-uploads' );

CREATE POLICY "Users can update their own assets"
ON storage.objects FOR UPDATE
TO authenticated
USING ( bucket_id = 'user-uploads' AND owner = auth.uid() );

CREATE POLICY "Users can delete their own assets"
ON storage.objects FOR DELETE
TO authenticated
USING ( bucket_id = 'user-uploads' AND owner = auth.uid() );
