-- Railway PostgreSQL Schema for Trainly
-- Simplified schema without Supabase-specific auth integration

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create custom types
CREATE TYPE subscription_status AS ENUM ('free', 'active', 'canceled', 'past_due');
CREATE TYPE experience_level AS ENUM ('beginner', 'intermediate', 'advanced');
CREATE TYPE plan_type AS ENUM ('ai_generated', 'manual', 'template');
CREATE TYPE session_type AS ENUM ('cardio', 'strength', 'recovery', 'mixed', 'skill');
CREATE TYPE session_status AS ENUM ('planned', 'completed', 'skipped', 'modified');

-- Users table (simplified auth)
CREATE TABLE public.users (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  email TEXT UNIQUE NOT NULL,
  password_hash TEXT NOT NULL,
  email_verified BOOLEAN DEFAULT false NOT NULL
);

-- Profiles table (extends users)
CREATE TABLE public.profiles (
  id UUID REFERENCES public.users(id) ON DELETE CASCADE PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  strava_id TEXT UNIQUE,
  strava_access_token TEXT,
  strava_refresh_token TEXT,
  google_access_token TEXT,
  google_refresh_token TEXT,
  calendar_sync_enabled BOOLEAN DEFAULT false NOT NULL,
  sheets_sync_enabled BOOLEAN DEFAULT false NOT NULL,
  google_calendar_id TEXT,
  google_sheet_id TEXT,
  subscription_status subscription_status DEFAULT 'free'::subscription_status NOT NULL,
  subscription_id TEXT,
  goals TEXT[],
  sports TEXT[],
  experience_level experience_level,
  weekly_volume INTEGER,
  nutrition_enabled BOOLEAN DEFAULT false NOT NULL
);

-- Training plans table
CREATE TABLE public.training_plans (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  start_date DATE NOT NULL,
  end_date DATE,
  is_active BOOLEAN DEFAULT true NOT NULL,
  plan_type plan_type DEFAULT 'ai_generated'::plan_type NOT NULL,
  metadata JSONB,
  ai_generated_insights JSONB
);

-- Training sessions table
CREATE TABLE public.training_sessions (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  plan_id UUID REFERENCES public.training_plans(id) ON DELETE CASCADE NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  date DATE NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  session_type session_type NOT NULL,
  duration_minutes INTEGER,
  intensity INTEGER CHECK (intensity >= 1 AND intensity <= 5) NOT NULL,
  status session_status DEFAULT 'planned'::session_status NOT NULL,
  strava_activity_id TEXT,
  notes TEXT,
  metadata JSONB,
  ai_recommendations JSONB
);

-- Strava activities table
CREATE TABLE public.strava_activities (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  strava_id TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  distance REAL,
  moving_time INTEGER,
  elapsed_time INTEGER,
  total_elevation_gain REAL,
  start_date TIMESTAMP WITH TIME ZONE NOT NULL,
  average_speed REAL,
  max_speed REAL,
  average_heartrate INTEGER,
  max_heartrate INTEGER,
  suffer_score INTEGER,
  metadata JSONB
);

-- Create indexes for better performance
CREATE INDEX profiles_strava_id_idx ON public.profiles(strava_id);
CREATE INDEX profiles_email_idx ON public.profiles(email);
CREATE INDEX training_plans_user_id_idx ON public.training_plans(user_id);
CREATE INDEX training_plans_active_idx ON public.training_plans(user_id, is_active);
CREATE INDEX training_sessions_user_id_idx ON public.training_sessions(user_id);
CREATE INDEX training_sessions_plan_id_idx ON public.training_sessions(plan_id);
CREATE INDEX training_sessions_date_idx ON public.training_sessions(user_id, date);
CREATE INDEX training_sessions_status_idx ON public.training_sessions(user_id, status);
CREATE INDEX strava_activities_user_id_idx ON public.strava_activities(user_id);
CREATE INDEX strava_activities_start_date_idx ON public.strava_activities(user_id, start_date);
CREATE INDEX strava_activities_strava_id_idx ON public.strava_activities(strava_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for updated_at
CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.training_plans
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

CREATE TRIGGER handle_updated_at BEFORE UPDATE ON public.training_sessions
  FOR EACH ROW EXECUTE PROCEDURE public.handle_updated_at();

-- Insert a test user for development
INSERT INTO public.users (id, email, password_hash, email_verified) 
VALUES (
  '00000000-0000-0000-0000-000000000001'::UUID,
  'test@trainly.app',
  'placeholder_hash', -- You'll need to hash this properly in your app
  true
);

INSERT INTO public.profiles (
  id, 
  email, 
  full_name,
  goals,
  sports,
  experience_level,
  weekly_volume
) VALUES (
  '00000000-0000-0000-0000-000000000001'::UUID,
  'test@trainly.app',
  'Test User',
  ARRAY['endurance', 'performance']::TEXT[],
  ARRAY['running', 'cycling']::TEXT[],
  'intermediate'::experience_level,
  5
);

-- Display success message
DO $$
BEGIN
  RAISE NOTICE 'Trainly database schema created successfully!';
  RAISE NOTICE 'Tables created: users, profiles, training_plans, training_sessions, strava_activities';
  RAISE NOTICE 'Test user created with email: test@trainly.app';
END
$$;