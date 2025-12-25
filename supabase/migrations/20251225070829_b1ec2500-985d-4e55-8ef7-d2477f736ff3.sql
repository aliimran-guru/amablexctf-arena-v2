-- Add scoring_type to challenges table
ALTER TABLE public.challenges 
ADD COLUMN IF NOT EXISTS scoring_type TEXT NOT NULL DEFAULT 'dynamic' 
CHECK (scoring_type IN ('static', 'dynamic'));

-- Add static_points column for static scoring
ALTER TABLE public.challenges 
ADD COLUMN IF NOT EXISTS static_points INTEGER DEFAULT 100;

-- Comment for clarity
COMMENT ON COLUMN public.challenges.scoring_type IS 'Type of scoring: static (fixed points) or dynamic (decreasing points)';
COMMENT ON COLUMN public.challenges.static_points IS 'Points awarded for static scoring challenges';