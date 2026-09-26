import React, { useState, useEffect } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Save, Edit3, Trash2 } from 'lucide-react';

export const EditEntityModal = ({ isOpen, onClose, entityType, entityData }) => {
  const { state, updateProject, updateTask, updateIdea, updateTeamMember, deleteTask } = useApp();

  const [formData, setFormData] = useState({});

  useEffect(() => {
    if (entityData) {
      setFormData({ ...entityData });
    }
  }, [entityData]);

  if (!isOpen || !entityData) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (entityType === 'PROJECT') {
      updateProject(entityData.id, formData);
    } else if (entityType === 'TASK') {
      updateTask(entityData.id, formData);
    } else if (entityType === 'IDEA') {
      updateIdea(entityData.id, formData);
    } else if (entityType === 'TEAM') {
      updateTeamMember(entityData.id, formData);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-dcore-red text-white flex items-center justify-center font-bold">
              <Edit3 className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Edit {entityType} Entry
              </h3>
              <p className="text-[11px] text-slate-500 font-mono">ID: {entityData.id}</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[70vh] space-y-4 text-xs font-medium">
          
          {/* PROJECT FORM */}
          {entityType === 'PROJECT' && (
            <>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Project Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red font-bold text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Website URL</label>
                  <input
                    type="url"
                    value={formData.url || ''}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category || ''}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Priority</label>
                  <select
                    value={formData.priority || 'P1'}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red"
                  >
                    <option value="P0">P0 — CRITICAL</option>
                    <option value="P1">P1 — HIGH</option>
                    <option value="P2">P2 — MEDIUM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Status</label>
                  <select
                    value={formData.status || 'active'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red"
                  >
                    <option value="active">Active</option>
                    <option value="planning">Planning</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Progress % ({formData.progress || 0}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.progress || 0}
                    onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value, 10) })}
                    className="w-full mt-2 accent-dcore-red"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red"
                ></textarea>
              </div>
            </>
          )}

          {/* TASK FORM */}
          {entityType === 'TASK' && (
            <>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Task Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red font-bold text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Associated Project</label>
                  <select
                    value={formData.projectId || ''}
                    onChange={(e) => setFormData({ ...formData, projectId: e.target.value })}
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
                    value={formData.ownerId || ''}
                    onChange={(e) => setFormData({ ...formData, ownerId: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red"
                  >
                    {state.team.map((m) => (
                      <option key={m.id} value={m.id}>{m.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Priority</label>
                  <select
                    value={formData.priority || 'P1'}
                    onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red"
                  >
                    <option value="P0">P0 — CRITICAL</option>
                    <option value="P1">P1 — HIGH</option>
                    <option value="P2">P2 — MEDIUM</option>
                    <option value="P3">P3 — LOW</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Status</label>
                  <select
                    value={formData.status || 'TO DO'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red"
                  >
                    <option value="BACKLOG">BACKLOG</option>
                    <option value="TO DO">TO DO</option>
                    <option value="IN PROGRESS">IN PROGRESS</option>
                    <option value="REVIEW">REVIEW</option>
                    <option value="COMPLETED">COMPLETED</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Progress % ({formData.progress || 0}%)</label>
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={formData.progress || 0}
                    onChange={(e) => setFormData({ ...formData, progress: parseInt(e.target.value, 10) })}
                    className="w-full mt-2 accent-dcore-red"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Due Date</label>
                  <input
                    type="date"
                    value={formData.dueDate || ''}
                    onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Pipeline Section</label>
                  <select
                    value={formData.type || 'CURRENT_WORK'}
                    onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red"
                  >
                    <option value="CURRENT_WORK">🟢 Current Work</option>
                    <option value="WORK_QUEUE">🟡 Work Queue (Planned)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red"
                ></textarea>
              </div>
            </>
          )}

          {/* IDEA FORM */}
          {entityType === 'IDEA' && (
            <>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Idea Title *</label>
                <input
                  type="text"
                  required
                  value={formData.title || ''}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red font-bold text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Impact</label>
                  <select
                    value={formData.impact || 'HIGH'}
                    onChange={(e) => setFormData({ ...formData, impact: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red"
                  >
                    <option value="CRITICAL">CRITICAL</option>
                    <option value="HIGH">HIGH</option>
                    <option value="MEDIUM">MEDIUM</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Complexity</label>
                  <select
                    value={formData.complexity || 'MEDIUM'}
                    onChange={(e) => setFormData({ ...formData, complexity: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red"
                  >
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                  </select>
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Status</label>
                  <select
                    value={formData.status || 'NEW'}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red"
                  >
                    <option value="NEW">NEW</option>
                    <option value="DISCUSSION">DISCUSSION</option>
                    <option value="RESEARCH">RESEARCH</option>
                    <option value="APPROVED">APPROVED</option>
                    <option value="REJECTED">REJECTED</option>
                    <option value="CONVERTED TO PROJECT">CONVERTED TO PROJECT</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Description</label>
                <textarea
                  rows="3"
                  value={formData.description || ''}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red"
                ></textarea>
              </div>
            </>
          )}

          {/* TEAM MEMBER FORM */}
          {entityType === 'TEAM' && (
            <>
              <div>
                <label className="block text-slate-700 font-bold mb-1">Team Member Name *</label>
                <input
                  type="text"
                  required
                  value={formData.name || ''}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red font-bold text-sm"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-700 font-bold mb-1">Role</label>
                  <input
                    type="text"
                    value={formData.role || ''}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-bold mb-1">Department</label>
                  <input
                    type="text"
                    value={formData.department || ''}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-bold mb-1">Email</label>
                <input
                  type="email"
                  value={formData.email || ''}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red"
                />
              </div>
            </>
          )}

          {/* Footer Submit */}
          <div className="pt-4 flex items-center justify-between border-t border-slate-100">
            <button
              type="button"
              onClick={() => {
                if (window.confirm(`Delete this ${entityType.toLowerCase()} entry?`)) {
                  deleteTask(entityData.id);
                  onClose();
                }
              }}
              className="px-3 py-2 rounded-xl text-red-600 bg-red-50 hover:bg-red-100 font-bold text-xs flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              <span>Delete</span>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 rounded-xl text-slate-600 bg-slate-100 font-bold hover:bg-slate-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 rounded-xl text-white bg-dcore-red font-bold hover:bg-dcore-red-hover shadow-md shadow-dcore-red/20 flex items-center gap-1.5"
              >
                <Save className="w-4 h-4" />
                <span>Save Changes</span>
              </button>
            </div>
          </div>

        </form>
      </div>
    </div>
  );
};
