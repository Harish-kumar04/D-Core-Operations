-- ============================================================
-- D-CORE OPERATIONS — SUPABASE DATABASE CREATION & SEED SCRIPT
-- Copy and paste this script into Supabase SQL Editor & click Run
-- ============================================================

-- 1. PROJECTS TABLE
CREATE TABLE IF NOT EXISTS public.projects (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  url TEXT,
  description TEXT,
  status TEXT DEFAULT 'active',
  priority TEXT DEFAULT 'P1',
  progress INT DEFAULT 0,
  owner_id TEXT,
  category TEXT DEFAULT 'Digital Platform',
  start_date TEXT,
  target_date TEXT,
  notes JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. TASKS TABLE
CREATE TABLE IF NOT EXISTS public.tasks (
  id TEXT PRIMARY KEY,
  project_id TEXT REFERENCES public.projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'TO DO',
  priority TEXT DEFAULT 'P2',
  owner_id TEXT,
  due_date TEXT,
  target_date TEXT,
  progress INT DEFAULT 0,
  estimated_hours INT DEFAULT 16,
  tags JSONB DEFAULT '[]'::jsonb,
  type TEXT DEFAULT 'CURRENT_WORK',
  dependencies TEXT,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. FUTURE IDEAS TABLE
CREATE TABLE IF NOT EXISTS public.ideas (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT DEFAULT 'Innovation',
  status TEXT DEFAULT 'NEW',
  created_by TEXT,
  impact TEXT DEFAULT 'MEDIUM',
  complexity TEXT DEFAULT 'MEDIUM',
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. TEAM MEMBERS TABLE
CREATE TABLE IF NOT EXISTS public.team (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  role TEXT,
  department TEXT,
  email TEXT,
  avatar TEXT,
  skills JSONB DEFAULT '[]'::jsonb,
  active_projects INT DEFAULT 1,
  capacity INT DEFAULT 50
);

-- 5. ADMIN EDIT HISTORY AUDIT LOG TABLE
CREATE TABLE IF NOT EXISTS public.history (
  id TEXT PRIMARY KEY,
  admin_name TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  entity_name TEXT,
  details TEXT,
  created_by_user_id UUID DEFAULT auth.uid(),
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- AUTOMATIC UPDATED_AT TRIGGER FUNCTION
-- ============================================================
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_set_updated_at_projects ON public.projects;
CREATE TRIGGER trigger_set_updated_at_projects
  BEFORE UPDATE ON public.projects
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS trigger_set_updated_at_tasks ON public.tasks;
CREATE TRIGGER trigger_set_updated_at_tasks
  BEFORE UPDATE ON public.tasks
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

-- ============================================================
-- ENABLE STRICT ROW LEVEL SECURITY (AUTHENTICATED ONLY)
-- ============================================================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.history ENABLE ROW LEVEL SECURITY;

-- Projects Policies
CREATE POLICY "Allow authenticated read projects"
  ON public.projects FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert projects"
  ON public.projects FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update projects"
  ON public.projects FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated delete projects"
  ON public.projects FOR DELETE TO authenticated USING (true);

-- Tasks Policies
CREATE POLICY "Allow authenticated read tasks"
  ON public.tasks FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert tasks"
  ON public.tasks FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update tasks"
  ON public.tasks FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated delete tasks"
  ON public.tasks FOR DELETE TO authenticated USING (true);

-- Ideas Policies
CREATE POLICY "Allow authenticated read ideas"
  ON public.ideas FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert ideas"
  ON public.ideas FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update ideas"
  ON public.ideas FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated delete ideas"
  ON public.ideas FOR DELETE TO authenticated USING (true);

-- Team Policies
CREATE POLICY "Allow authenticated read team"
  ON public.team FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert team"
  ON public.team FOR INSERT TO authenticated WITH CHECK (true);
CREATE POLICY "Allow authenticated update team"
  ON public.team FOR UPDATE TO authenticated USING (true) WITH CHECK (true);
CREATE POLICY "Allow authenticated delete team"
  ON public.team FOR DELETE TO authenticated USING (true);

-- History Policies (SELECT & INSERT ONLY, NO UPDATE, NO DELETE)
CREATE POLICY "Allow authenticated read history"
  ON public.history FOR SELECT TO authenticated USING (true);
CREATE POLICY "Allow authenticated insert history"
  ON public.history FOR INSERT TO authenticated WITH CHECK (true);

-- ============================================================
-- INITIAL SEED DATA FOR PLATFORMS, TASKS, IDEAS & HISTORY
-- ============================================================

-- SEED PROJECTS TABLE
INSERT INTO public.projects (id, name, url, description, status, priority, progress, owner_id, category, start_date, target_date, notes) VALUES
('proj_1', 'Periyar.net', 'https://periyar.net/', 'Digital archive and educational repository platform for Periyar thought, historical literature, and public research.', 'active', 'P1', 78, 'team_1', 'Digital Archive', '2026-01-15', '2026-11-30', '["CDN edge caching implemented.", "OCR text extraction scheduled."]'::jsonb),
('proj_2', 'Makkalveeran.com', 'https://makkalveeran.com/', 'Community engagement platform and digital publication network for public outreach and announcements.', 'active', 'P1', 62, 'team_2', 'Web Platform', '2026-02-01', '2026-12-15', '["Mobile responsive redressing passed QA."]'::jsonb),
('proj_3', 'Kalaignar.org', 'https://kalaignar.org/', 'Official memorial & legacy portal showcasing historical contributions, digitized speeches, and interactive timeline.', 'active', 'P0', 85, 'team_3', 'Core Infrastructure', '2025-11-01', '2026-10-31', '["Primary server cluster hardware migration completed."]'::jsonb),
('proj_4', 'TVK Files', 'https://tvkfiles.org/', 'Centralized digital asset management, document storage, and media repository system for verified operational assets.', 'active', 'P2', 45, 'team_4', 'Data & Storage', '2026-03-10', '2027-01-20', '["S3 compatible storage tier setup finished."]'::jsonb)
ON CONFLICT (id) DO NOTHING;

-- SEED TASKS TABLE
INSERT INTO public.tasks (id, project_id, title, description, status, priority, owner_id, due_date, progress, estimated_hours, tags, type, notes) VALUES
('task_001', 'proj_3', 'Website Infrastructure & Failover Upgrade', 'Deploy dual-region redundant server instances and automated DNS failover for Kalaignar.org high traffic load.', 'IN PROGRESS', 'P0', 'team_3', '2026-09-28', 68, 32, '["Infrastructure", "High Priority", "Failover"]'::jsonb, 'CURRENT_WORK', 'Primary node synced. Edge proxies responding within 18ms.'),
('task_002', 'proj_1', 'Archival Document Indexing Engine', 'Optimize elastic search queries for historical document search on Periyar.net.', 'IN PROGRESS', 'P1', 'team_1', '2026-10-05', 55, 24, '["Search", "Performance", "ElasticSearch"]'::jsonb, 'CURRENT_WORK', 'Query latency reduced by 40% in initial benchmark tests.'),
('task_003', 'proj_2', 'Mobile Navigation & Touch Interface Audit', 'Refactor navigation UI for Makkalveeran.com to ensure seamless touch interactions on mobile devices.', 'REVIEW', 'P1', 'team_2', '2026-09-29', 90, 16, '["Frontend", "UX", "Mobile"]'::jsonb, 'CURRENT_WORK', 'PR submitted for review by design team lead.')
ON CONFLICT (id) DO NOTHING;

-- SEED IDEAS TABLE
INSERT INTO public.ideas (id, title, description, category, status, created_by, impact, complexity, notes) VALUES
('idea_001', 'AI-Powered Archival Document Search & Summarization', 'Implement an intelligent semantic search agent leveraging LLM embeddings to allow researchers to query historical speeches.', 'Artificial Intelligence', 'RESEARCH', 'Arun Kumar', 'HIGH', 'MEDIUM', 'Evaluated sentence-transformers with Tamil embeddings.')
ON CONFLICT (id) DO NOTHING;

-- SEED HISTORY TABLE
INSERT INTO public.history (id, admin_name, action, entity_type, entity_id, entity_name, details) VALUES
('hist_001', 'Arun Kumar (Admin)', 'SYSTEM_INITIALIZED', 'SYSTEM', 'sys_01', 'Supabase Cloud Database', 'Supabase Cloud Database initialized with strict RLS policies.')
ON CONFLICT (id) DO NOTHING;
