-- Create budgets table for admin to create and send budgets to clients
CREATE TABLE public.budgets (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  admin_id UUID,
  client_email TEXT NOT NULL,
  client_name TEXT,
  client_user_id UUID,
  services JSONB NOT NULL DEFAULT '[]'::jsonb,
  total_amount NUMERIC NOT NULL,
  notes TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  approved_at TIMESTAMP WITH TIME ZONE,
  paid_at TIMESTAMP WITH TIME ZONE,
  payment_id UUID
);

-- Create success_stories table for Casos de éxito management
CREATE TABLE public.success_stories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  content TEXT,
  image_url TEXT,
  featured BOOLEAN DEFAULT false,
  published BOOLEAN DEFAULT true,
  slug TEXT UNIQUE,
  author TEXT DEFAULT 'Nova Marketing Solutions'
);

-- Enable RLS
ALTER TABLE public.budgets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.success_stories ENABLE ROW LEVEL SECURITY;

-- RLS policies for budgets
CREATE POLICY "Admins can manage budgets"
ON public.budgets
FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true
));

CREATE POLICY "Users can view their own budgets"
ON public.budgets
FOR SELECT
USING (client_user_id = auth.uid() OR client_email IN (
  SELECT email FROM profiles WHERE user_id = auth.uid()
));

CREATE POLICY "Users can update their own budgets"
ON public.budgets
FOR UPDATE
USING (client_user_id = auth.uid() OR client_email IN (
  SELECT email FROM profiles WHERE user_id = auth.uid()
));

-- RLS policies for success_stories (public read, admin write)
CREATE POLICY "Anyone can view published success stories"
ON public.success_stories
FOR SELECT
USING (published = true);

CREATE POLICY "Admins can manage success stories"
ON public.success_stories
FOR ALL
USING (EXISTS (
  SELECT 1 FROM profiles
  WHERE profiles.user_id = auth.uid() AND profiles.is_admin = true
));

-- Add trigger for updated_at
CREATE TRIGGER update_budgets_updated_at
BEFORE UPDATE ON public.budgets
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_success_stories_updated_at
BEFORE UPDATE ON public.success_stories
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();