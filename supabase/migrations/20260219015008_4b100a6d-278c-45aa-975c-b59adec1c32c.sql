
-- Fix overly permissive RLS policy on push_subscriptions
-- Drop the too-permissive policy and replace with service role only via edge functions
DROP POLICY IF EXISTS "Service role can manage push subscriptions" ON public.push_subscriptions;

-- The edge function will use the service role key to bypass RLS for anonymous subscriptions
-- Regular users manage their own subscriptions via the existing policy
