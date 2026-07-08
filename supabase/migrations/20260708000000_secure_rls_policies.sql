-- Replace broad RLS policies with ownership-based policies for authenticated users.

ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reminders ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  DROP POLICY IF EXISTS allow_access_to_users ON public.users;
  DROP POLICY IF EXISTS allow_access_to_family_members ON public.family_members;
  DROP POLICY IF EXISTS allow_access_to_health_metrics ON public.health_metrics;
  DROP POLICY IF EXISTS allow_access_to_reminders ON public.reminders;
  DROP POLICY IF EXISTS allow_users_access ON public.users;
  DROP POLICY IF EXISTS allow_family_members_access ON public.family_members;
  DROP POLICY IF EXISTS allow_health_metrics_access ON public.health_metrics;
  DROP POLICY IF EXISTS allow_reminders_access ON public.reminders;
END $$;

CREATE POLICY users_own_row
  ON public.users
  FOR ALL
  USING (
    auth.role() = 'authenticated'
    AND lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  )
  WITH CHECK (
    auth.role() = 'authenticated'
    AND lower(email) = lower(coalesce(auth.jwt() ->> 'email', ''))
  );

CREATE POLICY family_members_own_rows
  ON public.family_members
  FOR ALL
  USING (
    auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = family_members.user_id
        AND lower(u.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  )
  WITH CHECK (
    auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = family_members.user_id
        AND lower(u.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

CREATE POLICY reminders_own_rows
  ON public.reminders
  FOR ALL
  USING (
    auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = reminders.user_id
        AND lower(u.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  )
  WITH CHECK (
    auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1
      FROM public.users u
      WHERE u.id = reminders.user_id
        AND lower(u.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );

CREATE POLICY health_metrics_own_rows
  ON public.health_metrics
  FOR ALL
  USING (
    auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1
      FROM public.family_members fm
      JOIN public.users u ON u.id = fm.user_id
      WHERE fm.id = health_metrics.family_member_id
        AND lower(u.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  )
  WITH CHECK (
    auth.role() = 'authenticated'
    AND EXISTS (
      SELECT 1
      FROM public.family_members fm
      JOIN public.users u ON u.id = fm.user_id
      WHERE fm.id = health_metrics.family_member_id
        AND lower(u.email) = lower(coalesce(auth.jwt() ->> 'email', ''))
    )
  );
