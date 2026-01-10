-- Create content_requests table for content creation service
CREATE TABLE public.content_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  full_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  business_name TEXT,
  platforms JSONB DEFAULT '[]'::jsonb,
  goal TEXT,
  service_type TEXT,
  style JSONB DEFAULT '[]'::jsonb,
  details TEXT,
  links TEXT,
  budget TEXT,
  status TEXT DEFAULT 'Nuevo',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.content_requests ENABLE ROW LEVEL SECURITY;

-- Users can view their own requests
CREATE POLICY "Users can view own content requests"
ON public.content_requests
FOR SELECT
USING (auth.uid() = user_id);

-- Anyone can insert content requests (even without auth for lead gen)
CREATE POLICY "Anyone can create content requests"
ON public.content_requests
FOR INSERT
WITH CHECK (true);

-- Users can update their own requests
CREATE POLICY "Users can update own content requests"
ON public.content_requests
FOR UPDATE
USING (auth.uid() = user_id);

-- Add current_stage column to projects table for project flow tracking
ALTER TABLE public.projects 
ADD COLUMN IF NOT EXISTS current_stage TEXT DEFAULT 'inactive';

-- Add trigger to update updated_at
CREATE TRIGGER update_content_requests_updated_at
BEFORE UPDATE ON public.content_requests
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();