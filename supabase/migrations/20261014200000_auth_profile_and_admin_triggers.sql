-- The original dump only covered the public schema, so the trigger that creates
-- a profile for each new account was missing outside Lovable Cloud.
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- RLS checks use user_roles (has_role), the admin page uses profiles.is_admin:
-- give the NOVA account both as soon as its profile exists.
CREATE OR REPLACE FUNCTION public.grant_nova_admin_role()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
BEGIN
  IF NEW.email = 'info@solutionsnova.es' THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.user_id, 'admin'::public.app_role)
    ON CONFLICT (user_id, role) DO NOTHING;
  END IF;
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS grant_nova_admin_role ON public.profiles;
CREATE TRIGGER grant_nova_admin_role
  AFTER INSERT OR UPDATE OF email ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.grant_nova_admin_role();
