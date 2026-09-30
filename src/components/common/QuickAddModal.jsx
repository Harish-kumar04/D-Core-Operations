import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Plus, FolderKanban, CheckSquare, Lightbulb, UserPlus } from 'lucide-react';

export const QuickAddModal = () => {
  const {
    isQuickAddOpen,
    setIsQuickAddOpen,
    quickAddType,
    setQuickAddType,
    state,
    addTask,
    addProject,
    addIdea,
    addTeamMember
  } = useApp();

  // Task form state
  const [taskForm, setTaskForm] = useState({
    title: '',
    description: '',
    projectId: state.projects[0]?.id || '',
    ownerId: '',
    priority: 'P1',
    status: 'TO DO',
    type: 'WORK_QUEUE',
    dueDate: '',
    tags: '',
    estimatedHours: 16
  });

  // Project form state
  const [projectForm, setProjectForm] = useState({
    name: '',
    description: '',
    url: '',
    category: 'Digital Platform',
    ownerId: '',
    priority: 'P1',
    startDate: new Date().toISOString().split('T')[0],
    targetDate: '',
    notes: ''
  });

  // Idea form state
  const [ideaForm, setIdeaForm] = useState({
    title: '',
    description: '',
    category: 'Infrastructure Innovation',
    impact: 'HIGH',
    complexity: 'MEDIUM',
    notes: ''
  });

  if (!isQuickAddOpen) return null;

  const handleTaskSubmit = (e) => {
    e.preventDefault();
    if (!taskForm.title.trim() || !taskForm.projectId) return;
    addTask(taskForm);
    setIsQuickAddOpen(false);
  };

  const handleProjectSubmit = (e) => {
    e.preventDefault();
    if (!projectForm.name.trim()) return;
    addProject(projectForm);
    setIsQuickAddOpen(false);
  };

  const handleIdeaSubmit = (e) => {
    e.preventDefault();
    if (!ideaForm.title.trim()) return;
    addIdea(ideaForm);
    setIsQuickAddOpen(false);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/80">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-dcore-red text-white flex items-center justify-center font-bold">
              <Plus className="w-5 h-5 stroke-[3]" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">Quick Add Item</h3>
              <p className="text-xs text-slate-500">Add operational tasks, projects, or ideas.</p>
            </div>
          </div>
          <button
            onClick={() => setIsQuickAddOpen(false)}
            aria-label="Close modal"
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-200 bg-slate-100/60 p-1.5 gap-1 text-xs font-bold">
          <button
            onClick={() => setQuickAddType('task')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              quickAddType === 'task' ? 'bg-white text-dcore-red shadow-sm' : 'text-slate-600 hover:bg-white/50'
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>+ Task</span>
          </button>

          <button
            onClick={() => setQuickAddType('project')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              quickAddType === 'project' ? 'bg-white text-dcore-red shadow-sm' : 'text-slate-600 hover:bg-white/50'
            }`}
          >
            <FolderKanban className="w-3.5 h-3.5" />
            <span>+ Project</span>
          </button>

          <button
            onClick={() => setQuickAddType('idea')}
            className={`flex-1 py-2 rounded-lg flex items-center justify-center gap-1.5 transition-all ${
              quickAddType === 'idea' ? 'bg-white text-dcore-red shadow-sm' : 'text-slate-600 hover:bg-white/50'
            }`}
          >
            <Lightbulb className="w-3.5 h-3.5" />
            <span>+ Idea</span>
          </button>
        </div>

        {/* Body Forms */}
        <div className="p-6 overflow-y-auto max-h-[65vh]">
          {quickAddType === 'task' && (
            <form onSubmit={handleTaskSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Upgrade Cloudflare WAF Security Rules"
                  value={taskForm.title}
                  onChange={(e) => setTaskForm({ ...taskForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-dcore-red/20 focus:border-dcore-red text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Associated Project *</label>
                  <select
                    value={taskForm.projectId}
                    onChange={(e) => setTaskForm({ ...taskForm, projectId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red"
                  >
                    {state.projects.map((p) => (
                      <option key={p.id} value={p.id}>{p.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Assigned Owner</label>
                  <select
                    value={taskForm.ownerId}
                    onChange={(e) => setTaskForm({ ...taskForm, ownerId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red"
                  >
                    {state.team.map((m) => (
                      <option key={m.id} value={m.id}>{m.name} ({m.role})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Priority</label>
                  <select
                    value={taskForm.priority}
                    onChange={(e) => setTaskForm({ ...taskForm, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red"
                  >
                    <option value="P0">P0 — CRITICAL</option>
                    <option value="P1">P1 — HIGH</option>
                    <option value="P2">P2 — MEDIUM</option>
                    <option value="P3">P3 — LOW</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Pipeline Section</label>
                  <select
                    value={taskForm.type}
                    onChange={(e) => setTaskForm({ ...taskForm, type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red"
                  >
                    <option value="WORK_QUEUE">🟡 Work Queue (Planned)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Initial Status</label>
                  <select
                    value={taskForm.status}
                    onChange={(e) => setTaskForm({ ...taskForm, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red"
                  >
                    <option value="BACKLOG">BACKLOG</option>
                    <option value="TO DO">TO DO</option>
                    <option value="IN PROGRESS">IN PROGRESS</option>
                    <option value="REVIEW">REVIEW</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Due Date</label>
                  <input
                    type="date"
                    value={taskForm.dueDate}
                    onChange={(e) => setTaskForm({ ...taskForm, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Tags (comma separated)</label>
                  <input
                    type="text"
                    placeholder="Security, DevOps, High Traffic"
                    value={taskForm.tags}
                    onChange={(e) => setTaskForm({ ...taskForm, tags: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description & Requirements</label>
                <textarea
                  rows="3"
                  placeholder="Details of what needs to be implemented or configured..."
                  value={taskForm.description}
                  onChange={(e) => setTaskForm({ ...taskForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red"
                ></textarea>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsQuickAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white bg-dcore-red font-bold hover:bg-dcore-red-hover shadow-md shadow-dcore-red/20"
                >
                  Create Task
                </button>
              </div>
            </form>
          )}

          {quickAddType === 'project' && (
            <form onSubmit={handleProjectSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. DMK Digital Archives Portal"
                  value={projectForm.name}
                  onChange={(e) => setProjectForm({ ...projectForm, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Website URL</label>
                  <input
                    type="url"
                    placeholder="https://domain.com"
                    value={projectForm.url}
                    onChange={(e) => setProjectForm({ ...projectForm, url: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <input
                    type="text"
                    placeholder="Core Platform, Infrastructure, Mobile"
                    value={projectForm.category}
                    onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Project Owner</label>
                  <select
                    value={projectForm.ownerId}
                    onChange={(e) => setProjectForm({ ...projectForm, ownerId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red"
                  >
                    {state.team.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Priority</label>
                  <select
                    value={projectForm.priority}
                    onChange={(e) => setProjectForm({ ...projectForm, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red"
                  >
                    <option value="P0">P0 — CRITICAL</option>
                    <option value="P1">P1 — HIGH</option>
                    <option value="P2">P2 — MEDIUM</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  rows="3"
                  placeholder="Overview of project objectives and architecture..."
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red"
                ></textarea>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsQuickAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white bg-dcore-red font-bold hover:bg-dcore-red-hover shadow-md shadow-dcore-red/20"
                >
                  Register Project
                </button>
              </div>
            </form>
          )}

          {quickAddType === 'idea' && (
            <form onSubmit={handleIdeaSubmit} className="space-y-4 text-xs font-medium">
              <div>
                <label className="block text-slate-700 font-bold mb-1">Idea Title *</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 💡 Automated Document Summarization with AI"
                  value={ideaForm.title}
                  onChange={(e) => setIdeaForm({ ...ideaForm, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Expected Impact</label>
                  <select
                    value={ideaForm.impact}
                    onChange={(e) => setIdeaForm({ ...ideaForm, impact: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="LOW">LOW</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Complexity</label>
                  <select
                    value={ideaForm.complexity}
                    onChange={(e) => setIdeaForm({ ...ideaForm, complexity: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Idea Description & Value Proposition</label>
                <textarea
                  rows="3"
                  placeholder="Describe the potential innovation, operational benefit, and technical scope..."
                  value={ideaForm.description}
                  onChange={(e) => setIdeaForm({ ...ideaForm, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red"
                ></textarea>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsQuickAddOpen(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 font-bold hover:bg-slate-200"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl text-white bg-dcore-red font-bold hover:bg-dcore-red-hover shadow-md shadow-dcore-red/20"
                >
                  Add Future Idea
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
