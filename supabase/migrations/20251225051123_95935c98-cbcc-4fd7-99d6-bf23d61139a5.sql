-- ============================================
-- AmablexCTF Database Schema
-- ============================================

-- Create role enum for user permissions
CREATE TYPE public.app_role AS ENUM ('admin', 'moderator', 'user');

-- Create challenge category enum
CREATE TYPE public.challenge_category AS ENUM ('web', 'crypto', 'pwn', 'forensic', 'osint', 'misc');

-- Create challenge difficulty enum
CREATE TYPE public.challenge_difficulty AS ENUM ('easy', 'medium', 'hard', 'insane');

-- Create team invite status enum
CREATE TYPE public.invite_status AS ENUM ('pending', 'accepted', 'rejected');

-- ============================================
-- User Profiles Table
-- ============================================
CREATE TABLE public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  display_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  country TEXT,
  score INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles are viewable by everyone"
  ON public.profiles FOR SELECT
  USING (true);

CREATE POLICY "Users can update their own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert their own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ============================================
-- User Roles Table (Security)
-- ============================================
CREATE TABLE public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  role app_role NOT NULL DEFAULT 'user',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (user_id, role)
);

ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;

-- Security definer function to check roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id
      AND role = _role
  )
$$;

CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all roles"
  ON public.user_roles FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can manage roles"
  ON public.user_roles FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- Teams Table
-- ============================================
CREATE TABLE public.teams (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  description TEXT,
  avatar_url TEXT,
  invite_code TEXT UNIQUE DEFAULT encode(gen_random_bytes(6), 'hex'),
  captain_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  score INTEGER DEFAULT 0,
  max_members INTEGER DEFAULT 5,
  is_public BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Teams are viewable by everyone"
  ON public.teams FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create teams"
  ON public.teams FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

CREATE POLICY "Captains can update their team"
  ON public.teams FOR UPDATE
  USING (auth.uid() = captain_id);

CREATE POLICY "Captains can delete their team"
  ON public.teams FOR DELETE
  USING (auth.uid() = captain_id);

-- ============================================
-- Team Members Table
-- ============================================
CREATE TABLE public.team_members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  joined_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (team_id, user_id)
);

ALTER TABLE public.team_members ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members are viewable by everyone"
  ON public.team_members FOR SELECT
  USING (true);

CREATE POLICY "Users can join teams"
  ON public.team_members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can leave teams"
  ON public.team_members FOR DELETE
  USING (auth.uid() = user_id);

CREATE POLICY "Captains can remove members"
  ON public.team_members FOR DELETE
  USING (
    auth.uid() IN (
      SELECT captain_id FROM public.teams WHERE id = team_id
    )
  );

-- ============================================
-- Categories Table
-- ============================================
CREATE TABLE public.categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT UNIQUE NOT NULL,
  slug challenge_category UNIQUE NOT NULL,
  description TEXT,
  icon TEXT,
  color TEXT DEFAULT '#3b82f6',
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Insert default categories
INSERT INTO public.categories (name, slug, description, icon, color) VALUES
  ('Web Exploitation', 'web', 'Web application security challenges', 'Globe', '#3b82f6'),
  ('Cryptography', 'crypto', 'Encryption and decryption challenges', 'Lock', '#8b5cf6'),
  ('Binary Exploitation', 'pwn', 'Buffer overflows and memory corruption', 'Terminal', '#ef4444'),
  ('Forensics', 'forensic', 'Digital forensics and analysis', 'Search', '#10b981'),
  ('OSINT', 'osint', 'Open Source Intelligence gathering', 'Eye', '#f59e0b'),
  ('Miscellaneous', 'misc', 'Various other challenges', 'Puzzle', '#6b7280');

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone"
  ON public.categories FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage categories"
  ON public.categories FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- Challenges Table
-- ============================================
CREATE TABLE public.challenges (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category_id UUID REFERENCES public.categories(id) ON DELETE CASCADE NOT NULL,
  difficulty challenge_difficulty DEFAULT 'medium',
  flag TEXT NOT NULL,
  max_points INTEGER DEFAULT 500 NOT NULL,
  min_points INTEGER DEFAULT 50 NOT NULL,
  decay_rate INTEGER DEFAULT 25,
  current_points INTEGER DEFAULT 500,
  solve_count INTEGER DEFAULT 0,
  author TEXT,
  is_active BOOLEAN DEFAULT true,
  is_hidden BOOLEAN DEFAULT false,
  docker_image TEXT,
  source_url TEXT,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.challenges ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Active challenges are viewable by authenticated users"
  ON public.challenges FOR SELECT
  USING (
    (is_active = true AND is_hidden = false AND auth.uid() IS NOT NULL)
    OR public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can manage challenges"
  ON public.challenges FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- Challenge Hints Table
-- ============================================
CREATE TABLE public.challenge_hints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE NOT NULL,
  content TEXT NOT NULL,
  cost INTEGER DEFAULT 50 NOT NULL,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.challenge_hints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Hints are viewable by authenticated users"
  ON public.challenge_hints FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage hints"
  ON public.challenge_hints FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- Challenge Files Table
-- ============================================
CREATE TABLE public.challenge_files (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE NOT NULL,
  file_name TEXT NOT NULL,
  file_url TEXT NOT NULL,
  file_size INTEGER,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.challenge_files ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Files are viewable by authenticated users"
  ON public.challenge_files FOR SELECT
  USING (auth.uid() IS NOT NULL);

CREATE POLICY "Admins can manage files"
  ON public.challenge_files FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- Unlocked Hints Table
-- ============================================
CREATE TABLE public.unlocked_hints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  hint_id UUID REFERENCES public.challenge_hints(id) ON DELETE CASCADE NOT NULL,
  unlocked_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (user_id, hint_id)
);

ALTER TABLE public.unlocked_hints ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their unlocked hints"
  ON public.unlocked_hints FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can unlock hints"
  ON public.unlocked_hints FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Submissions Table
-- ============================================
CREATE TABLE public.submissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE NOT NULL,
  submitted_flag TEXT NOT NULL,
  is_correct BOOLEAN DEFAULT false,
  ip_address TEXT,
  submitted_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.submissions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own submissions"
  ON public.submissions FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can submit flags"
  ON public.submissions FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all submissions"
  ON public.submissions FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- Solves Table
-- ============================================
CREATE TABLE public.solves (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  team_id UUID REFERENCES public.teams(id) ON DELETE SET NULL,
  challenge_id UUID REFERENCES public.challenges(id) ON DELETE CASCADE NOT NULL,
  points_awarded INTEGER NOT NULL,
  is_first_blood BOOLEAN DEFAULT false,
  solved_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  UNIQUE (user_id, challenge_id)
);

ALTER TABLE public.solves ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Solves are viewable by everyone"
  ON public.solves FOR SELECT
  USING (true);

CREATE POLICY "System can insert solves"
  ON public.solves FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- ============================================
-- Competition Settings Table
-- ============================================
CREATE TABLE public.competition_settings (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT DEFAULT 'AmablexCTF' NOT NULL,
  description TEXT,
  start_time TIMESTAMPTZ,
  end_time TIMESTAMPTZ,
  registration_open BOOLEAN DEFAULT true,
  freeze_scoreboard BOOLEAN DEFAULT false,
  freeze_time TIMESTAMPTZ,
  team_mode BOOLEAN DEFAULT true,
  individual_mode BOOLEAN DEFAULT true,
  max_team_size INTEGER DEFAULT 5,
  first_blood_bonus INTEGER DEFAULT 50,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL,
  updated_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Insert default settings
INSERT INTO public.competition_settings (name, description) VALUES 
  ('AmablexCTF', 'Capture The Flag Competition Platform');

ALTER TABLE public.competition_settings ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Settings are viewable by everyone"
  ON public.competition_settings FOR SELECT
  USING (true);

CREATE POLICY "Admins can update settings"
  ON public.competition_settings FOR UPDATE
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- Announcements Table
-- ============================================
CREATE TABLE public.announcements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  is_pinned BOOLEAN DEFAULT false,
  author_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Announcements are viewable by everyone"
  ON public.announcements FOR SELECT
  USING (true);

CREATE POLICY "Admins can manage announcements"
  ON public.announcements FOR ALL
  USING (public.has_role(auth.uid(), 'admin'));

-- ============================================
-- Team Chat Messages Table
-- ============================================
CREATE TABLE public.team_chat_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  team_id UUID REFERENCES public.teams(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

ALTER TABLE public.team_chat_messages ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Team members can view chat"
  ON public.team_chat_messages FOR SELECT
  USING (
    team_id IN (
      SELECT tm.team_id FROM public.team_members tm WHERE tm.user_id = auth.uid()
    )
  );

CREATE POLICY "Team members can send messages"
  ON public.team_chat_messages FOR INSERT
  WITH CHECK (
    auth.uid() = user_id AND
    team_id IN (
      SELECT tm.team_id FROM public.team_members tm WHERE tm.user_id = auth.uid()
    )
  );

-- ============================================
-- Functions & Triggers
-- ============================================

-- Function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Apply timestamp triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_teams_updated_at
  BEFORE UPDATE ON public.teams
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_challenges_updated_at
  BEFORE UPDATE ON public.challenges
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_competition_settings_updated_at
  BEFORE UPDATE ON public.competition_settings
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
DECLARE
  username_val TEXT;
BEGIN
  -- Generate username from email or metadata
  username_val := COALESCE(
    NEW.raw_user_meta_data ->> 'username',
    SPLIT_PART(NEW.email, '@', 1) || '_' || SUBSTRING(NEW.id::TEXT, 1, 4)
  );
  
  -- Insert profile
  INSERT INTO public.profiles (id, username, display_name, avatar_url)
  VALUES (
    NEW.id, 
    username_val,
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', username_val),
    NEW.raw_user_meta_data ->> 'avatar_url'
  );
  
  -- Assign default user role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (NEW.id, 'user');
  
  RETURN NEW;
END;
$$;

-- Trigger for new user
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to calculate dynamic points
CREATE OR REPLACE FUNCTION public.calculate_challenge_points(
  p_max_points INTEGER,
  p_min_points INTEGER,
  p_decay_rate INTEGER,
  p_solve_count INTEGER
)
RETURNS INTEGER
LANGUAGE plpgsql
AS $$
BEGIN
  RETURN GREATEST(
    p_min_points,
    p_max_points - (p_decay_rate * p_solve_count)
  );
END;
$$;

-- Function to update challenge points after solve
CREATE OR REPLACE FUNCTION public.update_challenge_after_solve()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Update solve count and current points
  UPDATE public.challenges
  SET 
    solve_count = solve_count + 1,
    current_points = public.calculate_challenge_points(
      max_points, min_points, decay_rate, solve_count + 1
    )
  WHERE id = NEW.challenge_id;
  
  -- Update user score
  UPDATE public.profiles
  SET score = score + NEW.points_awarded
  WHERE id = NEW.user_id;
  
  -- Update team score if applicable
  IF NEW.team_id IS NOT NULL THEN
    UPDATE public.teams
    SET score = score + NEW.points_awarded
    WHERE id = NEW.team_id;
  END IF;
  
  RETURN NEW;
END;
$$;

CREATE TRIGGER on_solve_created
  AFTER INSERT ON public.solves
  FOR EACH ROW EXECUTE FUNCTION public.update_challenge_after_solve();

-- Enable realtime for key tables
ALTER PUBLICATION supabase_realtime ADD TABLE public.solves;
ALTER PUBLICATION supabase_realtime ADD TABLE public.announcements;
ALTER PUBLICATION supabase_realtime ADD TABLE public.team_chat_messages;

-- ============================================
-- Storage Buckets
-- ============================================
INSERT INTO storage.buckets (id, name, public) VALUES 
  ('challenge-files', 'challenge-files', true),
  ('avatars', 'avatars', true);

-- Storage policies for challenge files
CREATE POLICY "Challenge files are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'challenge-files');

CREATE POLICY "Admins can upload challenge files"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'challenge-files' 
    AND public.has_role(auth.uid(), 'admin')
  );

CREATE POLICY "Admins can delete challenge files"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'challenge-files'
    AND public.has_role(auth.uid(), 'admin')
  );

-- Storage policies for avatars
CREATE POLICY "Avatar images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'avatars');

CREATE POLICY "Users can upload their own avatar"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'avatars' 
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can update their own avatar"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );

CREATE POLICY "Users can delete their own avatar"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'avatars'
    AND auth.uid()::text = (storage.foldername(name))[1]
  );