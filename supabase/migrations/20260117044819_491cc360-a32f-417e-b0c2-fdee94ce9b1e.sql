-- Fix critical security issues: Add SELECT policies to restrict access to sensitive data

-- 1. Appointments: Only admins can view
CREATE POLICY "Only admins can view appointments"
ON public.appointments
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- 2. Content requests: Only admins can view
CREATE POLICY "Only admins can view content requests"
ON public.content_requests
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- 3. Email messages: Only admins can view
CREATE POLICY "Only admins can view email messages"
ON public.email_messages
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- 4. Leads: Only admins can view
CREATE POLICY "Only admins can view leads"
ON public.leads
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- 5. Tickets: Users can view own tickets or admins can view all
DROP POLICY IF EXISTS "Users can view their own tickets or admins can view all" ON public.tickets;
CREATE POLICY "Users can view own tickets by email or admins"
ON public.tickets
FOR SELECT
TO authenticated
USING (
  email = (SELECT email FROM public.profiles WHERE profiles.user_id = auth.uid())
  OR EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.is_admin = true
  )
);

-- 6. Payments: Add admin access
CREATE POLICY "Admins can view all payments"
ON public.payments
FOR SELECT
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.profiles
    WHERE profiles.user_id = auth.uid()
    AND profiles.is_admin = true
  )
);