-- Add avatar storage columns to profiles
ALTER TABLE public.profiles
  ADD COLUMN IF NOT EXISTS avatar_bytes bytea,
  ADD COLUMN IF NOT EXISTS avatar_mime text;

