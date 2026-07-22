-- ==============================================================================
-- IMPORT SESSIONS & UNDO FUNCTIONALITY
-- ==============================================================================

CREATE TABLE public.import_sessions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    file_name TEXT,
    total_items INT DEFAULT 0,
    error_count INT DEFAULT 0,
    status TEXT DEFAULT 'completed' CHECK (status IN ('processing', 'completed', 'undone', 'failed')),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    undone_at TIMESTAMPTZ
);

CREATE TABLE public.import_errors (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    session_id UUID REFERENCES public.import_sessions(id) ON DELETE CASCADE,
    row_number INT,
    raw_data JSONB,
    error_message TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Update Questions table to link to import sessions
ALTER TABLE public.questions 
ADD COLUMN import_session_id UUID REFERENCES public.import_sessions(id) ON DELETE CASCADE;

-- Index for cascading deletes during 'Undo'
CREATE INDEX idx_questions_import_session ON public.questions(import_session_id);

-- RLS Policies for Imports
ALTER TABLE public.import_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.import_errors ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own import sessions"
ON public.import_sessions FOR SELECT
TO authenticated
USING ( user_id = auth.uid() OR exists (select 1 from public.user_roles ur join public.roles r on ur.role_id = r.id where ur.user_id = auth.uid() and r.name in ('Super Admin', 'Admin')) );

CREATE POLICY "Users can view their own import errors"
ON public.import_errors FOR SELECT
TO authenticated
USING ( 
    exists (
        select 1 from public.import_sessions s 
        where s.id = session_id and (s.user_id = auth.uid() OR exists (select 1 from public.user_roles ur join public.roles r on ur.role_id = r.id where ur.user_id = auth.uid() and r.name in ('Super Admin', 'Admin')))
    )
);
