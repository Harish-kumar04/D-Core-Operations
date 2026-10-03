-- ============================================================
-- D-CORE OPERATIONS — MIGRATION 001: SECURITY ENHANCEMENT
-- Copy and run this script once in the Supabase SQL Editor
-- ============================================================

-- 1. DROP PLAIN-TEXT USERS TABLE (Authentication managed via Supabase Auth)
DROP TABLE IF EXISTS public.users CASCADE;

-- 2. DROP INSECURE PUBLIC ANON RLS POLICIES IF THEY EXIST
DROP POLICY IF EXISTS "Allow anon read users" ON public.users;

DROP POLICY IF EXISTS "Allow anon read projects" ON public.projects;
DROP POLICY IF EXISTS "Allow anon insert projects" ON public.projects;
DROP POLICY IF EXISTS "Allow anon update projects" ON public.projects;
DROP POLICY IF EXISTS "Allow anon delete projects" ON public.projects;

DROP POLICY IF EXISTS "Allow anon read tasks" ON public.tasks;
DROP POLICY IF EXISTS "Allow anon insert tasks" ON public.tasks;
DROP POLICY IF EXISTS "Allow anon update tasks" ON public.tasks;
DROP POLICY IF EXISTS "Allow anon delete tasks" ON public.tasks;

DROP POLICY IF EXISTS "Allow anon read ideas" ON public.ideas;
DROP POLICY IF EXISTS "Allow anon insert ideas" ON public.ideas;
DROP POLICY IF EXISTS "Allow anon update ideas" ON public.ideas;
DROP POLICY IF EXISTS "Allow anon delete ideas" ON public.ideas;

DROP POLICY IF EXISTS "Allow anon read team" ON public.team;
DROP POLICY IF EXISTS "Allow anon insert team" ON public.team;
DROP POLICY IF EXISTS "Allow anon update team" ON public.team;
DROP POLICY IF EXISTS "Allow anon delete team" ON public.team;

DROP POLICY IF EXISTS "Allow anon read history" ON public.history;
DROP POLICY IF EXISTS "Allow anon insert history" ON public.history;

-- 3. ENSURE ROW LEVEL SECURITY IS ENABLED FOR ALL TABLES
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.history ENABLE ROW LEVEL SECURITY;

-- 4. CREATE STRICT POLICIES FOR AUTHENTICATED USERS ONLY

-- Projects Policies (AUTHENTICATED ONLY: SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Allow authenticated read projects"
  ON public.projects FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert projects"
  ON public.projects FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update projects"
  ON public.projects FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated delete projects"
  ON public.projects FOR DELETE TO authenticated USING (true);

-- Tasks Policies (AUTHENTICATED ONLY: SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Allow authenticated read tasks"
  ON public.tasks FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert tasks"
  ON public.tasks FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update tasks"
  ON public.tasks FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated delete tasks"
  ON public.tasks FOR DELETE TO authenticated USING (true);

-- Ideas Policies (AUTHENTICATED ONLY: SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Allow authenticated read ideas"
  ON public.ideas FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert ideas"
  ON public.ideas FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update ideas"
  ON public.ideas FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated delete ideas"
  ON public.ideas FOR DELETE TO authenticated USING (true);

-- Team Policies (AUTHENTICATED ONLY: SELECT, INSERT, UPDATE, DELETE)
CREATE POLICY "Allow authenticated read team"
  ON public.team FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert team"
  ON public.team FOR INSERT TO authenticated WITH CHECK (true);

CREATE POLICY "Allow authenticated update team"
  ON public.team FOR UPDATE TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow authenticated delete team"
  ON public.team FOR DELETE TO authenticated USING (true);

-- History Policies (AUTHENTICATED ONLY: SELECT & INSERT ONLY, NO UPDATE, NO DELETE)
CREATE POLICY "Allow authenticated read history"
  ON public.history FOR SELECT TO authenticated USING (true);

CREATE POLICY "Allow authenticated insert history"
  ON public.history FOR INSERT TO authenticated WITH CHECK (true);

-- 5. ADD CREATED_BY_USER_ID TO HISTORY AUDIT TABLE
ALTER TABLE public.history
  ADD COLUMN IF NOT EXISTS created_by_user_id UUID DEFAULT auth.uid();

-- 6. AUTOMATIC UPDATED_AT TIMESTAMP TRIGGER FUNCTION
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Attach trigger to projects table
DROP TRIGGER IF EXISTS trigger_set_updated_at_projects ON public.projects;
CREATE TRIGGER trigger_set_updated_at_projects
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- Attach trigger to tasks table
DROP TRIGGER IF EXISTS trigger_set_updated_at_tasks ON public.tasks;
CREATE TRIGGER trigger_set_updated_at_tasks
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();
