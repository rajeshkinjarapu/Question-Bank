-- ==============================================================================
-- QUESTION BANK ENHANCEMENTS
-- ==============================================================================

-- 1. Insert Question Types
INSERT INTO public.question_types (name, description) VALUES
('MCQ', 'Multiple Choice Question (Single Correct)'),
('MSQ', 'Multiple Select Question (Multiple Correct)'),
('Integer', 'Integer Type Answer'),
('Numerical', 'Numerical Value Answer'),
('Assertion Reason', 'Assertion and Reason type'),
('Subjective', 'Long form subjective answer'),
('Case Study', 'Case study based question'),
('Paragraph', 'Paragraph comprehension')
ON CONFLICT (name) DO NOTHING;

-- 2. Expand Questions Table Metadata
ALTER TABLE public.questions
ADD COLUMN board_id UUID,
ADD COLUMN class_id UUID,
ADD COLUMN exam_id UUID,
ADD COLUMN estimated_solving_time INT, -- in seconds
ADD COLUMN ai_confidence_score DECIMAL(5,2),
ADD COLUMN source TEXT,
ADD COLUMN options JSONB,
ADD COLUMN explanation JSONB,
ADD COLUMN solution JSONB;

-- 3. Version History Trigger
-- Assuming `question_versions` table exists from Phase 3, we create a function to snapshot.
CREATE OR REPLACE FUNCTION snapshot_question_version()
RETURNS TRIGGER AS $$
BEGIN
    IF OLD.content IS DISTINCT FROM NEW.content OR OLD.options IS DISTINCT FROM NEW.options THEN
        INSERT INTO public.question_versions (question_id, version_number, snapshot, created_by)
        VALUES (
            NEW.id,
            COALESCE((SELECT MAX(version_number) + 1 FROM public.question_versions WHERE question_id = NEW.id), 1),
            row_to_json(OLD),
            NEW.updated_by
        );
    END IF;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_snapshot_question ON public.questions;
CREATE TRIGGER trigger_snapshot_question
AFTER UPDATE ON public.questions
FOR EACH ROW
EXECUTE FUNCTION snapshot_question_version();
