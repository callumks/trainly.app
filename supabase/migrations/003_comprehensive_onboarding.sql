-- Migration: Add comprehensive onboarding fields to profiles table
-- This migration adds all the new onboarding data fields to support the enhanced onboarding flow

-- Add new columns to profiles table
alter table public.profiles 
add column if not exists onboarding_completed boolean default false not null,
add column if not exists onboarding_data jsonb,
add column if not exists oauth_provider text,
add column if not exists sport_order text[],
add column if not exists current_injuries text,
add column if not exists past_injuries text[],
add column if not exists height_cm integer,
add column if not exists weight_kg integer,
add column if not exists age integer,
add column if not exists sex text check (sex in ('male', 'female', 'other')),
add column if not exists weekly_hours jsonb,
add column if not exists performance_metrics jsonb,
add column if not exists sync_historical_data boolean default false,
add column if not exists plan_type text check (plan_type in ('training', 'nutrition', 'combined')) default 'combined',
add column if not exists training_frequency jsonb,
add column if not exists training_structure text check (training_structure in ('structured', 'freeform')) default 'structured',
add column if not exists dietary_preferences text[],
add column if not exists allergies text[],
add column if not exists schedule_constraints text,
add column if not exists sleep_habits text,
add column if not exists baseline_fatigue jsonb,
add column if not exists hrv_ms integer,
add column if not exists resting_heart_rate integer,
add column if not exists interest_groups text[],
add column if not exists coach_connect boolean default false,
add column if not exists motivation_preferences text[],
add column if not exists feedback_style text check (feedback_style in ('data-driven', 'motivational', 'both')) default 'both',
add column if not exists injury_prevention_focus text[],
add column if not exists max_workout_duration integer default 90,
add column if not exists recovery_preferences text[];

-- Create indexes for new fields
create index if not exists profiles_onboarding_completed_idx on public.profiles(onboarding_completed);
create index if not exists profiles_oauth_provider_idx on public.profiles(oauth_provider);
create index if not exists profiles_coach_connect_idx on public.profiles(coach_connect);

-- Add comments for documentation
comment on column public.profiles.onboarding_completed is 'Whether the user has completed the comprehensive onboarding flow';
comment on column public.profiles.onboarding_data is 'Complete onboarding data as JSON for future reference';
comment on column public.profiles.oauth_provider is 'OAuth provider used for signup (strava, google, apple)';
comment on column public.profiles.sport_order is 'Ordered list of sports by priority';
comment on column public.profiles.current_injuries is 'Description of current injuries and recovery status';
comment on column public.profiles.past_injuries is 'Array of past injuries for safety considerations';
comment on column public.profiles.height_cm is 'Height in centimeters for personalized recommendations';
comment on column public.profiles.weight_kg is 'Weight in kilograms for personalized recommendations';
comment on column public.profiles.age is 'Age for personalized recommendations';
comment on column public.profiles.sex is 'Sex for personalized recommendations';
comment on column public.profiles.weekly_hours is 'Weekly training hours per sport as JSON';
comment on column public.profiles.performance_metrics is 'Performance metrics per sport as JSON';
comment on column public.profiles.sync_historical_data is 'Whether to sync historical data from external sources';
comment on column public.profiles.plan_type is 'Type of program (training, nutrition, combined)';
comment on column public.profiles.training_frequency is 'Training frequency per sport as JSON';
comment on column public.profiles.training_structure is 'Preferred training structure (structured, freeform)';
comment on column public.profiles.dietary_preferences is 'Dietary preferences and restrictions';
comment on column public.profiles.allergies is 'Food allergies and restrictions';
comment on column public.profiles.schedule_constraints is 'Daily schedule constraints and commitments';
comment on column public.profiles.sleep_habits is 'Sleep patterns and habits';
comment on column public.profiles.baseline_fatigue is 'Baseline fatigue assessment as JSON';
comment on column public.profiles.hrv_ms is 'Heart rate variability in milliseconds';
comment on column public.profiles.resting_heart_rate is 'Resting heart rate in bpm';
comment on column public.profiles.interest_groups is 'Community interest groups joined';
comment on column public.profiles.coach_connect is 'Whether user has coach connect enabled';
comment on column public.profiles.motivation_preferences is 'Preferred motivation styles';
comment on column public.profiles.feedback_style is 'Preferred feedback style';
comment on column public.profiles.injury_prevention_focus is 'Areas for extra injury prevention monitoring';
comment on column public.profiles.max_workout_duration is 'Maximum workout duration in minutes';
comment on column public.profiles.recovery_preferences is 'Preferred recovery activities';
