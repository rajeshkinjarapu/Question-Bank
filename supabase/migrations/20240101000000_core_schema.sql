-- ==============================================================================
-- DATABASE SCHEMA: QUESTION BANK & EXAM PLATFORM
-- Features: UUIDs, Soft Deletes, FTS, Audit Logs, JSONB
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. AUDIT LOGGING SETUP (Triggers)
CREATE TABLE IF NOT EXISTS public.system_audit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    table_name TEXT NOT NULL,
    record_id UUID NOT NULL,
    action TEXT NOT NULL CHECK (action IN ('INSERT', 'UPDATE', 'DELETE', 'SOFT_DELETE')),
    old_data JSONB,
    new_data JSONB,
    changed_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE OR REPLACE FUNCTION public.audit_trigger_func()
RETURNS trigger AS $$
DECLARE
    user_id UUID;
BEGIN
    -- Attempt to get user from Supabase auth context if available
    BEGIN
        user_id := (current_setting('request.jwt.claim.sub', true))::UUID;
    EXCEPTION WHEN OTHERS THEN
        user_id := NULL;
    END;

    IF (TG_OP = 'DELETE') THEN
        INSERT INTO public.system_audit_logs (table_name, record_id, action, old_data, changed_by)
        VALUES (TG_TABLE_NAME, OLD.id, 'DELETE', row_to_json(OLD)::JSONB, user_id);
        RETURN OLD;
    ELSIF (TG_OP = 'UPDATE') THEN
        IF (NEW.deleted_at IS NOT NULL AND OLD.deleted_at IS NULL) THEN
            INSERT INTO public.system_audit_logs (table_name, record_id, action, old_data, new_data, changed_by)
            VALUES (TG_TABLE_NAME, NEW.id, 'SOFT_DELETE', row_to_json(OLD)::JSONB, row_to_json(NEW)::JSONB, user_id);
        ELSE
            INSERT INTO public.system_audit_logs (table_name, record_id, action, old_data, new_data, changed_by)
            VALUES (TG_TABLE_NAME, NEW.id, 'UPDATE', row_to_json(OLD)::JSONB, row_to_json(NEW)::JSONB, user_id);
        END IF;
        RETURN NEW;
    ELSIF (TG_OP = 'INSERT') THEN
        INSERT INTO public.system_audit_logs (table_name, record_id, action, new_data, changed_by)
        VALUES (TG_TABLE_NAME, NEW.id, 'INSERT', row_to_json(NEW)::JSONB, user_id);
        RETURN NEW;
    END IF;
    RETURN NULL;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. TAXONOMY & METADATA TABLES
CREATE TABLE public.exams (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    description TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE public.subjects (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    exam_id UUID REFERENCES public.exams(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE public.chapters (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    subject_id UUID REFERENCES public.subjects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    chapter_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE public.topics (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    chapter_id UUID REFERENCES public.chapters(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    topic_order INT DEFAULT 0,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

-- Core Enums/Lookups
CREATE TABLE public.question_types (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE, -- e.g., 'MCQ', 'MSQ', 'NUMERICAL', 'SUBJECTIVE'
    name TEXT NOT NULL
);

CREATE TABLE public.difficulty_levels (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    level INT NOT NULL UNIQUE,
    name TEXT NOT NULL -- e.g., 'Easy', 'Medium', 'Hard'
);

CREATE TABLE public.languages (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT NOT NULL UNIQUE, -- e.g., 'en', 'hi', 'te'
    name TEXT NOT NULL
);

CREATE TABLE public.tags (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

-- 4. CORE QUESTION TABLES
CREATE TABLE public.questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type_id UUID REFERENCES public.question_types(id) NOT NULL,
    difficulty_id UUID REFERENCES public.difficulty_levels(id) NOT NULL,
    language_id UUID REFERENCES public.languages(id) NOT NULL,
    
    -- Content
    content TEXT NOT NULL, -- HTML/Markdown representation
    raw_content JSONB, -- Draft.js or lexical JSON payload
    
    -- Full Text Search
    fts tsvector GENERATED ALWAYS AS (to_tsvector('english', coalesce(content, ''))) STORED,
    
    -- Metadata
    marks_positive NUMERIC(5,2) DEFAULT 1.00,
    marks_negative NUMERIC(5,2) DEFAULT 0.00,
    status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'published', 'archived')),
    
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE public.question_topics (
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
    PRIMARY KEY (question_id, topic_id)
);

CREATE TABLE public.question_tags (
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    tag_id UUID REFERENCES public.tags(id) ON DELETE CASCADE,
    PRIMARY KEY (question_id, tag_id)
);

CREATE TABLE public.options (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    is_correct BOOLEAN DEFAULT false,
    option_order INT DEFAULT 0
);

CREATE TABLE public.solutions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    content TEXT NOT NULL,
    video_url TEXT
);

CREATE TABLE public.question_images (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text TEXT
);

CREATE TABLE public.question_formulas (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    latex_content TEXT NOT NULL
);

-- 5. VERSIONING & HISTORY
CREATE TABLE public.question_versions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    question_id UUID REFERENCES public.questions(id) ON DELETE CASCADE,
    version_number INT NOT NULL,
    snapshot JSONB NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    created_by UUID REFERENCES auth.users(id)
);

-- 6. EXAM GENERATION
CREATE TABLE public.generated_papers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    exam_id UUID REFERENCES public.exams(id),
    title TEXT NOT NULL,
    total_marks NUMERIC(7,2),
    duration_minutes INT,
    status TEXT DEFAULT 'draft',
    config JSONB, -- Storing blueprint configs
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ
);

CREATE TABLE public.paper_questions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    paper_id UUID REFERENCES public.generated_papers(id) ON DELETE CASCADE,
    question_id UUID REFERENCES public.questions(id),
    section_name TEXT,
    question_order INT NOT NULL,
    custom_positive_marks NUMERIC(5,2),
    custom_negative_marks NUMERIC(5,2),
    UNIQUE(paper_id, question_order)
);

CREATE TABLE public.answer_keys (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    paper_id UUID REFERENCES public.generated_papers(id) ON DELETE CASCADE UNIQUE,
    key_data JSONB NOT NULL, -- structured mapping of paper questions to correct option IDs
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ==============================================================================
-- INDEXES FOR SCALE (Millions of Rows)
-- ==============================================================================

-- Foreign Key Indexes (B-Tree)
CREATE INDEX idx_subjects_exam ON public.subjects(exam_id);
CREATE INDEX idx_chapters_subject ON public.chapters(subject_id);
CREATE INDEX idx_topics_chapter ON public.topics(chapter_id);
CREATE INDEX idx_questions_type ON public.questions(type_id);
CREATE INDEX idx_questions_difficulty ON public.questions(difficulty_id);
CREATE INDEX idx_options_question ON public.options(question_id);
CREATE INDEX idx_solutions_question ON public.solutions(question_id);
CREATE INDEX idx_paper_questions_paper ON public.paper_questions(paper_id);
CREATE INDEX idx_paper_questions_question ON public.paper_questions(question_id);

-- Soft Delete Partial Indexes (Massively speeds up queries ignoring deleted items)
CREATE INDEX idx_questions_not_deleted ON public.questions(id) WHERE deleted_at IS NULL;
CREATE INDEX idx_exams_not_deleted ON public.exams(id) WHERE deleted_at IS NULL;

-- Full Text Search Index (GIN)
CREATE INDEX idx_questions_fts ON public.questions USING GIN (fts);

-- JSONB Indexes
CREATE INDEX idx_generated_papers_config ON public.generated_papers USING GIN (config);
CREATE INDEX idx_answer_keys_data ON public.answer_keys USING GIN (key_data);

-- ==============================================================================
-- ATTACH AUDIT TRIGGERS
-- ==============================================================================
CREATE TRIGGER audit_questions_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.questions
FOR EACH ROW EXECUTE PROCEDURE public.audit_trigger_func();

CREATE TRIGGER audit_exams_trigger
AFTER INSERT OR UPDATE OR DELETE ON public.exams
FOR EACH ROW EXECUTE PROCEDURE public.audit_trigger_func();
