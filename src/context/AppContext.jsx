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

  // Helper to map user email / metadata to a clean human display name
  const resolveDisplayName = (userObj, rawEmail = '') => {
    const email = (userObj?.email || rawEmail || '').toLowerCase().trim();
    const metaName = userObj?.user_metadata?.display_name || userObj?.user_metadata?.full_name || userObj?.user_metadata?.name;

    if (metaName && metaName !== email && !metaName.includes('@')) {
      return metaName;
    }

    // Match against team member profiles
    if (state?.team?.length && email) {
      const match = state.team.find(m => m.email?.toLowerCase().trim() === email);
      if (match?.name) return match.name;
    }

    // Known email address mappings for authorized team members
    if (email.includes('erharishkumarece') || email.includes('harishkumar777')) {
      return 'Harish Kumar';
    }
    if (email.includes('architect@dcore.ops')) return 'Systems Architecture Lead';
    if (email.includes('frontend@dcore.ops')) return 'Frontend Platforms Lead';
    if (email.includes('noc@dcore.ops')) return 'IT Security Lead';
    if (email.includes('data@dcore.ops')) return 'Data Systems Specialist';

    // Format local email part if unknown (e.g. john.doe -> John Doe)
    const localPart = email.split('@')[0] || '';
    if (localPart && localPart !== 'admin' && localPart !== 'user') {
      return localPart
        .replace(/[._-]/g, ' ')
        .replace(/\b\w/g, c => c.toUpperCase());
    }

    return 'Admin Operator';
  };

  // Listen for Supabase auth state changes
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;

    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session?.user) {
        const displayName = resolveDisplayName(session.user);
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
        const displayName = resolveDisplayName(session.user);
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
  }, [state.team]);

  // Edit Modal State
  const [editModal, setEditModal] = useState({ isOpen: false, type: null, data: null });

  // Quick Add & Search state
  const [isQuickAddOpen, setIsQuickAddOpen] = useState(false);
  const [quickAddType, setQuickAddType] = useState('task');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [toast, setToast] = useState(null);

  const [isLoadingState, setIsLoadingState] = useState(true);

  // Initial async sync from Supabase Cloud
  useEffect(() => {
    setIsLoadingState(true);
    DataService.fetchStateAsync().then((res) => {
      if (res && res.error) {
        showToast(res.message, 'error');
      } else if (res && res.success) {
        setState(res.data);
      }
      setIsLoadingState(false);
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

  const loginUserSession = async (email, password) => {
    if (!isSupabaseConfigured || !supabase) {
      return { success: false, error: 'Backend authentication service is not configured.' };
    }

    const cleanEmail = (email || '').trim();

    if (!cleanEmail || !password) {
      return { success: false, error: 'Invalid email or password.' };
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanEmail,
      password: password
    });

    if (error) {
      console.error('Supabase Auth Error:', error);
      return { success: false, error: error.message };
    }
    
    if (!data?.user) {
      return { success: false, error: 'Authentication failed. Please try again.' };
    }

    const displayName = resolveDisplayName(data.user, cleanEmail);

    addHistoryLog(
      'PORTAL_LOGIN',
      'AUTH',
      `session_${crypto.randomUUID()}`,
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

  const changePassword = async (role, oldPass, newPass) => {
    // 1. If Supabase Auth session active, update Supabase password
    if (isSupabaseConfigured && supabase && userSession.isAuthenticated) {
      const { error } = await supabase.auth.updateUser({ password: newPass });
      if (error) {
        console.error('Supabase Auth Password Update Error:', error);
        showToast(`Supabase Auth: ${error.message}`, 'error');
        return { success: false, error: error.message };
      }
    }

    // 2. Update local 14-day password rotation tracker
    const res = updatePasswordService(role, oldPass, newPass);
    if (res.success) {
      setPasswordExpiry(getPasswordExpiryInfo());
      showToast(res.message);
      addHistoryLog(
        'PASSWORD_ROTATION',
        'SECURITY',
        `pass_${crypto.randomUUID()}`,
        '14-Day Password Rotation',
        `Password updated successfully for ${userSession.userName || 'Admin'}. 14-day rotation compliance cycle reset.`,
        userSession.userName
      );
    } else {
      showToast(res.error, 'error');
    }
    return res;
  };

  const addFeedPost = (feedData) => {
    const activeAuthor = userSession?.userName || 'Core Team Member';
    const newPost = {
      id: `feed_${crypto.randomUUID()}`,
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

  // Helper to append history audit logs outside setState updaters
  const addHistoryLog = (action, entityType, entityId, entityName, details, overrideAdminName = null) => {
    const activeMember = userSession?.userName || userSession?.memberName || 'Admin Operator';
    const newLog = {
      id: `hist_${crypto.randomUUID()}`,
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
      id: `act_${crypto.randomUUID()}`,
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

  // Unified save helper for optimistic UI updates, error rollbacks, and single audit logs
  const saveEntity = async ({
    type,
    action,
    entityId,
    entityName,
    historyDetails,
    apiCall,
    optimisticUpdate,
    successMessage
  }) => {
    let previousStateSnapshot = null;

    setState(prev => {
      previousStateSnapshot = prev;
      return optimisticUpdate(prev);
    });

    const res = await apiCall();

    if (res && res.error) {
      if (previousStateSnapshot) {
        setState(previousStateSnapshot);
      }
      showToast(`Save failed: ${res.message || res.error}`, 'error');
      return { success: false, error: res.message || res.error };
    }

    if (historyDetails) {
      addHistoryLog(action, type, entityId, entityName, historyDetails);
    }

    if (successMessage) {
      showToast(successMessage, 'success');
    }

    return { success: true };
  };

  // --- PROJECTS ---
  const addProject = async (projectData) => {
    const newProject = {
      id: `proj_${crypto.randomUUID()}`,
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
      notes: projectData.notes ? (Array.isArray(projectData.notes) ? projectData.notes : [projectData.notes]) : [],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return await saveEntity({
      type: 'PROJECT',
      action: 'CREATE_PROJECT',
      entityId: newProject.id,
      entityName: newProject.name,
      historyDetails: `Created project '${newProject.name}' (${newProject.category}).`,
      apiCall: () => DataService.saveProjectApi(newProject, userSession.userName, false),
      optimisticUpdate: prev => ({ ...prev, projects: [newProject, ...(prev.projects || [])] }),
      successMessage: `Project '${newProject.name}' created!`
    });
  };

  const updateProject = async (projectId, updates) => {
    const proj = state.projects.find(p => p.id === projectId);
    const projName = updates.name || (proj ? proj.name : 'Project');
    const fullProject = { ...(proj || {}), ...updates, id: projectId, updatedAt: new Date().toISOString() };

    let detailsStr = `Updated project details for '${projName}'.`;
    if (updates.progress !== undefined && updates.progress !== null) {
      detailsStr = `Updated project '${projName}'. Modified progress to ${updates.progress}%.`;
    }

    return await saveEntity({
      type: 'PROJECT',
      action: 'EDIT_PROJECT',
      entityId: projectId,
      entityName: projName,
      historyDetails: detailsStr,
      apiCall: () => DataService.saveProjectApi(fullProject, userSession.userName, true),
      optimisticUpdate: prev => ({
        ...prev,
        projects: (prev.projects || []).map(p => p.id === projectId ? fullProject : p)
      }),
      successMessage: 'Project entry updated successfully.'
    });
  };

  const deleteProject = async (projectId) => {
    const proj = state.projects.find(p => p.id === projectId);
    const projName = proj ? proj.name : projectId;

    return await saveEntity({
      type: 'PROJECT',
      action: 'DELETE_PROJECT',
      entityId: projectId,
      entityName: projName,
      historyDetails: `Deleted project '${projName}'.`,
      apiCall: () => DataService.deleteEntityApi('PROJECT', projectId, userSession.userName),
      optimisticUpdate: prev => ({
        ...prev,
        projects: (prev.projects || []).filter(p => p.id !== projectId)
      }),
      successMessage: `Project '${projName}' deleted.`
    });
  };

  // --- TASKS ---
  const addTask = async (taskData) => {
    const newTask = {
      id: `task_${crypto.randomUUID()}`,
      projectId: taskData.projectId,
      title: taskData.title,
      description: taskData.description || '',
      status: taskData.status || 'TO DO',
      priority: taskData.priority || 'P2',
      ownerId: taskData.ownerId || 'team_1',
      dueDate: taskData.dueDate || '',
      targetDate: taskData.targetDate || '',
      progress: parseInt(taskData.progress || 0, 10),
      estimatedHours: parseInt(taskData.estimatedHours || 16, 10),
      tags: Array.isArray(taskData.tags) ? taskData.tags : (taskData.tags ? taskData.tags.split(',').map(t => t.trim()) : []),
      type: taskData.type || 'WORK_QUEUE',
      notes: taskData.notes || '',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return await saveEntity({
      type: 'TASK',
      action: 'CREATE_TASK',
      entityId: newTask.id,
      entityName: newTask.title,
      historyDetails: `Created task '${newTask.title}' in ${newTask.type}.`,
      apiCall: () => DataService.saveTaskApi(newTask, userSession.userName, false),
      optimisticUpdate: prev => ({ ...prev, tasks: [newTask, ...(prev.tasks || [])] }),
      successMessage: `Task '${newTask.title}' added.`
    });
  };

  const updateTask = async (taskId, updates) => {
    const task = state.tasks.find(t => t.id === taskId);
    const taskTitle = updates.title || (task ? task.title : 'Task');
    const fullTask = { ...(task || {}), ...updates, id: taskId, updatedAt: new Date().toISOString() };

    return await saveEntity({
      type: 'TASK',
      action: 'EDIT_TASK',
      entityId: taskId,
      entityName: taskTitle,
      historyDetails: `Updated task '${taskTitle}'. Status: ${fullTask.status}.`,
      apiCall: () => DataService.saveTaskApi(fullTask, userSession.userName, true),
      optimisticUpdate: prev => ({
        ...prev,
        tasks: (prev.tasks || []).map(t => t.id === taskId ? fullTask : t)
      }),
      successMessage: 'Task entry updated successfully.'
    });
  };

  const moveTaskStatus = async (taskId, newStatus) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    const oldStatus = task.status;
    const isCompleted = newStatus === 'COMPLETED';
    const newProgress = isCompleted ? 100 : (oldStatus === 'COMPLETED' ? 80 : task.progress);
    const updatedTask = {
      ...task,
      status: newStatus,
      progress: newProgress,
      updatedAt: new Date().toISOString()
    };

    return await saveEntity({
      type: 'TASK',
      action: 'STATUS_CHANGE',
      entityId: taskId,
      entityName: task.title,
      historyDetails: `Moved status '${task.title}': ${oldStatus} → ${newStatus}.`,
      apiCall: () => DataService.saveTaskApi(updatedTask, userSession.userName, true),
      optimisticUpdate: prev => ({
        ...prev,
        tasks: (prev.tasks || []).map(t => t.id === taskId ? updatedTask : t)
      }),
      successMessage: `Task moved to ${newStatus}`
    });
  };

  const moveWorkQueueToCurrentWork = async (taskId) => {
    const task = state.tasks.find(t => t.id === taskId);
    if (!task) return;

    const updatedTask = {
      ...task,
      type: 'CURRENT_WORK',
      status: 'TO DO',
      updatedAt: new Date().toISOString()
    };

    return await saveEntity({
      type: 'TASK',
      action: 'WORK_STARTED',
      entityId: taskId,
      entityName: task.title,
      historyDetails: `Transferred Work Queue item '${task.title}' into active Current Works.`,
      apiCall: () => DataService.saveTaskApi(updatedTask, userSession.userName, true),
      optimisticUpdate: prev => ({
        ...prev,
        tasks: (prev.tasks || []).map(t => t.id === taskId ? updatedTask : t)
      }),
      successMessage: `'${task.title}' moved to Current Works Kanban!`
    });
  };

  const deleteTask = async (taskId) => {
    const task = state.tasks.find(t => t.id === taskId);
    const taskTitle = task ? task.title : taskId;

    if (selectedTaskId === taskId) {
      setSelectedTaskId(null);
    }

    return await saveEntity({
      type: 'TASK',
      action: 'DELETE_TASK',
      entityId: taskId,
      entityName: taskTitle,
      historyDetails: `Deleted task '${taskTitle}'.`,
      apiCall: () => DataService.deleteEntityApi('TASK', taskId, userSession.userName),
      optimisticUpdate: prev => ({
        ...prev,
        tasks: (prev.tasks || []).filter(t => t.id !== taskId)
      }),
      successMessage: 'Task entry deleted.'
    });
  };

  // --- FUTURE IDEAS ---
  const addIdea = async (ideaData) => {
    const newIdea = {
      id: `idea_${crypto.randomUUID()}`,
      title: ideaData.title,
      description: ideaData.description || '',
      category: ideaData.category || 'General Innovation',
      status: ideaData.status || 'NEW',
      createdBy: ideaData.createdBy || userSession.userName || 'Admin Operator',
      impact: ideaData.impact || 'MEDIUM',
      complexity: ideaData.complexity || 'MEDIUM',
      notes: ideaData.notes || '',
      createdAt: new Date().toISOString()
    };

    return await saveEntity({
      type: 'IDEA',
      action: 'CREATE_IDEA',
      entityId: newIdea.id,
      entityName: newIdea.title,
      historyDetails: `Added future idea '${newIdea.title}'.`,
      apiCall: () => DataService.saveIdeaApi(newIdea, userSession.userName, false),
      optimisticUpdate: prev => ({ ...prev, ideas: [newIdea, ...(prev.ideas || [])] }),
      successMessage: `Idea '${newIdea.title}' added!`
    });
  };

  const updateIdea = async (ideaId, updates) => {
    const idea = state.ideas.find(i => i.id === ideaId);
    const ideaTitle = updates.title || (idea ? idea.title : 'Idea');
    const fullIdea = { ...(idea || {}), ...updates, id: ideaId };

    return await saveEntity({
      type: 'IDEA',
      action: 'EDIT_IDEA',
      entityId: ideaId,
      entityName: ideaTitle,
      historyDetails: `Updated future idea '${ideaTitle}'.`,
      apiCall: () => DataService.saveIdeaApi(fullIdea, userSession.userName, true),
      optimisticUpdate: prev => ({
        ...prev,
        ideas: (prev.ideas || []).map(i => i.id === ideaId ? fullIdea : i)
      }),
      successMessage: 'Idea entry updated.'
    });
  };

  const deleteIdea = async (ideaId) => {
    const idea = state.ideas.find(i => i.id === ideaId);
    const ideaTitle = idea ? idea.title : ideaId;

    return await saveEntity({
      type: 'IDEA',
      action: 'DELETE_IDEA',
      entityId: ideaId,
      entityName: ideaTitle,
      historyDetails: `Deleted future idea '${ideaTitle}'.`,
      apiCall: () => DataService.deleteEntityApi('IDEA', ideaId, userSession.userName),
      optimisticUpdate: prev => ({
        ...prev,
        ideas: (prev.ideas || []).filter(i => i.id !== ideaId)
      }),
      successMessage: `Idea '${ideaTitle}' deleted.`
    });
  };

  const convertIdeaToProject = async (ideaId) => {
    const idea = state.ideas.find(i => i.id === ideaId);
    if (!idea) return;

    const res = await addProject({
      name: idea.title,
      description: idea.description,
      category: idea.category,
      priority: idea.impact === 'CRITICAL' || idea.impact === 'HIGH' ? 'P1' : 'P2',
      status: 'active',
      progress: 0,
      notes: `Converted from Future Idea by ${userSession.userName || 'Admin'}.`
    });

    if (res && res.success) {
      await updateIdea(ideaId, { status: 'CONVERTED TO PROJECT' });
      addHistoryLog('CONVERT_IDEA', 'IDEA', ideaId, idea.title, `Converted future idea '${idea.title}' into Project.`);
      showToast(`Idea converted into Project!`);
    }
  };

  // --- TEAM ---
  const addTeamMember = async (memberData) => {
    const newMember = {
      id: `team_${crypto.randomUUID()}`,
      name: memberData.name,
      role: memberData.role || 'Software Engineer',
      department: memberData.department || 'Technology Operations',
      email: memberData.email || '',
      avatar: memberData.avatar || `https://images.unsplash.com/photo-1534528741775?w=150&auto=format&fit=crop&q=80`,
      skills: Array.isArray(memberData.skills) ? memberData.skills : (memberData.skills ? memberData.skills.split(',').map(s=>s.trim()) : ['Tech Ops']),
      activeProjects: 1,
      capacity: 50
    };

    return await saveEntity({
      type: 'TEAM',
      action: 'CREATE_TEAM',
      entityId: newMember.id,
      entityName: newMember.name,
      historyDetails: `Registered team member '${newMember.name}' (${newMember.role}).`,
      apiCall: () => DataService.saveTeamApi(newMember, userSession.userName, false),
      optimisticUpdate: prev => ({ ...prev, team: [...(prev.team || []), newMember] }),
      successMessage: `Team member '${newMember.name}' added!`
    });
  };

  const updateTeamMember = async (memberId, updates) => {
    const member = state.team.find(m => m.id === memberId);
    const name = updates.name || (member ? member.name : 'Team Member');
    const fullMember = { ...(member || {}), ...updates, id: memberId };

    return await saveEntity({
      type: 'TEAM',
      action: 'EDIT_TEAM',
      entityId: memberId,
      entityName: name,
      historyDetails: `Updated team member profile for '${name}'.`,
      apiCall: () => DataService.saveTeamApi(fullMember, userSession.userName, true),
      optimisticUpdate: prev => ({
        ...prev,
        team: (prev.team || []).map(m => m.id === memberId ? fullMember : m)
      }),
      successMessage: 'Team member profile updated.'
    });
  };

  const deleteTeamMember = async (memberId) => {
    const member = state.team.find(m => m.id === memberId);
    const name = member ? member.name : memberId;

    return await saveEntity({
      type: 'TEAM',
      action: 'DELETE_TEAM',
      entityId: memberId,
      entityName: name,
      historyDetails: `Deleted team member profile for '${name}'.`,
      apiCall: () => DataService.deleteEntityApi('TEAM', memberId, userSession.userName),
      optimisticUpdate: prev => ({
        ...prev,
        team: (prev.team || []).filter(m => m.id !== memberId)
      }),
      successMessage: `Team member profile deleted.`
    });
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

  const importJSON = async (jsonStr) => {
    const res = DataService.importDataJSON(jsonStr);
    if (res.success) {
      setState(res.data);
      showToast('Restoring JSON state to Supabase Cloud DB...', 'info');
      // Persist imported objects to Supabase Cloud
      if (res.data.projects?.length) {
        for (const p of res.data.projects) {
          await DataService.saveProjectApi(p, userSession.userName, false);
        }
      }
      if (res.data.tasks?.length) {
        for (const t of res.data.tasks) {
          await DataService.saveTaskApi(t, userSession.userName, false);
        }
      }
      if (res.data.ideas?.length) {
        for (const i of res.data.ideas) {
          await DataService.saveIdeaApi(i, userSession.userName, false);
        }
      }
      if (res.data.team?.length) {
        for (const tm of res.data.team) {
          await DataService.saveTeamApi(tm, userSession.userName, false);
        }
      }
      showToast('JSON state imported and synced to Supabase Cloud DB successfully!');
      return true;
    } else {
      showToast(`Import failed: ${res.error}`, 'error');
      return false;
    }
  };

  const value = {
    state,
    isLoadingState,
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
    moveWorkQueueToCurrentWork,
    deleteTask,
    addIdea,
    updateIdea,
    deleteIdea,
    convertIdeaToProject,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
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
