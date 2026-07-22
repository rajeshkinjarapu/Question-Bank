-- ==============================================================================
-- ADVANCED SEARCH OPTIMIZATIONS
-- ==============================================================================

-- 1. Enable Trigram Extension for Fuzzy Search and Typo Correction
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- 2. Build GIN Indexes for Lightning Fast Lookups
-- Drop existing basic indexes if they conflict
DROP INDEX IF EXISTS idx_questions_content_trgm;
CREATE INDEX idx_questions_content_trgm ON public.questions USING GIN (content gin_trgm_ops);

-- Dedicated vector for Formula Search (keeping special characters intact)
ALTER TABLE public.questions ADD COLUMN formula_search_vector text;
-- Populate formula vector by stripping HTML but keeping LaTeX
UPDATE public.questions SET formula_search_vector = regexp_replace(content, '<[^>]+>', '', 'g');
CREATE INDEX idx_questions_formula_trgm ON public.questions USING GIN (formula_search_vector gin_trgm_ops);

-- Standard Full Text Search Index (already created in Phase 3, ensuring it exists)
CREATE INDEX IF NOT EXISTS questions_fts_idx ON public.questions USING GIN (fts);

-- Composite Index for frequent exact-match filters to prevent sequential scans
CREATE INDEX idx_questions_filters_composite ON public.questions 
(exam_id, difficulty_id, type_id, status);

-- 3. Saved Filters Table
CREATE TABLE public.saved_filters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    filter_json JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.saved_filters ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users manage own filters" ON public.saved_filters FOR ALL USING (user_id = auth.uid());

-- 4. Search History Table
CREATE TABLE public.search_history (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    query TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);
ALTER TABLE public.search_history ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own history" ON public.search_history FOR SELECT USING (user_id = auth.uid());
CREATE POLICY "Users insert own history" ON public.search_history FOR INSERT WITH CHECK (user_id = auth.uid());
