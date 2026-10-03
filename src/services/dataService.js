import initialData from '../data/initialData.json';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const API_BASE = 'http://localhost:5000/api';
const STORAGE_KEY = 'dcore_operations_state_v4';

export const DataService = {
  // Fetch full state from Supabase Cloud DB or local Express REST API or localStorage
  fetchStateAsync: async () => {
    // 1. Try Supabase Cloud Database if configured
    if (isSupabaseConfigured && supabase) {
      try {
        const [projRes, taskRes, ideaRes, teamRes, histRes] = await Promise.all([
          supabase.from('projects').select('*').order('created_at', { ascending: false }),
          supabase.from('tasks').select('*').order('created_at', { ascending: false }),
          supabase.from('ideas').select('*').order('created_at', { ascending: false }),
          supabase.from('team').select('*'),
          supabase.from('history').select('*').order('timestamp', { ascending: false })
        ]);

        if (!projRes.error && projRes.data) {
          const mapProject = (p) => ({
            id: p.id,
            name: p.name,
            url: p.url,
            description: p.description,
            status: p.status,
            priority: p.priority,
            progress: p.progress,
            ownerId: p.owner_id,
            category: p.category,
            startDate: p.start_date,
            targetDate: p.target_date,
            notes: typeof p.notes === 'string' ? JSON.parse(p.notes) : (p.notes || []),
            createdAt: p.created_at,
            updatedAt: p.updated_at
          });

          const mapTask = (t) => ({
            id: t.id,
            projectId: t.project_id,
            title: t.title,
            description: t.description,
            status: t.status,
            priority: t.priority,
            ownerId: t.owner_id,
            dueDate: t.due_date,
            targetDate: t.target_date,
            progress: t.progress,
            estimatedHours: t.estimated_hours,
            tags: typeof t.tags === 'string' ? JSON.parse(t.tags) : (t.tags || []),
            type: t.type,
            dependencies: t.dependencies,
            notes: t.notes,
            createdAt: t.created_at,
            updatedAt: t.updated_at
          });

          const mapIdea = (i) => ({
            id: i.id,
            title: i.title,
            description: i.description,
            category: i.category,
            status: i.status,
            createdBy: i.created_by,
            impact: i.impact,
            complexity: i.complexity,
            notes: i.notes,
            createdAt: i.created_at
          });

          const mapTeam = (m) => ({
            id: m.id,
            name: m.name,
            role: m.role,
            department: m.department,
            email: m.email,
            avatar: m.avatar,
            skills: typeof m.skills === 'string' ? JSON.parse(m.skills) : (m.skills || []),
            activeProjects: m.active_projects,
            capacity: m.capacity
          });

          const mapHist = (h) => ({
            id: h.id,
            adminName: h.admin_name,
            action: h.action,
            entityType: h.entity_type,
            entityId: h.entity_id,
            entityName: h.entity_name,
            details: h.details,
            timestamp: h.timestamp
          });

          const cloudState = {
            organization: initialData.organization,
            projects: (projRes.data || []).map(mapProject),
            tasks: (taskRes.data || []).map(mapTask),
            ideas: (ideaRes.data || []).map(mapIdea),
            team: (teamRes.data || []).map(mapTeam),
            history: (histRes.data || []).map(mapHist),
            activities: initialData.activities,
            notifications: initialData.notifications,
            settings: initialData.settings
          };

          localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudState));
          return cloudState;
        }
      } catch (err) {
        console.warn('Supabase fetch error, fallback to REST API / localStorage:', err);
      }
    }

    // 2. Fallback to Local Express REST API
    try {
      const res = await fetch(`${API_BASE}/state`);
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data;
      }
    } catch (e) {
      console.warn('REST API unavailable, fallback to localStorage cache.');
    }

    // 3. Fallback to LocalStorage
    return DataService.loadState();
  },

  // Save Project to Supabase & Local DB
  saveProjectApi: async (project, adminName, isEdit = false) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const row = {
          id: project.id,
          name: project.name,
          url: project.url,
          description: project.description,
          status: project.status,
          priority: project.priority,
          progress: project.progress,
          owner_id: project.ownerId,
          category: project.category,
          start_date: project.startDate,
          target_date: project.targetDate,
          notes: project.notes || [],
          updated_at: new Date().toISOString()
        };
        if (isEdit) {
          await supabase.from('projects').update(row).eq('id', project.id);
        } else {
          await supabase.from('projects').insert([row]);
        }
      } catch (e) {
        console.error('Supabase project mutation error:', e);
      }
    }

    // Local REST API backup
    try {
      const url = isEdit ? `${API_BASE}/projects/${project.id}` : `${API_BASE}/projects`;
      await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project, updates: project, adminName })
      });
    } catch (e) {}
  },

  // Save Task to Supabase & Local DB
  saveTaskApi: async (task, adminName, isEdit = false) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const row = {
          id: task.id,
          project_id: task.projectId,
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
          owner_id: task.ownerId,
          due_date: task.dueDate,
          target_date: task.targetDate,
          progress: task.progress,
          estimated_hours: task.estimatedHours,
          tags: task.tags || [],
          type: task.type,
          dependencies: task.dependencies,
          notes: task.notes,
          updated_at: new Date().toISOString()
        };
        if (isEdit) {
          await supabase.from('tasks').update(row).eq('id', task.id);
        } else {
          await supabase.from('tasks').insert([row]);
        }
      } catch (e) {
        console.error('Supabase task mutation error:', e);
      }
    }

    try {
      const url = isEdit ? `${API_BASE}/tasks/${task.id}` : `${API_BASE}/tasks`;
      await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, updates: task, adminName })
      });
    } catch (e) {}
  },

  // Save Idea to Supabase & Local DB
  saveIdeaApi: async (idea, adminName, isEdit = false) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const row = {
          id: idea.id,
          title: idea.title,
          description: idea.description,
          category: idea.category,
          status: idea.status,
          created_by: idea.createdBy,
          impact: idea.impact,
          complexity: idea.complexity,
          notes: idea.notes
        };
        if (isEdit) {
          await supabase.from('ideas').update(row).eq('id', idea.id);
        } else {
          await supabase.from('ideas').insert([row]);
        }
      } catch (e) {
        console.error('Supabase idea mutation error:', e);
      }
    }

    try {
      const url = isEdit ? `${API_BASE}/ideas/${idea.id}` : `${API_BASE}/ideas`;
      await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, updates: idea, adminName })
      });
    } catch (e) {}
  },

  // Save Team Member to Supabase & Local DB
  saveTeamApi: async (member, adminName, isEdit = false) => {
    if (isSupabaseConfigured && supabase) {
      try {
        const row = {
          id: member.id,
          name: member.name,
          role: member.role,
          department: member.department,
          email: member.email,
          avatar: member.avatar,
          skills: member.skills || [],
          active_projects: member.activeProjects,
          capacity: member.capacity
        };
        if (isEdit) {
          await supabase.from('team').update(row).eq('id', member.id);
        } else {
          await supabase.from('team').insert([row]);
        }
      } catch (e) {
        console.error('Supabase team mutation error:', e);
      }
    }

    try {
      const url = isEdit ? `${API_BASE}/team/${member.id}` : `${API_BASE}/team`;
      await fetch(url, {
        method: isEdit ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member, updates: member, adminName })
      });
    } catch (e) {}
  },

  // Log Audit History Entry in Supabase & Local DB
  saveHistoryApi: async (log) => {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('history').insert([{
          id: log.id,
          admin_name: log.adminName,
          action: log.action,
          entity_type: log.entityType,
          entity_id: log.entityId,
          entity_name: log.entityName,
          details: log.details,
          timestamp: log.timestamp
        }]);
      } catch (e) {
        console.error('Supabase history insert error:', e);
      }
    }
  },

  // Delete Entity from Supabase & Local DB
  deleteEntityApi: async (type, id, adminName) => {
    const tableMap = {
      PROJECT: 'projects',
      TASK: 'tasks',
      IDEA: 'ideas',
      TEAM: 'team'
    };
    const table = tableMap[type];

    if (isSupabaseConfigured && supabase && table) {
      try {
        await supabase.from(table).delete().eq('id', id);
      } catch (e) {
        console.error('Supabase delete error:', e);
      }
    }

    try {
      if (table) {
        await fetch(`${API_BASE}/${table}/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ adminName })
        });
      }
    } catch (e) {}
  },

  // Admin Login via Supabase / REST API
  loginAdminApi: async (email, password, adminName) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, adminName })
      });
      if (res.ok) {
        return await res.json();
      }
    } catch (e) {}

    if (email === 'admin@dcore.ops' && password === 'admin123') {
      return { success: true, adminName: adminName || 'Admin' };
    }
    return { success: false, error: 'Invalid credentials' };
  },

  // Load state from localStorage
  loadState: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure new initialData projects and ideas are merged if missing in local cache
        const existingProjIds = new Set((parsed.projects || []).map(p => p.id));
        const missingProj = initialData.projects.filter(p => !existingProjIds.has(p.id));
        if (missingProj.length > 0) {
          parsed.projects = [...(parsed.projects || []), ...missingProj];
        }

        const existingIdeaIds = new Set((parsed.ideas || []).map(i => i.id));
        const missingIdeas = initialData.ideas.filter(i => !existingIdeaIds.has(i.id));
        if (missingIdeas.length > 0) {
          parsed.ideas = [...(parsed.ideas || []), ...missingIdeas];
        }

        const existingTaskIds = new Set((parsed.tasks || []).map(t => t.id));
        const missingTasks = initialData.tasks.filter(t => !existingTaskIds.has(t.id));
        if (missingTasks.length > 0) {
          parsed.tasks = [...(parsed.tasks || []), ...missingTasks];
        }

        return parsed;
      }
    } catch (e) {
      console.error('Error loading state from localStorage:', e);
    }
    return initialData;
  },

  // Save state to localStorage
  saveState: (state) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving state to localStorage:', e);
    }
  },

  // Reset demo data
  resetDemoData: () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    } catch (e) {
      console.error('Error resetting demo data:', e);
    }
    return initialData;
  },

  // Export JSON file
  exportDataJSON: (state) => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(state, null, 2));
    const downloadAnchor = document.createElement('a');
    const timestamp = new Date().toISOString().split('T')[0];
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `d-core-operations-backup-${timestamp}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  },

  // Import JSON string
  importDataJSON: (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.projects || !Array.isArray(parsed.projects)) {
        throw new Error("Invalid format: 'projects' array is missing.");
      }
      DataService.saveState(parsed);
      return { success: true, data: parsed };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
};
