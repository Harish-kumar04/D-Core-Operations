import React, { createContext, useContext, useState, useEffect } from 'react';
import { DataService } from '../services/dataService';
import { supabase, isSupabaseConfigured } from '../services/supabaseClient';
import {
  changeAdminPassword as updatePasswordService,
  getPasswordExpiryInfo
} from '../services/passwordService';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [state, setState] = useState(() => DataService.loadState());
  const [activeTab, setActiveTab] = useState('dashboard');
  const [selectedProjectId, setSelectedProjectId] = useState(null);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [passwordExpiry, setPasswordExpiry] = useState(() => getPasswordExpiryInfo());

  // User Session & Gated Access State derived from Supabase Auth
  const [userSession, setUserSession] = useState({
    isAuthenticated: false,
    user: null,
    email: '',
    userName: '',
    memberName: '',
    userRole: 'GUEST'
  });

  // Listen for Supabase auth state changes
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const displayName = session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'Admin Operator';
        setUserSession({
          isAuthenticated: true,
          user: session.user,
          email: session.user.email || '',
          userName: displayName,
          memberName: displayName,
          userRole: 'ADMIN'
        });
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        const displayName = session.user.user_metadata?.display_name || session.user.email?.split('@')[0] || 'Admin Operator';
        setUserSession({
          isAuthenticated: true,
          user: session.user,
          email: session.user.email || '',
          userName: displayName,
          memberName: displayName,
          userRole: 'ADMIN'
        });
      } else {
        setUserSession({
          isAuthenticated: false,
          user: null,
          email: '',
          userName: '',
          memberName: '',
          userRole: 'GUEST'
        });
      }
    });

    return () => {
      subscription?.unsubscribe();
    };
  }, []);

  // Edit Modal State
  const [editModal, setEditModal] = useState({ isOpen: false, type: null, data: null });

  // Quick Add & Search state
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState('task');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  // Initial async sync from Supabase Cloud / REST API server
  useEffect(() => {
    DataService.fetchStateAsync().then((fetchedState) => {
      if (fetchedState) {
        setState(fetchedState);
      }
    });
  }, []);

  // Auto-save to localStorage whenever state updates
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

  // --- SUPABASE AUTH LOGIN ---
  const loginUserSession = async (email, password) => {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Backend authentication service is not configured.' };
    }

    const cleanEmail = (email || '').trim();
    const cleanPass = (password || '').trim();

    if (!cleanEmail || !cleanPass) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: cleanPass
    });

    if (error || !data?.user) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const displayName = data.user.user_metadata?.display_name || data.user.email?.split('@')[0] || 'Admin Operator';

    addHistoryLog(
      'PORTAL_LOGIN',
      'AUTH',
      `session_${Date.now()}`,
      'User Access Audit',
      `Team Member '${displayName}' authenticated via Supabase Auth.`,
      displayName
    );

    showToast(`Welcome ${displayName}! Access granted.`);
    return { success: true };
  };

  const logoutUserSession = async () => {
    if (isSupabaseConfigured && supabase) {
      await supabase.auth.signOut();
    }
    setUserSession({
      isAuthenticated: false,
      user: null,
      email: '',
      userName: '',
      memberName: '',
      userRole: 'GUEST'
    });
    showToast('Signed out of D-Core Operations Portal.', 'info');
  };

  const changePassword = (role, oldPass, newPass) => {
    const res = updatePasswordService(role, oldPass, newPass);
    if (res.success) {
      setPasswordExpiry(getPasswordExpiryInfo());
      showToast(res.message);
    } else {
      showToast(res.error, 'error');
    }
    return res;
  };

  const addFeedPost = (feedData) => {
    const activeAuthor = userSession?.userName || 'Core Team Member';
    const newPost = {
      id: `feed_${Date.now()}`,
      author: activeAuthor,
      role: userSession?.userRole || 'ADMIN',
      category: feedData.category || 'GENERAL',
      content: feedData.content,
      createdAt: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      feeds: [newPost, ...(prev.feeds || [])]
    }));

    addHistoryLog('POST_FEED', 'FEED', newPost.id, 'Feed Post', `Published feed update: "${feedData.content.substring(0, 40)}..."`);
    showToast('Feed update posted successfully!');
  };

  const deleteFeedPost = (feedId) => {
    setState(prev => ({
      ...prev,
      feeds: (prev.feeds || []).filter(f => f.id !== feedId)
    }));
    showToast('Feed post removed.');
  };

  const openEditModal = (type, data) => {
    setEditModal({ isOpen: true, type, data });
  };

  const closeEditModal = () => {
    setEditModal({ isOpen: false, type: null, data: null });
  };

  const openTaskDrawer = (taskId) => {
    setSelectedTaskId(taskId);
  };

  const closeTaskDrawer = () => {
    setSelectedTaskId(null);
  };

  // Helper to append history audit logs using real display name
  const addHistoryLog = (action, entityType, entityId, entityName, details, overrideAdminName = null) => {
    const activeMember = userSession?.userName || userSession?.memberName || 'Admin Operator';
    const newLog = {
      id: `hist_${Date.now()}_${Math.floor(Math.random() * 1000)}`,
      adminName: overrideAdminName || activeMember,
      action,
      entityType,
      entityId,
      entityName,
      details,
      timestamp: new Date().toISOString()
    };
    setState(prev => ({
      ...prev,
      history: [newLog, ...(prev.history || [])]
    }));
    DataService.saveHistoryApi(newLog);
  };

  const addActivity = (text, type = 'GENERAL', projectId = null, taskId = null) => {
    const newActivity = {
      id: `act_${Date.now()}`,
      type,
      text,
      projectId,
      taskId,
      user: userSession?.userName || state.settings?.currentUserName || 'Admin Operator',
      timestamp: new Date().toISOString()
    };
    setState(prev => ({
      ...prev,
      activities: [newActivity, ...(prev.activities || [])]
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

    addHistoryLog('CREATE_PROJECT', 'PROJECT', newProject.id, newProject.name, `Created project '${newProject.name}' (${newProject.category}).`);
    DataService.saveProjectApi(newProject, adminName, false);
    showToast(`Project '${newProject.name}' created!`);
    return newProject;
  };

  const updateProject = (projectId, updates) => {
    setState(prev => {
      const proj = prev.projects.find(p => p.id === projectId);
      const projName = updates.name || (proj ? proj.name : 'Project');
      addHistoryLog('EDIT_PROJECT', 'PROJECT', projectId, projName, `Updated project '${projName}'. Modified progress to ${updates.progress}%.`);
      DataService.saveProjectApi({ id: projectId, ...updates }, adminName, true);

      return {
        ...prev,
        projects: prev.projects.map(p => p.id === projectId ? { ...p, ...updates, updatedAt: new Date().toISOString() } : p)
      };
    });
    showToast('Project entry updated successfully.');
  };

  const deleteProject = (projectId) => {
    const proj = state.projects.find(p => p.id === projectId);
    const projName = proj ? proj.name : projectId;
    setState(prev => ({
      ...prev,
      projects: prev.projects.filter(p => p.id !== projectId)
    }));
    addHistoryLog('DELETE_PROJECT', 'PROJECT', projectId, projName, `Deleted project '${projName}'.`);
    DataService.deleteEntityApi('PROJECT', projectId, adminName);
    showToast(`Project '${projName}' deleted.`, 'info');
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
      estimatedHours: parseInt(taskData.estimatedHours || 16, 10),
      tags: Array.isArray(taskData.tags) ? taskData.tags : (taskData.tags ? taskData.tags.split(',').map(t => t.trim()) : []),
      type: taskData.type || 'WORK_QUEUE',
      notes: taskData.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      tasks: [newTask, ...prev.tasks]
    }));

    addHistoryLog('CREATE_TASK', 'TASK', newTask.id, newTask.title, `Created task '${newTask.title}' in ${newTask.type}.`);
    DataService.saveTaskApi(newTask, adminName, false);
    showToast(`Task '${newTask.title}' added.`);
    return newTask;
  };

  const updateTask = (taskId, updates) => {
    setState(prev => {
      const task = prev.tasks.find(t => t.id === taskId);
      const taskTitle = updates.title || (task ? task.title : 'Task');
      addHistoryLog('EDIT_TASK', 'TASK', taskId, taskTitle, `Updated task '${taskTitle}'. Status: ${updates.status || (task ? task.status : '')}.`);
      DataService.saveTaskApi({ id: taskId, ...updates }, adminName, true);

      return {
        ...prev,
        tasks: prev.tasks.map(t => t.id === taskId ? { ...t, ...updates, updatedAt: new Date().toISOString() } : t)
      };
    });
    showToast('Task entry updated successfully.');
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

    addHistoryLog('STATUS_CHANGE', 'TASK', taskId, task.title, `Moved status '${task.title}': ${oldStatus} → ${newStatus}.`);
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

    addHistoryLog('WORK_STARTED', 'TASK', taskId, task.title, `Transferred Work Queue item '${task.title}' into active Current Works.`);
    showToast(`'${task.title}' moved to Current Works Kanban!`);
  };

  const deleteTask = (taskId) => {
    const task = state.tasks.find(t => t.id === taskId);
    const taskTitle = task ? task.title : taskId;

    setState(prev => ({
      ...prev,
      tasks: prev.tasks.filter(t => t.id !== taskId)
    }));

    addHistoryLog('DELETE_TASK', 'TASK', taskId, taskTitle, `Deleted task '${taskTitle}'.`);
    DataService.deleteEntityApi('TASK', taskId, adminName);
    showToast('Task entry deleted.', 'info');
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
      createdBy: ideaData.createdBy || adminName || userSession.userName || 'Arun Kumar',
      impact: ideaData.impact || 'MEDIUM',
      complexity: ideaData.complexity || 'MEDIUM',
      notes: ideaData.notes || '',
      createdAt: new Date().toISOString()
    };

    setState(prev => ({
      ...prev,
      ideas: [newIdea, ...prev.ideas]
    }));

    addHistoryLog('CREATE_IDEA', 'IDEA', newIdea.id, newIdea.title, `Added future idea '${newIdea.title}'.`);
    DataService.saveIdeaApi(newIdea, adminName, false);
    showToast(`Idea '${newIdea.title}' added!`);
    return newIdea;
  };

  const updateIdea = (ideaId, updates) => {
    setState(prev => {
      const idea = prev.ideas.find(i => i.id === ideaId);
      const ideaTitle = updates.title || (idea ? idea.title : 'Idea');
      addHistoryLog('EDIT_IDEA', 'IDEA', ideaId, ideaTitle, `Updated future idea '${ideaTitle}'.`);
      DataService.saveIdeaApi({ id: ideaId, ...updates }, adminName, true);

      return {
        ...prev,
        ideas: prev.ideas.map(i => i.id === ideaId ? { ...i, ...updates } : i)
      };
    });
    showToast('Idea entry updated.');
  };

  const convertIdeaToProject = (ideaId) => {
    const idea = state.ideas.find(i => i.id === ideaId);
    if (!idea) return;

    const createdProject = addProject({
      name: idea.title,
      description: idea.description,
      category: idea.category,
      priority: idea.impact === 'CRITICAL' || idea.impact === 'HIGH' ? 'P1' : 'P2',
      status: 'active',
      progress: 0,
      notes: `Converted from Future Idea by ${adminName || userSession.userName || 'Admin'}.`
    });

    updateIdea(ideaId, { status: 'CONVERTED TO PROJECT' });
    addHistoryLog('CONVERT_IDEA', 'IDEA', ideaId, idea.title, `Converted future idea '${idea.title}' into Project '${createdProject.name}'.`);
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
      avatar: memberData.avatar || `https://images.unsplash.com/photo-1534528741775?w=150&auto=format&fit=crop&q=80`,
      skills: Array.isArray(memberData.skills) ? memberData.skills : (memberData.skills ? memberData.skills.split(',').map(s=>s.trim()) : ['Tech Ops']),
      activeProjects: 1,
      capacity: 50
    };

    setState(prev => ({
      ...prev,
      team: [...prev.team, newMember]
    }));

    addHistoryLog('CREATE_TEAM', 'TEAM', newMember.id, newMember.name, `Registered team member '${newMember.name}' (${newMember.role}).`);
    DataService.saveTeamApi(newMember, adminName, false);
    showToast(`Team member '${newMember.name}' added!`);
  };

  const updateTeamMember = (memberId, updates) => {
    setState(prev => {
      const member = prev.team.find(m => m.id === memberId);
      const name = updates.name || (member ? member.name : 'Team Member');
      addHistoryLog('EDIT_TEAM', 'TEAM', memberId, name, `Updated team member profile for '${name}'.`);
      DataService.saveTeamApi({ id: memberId, ...updates }, adminName, true);

      return {
        ...prev,
        team: prev.team.map(m => m.id === memberId ? { ...m, ...updates } : m)
      };
    });
    showToast('Team member profile updated.');
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
    userSession,
    loginUserSession,
    logoutUserSession,
    editModal,
    openEditModal,
    closeEditModal,
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
    deleteProject,
    addTask,
    updateTask,
    moveTaskStatus,
    deleteTask,
    addIdea,
    updateIdea,
    convertIdeaToProject,
    addTeamMember,
    updateTeamMember,
    addActivity,
    passwordExpiry,
    changePassword,
    addFeedPost,
    deleteFeedPost,
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
