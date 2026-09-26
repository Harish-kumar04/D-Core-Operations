import React, { createContext, useContext, useState, useEffect } from 'react';
import { DataService } from '../services/dataService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, setState] = useState(() => DataService.loadState());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState('task'); // task, project, idea, team
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null); // { message, type: 'success'|'error'|'info' }

  // Auto-save to localStorage whenever state changes
  useEffect(() => {
    DataService.saveState(state);
  }, [state]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => {
      setToast(null);
    }, 3500);
  };

  const navigate = (tab, projectId = null) => {
    setActiveTab(tab);
    if (projectId) {
      setSelectedProjectId(projectId);
    } else if (tab !== 'projects') {
      setSelectedProjectId(null);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const openTaskDrawer = (taskId) => {
    setSelectedTaskId(taskId);
  };

  const closeTaskDrawer = () => {
    setSelectedTaskId(null);
  };

  const addActivity = (text, type = 'GENERAL', projectId = null, taskId = null) => {
    const newActivity = {
      id: `act_${Date.now()}`,
      type,
      text,
      projectId,
      taskId,
      user: state.settings.currentUserName || 'Arun Kumar',
      timestamp: new Date().toISOString()
    };
    setState(prev => ({
      ...prev,
      activities: [newActivity, ...(prev.activities || [])]
    }));
  };

  const addNotification = (title, message, type = 'info') => {
    const newNotif = {
      id: `notif_${Date.now()}`,
      title,
      message,
      time: 'Just now',
      read: false,
      type
    };
    setState(prev => ({
      ...prev,
      notifications: [newNotif, ...(prev.notifications || [])]
    }));
  };

  // --- PROJECTS ---
  const addProject = (projectData) => {
    const newProject = {
      id: `proj_${Date.now()}`,
      name: projectData.name,
      url: projectData.url || '',
      description: projectData.description || '',
      status: projectData.status || 'active',
      priority: projectData.priority || 'P1',
      progress: parseInt(projectData.progress || 0, 10),
      ownerId: projectData.ownerId || 'team_1',
      category: projectData.category || 'Digital Platform',
      startDate: projectData.startDate || new Date().toISOString().split('T')[0],
      targetDate: projectData.targetDate || '',
      notes: projectData.notes ? [projectData.notes] : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      projects: [newProject, ...prev.projects]
    }));

    addActivity(`Project created: '${newProject.name}'`, 'PROJECT_CREATED', newProject.id);
    addNotification('Project Created', `New project '${newProject.name}' registered.`, 'project');
    showToast(`Project '${newProject.name}' created successfully!`);
    return newProject;
  };

  const updateProject = (projectId, updates) => {
    setState(prev => ({
      ...prev,
      projects: prev.projects.map(p => p.id === projectId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p)
    }));
    addActivity(`Project updated: '${updates.name || projectId}'`, 'PROJECT_UPDATED', projectId);
    showToast('Project updated successfully.');
  };

  // --- TASKS ---
  const addTask = (taskData) => {
    const newTask = {
      id: `task_${Date.now()}`,
      projectId: taskData.projectId,
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'TO DO',
      priority: taskData.priority || 'P2',
      ownerId: taskData.ownerId || 'team_1',
      dueDate: taskData.dueDate || '',
      progress: parseInt(taskData.progress || 0, 10),
      estimatedHours: parseInt(taskData.estimatedHours || 8, 10),
      tags: Array.isArray(taskData.tags) ? taskData.tags : (taskData.tags ? taskData.tags.split(',').map(t => t.trim()) : []),
      type: taskData.type || 'CURRENT_WORK', // CURRENT_WORK or WORK_QUEUE
      notes: taskData.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      tasks: [newTask, ...prev.tasks]
    }));

    const proj = state.projects.find(p => p.id === taskData.projectId);
    const projName = proj ? proj.name : 'System';
    addActivity(`Task created: '${newTask.title}' under ${projName}`, 'TASK_CREATED', taskData.projectId, newTask.id);
    showToast(`Task '${newTask.title}' added.`);
    return newTask;
  };

  const updateTask = (taskId, updates) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)
    }));
    showToast('Task updated successfully.');
  };

  const moveTaskStatus = (taskId, newStatus) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    const oldStatus = task.status;
    const isCompleted = newStatus === 'COMPLETED';
    const newProgress = isCompleted ? 100 : (oldStatus === 'COMPLETED' ? 80 : task.progress);

    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? {
        ...t,
        status: newStatus,
        progress: newProgress,
        updatedAt: new Date().toISOString()
      } : t)
    }));

    addActivity(`Task moved '${task.title}': ${oldStatus} → ${newStatus}`, 'STATUS_CHANGE', task.projectId, taskId);
    showToast(`Task moved to ${newStatus}`);
  };

  const moveWorkQueueToCurrentWork = (taskId) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    setState(prev => ({
      ...prev,
      tasks: prev.tasks.map(t => t.id === taskId ? {
        ...t,
        type: 'CURRENT_WORK',
        status: 'TO DO',
        updatedAt: new Date().toISOString()
      } : t)
    }));

    addActivity(`Work Queue item '${task.title}' moved to Current Works`, 'WORK_STARTED', task.projectId, taskId);
    showToast(`'${task.title}' moved to Current Works Kanban!`);
  };

  const deleteTask = (taskId) => {
    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== taskId)
    }));
    showToast('Task removed.', 'info');
    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
    }
  };

  // --- FUTURE IDEAS ---
  const addIdea = (ideaData) => {
    const newIdea = {
      id: `idea_${Date.now()}`,
      title: ideaData.title,
      description: ideaData.description || '',
      category: ideaData.category || 'General Innovation',
      status: ideaData.status || 'NEW',
      createdBy: ideaData.createdBy || state.settings.currentUserName || 'Arun Kumar',
      impact: ideaData.impact || 'MEDIUM',
      complexity: ideaData.complexity || 'MEDIUM',
      notes: ideaData.notes || '',
      createdAt: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      ideas: [newIdea, ...prev.ideas]
    }));

    addActivity(`New Future Idea added: '${newIdea.title}'`, 'IDEA_CREATED');
    showToast(`Idea '${newIdea.title}' added to Future Ideas repository!`);
    return newIdea;
  };

  const updateIdea = (ideaId, updates) => {
    setState(prev => ({
      ...prev,
      ideas: prev.ideas.map(i => i.id === ideaId ? { ...i, ...updates } : i)
    }));
    showToast('Idea updated.');
  };

  const convertIdeaToProject = (ideaId) => {
    const idea = state.ideas.find(i => i.id === ideaId);
    if (!idea) return;

    // Create a project from this idea
    const createdProject = addProject({
      name: idea.title,
      description: idea.description,
      category: idea.category,
      priority: idea.impact === 'CRITICAL' || idea.impact === 'HIGH' ? 'P1' : 'P2',
      status: 'active',
      progress: 0,
      notes: `Converted from Future Idea. Original impact: ${idea.impact}, complexity: ${idea.complexity}.`
    });

    // Update idea status to CONVERTED TO PROJECT
    updateIdea(ideaId, { status: 'CONVERTED TO PROJECT' });
    addActivity(`Future Idea '${idea.title}' converted to Project`, 'IDEA_CONVERTED', createdProject.id);
    showToast(`Idea converted into Project '${createdProject.name}'!`);
    navigate('projects', createdProject.id);
  };

  // --- TEAM ---
  const addTeamMember = (memberData) => {
    const newMember = {
      id: `team_${Date.now()}`,
      name: memberData.name,
      role: memberData.role || 'Software Engineer',
      department: memberData.department || 'Technology Operations',
      email: memberData.email || '',
      avatar: memberData.avatar || `https://images.unsplash.com/photo-${1534528741775 + Math.floor(Math.random()*1000)}?w=150&auto=format&fit=crop&q=80`,
      skills: Array.isArray(memberData.skills) ? memberData.skills : (memberData.skills ? memberData.skills.split(',').map(s=>s.trim()) : ['Tech Ops']),
      activeProjects: 1,
      capacity: 50
    };

    setState(prev => ({
      ...prev,
      team: [...prev.team, newMember]
    }));

    addActivity(`New team member added: '${newMember.name}'`, 'TEAM_ADDED');
    showToast(`Team member '${newMember.name}' registered!`);
  };

  // --- SETTINGS & DATA MANAGEMENT ---
  const resetDemoData = () => {
    const resetState = DataService.resetDemoData();
    setState(resetState);
    showToast('Application reset to default DEMO DATA state.', 'info');
  };

  const exportJSON = () => {
    DataService.exportDataJSON(state);
    showToast('Application JSON data exported successfully!');
  };

  const importJSON = (jsonStr) => {
    const res = DataService.importDataJSON(jsonStr);
    if (res.success) {
      setState(res.data);
      showToast('JSON state restored successfully!');
      return true;
    } else {
      showToast(`Import failed: ${res.error}`, 'error');
      return false;
    }
  };

  const value = {
    state,
    activeTab,
    selectedProjectId,
    selectedTaskId,
    isQuickAddOpen,
    quickAddType,
    isSearchOpen,
    searchQuery,
    toast,
    showToast,
    navigate,
    openTaskDrawer,
    closeTaskDrawer,
    setIsQuickAddOpen,
    setQuickAddType,
    setIsSearchOpen,
    setSearchQuery,
    addProject,
    updateProject,
    addTask,
    updateTask,
    moveTaskStatus,
    moveWorkQueueToCurrentWork,
    deleteTask,
    addIdea,
    updateIdea,
    convertIdeaToProject,
    addTeamMember,
    addActivity,
    addNotification,
    resetDemoData,
    exportJSON,
    importJSON
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
