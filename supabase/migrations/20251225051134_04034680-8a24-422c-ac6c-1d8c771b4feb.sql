-- Fix function search_path for calculate_challenge_points
CREATE OR REPLACE FUNCTION public.calculate_challenge_points(
  p_max_points INTEGER,
  p_min_points INTEGER,
  p_decay_rate INTEGER,
  p_solve_count INTEGER
)
RETURNS INTEGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  RETURN GREATEST(
    p_min_points,
    p_max_points - (p_decay_rate * p_solve_count)
  );
END;
$$;