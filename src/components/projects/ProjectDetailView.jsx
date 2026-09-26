import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  FolderKanban,
  ExternalLink,
  Calendar,
  User,
  CheckCircle2,
  Clock,
  ArrowLeft,
  Plus,
  Activity,
  Kanban,
  FileText,
  Lightbulb
} from 'lucide-react';

export const ProjectDetailView = ({ projectId, onBack }) => {
  const { state, openTaskDrawer, setIsQuickAddOpen, setQuickAddType } = useApp();
  const [activeTab, setActiveTab] = useState('overview');

  const project = (state.projects || []).find(p => p.id === projectId);

  if (!project) return <div>Project not found.</div>;

  const owner = (state.team || []).find(m => m.id === project.ownerId);
  const projectTasks = (state.tasks || []).filter(t => t.projectId === project.id);
  const projectActivities = (state.activities || []).filter(a => a.projectId === project.id);

  const completedTasksCount = projectTasks.filter(t => t.status === 'COMPLETED').length;

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Top Navigation Back Button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-dcore-red transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to All Projects</span>
      </button>

      {/* Project Banner Header */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className={project.priority === 'P0' ? 'badge-p0' : 'badge-p1'}>
                {project.priority}
              </span>
              <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                {project.status}
              </span>
              <span className="text-[10px] font-mono text-slate-400">ID: {project.id}</span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3">
              <span>{project.name}</span>
              {project.url && (
                <a
                  href={project.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1.5 rounded-lg bg-slate-100 text-slate-500 hover:text-dcore-red hover:bg-red-50 transition-colors"
                  title="Visit Website"
                >
                  <ExternalLink className="w-5 h-5" />
                </a>
              )}
            </h1>

            <p className="text-xs text-slate-600 mt-2 max-w-2xl leading-relaxed font-medium">
              {project.description}
            </p>
          </div>

          {/* Overall Progress Bar */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 min-w-[240px] space-y-2">
            <div className="flex items-center justify-between text-xs font-bold">
              <span className="text-slate-500">PROJECT PROGRESS</span>
              <span className="font-mono text-dcore-red text-sm font-extrabold">{project.progress}%</span>
            </div>
            {/* Visual ASCII Progress Representation */}
            <div className="font-mono text-xs tracking-tighter text-dcore-red overflow-hidden select-none">
              {'█'.repeat(Math.round(project.progress / 5))}
              {'░'.repeat(20 - Math.round(project.progress / 5))}
            </div>
            <p className="text-[10px] text-slate-400 text-right">
              {completedTasksCount} of {projectTasks.length} tasks finished
            </p>
          </div>
        </div>

        {/* Project Metadata bar */}
        <div className="pt-4 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-4 text-xs font-medium">
          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px] block">Project Owner</span>
            <div className="flex items-center gap-1.5 mt-1 font-bold text-slate-800">
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

          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px] block">Category</span>
            <span className="font-bold text-slate-800 mt-1 block">{project.category}</span>
          </div>

          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px] block">Start Date</span>
            <span className="font-bold text-slate-800 mt-1 block font-mono">{project.startDate || 'Jan 2026'}</span>
          </div>

          <div>
            <span className="text-slate-400 font-bold uppercase text-[10px] block">Target Completion</span>
            <span className="font-bold text-slate-800 mt-1 block font-mono">{project.targetDate || 'Nov 2026'}</span>
          </div>
        </div>
      </div>

      {/* Detail View Tabs */}
      <div className="flex border-b border-slate-200 gap-2 font-bold text-xs">
        {[
          { id: 'overview', label: 'Overview' },
          { id: 'tasks', label: `Tasks (${projectTasks.length})` },
          { id: 'timeline', label: 'Timeline' },
          { id: 'notes', label: 'Notes & Updates' },
          { id: 'activity', label: `Activity (${projectActivities.length})` }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`pb-3 px-3 transition-colors border-b-2 ${
              activeTab === tab.id
                ? 'border-dcore-red text-dcore-red'
                : 'border-transparent text-slate-500 hover:text-slate-900'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content: Tasks */}
      {activeTab === 'tasks' && (
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-extrabold text-slate-900">Project Operational Tasks</h3>
            <button
              onClick={() => {
                setQuickAddType('task');
                setIsQuickAddOpen(true);
              }}
              className="bg-dcore-red text-white text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-dcore-red-hover"
            >
              + Add Task to Project
            </button>
          </div>

          <div className="grid grid-cols-1 gap-3">
            {projectTasks.map(t => (
              <div
                key={t.id}
                onClick={() => openTaskDrawer(t.id)}
                className="p-4 rounded-xl border border-slate-200 bg-white hover:border-dcore-red/40 cursor-pointer flex items-center justify-between transition-all"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className={t.priority === 'P0' ? 'badge-p0' : 'badge-p1'}>{t.priority}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">{t.status}</span>
                  </div>
                  <h4 className="font-bold text-xs text-slate-900">{t.title}</h4>
                </div>

                <div className="text-right">
                  <span className="text-xs font-mono font-bold text-dcore-red">{t.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab Content: Overview */}
      {activeTab === 'overview' && (
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <h3 className="text-sm font-extrabold text-slate-900">Project Overview & Architecture</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            {project.description}
          </p>
          {project.url && (
            <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-center justify-between text-xs">
              <span className="font-semibold text-slate-700">Live Website URL:</span>
              <a href={project.url} target="_blank" rel="noreferrer" className="text-dcore-red font-bold hover:underline">
                {project.url}
              </a>
            </div>
          )}
        </div>
      )}

      {/* Tab Content: Activity */}
      {activeTab === 'activity' && (
        <div className="glass-card p-6 rounded-2xl space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 mb-4">Project Activity Feed</h3>
          {projectActivities.map(a => (
            <div key={a.id} className="text-xs border-l-2 border-dcore-red pl-3 py-1">
              <p className="font-bold text-slate-800">{a.text}</p>
              <p className="text-[10px] text-slate-400 font-mono mt-0.5">{a.user} • {new Date(a.timestamp).toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: Notes */}
      {activeTab === 'notes' && (
        <div className="glass-card p-6 rounded-2xl space-y-3">
          <h3 className="text-sm font-extrabold text-slate-900 mb-2">Project Notes Log</h3>
          {(project.notes || []).map((n, i) => (
            <div key={i} className="p-3 rounded-xl bg-amber-50/60 border border-amber-200 text-xs font-mono text-slate-700">
              • {n}
            </div>
          ))}
        </div>
      )}

      {/* Tab Content: Timeline */}
      {activeTab === 'timeline' && (
        <div className="glass-card p-6 rounded-2xl space-y-3 text-xs">
          <h3 className="text-sm font-extrabold text-slate-900 mb-2">Milestone Timeline</h3>
          <div className="space-y-4 font-mono">
            <div className="flex items-center gap-3">
              <span className="text-dcore-red font-bold">● {project.startDate}</span>
              <span className="text-slate-700 font-semibold">Project Kickoff & Infrastructure Setup</span>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-dcore-red font-bold">● Active Sprint</span>
              <span className="text-slate-700 font-semibold">Current Works & Platform Optimization ({project.progress}% Complete)</span>
            </div>
            <div className="flex items-center gap-3 text-slate-400">
              <span>○ {project.targetDate}</span>
              <span>Target Completion & Production Audit</span>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
