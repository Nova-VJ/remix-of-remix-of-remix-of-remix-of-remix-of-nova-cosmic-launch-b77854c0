-- Fix overly permissive RLS policies for sara_anonymous tables
-- These tables should only be writable by service role (edge function)

-- Drop the overly permissive policies
DROP POLICY IF EXISTS "Service role can insert anonymous conversations" ON public.sara_anonymous_conversations;
DROP POLICY IF EXISTS "Service role can insert anonymous messages" ON public.sara_anonymous_messages;

-- Create proper policies that deny public INSERT (service role bypasses RLS anyway)
-- Only allow SELECT for admins to review conversations
CREATE POLICY "Only admins can view anonymous conversations"
ON public.sara_anonymous_conversations
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.is_admin = true
  )
);

CREATE POLICY "Only admins can view anonymous messages"
ON public.sara_anonymous_messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- Fix tickets policy - should require email or be authenticated
DROP POLICY IF EXISTS "Users can create tickets" ON public.tickets;

CREATE POLICY "Authenticated users can create tickets"
ON public.tickets
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Anyone can create tickets with email"
ON public.tickets
FOR INSERT
TO anon
WITH CHECK (email IS NOT NULL AND email != '');