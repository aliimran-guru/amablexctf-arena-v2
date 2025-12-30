-- Create waves table for competition rounds/babak
CREATE TABLE public.waves (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  wave_number INTEGER NOT NULL,
  start_time TIMESTAMP WITH TIME ZONE,
  duration_hours INTEGER NOT NULL DEFAULT 8,
  is_active BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.waves ENABLE ROW LEVEL SECURITY;

-- Everyone can view waves
CREATE POLICY "Waves are viewable by everyone"
ON public.waves FOR SELECT
USING (true);

-- Admins can manage waves
CREATE POLICY "Admins can manage waves"
ON public.waves FOR ALL
USING (has_role(auth.uid(), 'admin'::app_role));

-- Add wave_id to challenges table
ALTER TABLE public.challenges ADD COLUMN wave_id UUID REFERENCES public.waves(id) ON DELETE SET NULL;

-- Add index for wave lookups
CREATE INDEX idx_challenges_wave_id ON public.challenges(wave_id);

-- Trigger for updating waves updated_at
CREATE TRIGGER update_waves_updated_at
BEFORE UPDATE ON public.waves
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();