-- ==============================================================================
-- BLUEPRINTS GENERATOR
-- ==============================================================================

CREATE TABLE public.blueprints (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    exam_id UUID NOT NULL, -- Logical link, no strict FK yet for flexibility, or reference exams table if exists
    subject_id UUID NOT NULL,
    total_questions INT NOT NULL,
    constraints_json JSONB NOT NULL,
    is_verified BOOLEAN DEFAULT false,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.blueprints ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view all blueprints" ON public.blueprints FOR SELECT USING (true);
CREATE POLICY "Users can insert own blueprints" ON public.blueprints FOR INSERT WITH CHECK (created_by = auth.uid());
CREATE POLICY "Users can update own blueprints" ON public.blueprints FOR UPDATE USING (created_by = auth.uid());
CREATE POLICY "Users can delete own blueprints" ON public.blueprints FOR DELETE USING (created_by = auth.uid());
