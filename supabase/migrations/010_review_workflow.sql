-- Phase 24: Question Review Workflow, Versioning, and Comments

-- 1. Ensure the status enum exists and has the correct types
-- Assuming 'status' column exists on 'questions' table. If not, add it:
-- ALTER TABLE public.questions ADD COLUMN status text DEFAULT 'draft' CHECK (status IN ('draft', 'pending_review', 'approved', 'rejected', 'archived', 'published'));

-- 2. Question Versions Table
CREATE TABLE public.question_versions (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id uuid REFERENCES public.questions(id) ON DELETE CASCADE,
  version_number integer NOT NULL,
  statement_html text,
  options jsonb,
  solution_html text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
);

-- Create a unique constraint so we don't have duplicate version numbers for the same question
ALTER TABLE public.question_versions ADD CONSTRAINT unique_version_per_question UNIQUE (question_id, version_number);

-- 3. Review Comments Table
CREATE TABLE public.review_comments (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id uuid REFERENCES public.questions(id) ON DELETE CASCADE,
  reviewer_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  comment_text text NOT NULL,
  highlighted_html_segment text, -- Stores the specific snippet of HTML the comment is about
  created_at timestamptz DEFAULT now()
);

-- 4. Approval History Table
CREATE TABLE public.approval_history (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  question_id uuid REFERENCES public.questions(id) ON DELETE CASCADE,
  actor_id uuid REFERENCES auth.users(id) ON DELETE SET NULL,
  previous_status text,
  new_status text NOT NULL,
  action_timestamp timestamptz DEFAULT now()
);

-- Add triggers or RLS policies here as required by Supabase security.
