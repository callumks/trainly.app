-- Add Google integration fields to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS google_access_token TEXT,
ADD COLUMN IF NOT EXISTS google_refresh_token TEXT,
ADD COLUMN IF NOT EXISTS calendar_sync_enabled BOOLEAN DEFAULT false NOT NULL,
ADD COLUMN IF NOT EXISTS sheets_sync_enabled BOOLEAN DEFAULT false NOT NULL,
ADD COLUMN IF NOT EXISTS google_calendar_id TEXT,
ADD COLUMN IF NOT EXISTS google_sheet_id TEXT;

-- Add AI coaching metadata to training plans
ALTER TABLE public.training_plans 
ADD COLUMN IF NOT EXISTS ai_generated_insights JSONB;

-- Add AI recommendations to training sessions
ALTER TABLE public.training_sessions 
ADD COLUMN IF NOT EXISTS ai_recommendations JSONB;

-- Create index for Google tokens for performance
CREATE INDEX IF NOT EXISTS profiles_google_tokens_idx ON public.profiles(google_access_token) WHERE google_access_token IS NOT NULL;

-- Add comments for documentation
COMMENT ON COLUMN public.profiles.google_access_token IS 'Google OAuth access token for Calendar/Sheets integration';
COMMENT ON COLUMN public.profiles.google_refresh_token IS 'Google OAuth refresh token';
COMMENT ON COLUMN public.profiles.calendar_sync_enabled IS 'Whether Google Calendar sync is enabled';
COMMENT ON COLUMN public.profiles.sheets_sync_enabled IS 'Whether Google Sheets sync is enabled';
COMMENT ON COLUMN public.profiles.google_calendar_id IS 'Google Calendar ID for training events';
COMMENT ON COLUMN public.profiles.google_sheet_id IS 'Google Sheet ID for data export';
COMMENT ON COLUMN public.training_plans.ai_generated_insights IS 'AI analysis and insights for the training plan';
COMMENT ON COLUMN public.training_sessions.ai_recommendations IS 'AI recommendations for this specific session';