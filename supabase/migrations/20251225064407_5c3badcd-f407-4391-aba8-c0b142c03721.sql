-- Create registration tokens table for admin-managed signup tokens
CREATE TABLE public.registration_tokens (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    token VARCHAR(50) NOT NULL UNIQUE,
    description TEXT,
    max_uses INTEGER DEFAULT 1,
    current_uses INTEGER DEFAULT 0,
    expires_at TIMESTAMP WITH TIME ZONE,
    is_active BOOLEAN DEFAULT true,
    created_by UUID REFERENCES auth.users(id),
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create table to track token usage
CREATE TABLE public.token_usage (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    token_id UUID REFERENCES public.registration_tokens(id) ON DELETE CASCADE,
    user_id UUID NOT NULL,
    used_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.registration_tokens ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.token_usage ENABLE ROW LEVEL SECURITY;

-- Policies for registration_tokens
-- Admins can do everything
CREATE POLICY "Admins can manage registration tokens"
ON public.registration_tokens
FOR ALL
TO authenticated
USING (public.has_role(auth.uid(), 'admin'))
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Anonymous users can validate tokens during signup
CREATE POLICY "Anyone can validate tokens"
ON public.registration_tokens
FOR SELECT
TO anon, authenticated
USING (is_active = true);

-- Policies for token_usage
CREATE POLICY "Admins can view token usage"
ON public.token_usage
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Users can insert their own token usage"
ON public.token_usage
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

-- Function to validate and use a token
CREATE OR REPLACE FUNCTION public.validate_registration_token(p_token VARCHAR)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_token_id UUID;
    v_max_uses INTEGER;
    v_current_uses INTEGER;
    v_expires_at TIMESTAMP WITH TIME ZONE;
    v_is_active BOOLEAN;
BEGIN
    SELECT id, max_uses, current_uses, expires_at, is_active
    INTO v_token_id, v_max_uses, v_current_uses, v_expires_at, v_is_active
    FROM public.registration_tokens
    WHERE token = p_token;
    
    IF v_token_id IS NULL THEN
        RETURN FALSE;
    END IF;
    
    IF NOT v_is_active THEN
        RETURN FALSE;
    END IF;
    
    IF v_expires_at IS NOT NULL AND v_expires_at < now() THEN
        RETURN FALSE;
    END IF;
    
    IF v_max_uses IS NOT NULL AND v_current_uses >= v_max_uses THEN
        RETURN FALSE;
    END IF;
    
    RETURN TRUE;
END;
$$;

-- Function to use a token (increment usage)
CREATE OR REPLACE FUNCTION public.use_registration_token(p_token VARCHAR, p_user_id UUID)
RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
    v_token_id UUID;
BEGIN
    IF NOT public.validate_registration_token(p_token) THEN
        RETURN FALSE;
    END IF;
    
    SELECT id INTO v_token_id
    FROM public.registration_tokens
    WHERE token = p_token;
    
    UPDATE public.registration_tokens
    SET current_uses = current_uses + 1,
        updated_at = now()
    WHERE id = v_token_id;
    
    INSERT INTO public.token_usage (token_id, user_id)
    VALUES (v_token_id, p_user_id);
    
    RETURN TRUE;
END;
$$;

-- Add trigger for updated_at
CREATE TRIGGER update_registration_tokens_updated_at
BEFORE UPDATE ON public.registration_tokens
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();