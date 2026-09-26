import initialData from '../data/initialData.json';

const STORAGE_KEY = 'dcore_operations_state_v1';

export const DataService = {
  // Load state from localStorage or initialData
  loadState: () => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        // Ensure initial mandatory projects exist if missing
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

  // Save full state
  saveState: (state) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch (e) {
      console.error('Error saving state to localStorage:', e);
    }
  },

  // Reset data to initial demo state
  resetDemoData: () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initialData));
    } catch (e) {
      console.error('Error resetting demo data:', e);
    }
    return initialData;
  },

  // Export current state to JSON file download
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

  // Import JSON string and validate schema
  importDataJSON: (jsonString) => {
    try {
      const parsed = JSON.parse(jsonString);
      if (!parsed.projects || !Array.isArray(parsed.projects)) {
        throw new Error("Invalid format: 'projects' array is missing.");
      }
      if (!parsed.tasks || !Array.isArray(parsed.tasks)) {
        throw new Error("Invalid format: 'tasks' array is missing.");
      }
      DataService.saveState(parsed);
      return { success: true, data: parsed };
    } catch (e) {
      return { success: false, error: e.message };
    }
  }
};
