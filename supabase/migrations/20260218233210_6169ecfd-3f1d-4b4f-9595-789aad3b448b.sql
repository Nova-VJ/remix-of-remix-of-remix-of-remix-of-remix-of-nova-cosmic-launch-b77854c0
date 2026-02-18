
-- Add AI classification fields to sara_anonymous_conversations
ALTER TABLE public.sara_anonymous_conversations
  ADD COLUMN IF NOT EXISTS ai_title TEXT,
  ADD COLUMN IF NOT EXISTS ai_service TEXT,
  ADD COLUMN IF NOT EXISTS ai_stage TEXT,
  ADD COLUMN IF NOT EXISTS ai_urgency TEXT,
  ADD COLUMN IF NOT EXISTS ai_quality TEXT,
  ADD COLUMN IF NOT EXISTS ai_score INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ai_summary TEXT,
  ADD COLUMN IF NOT EXISTS ai_next_action TEXT,
  ADD COLUMN IF NOT EXISTS lead_status TEXT DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS contact_name TEXT,
  ADD COLUMN IF NOT EXISTS contact_email TEXT,
  ADD COLUMN IF NOT EXISTS contact_phone TEXT,
  ADD COLUMN IF NOT EXISTS contact_city TEXT,
  ADD COLUMN IF NOT EXISTS contact_website TEXT,
  ADD COLUMN IF NOT EXISTS message_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS classified_at TIMESTAMP WITH TIME ZONE;

-- Add AI classification fields to conversations (registered users)
ALTER TABLE public.conversations
  ADD COLUMN IF NOT EXISTS ai_title TEXT,
  ADD COLUMN IF NOT EXISTS ai_service TEXT,
  ADD COLUMN IF NOT EXISTS ai_stage TEXT,
  ADD COLUMN IF NOT EXISTS ai_urgency TEXT,
  ADD COLUMN IF NOT EXISTS ai_quality TEXT,
  ADD COLUMN IF NOT EXISTS ai_score INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS ai_summary TEXT,
  ADD COLUMN IF NOT EXISTS ai_next_action TEXT,
  ADD COLUMN IF NOT EXISTS lead_status TEXT DEFAULT 'new',
  ADD COLUMN IF NOT EXISTS message_count INTEGER DEFAULT 0,
  ADD COLUMN IF NOT EXISTS classified_at TIMESTAMP WITH TIME ZONE;

-- Create admin notifications table for Sara alerts
CREATE TABLE IF NOT EXISTS public.admin_notifications (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  type TEXT NOT NULL DEFAULT 'sara_message',
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  data JSONB,
  read BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

ALTER TABLE public.admin_notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can manage admin notifications"
ON public.admin_notifications
FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true
))
WITH CHECK (EXISTS (
  SELECT 1 FROM profiles WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true
));

-- Allow edge functions (service role) to insert admin notifications
-- Service role bypasses RLS by default
