
-- Create table for problem history
CREATE TABLE public.problem_history (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  problem_text TEXT NOT NULL,
  problem_type TEXT NOT NULL DEFAULT 'text', -- text, image, pdf
  solution_data JSONB,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.problem_history ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read and insert (no auth required for this app)
CREATE POLICY "Anyone can read problems" ON public.problem_history FOR SELECT USING (true);
CREATE POLICY "Anyone can insert problems" ON public.problem_history FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can delete problems" ON public.problem_history FOR DELETE USING (true);
