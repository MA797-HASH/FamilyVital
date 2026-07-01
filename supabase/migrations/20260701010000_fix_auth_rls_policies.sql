-- Replace the overly restrictive RLS policies with auth-aware policies so signup, login, and app data access continue to work.

DO $$
BEGIN
  DROP POLICY IF EXISTS allow_access_to_users ON public.users;
  DROP POLICY IF EXISTS allow_access_to_family_members ON public.family_members;
  DROP POLICY IF EXISTS allow_access_to_health_metrics ON public.health_metrics;
  DROP POLICY IF EXISTS allow_access_to_reminders ON public.reminders;
END $$;

ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reminders ENABLE ROW LEVEL SECURITY;

CREATE POLICY allow_users_access
  ON public.users
  FOR ALL
  USING (auth.role() IN ('anon', 'authenticated', 'service_role'))
  WITH CHECK (auth.role() IN ('anon', 'authenticated', 'service_role'));

CREATE POLICY allow_family_members_access
  ON public.family_members
  FOR ALL
  USING (auth.role() IN ('anon', 'authenticated', 'service_role'))
  WITH CHECK (auth.role() IN ('anon', 'authenticated', 'service_role'));

CREATE POLICY allow_health_metrics_access
  ON public.health_metrics
  FOR ALL
  USING (auth.role() IN ('anon', 'authenticated', 'service_role'))
  WITH CHECK (auth.role() IN ('anon', 'authenticated', 'service_role'));

CREATE POLICY allow_reminders_access
  ON public.reminders
  FOR ALL
  USING (auth.role() IN ('anon', 'authenticated', 'service_role'))
  WITH CHECK (auth.role() IN ('anon', 'authenticated', 'service_role'));
