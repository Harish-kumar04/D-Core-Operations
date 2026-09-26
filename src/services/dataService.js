import initialData from '../data/initialData.json';

const API_BASE = 'http://localhost:5000/api';
const STORAGE_KEY = 'dcore_operations_state_v1';

export const DataService = {
  // Fetch state from REST API or fallback to localStorage
  fetchStateAsync: async () => {
    try {
      const res = await fetch(`${API_BASE}/state`);
      if (res.ok) {
        const data = await res.json();
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
        return data;
      }
    } catch (e) {
      console.warn('REST API unavailable, loading state from localStorage:', e);
    }
    return DataService.loadState();
  },

  // Load from localStorage
  loadState: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (!parsed.projects || parsed.projects.length === 0) {
          parsed.projects = initialData.projects;
        }
        return parsed;
      }
    } catch (e) {
      console.error('Error loading state from localStorage:', e);
    }
    return initialData;
  },

  // Admin Auth Login via REST API
  loginAdminApi: async (email, password, adminName) => {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, adminName })
      });
      if (res.ok) {
        const data = await res.json();
        return data;
      }
    } catch (e) {
      console.warn('REST API auth offline, fallback login:', e);
    }
    // Fallback if backend server is offline
    if (email === 'admin@dcore.ops' && password === 'admin123') {
      return { success: true, adminName: adminName || 'Admin' };
    }
    return { success: false, error: 'Invalid credentials' };
  },

  // Save Project via REST API
  saveProjectApi: async (project, adminName, isEdit = false) => {
    try {
      const url = isEdit ? `${API_BASE}/projects/${project.id}` : `${API_BASE}/projects`;
      const method = isEdit ? 'PUT' : 'POST';
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ project, updates: project, adminName })
      });
    } catch (e) {
      console.warn('REST API save project failed:', e);
    }
  },

  // Save Task via REST API
  saveTaskApi: async (task, adminName, isEdit = false) => {
    try {
      const url = isEdit ? `${API_BASE}/tasks/${task.id}` : `${API_BASE}/tasks`;
      const method = isEdit ? 'PUT' : 'POST';
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task, updates: task, adminName })
      });
    } catch (e) {
      console.warn('REST API save task failed:', e);
    }
  },

  // Save Idea via REST API
  saveIdeaApi: async (idea, adminName, isEdit = false) => {
    try {
      const url = isEdit ? `${API_BASE}/ideas/${idea.id}` : `${API_BASE}/ideas`;
      const method = isEdit ? 'PUT' : 'POST';
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ idea, updates: idea, adminName })
      });
    } catch (e) {
      console.warn('REST API save idea failed:', e);
    }
  },

  // Save Team Member via REST API
  saveTeamApi: async (member, adminName, isEdit = false) => {
    try {
      const url = isEdit ? `${API_BASE}/team/${member.id}` : `${API_BASE}/team`;
      const method = isEdit ? 'PUT' : 'POST';
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ member, updates: member, adminName })
      });
    } catch (e) {
      console.warn('REST API save team failed:', e);
    }
  },

  // Delete Entity via REST API
  deleteEntityApi: async (type, id, adminName) => {
    try {
      const endpointMap = {
        PROJECT: 'projects',
        TASK: 'tasks',
        IDEA: 'ideas',
        TEAM: 'team'
      };
      const endpoint = endpointMap[type];
      if (endpoint) {
        await fetch(`${API_BASE}/${endpoint}/${id}`, {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ adminName })
        });
      }
    } catch (e) {
      console.warn('REST API delete entity failed:', e);
    }
  },

  // Save full state to localStorage
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
