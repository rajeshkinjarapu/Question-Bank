-- ==============================================================================
-- ADVANCED STORAGE BUCKETS & RLS
-- ==============================================================================

-- 1. Create Consolidated Buckets
INSERT INTO storage.buckets (id, name, public) 
VALUES ('public-assets', 'public-assets', true)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('private-exports', 'private-exports', false)
ON CONFLICT (id) DO NOTHING;

INSERT INTO storage.buckets (id, name, public) 
VALUES ('system-backups', 'system-backups', false)
ON CONFLICT (id) DO NOTHING;

-- 2. PUBLIC-ASSETS POLICIES
-- Anyone can view
CREATE POLICY "Public Read Access" 
ON storage.objects FOR SELECT 
USING ( bucket_id = 'public-assets' );

-- Only authenticated users can insert/update
CREATE POLICY "Authenticated Insert/Update Access" 
ON storage.objects FOR INSERT 
TO authenticated 
WITH CHECK ( bucket_id = 'public-assets' );

CREATE POLICY "Authenticated Update Access" 
ON storage.objects FOR UPDATE 
TO authenticated 
USING ( bucket_id = 'public-assets' );


-- 3. PRIVATE-EXPORTS POLICIES
-- Only the owner (uploader) or an Admin can view/download
CREATE POLICY "Private Export Select" 
ON storage.objects FOR SELECT 
TO authenticated
USING ( 
    bucket_id = 'private-exports' 
    AND (
        auth.uid() = owner
        OR exists (select 1 from public.users where id = auth.uid() and role in ('super_admin', 'admin'))
    )
);

-- Only authenticated users can generate/upload an export
CREATE POLICY "Private Export Insert" 
ON storage.objects FOR INSERT 
TO authenticated
WITH CHECK ( bucket_id = 'private-exports' );


-- 4. SYSTEM-BACKUPS POLICIES
-- Strictly Super Admins
CREATE POLICY "Super Admin Backups" 
ON storage.objects FOR ALL 
TO authenticated
USING ( 
    bucket_id = 'system-backups' 
    AND exists (select 1 from public.users where id = auth.uid() and role = 'super_admin')
)
WITH CHECK ( 
    bucket_id = 'system-backups' 
    AND exists (select 1 from public.users where id = auth.uid() and role = 'super_admin')
);
