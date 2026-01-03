-- Set info@solutionsnova.es as admin
UPDATE public.profiles
SET is_admin = true
WHERE email = 'info@solutionsnova.es';

-- Also set via trigger for new users with this email
CREATE OR REPLACE FUNCTION public.set_admin_for_nova()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  IF NEW.email = 'info@solutionsnova.es' THEN
    NEW.is_admin := true;
  END IF;
  RETURN NEW;
END;
$$;

CREATE TRIGGER set_nova_admin
  BEFORE INSERT OR UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_admin_for_nova();