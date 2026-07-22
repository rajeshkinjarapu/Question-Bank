-- ==============================================================================
-- BACKGROUND JOBS & BULK OPERATION LOGS
-- ==============================================================================

-- 1. Jobs Queue Table
-- Used by external workers (Render, BullMQ) or Supabase Edge Functions to track async progress
CREATE TABLE public.jobs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    type VARCHAR(50) NOT NULL, -- 'bulk_ai_correction', 'bulk_move_chapter', 'translate', etc.
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
    progress INT DEFAULT 0 CHECK (progress >= 0 AND progress <= 100),
    payload JSONB NOT NULL,    -- e.g. { "questionIds": [...], "targetChapterId": "uuid" }
    result JSONB,              -- Store error messages or success stats here
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for workers to quickly find pending jobs
CREATE INDEX idx_jobs_status ON public.jobs (status) WHERE status = 'pending';

-- 2. Bulk Operation Logs
-- Exists specifically to provide a 1-click "Undo" button for massive DB updates
CREATE TABLE public.bulk_operation_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    job_id UUID REFERENCES public.jobs(id) ON DELETE CASCADE,
    affected_ids UUID[] NOT NULL,
    previous_state JSONB NOT NULL, -- Array of the exact rows BEFORE the bulk update happened
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- RLS
ALTER TABLE public.jobs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own jobs" ON public.jobs FOR SELECT USING (created_by = auth.uid());
CREATE POLICY "Users insert own jobs" ON public.jobs FOR INSERT WITH CHECK (created_by = auth.uid());
-- Only workers (service_role) should ideally UPDATE jobs, but we allow authenticated for local mock setups
CREATE POLICY "Users update own jobs" ON public.jobs FOR UPDATE USING (created_by = auth.uid());

ALTER TABLE public.bulk_operation_logs ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users view own logs via jobs" ON public.bulk_operation_logs 
FOR SELECT USING (job_id IN (SELECT id FROM public.jobs WHERE created_by = auth.uid()));
