import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Calendar, User, Tag, Clock, CheckCircle2, History, AlertCircle, Trash2, Edit3 } from 'lucide-react';

export const TaskDetailDrawer = () => {
  const { selectedTaskId, closeTaskDrawer, state, updateTask, moveTaskStatus, deleteTask, openEditModal } = useApp();
  const [noteText, setNoteText] = useState('');

  if (!selectedTaskId) return null;

  const task = (state.tasks || []).find(t => t.id === selectedTaskId);
  if (!task) return null;

  const project = (state.projects || []).find(p => p.id === task.projectId);
  const owner = (state.team || []).find(m => m.id === task.ownerId);

  const taskActivities = (state.activities || []).filter(a => a.taskId === task.id);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!noteText.trim()) return;
    const updatedNotes = task.notes ? `${task.notes}\n• ${noteText.trim()}` : `• ${noteText.trim()}`;
    updateTask(task.id, { notes: updatedNotes });
    setNoteText('');
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-sm flex justify-end animate-in fade-in duration-200">
      <div
        className="w-full max-w-xl bg-white h-full shadow-drawer border-l border-slate-200 overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-300"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Drawer Header */}
        <div className="p-6 border-b border-slate-200 bg-slate-50/80 sticky top-0 z-10 backdrop-blur-md flex items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={`badge-${task.priority.toLowerCase()}`}>
                {task.priority}
              </span>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 text-slate-700 uppercase">
                {task.type === 'CURRENT_WORK' ? 'Current Work' : 'Work Queue'}
              </span>
              <span className="text-[10px] font-mono text-slate-400">ID: {task.id}</span>
            </div>
            <h2 className="text-lg font-extrabold text-slate-900 leading-tight">
              {task.title}
            </h2>
            <p className="text-xs font-semibold text-dcore-red mt-1">
              Project: {project ? project.name : 'Unassigned'}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => openEditModal('TASK', task)}
              className="p-2 rounded-xl text-slate-600 hover:text-dcore-red hover:bg-red-50 transition-colors"
              title="Edit Task Details"
            >
              <Edit3 className="w-4 h-4" />
            </button>
            <button
              onClick={() => deleteTask(task.id)}
              className="p-2 rounded-xl text-slate-400 hover:text-red-600 hover:bg-red-50 transition-colors"
              title="Delete Task"
            >
              <Trash2 className="w-4 h-4" />
            </button>
            <button
              onClick={closeTaskDrawer}
              className="p-2 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Drawer Content */}
        <div className="p-6 space-y-6 flex-1">
          
          {/* Quick Status Control */}
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-700">Update Task Status</span>
              <span className="text-xs font-mono font-bold text-dcore-red">{task.status}</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {['BACKLOG', 'TO DO', 'IN PROGRESS', 'REVIEW', 'COMPLETED'].map((st) => (
                <button
                  key={st}
                  onClick={() => moveTaskStatus(task.id, st)}
                  className={`text-[10px] font-bold px-2.5 py-1 rounded-lg transition-all ${
                    task.status === st
                      ? 'bg-dcore-red text-white shadow-sm'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl border border-slate-100 bg-white">
              <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Assigned Owner</span>
              <div className="flex items-center gap-2 font-bold text-slate-800">
                {owner ? (
                  <>
                    <img src={owner.avatar} alt={owner.name} className="w-5 h-5 rounded-full object-cover" />
                    <span>{owner.name}</span>
                  </>
                ) : (
                  <span>Unassigned</span>
                )}
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-100 bg-white">
              <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Target Due Date</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Calendar className="w-4 h-4 text-dcore-red" />
                <span>{task.dueDate || 'Not set'}</span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-100 bg-white">
              <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Estimated Effort</span>
              <div className="flex items-center gap-1.5 font-bold text-slate-800">
                <Clock className="w-4 h-4 text-amber-500" />
                <span>{task.estimatedHours || 16} Hours</span>
              </div>
            </div>

            <div className="p-3 rounded-xl border border-slate-100 bg-white">
              <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Current Progress</span>
              <div className="flex items-center gap-2">
                <div className="flex-1 bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div className="bg-dcore-red h-full" style={{ width: `${task.progress}%` }}></div>
                </div>
                <span className="font-mono font-bold text-dcore-red">{task.progress}%</span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Task Description
            </h4>
            <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-xl border border-slate-200/80">
              {task.description || 'No detailed description provided.'}
            </p>
          </div>

          {/* Tags */}
          {task.tags && task.tags.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
                <Tag className="w-3.5 h-3.5" />
                Tags
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {task.tags.map((tg, i) => (
                  <span key={i} className="text-[10px] font-semibold bg-red-50 text-dcore-red px-2 py-0.5 rounded border border-red-100">
                    #{tg}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Notes Section */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Project Notes & Updates
            </h4>
            {task.notes && (
              <div className="text-xs text-slate-700 bg-amber-50/50 p-3 rounded-xl border border-amber-200/60 mb-3 whitespace-pre-line font-mono">
                {task.notes}
              </div>
            )}
            <form onSubmit={handleAddNote} className="flex gap-2">
              <input
                type="text"
                value={noteText}
                onChange={(e) => setNoteText(e.target.value)}
                placeholder="Add an operational note or update..."
                className="flex-1 px-3 py-2 text-xs border border-slate-300 rounded-xl focus:outline-none focus:border-dcore-red"
              />
              <button
                type="submit"
                className="px-3 py-2 text-xs font-bold text-white bg-dcore-red rounded-xl hover:bg-dcore-red-hover transition-colors"
              >
                Add Note
              </button>
            </form>
          </div>

          {/* Activity History Timeline */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-3 flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-dcore-red" />
              Activity History
            </h4>
            {taskActivities.length === 0 ? (
              <div className="text-xs text-slate-400 italic bg-slate-50 p-3 rounded-xl">
                Created on {new Date(task.createdAt).toLocaleDateString()}
              </div>
            ) : (
              <div className="space-y-3 pl-2 border-l-2 border-slate-200">
                {taskActivities.map((act) => (
                  <div key={act.id} className="relative pl-3 text-xs">
                    <div className="absolute -left-[11px] top-1 w-2 h-2 rounded-full bg-dcore-red"></div>
                    <p className="font-semibold text-slate-800">{act.text}</p>
                    <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                      {act.user} • {new Date(act.timestamp).toLocaleString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>

        {/* Drawer Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
          <button
            onClick={closeTaskDrawer}
            className="px-5 py-2 text-xs font-bold bg-slate-900 text-white rounded-xl hover:bg-slate-800"
          >
            Close Panel
          </button>
        </div>
      </div>
    </div>
  );
};
