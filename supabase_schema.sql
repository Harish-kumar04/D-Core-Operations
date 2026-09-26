-- ============================================================
-- D-CORE OPERATIONS — SUPABASE DATABASE CREATION & SEED SCRIPT
-- Copy and paste this script into Supabase SQL Editor & click Run
-- ============================================================

-- 1. AUTHORIZED USERS TABLE (STRICT 4 USERS)
CREATE TABLE IF NOT EXISTS public.users (
  id TEXT PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  passcode TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'MEMBER', -- ADMIN or MEMBER
  department TEXT,
  avatar TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. PROJECTS TABLE
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

-- 3. TASKS TABLE
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

-- 4. FUTURE IDEAS TABLE
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

-- 5. TEAM MEMBERS TABLE
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

-- 6. ADMIN EDIT HISTORY AUDIT LOG TABLE
CREATE TABLE IF NOT EXISTS public.history (
  id TEXT PRIMARY KEY,
  admin_name TEXT NOT NULL,
  action TEXT NOT NULL,
  entity_type TEXT NOT NULL,
  entity_id TEXT,
  entity_name TEXT,
  details TEXT,
  timestamp TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- ENABLE PUBLIC RLS POLICIES FOR TEAM COLLABORATION
-- ============================================================
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.ideas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.team ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.history ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow anon read users" ON public.users FOR SELECT USING (true);

CREATE POLICY "Allow anon read projects" ON public.projects FOR SELECT USING (true);
CREATE POLICY "Allow anon insert projects" ON public.projects FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update projects" ON public.projects FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete projects" ON public.projects FOR DELETE USING (true);

CREATE POLICY "Allow anon read tasks" ON public.tasks FOR SELECT USING (true);
CREATE POLICY "Allow anon insert tasks" ON public.tasks FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update tasks" ON public.tasks FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete tasks" ON public.tasks FOR DELETE USING (true);

CREATE POLICY "Allow anon read ideas" ON public.ideas FOR SELECT USING (true);
CREATE POLICY "Allow anon insert ideas" ON public.ideas FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update ideas" ON public.ideas FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete ideas" ON public.ideas FOR DELETE USING (true);

CREATE POLICY "Allow anon read team" ON public.team FOR SELECT USING (true);
CREATE POLICY "Allow anon insert team" ON public.team FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow anon update team" ON public.team FOR UPDATE USING (true);
CREATE POLICY "Allow anon delete team" ON public.team FOR DELETE USING (true);

CREATE POLICY "Allow anon read history" ON public.history FOR SELECT USING (true);
CREATE POLICY "Allow anon insert history" ON public.history FOR INSERT WITH CHECK (true);

-- ============================================================
-- INITIAL SEED DATA FOR THE 4 AUTHORIZED USERS & PLATFORMS
-- ============================================================

-- SEED 4 AUTHORIZED USERS
INSERT INTO public.users (id, name, email, passcode, role, department, avatar) VALUES
('team_1', 'Arun Kumar', 'arun.k@dcore.ops', 'dcore101', 'ADMIN', 'Technology Operations', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80'),
('team_2', 'Priya Ramachandran', 'priya.r@dcore.ops', 'dcore102', 'ADMIN', 'Digital Platforms', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80'),
('team_3', 'Karthik Subramanian', 'karthik.s@dcore.ops', 'dcore103', 'MEMBER', 'IT Infrastructure', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80'),
('team_4', 'Deepa Sundaram', 'deepa.s@dcore.ops', 'dcore104', 'MEMBER', 'Technology Operations', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80')
ON CONFLICT (id) DO NOTHING;

-- SEED TEAM TABLE
INSERT INTO public.team (id, name, role, department, email, avatar, skills, active_projects, capacity) VALUES
('team_1', 'Arun Kumar', 'Lead Systems Architect', 'Technology Operations', 'arun.k@dcore.ops', 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80', '["Cloud Infrastructure", "Kubernetes", "React", "DevOps"]'::jsonb, 3, 80),
('team_2', 'Priya Ramachandran', 'Senior Frontend Engineer', 'Digital Platforms', 'priya.r@dcore.ops', 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=150&auto=format&fit=crop&q=80', '["React", "Next.js", "Tailwind CSS", "UI/UX"]'::jsonb, 2, 65),
('team_3', 'Karthik Subramanian', 'Infrastructure & Security Lead', 'IT Infrastructure', 'karthik.s@dcore.ops', 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80', '["Cybersecurity", "NOC", "Database Admin", "Python"]'::jsonb, 3, 90),
('team_4', 'Deepa Sundaram', 'Data & Systems Specialist', 'Technology Operations', 'deepa.s@dcore.ops', 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80', '["Data Pipelines", "PostgreSQL", "Analytics", "Automation"]'::jsonb, 2, 45)
ON CONFLICT (id) DO NOTHING;

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
('hist_001', 'Arun Kumar (Admin)', 'SYSTEM_INITIALIZED', 'SYSTEM', 'sys_01', 'Supabase Cloud Database', 'Supabase Cloud Database initialized with 4 Authorized Users system.')
ON CONFLICT (id) DO NOTHING;
