-- Anti-spam for the public forms (contact/budget, appointments, tickets,
-- content requests): limits per connection and overall, plus a size cap.
-- The visitor IP comes from Cloudflare (cf-connecting-ip) and is stored only
-- as a salted hash. Admins and server-side inserts are not limited.

CREATE SCHEMA IF NOT EXISTS private;
REVOKE ALL ON SCHEMA private FROM anon, authenticated;

CREATE TABLE IF NOT EXISTS private.form_submissions (
  ip_hash text NOT NULL,
  form text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);
CREATE INDEX IF NOT EXISTS form_submissions_lookup
  ON private.form_submissions (form, ip_hash, created_at);
CREATE INDEX IF NOT EXISTS form_submissions_created
  ON private.form_submissions (created_at);

CREATE OR REPLACE FUNCTION public.enforce_form_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public', 'extensions'
AS $$
DECLARE
  headers json := nullif(current_setting('request.headers', true), '')::json;
  ip text;
  v_ip_hash text;
  per_hour int;
  per_day int;
  site_hour int;
BEGIN
  -- Server-side inserts (SQL editor, functions) and admins are not limited
  IF headers IS NULL OR public.has_role(auth.uid(), 'admin') THEN
    RETURN NEW;
  END IF;

  IF length(row_to_json(NEW)::text) > 20000 THEN
    RAISE EXCEPTION 'El envío es demasiado largo.' USING ERRCODE = 'check_violation';
  END IF;

  ip := coalesce(headers->>'cf-connecting-ip', split_part(headers->>'x-forwarded-for', ',', 1), 'unknown');
  v_ip_hash := encode(extensions.digest('nova-forms:' || ip, 'sha256'), 'hex');

  SELECT count(*) FILTER (WHERE created_at > now() - interval '1 hour'),
         count(*)
    INTO per_hour, per_day
    FROM private.form_submissions
   WHERE form = TG_TABLE_NAME AND ip_hash = v_ip_hash
     AND created_at > now() - interval '1 day';

  SELECT count(*) INTO site_hour
    FROM private.form_submissions
   WHERE form = TG_TABLE_NAME AND created_at > now() - interval '1 hour';

  IF per_hour >= 5 OR per_day >= 20 OR site_hour >= 100 THEN
    RAISE EXCEPTION 'Has enviado demasiados formularios. Inténtalo más tarde o escríbenos por WhatsApp.'
      USING ERRCODE = 'PT429';  -- PostgREST answers HTTP 429
  END IF;

  INSERT INTO private.form_submissions (ip_hash, form) VALUES (v_ip_hash, TG_TABLE_NAME);
  DELETE FROM private.form_submissions WHERE created_at < now() - interval '2 days';
  RETURN NEW;
END;
$$;

REVOKE ALL ON FUNCTION public.enforce_form_rate_limit() FROM anon, authenticated, public;

DO $$
DECLARE t text;
BEGIN
  FOREACH t IN ARRAY ARRAY['leads', 'appointments', 'tickets', 'content_requests'] LOOP
    EXECUTE format('DROP TRIGGER IF EXISTS form_rate_limit ON public.%I', t);
    EXECUTE format('CREATE TRIGGER form_rate_limit BEFORE INSERT ON public.%I
                    FOR EACH ROW EXECUTE FUNCTION public.enforce_form_rate_limit()', t);
  END LOOP;
END $$;
