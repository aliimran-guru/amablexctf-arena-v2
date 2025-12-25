-- Create policy for admins to delete teams (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Admins can delete any team'
    ) THEN
        CREATE POLICY "Admins can delete any team"
        ON public.teams
        FOR DELETE
        USING (has_role(auth.uid(), 'admin'::app_role));
    END IF;
END $$;

-- Create policy for admins to update any team (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Admins can update any team'
    ) THEN
        CREATE POLICY "Admins can update any team"
        ON public.teams
        FOR UPDATE
        USING (has_role(auth.uid(), 'admin'::app_role));
    END IF;
END $$;

-- Create policy for admins to update any profile (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies WHERE policyname = 'Admins can update any profile'
    ) THEN
        CREATE POLICY "Admins can update any profile"
        ON public.profiles
        FOR UPDATE
        USING (has_role(auth.uid(), 'admin'::app_role));
    END IF;
END $$;