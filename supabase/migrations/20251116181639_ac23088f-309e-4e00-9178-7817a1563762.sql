-- Create profiles table for user information
CREATE TABLE public.profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email text NOT NULL,
  full_name text NOT NULL,
  former_sport text NOT NULL,
  career_end_reason text NOT NULL,
  career_end_date date NOT NULL,
  created_at timestamptz DEFAULT now() NOT NULL
);

-- Enable RLS on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Profiles policies: users can read and update their own profile
CREATE POLICY "Users can view own profile"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- Create conversations table for AI chat history
CREATE TABLE public.conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  message text NOT NULL,
  response text NOT NULL,
  sentiment_score decimal DEFAULT 0,
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX idx_conversations_user_created ON public.conversations(user_id, created_at DESC);

ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own conversations"
  ON public.conversations FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own conversations"
  ON public.conversations FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create journal_entries table
CREATE TABLE public.journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  entry_date date NOT NULL,
  mood_rating integer NOT NULL CHECK (mood_rating >= 1 AND mood_rating <= 10),
  gratitude_1 text NOT NULL,
  gratitude_2 text NOT NULL,
  gratitude_3 text NOT NULL,
  challenge_faced text NOT NULL,
  small_win text NOT NULL,
  tomorrow_goal text NOT NULL,
  private_notes text,
  created_at timestamptz DEFAULT now() NOT NULL,
  UNIQUE(user_id, entry_date)
);

CREATE INDEX idx_journal_user_date ON public.journal_entries(user_id, entry_date DESC);

ALTER TABLE public.journal_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own journal entries"
  ON public.journal_entries FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create success_stories table
CREATE TABLE public.success_stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  athlete_name text NOT NULL,
  former_sport text NOT NULL,
  career_end_year integer NOT NULL,
  new_career_path text NOT NULL,
  story_summary text NOT NULL,
  key_lesson text NOT NULL,
  is_featured boolean DEFAULT false,
  created_at timestamptz DEFAULT now() NOT NULL
);

ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;

-- Success stories are readable by all authenticated users
CREATE POLICY "Anyone can view success stories"
  ON public.success_stories FOR SELECT
  TO authenticated
  USING (true);

-- Seed success stories with the 5 provided examples
INSERT INTO public.success_stories (athlete_name, former_sport, career_end_year, new_career_path, story_summary, key_lesson, is_featured) VALUES
  ('Michael Carter', 'Rugby', 2019, 'Sports Psychology Coach', 'After a career-ending knee injury, Michael used his understanding of athletic mindset to become a certified sports psychologist. He now helps young athletes navigate pressure and mental health challenges.', 'Your experience as an athlete gives you unique empathy that others cannot replicate.', true),
  ('Sarah Mitchell', 'Football', 2020, 'Tech Startup Founder', 'Sarah channeled her competitive drive into learning to code. Within 2 years, she founded a fitness tech startup that has raised $2M in funding.', 'The discipline that made you great in sports translates directly to entrepreneurship.', true),
  ('James Thompson', 'Basketball', 2018, 'Physical Therapist', 'James turned his injury experience into purpose by becoming a PT specializing in athletic recovery. He helps others avoid the fate that ended his career.', 'Your pain can become someone else''s gain when you choose to help others.', true),
  ('Emily Rodriguez', 'Soccer', 2021, 'Sports Broadcaster', 'Emily discovered her passion for storytelling while recovering from injury. She now covers professional soccer for a major network.', 'The game can still be part of your life—just from a different angle.', false),
  ('David Okoye', 'Rugby', 2020, 'Strength & Conditioning Coach', 'David used his deep knowledge of training to transition into coaching professional rugby teams in strength and conditioning.', 'Your years of training weren''t wasted—they were preparation for teaching others.', false);

-- Create career_explorations table
CREATE TABLE public.career_explorations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  career_field text NOT NULL,
  interest_level integer CHECK (interest_level >= 1 AND interest_level <= 5),
  notes text,
  status text DEFAULT 'exploring' CHECK (status IN ('exploring', 'pursuing', 'paused', 'completed')),
  created_at timestamptz DEFAULT now() NOT NULL
);

CREATE INDEX idx_career_explorations_user ON public.career_explorations(user_id, created_at DESC);

ALTER TABLE public.career_explorations ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own career explorations"
  ON public.career_explorations FOR ALL
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create function to handle new user profile creation
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, email, full_name, former_sport, career_end_reason, career_end_date)
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'full_name', ''),
    COALESCE(new.raw_user_meta_data->>'former_sport', ''),
    COALESCE(new.raw_user_meta_data->>'career_end_reason', ''),
    COALESCE((new.raw_user_meta_data->>'career_end_date')::date, CURRENT_DATE)
  );
  RETURN new;
END;
$$;

-- Trigger to create profile on user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();