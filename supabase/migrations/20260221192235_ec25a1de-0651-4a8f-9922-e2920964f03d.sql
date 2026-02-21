-- Add referred_by_code column to profiles
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS referred_by_code text;