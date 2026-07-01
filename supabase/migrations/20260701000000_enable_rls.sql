-- Enable Row Level Security for the tables used by FamilyVital
ALTER TABLE IF EXISTS public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.family_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.health_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS public.reminders ENABLE ROW LEVEL SECURITY;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'users'
      AND policyname = 'allow_access_to_users'
  ) THEN
    CREATE POLICY allow_access_to_users
      ON public.users
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'family_members'
      AND policyname = 'allow_access_to_family_members'
  ) THEN
    CREATE POLICY allow_access_to_family_members
      ON public.family_members
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'health_metrics'
      AND policyname = 'allow_access_to_health_metrics'
  ) THEN
    CREATE POLICY allow_access_to_health_metrics
      ON public.health_metrics
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1
    FROM pg_policies
    WHERE schemaname = 'public'
      AND tablename = 'reminders'
      AND policyname = 'allow_access_to_reminders'
  ) THEN
    CREATE POLICY allow_access_to_reminders
      ON public.reminders
      FOR ALL
      USING (true)
      WITH CHECK (true);
  END IF;
END $$;
