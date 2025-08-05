-- Enable required extensions
create extension if not exists "uuid-ossp";

-- Create custom types
create type subscription_status as enum ('free', 'active', 'canceled', 'past_due');
create type experience_level as enum ('beginner', 'intermediate', 'advanced');
create type plan_type as enum ('ai_generated', 'manual', 'template');
create type session_type as enum ('cardio', 'strength', 'recovery', 'mixed', 'skill');
create type session_status as enum ('planned', 'completed', 'skipped', 'modified');

-- Profiles table (extends auth.users)
create table public.profiles (
  id uuid references auth.users(id) on delete cascade primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  email text not null,
  full_name text,
  avatar_url text,
  strava_id text unique,
  strava_access_token text,
  strava_refresh_token text,
  subscription_status subscription_status default 'free'::subscription_status not null,
  subscription_id text,
  goals text[],
  sports text[],
  experience_level experience_level,
  weekly_volume integer,
  nutrition_enabled boolean default false not null
);

-- Training plans table
create table public.training_plans (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  name text not null,
  description text,
  start_date date not null,
  end_date date,
  is_active boolean default true not null,
  plan_type plan_type default 'ai_generated'::plan_type not null,
  metadata jsonb
);

-- Training sessions table
create table public.training_sessions (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  plan_id uuid references public.training_plans(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  date date not null,
  name text not null,
  description text,
  session_type session_type not null,
  duration_minutes integer,
  intensity integer check (intensity >= 1 and intensity <= 5) not null,
  status session_status default 'planned'::session_status not null,
  strava_activity_id text,
  notes text,
  metadata jsonb
);

-- Strava activities table
create table public.strava_activities (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  strava_id text not null unique,
  name text not null,
  type text not null,
  distance real,
  moving_time integer,
  elapsed_time integer,
  total_elevation_gain real,
  start_date timestamp with time zone not null,
  average_speed real,
  max_speed real,
  average_heartrate integer,
  max_heartrate integer,
  suffer_score integer,
  metadata jsonb
);

-- Create indexes for better performance
create index profiles_strava_id_idx on public.profiles(strava_id);
create index training_plans_user_id_idx on public.training_plans(user_id);
create index training_plans_active_idx on public.training_plans(user_id, is_active);
create index training_sessions_user_id_idx on public.training_sessions(user_id);
create index training_sessions_plan_id_idx on public.training_sessions(plan_id);
create index training_sessions_date_idx on public.training_sessions(user_id, date);
create index training_sessions_status_idx on public.training_sessions(user_id, status);
create index strava_activities_user_id_idx on public.strava_activities(user_id);
create index strava_activities_start_date_idx on public.strava_activities(user_id, start_date);
create index strava_activities_strava_id_idx on public.strava_activities(strava_id);

-- Set up Row Level Security (RLS)
alter table public.profiles enable row level security;
alter table public.training_plans enable row level security;
alter table public.training_sessions enable row level security;
alter table public.strava_activities enable row level security;

-- Create policies for profiles
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);

create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);

create policy "Users can insert own profile" on public.profiles
  for insert with check (auth.uid() = id);

-- Create policies for training plans
create policy "Users can view own training plans" on public.training_plans
  for select using (auth.uid() = user_id);

create policy "Users can insert own training plans" on public.training_plans
  for insert with check (auth.uid() = user_id);

create policy "Users can update own training plans" on public.training_plans
  for update using (auth.uid() = user_id);

create policy "Users can delete own training plans" on public.training_plans
  for delete using (auth.uid() = user_id);

-- Create policies for training sessions
create policy "Users can view own training sessions" on public.training_sessions
  for select using (auth.uid() = user_id);

create policy "Users can insert own training sessions" on public.training_sessions
  for insert with check (auth.uid() = user_id);

create policy "Users can update own training sessions" on public.training_sessions
  for update using (auth.uid() = user_id);

create policy "Users can delete own training sessions" on public.training_sessions
  for delete using (auth.uid() = user_id);

-- Create policies for strava activities
create policy "Users can view own strava activities" on public.strava_activities
  for select using (auth.uid() = user_id);

create policy "Users can insert own strava activities" on public.strava_activities
  for insert with check (auth.uid() = user_id);

create policy "Users can update own strava activities" on public.strava_activities
  for update using (auth.uid() = user_id);

create policy "Users can delete own strava activities" on public.strava_activities
  for delete using (auth.uid() = user_id);

-- Create functions for automatic profile creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (
    new.id,
    new.email,
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url'
  );
  return new;
end;
$$ language plpgsql security definer;

-- Create trigger for new user
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- Create function to update updated_at timestamp
create or replace function public.handle_updated_at()
returns trigger as $$
begin
  new.updated_at = timezone('utc'::text, now());
  return new;
end;
$$ language plpgsql;

-- Create triggers for updated_at
create trigger handle_updated_at before update on public.profiles
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.training_plans
  for each row execute procedure public.handle_updated_at();

create trigger handle_updated_at before update on public.training_sessions
  for each row execute procedure public.handle_updated_at(); 