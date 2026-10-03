import initialData from '../data/initialData.json';
import { supabase, isSupabaseConfigured } from './supabaseClient';

const STORAGE_KEY = 'dcore_operations_state_v4';

export const DataService = {
  // Fetch full state from Supabase Cloud DB
  fetchStateAsync: async () => {
    if (isSupabaseConfigured && supabase) {
      try {
        const [projRes, taskRes, ideaRes, teamRes, histRes] = await Promise.all([
          supabase.from('projects').select('*').order('created_at', { ascending: false }),
          supabase.from('tasks').select('*').order('created_at', { ascending: false }),
          supabase.from('ideas').select('*').order('created_at', { ascending: false }),
          supabase.from('team').select('*'),
          supabase.from('history').select('*').order('timestamp', { ascending: false })
        ]);

        const errors = [];
        if (projRes.error) errors.push(`projects (${projRes.error.message})`);
        if (taskRes.error) errors.push(`tasks (${taskRes.error.message})`);
        if (ideaRes.error) errors.push(`ideas (${ideaRes.error.message})`);
        if (teamRes.error) errors.push(`team (${teamRes.error.message})`);
        if (histRes.error) errors.push(`history (${histRes.error.message})`);

        if (errors.length > 0) {
          console.warn('Supabase fetch error details:', errors.join('; '));
          return { error: true, message: `Failed to sync with Supabase: ${errors[0]}` };
        }

        if (projRes.data) {
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

          // Merge any new items from initialData.json that are missing in cloud DB
          const existingProjIds = new Set(cloudState.projects.map(p => p.id));
          const missingProj = initialData.projects.filter(p => !existingProjIds.has(p.id));
          if (missingProj.length > 0) cloudState.projects = [...cloudState.projects, ...missingProj];

          const existingTaskIds = new Set(cloudState.tasks.map(t => t.id));
          const missingTasks = initialData.tasks.filter(t => !existingTaskIds.has(t.id));
          if (missingTasks.length > 0) cloudState.tasks = [...cloudState.tasks, ...missingTasks];

          const existingIdeaIds = new Set(cloudState.ideas.map(i => i.id));
          const missingIdeas = initialData.ideas.filter(i => !existingIdeaIds.has(i.id));
          if (missingIdeas.length > 0) cloudState.ideas = [...cloudState.ideas, ...missingIdeas];

          localStorage.setItem(STORAGE_KEY, JSON.stringify(cloudState));
          return { success: true, data: cloudState };
        }
      } catch (err) {
        console.warn('Supabase fetch error:', err);
        return { error: true, message: 'Network error connecting to Supabase.' };
      }
    }
    return { error: true, message: 'Backend authentication service is not configured.' };
  },

  // Save Project to Supabase
  saveProjectApi: async (project, adminName, isEdit = false) => {
    if (!isSupabaseConfigured || !supabase) {
      return { error: true, message: 'Supabase is not configured.' };
    }
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
      const res = isEdit
        ? await supabase.from('projects').update(row).eq('id', project.id)
        : await supabase.from('projects').insert([row]);

      if (res.error) {
        console.error('Supabase project mutation error:', res.error);
        return { error: true, message: res.error.message };
      }
      return { success: true };
    } catch (e) {
      console.error('Supabase project mutation exception:', e);
      return { error: true, message: e.message || 'Failed to save project.' };
    }
  },

  // Save Task to Supabase
  saveTaskApi: async (task, adminName, isEdit = false) => {
    if (!isSupabaseConfigured || !supabase) {
      return { error: true, message: 'Supabase is not configured.' };
    }
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
      const res = isEdit
        ? await supabase.from('tasks').update(row).eq('id', task.id)
        : await supabase.from('tasks').insert([row]);

      if (res.error) {
        console.error('Supabase task mutation error:', res.error);
        return { error: true, message: res.error.message };
      }
      return { success: true };
    } catch (e) {
      console.error('Supabase task mutation exception:', e);
      return { error: true, message: e.message || 'Failed to save task.' };
    }
  },

  // Save Idea to Supabase
  saveIdeaApi: async (idea, adminName, isEdit = false) => {
    if (!isSupabaseConfigured || !supabase) {
      return { error: true, message: 'Supabase is not configured.' };
    }
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
      const res = isEdit
        ? await supabase.from('ideas').update(row).eq('id', idea.id)
        : await supabase.from('ideas').insert([row]);

      if (res.error) {
        console.error('Supabase idea mutation error:', res.error);
        return { error: true, message: res.error.message };
      }
      return { success: true };
    } catch (e) {
      console.error('Supabase idea mutation exception:', e);
      return { error: true, message: e.message || 'Failed to save idea.' };
    }
  },

  // Save Team Member to Supabase
  saveTeamApi: async (member, adminName, isEdit = false) => {
    if (!isSupabaseConfigured || !supabase) {
      return { error: true, message: 'Supabase is not configured.' };
    }
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
      const res = isEdit
        ? await supabase.from('team').update(row).eq('id', member.id)
        : await supabase.from('team').insert([row]);

      if (res.error) {
        console.error('Supabase team mutation error:', res.error);
        return { error: true, message: res.error.message };
      }
      return { success: true };
    } catch (e) {
      console.error('Supabase team mutation exception:', e);
      return { error: true, message: e.message || 'Failed to save team member.' };
    }
  },

  // Log Audit History Entry in Supabase
  saveHistoryApi: async (log) => {
    if (!isSupabaseConfigured || !supabase) {
      return { error: true, message: 'Supabase is not configured.' };
    }
    try {
      const res = await supabase.from('history').insert([{
        id: log.id,
        admin_name: log.adminName,
        action: log.action,
        entity_type: log.entityType,
        entity_id: log.entityId,
        entity_name: log.entityName,
        details: log.details,
        timestamp: log.timestamp
      }]);
      if (res.error) {
        console.error('Supabase history insert error:', res.error);
        return { error: true, message: res.error.message };
      }
      return { success: true };
    } catch (e) {
      console.error('Supabase history insert exception:', e);
      return { error: true, message: e.message || 'Failed to save history entry.' };
    }
  },

  // Delete Entity from Supabase
  deleteEntityApi: async (type, id, adminName) => {
    const tableMap = {
      PROJECT: 'projects',
      TASK: 'tasks',
      IDEA: 'ideas',
      TEAM: 'team'
    };
    const table = tableMap[type];

    if (!isSupabaseConfigured || !supabase || !table) {
      return { error: true, message: 'Supabase or table not configured.' };
    }
    try {
      const res = await supabase.from(table).delete().eq('id', id);
      if (res.error) {
        console.error('Supabase delete error:', res.error);
        return { error: true, message: res.error.message };
      }
      return { success: true };
    } catch (e) {
      console.error('Supabase delete exception:', e);
      return { error: true, message: e.message || 'Failed to delete entity.' };
    }
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
