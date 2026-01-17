-- Update public form policies to require minimum data validation
-- These are intentionally public forms but should require email

-- Fix appointments policy
DROP POLICY IF EXISTS "Anyone can create appointments" ON public.appointments;
CREATE POLICY "Anyone can create appointments with required fields"
ON public.appointments
FOR INSERT
TO anon, authenticated
WITH CHECK (email IS NOT NULL AND email != '' AND name IS NOT NULL AND name != '');

-- Fix content_requests policy
DROP POLICY IF EXISTS "Anyone can create content requests" ON public.content_requests;
CREATE POLICY "Anyone can create content requests with required fields"
ON public.content_requests
FOR INSERT
TO anon, authenticated
WITH CHECK (email IS NOT NULL AND email != '' AND full_name IS NOT NULL AND full_name != '');

-- Fix leads policy
DROP POLICY IF EXISTS "Anyone can create leads" ON public.leads;
CREATE POLICY "Anyone can create leads with required fields"
ON public.leads
FOR INSERT
TO anon, authenticated
WITH CHECK (email IS NOT NULL AND email != '' AND name IS NOT NULL AND name != '');

-- Fix email_messages policy
DROP POLICY IF EXISTS "Anyone can send emails" ON public.email_messages;
CREATE POLICY "Anyone can send emails with required fields"
ON public.email_messages
FOR INSERT
TO anon, authenticated
WITH CHECK (email IS NOT NULL AND email != '' AND name IS NOT NULL AND name != '' AND message IS NOT NULL AND message != '');