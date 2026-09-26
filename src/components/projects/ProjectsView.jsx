import React from 'react';
import { useApp } from '../../context/AppContext';
import { ProjectDetailView } from './ProjectDetailView';
import {
  FolderKanban,
  Plus,
  ExternalLink,
  ChevronRight,
  Calendar,
  User,
  CheckCircle2,
  Clock
} from 'lucide-react';

export const ProjectsView = () => {
  const { state, selectedProjectId, navigate, setIsQuickAddOpen, setQuickAddType } = useApp();

  // If a specific project is selected, render its detail page
  if (selectedProjectId) {
    return (
      <ProjectDetailView
        projectId={selectedProjectId}
        onBack={() => navigate('projects', null)}
      />
    );
  }

  const handleOpenAddProject = () => {
    setQuickAddType('project');
    setIsQuickAddOpen(true);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
        <div>
          <div className="flex items-center gap-2 text-dcore-red text-xs font-bold uppercase tracking-wider mb-1">
            <FolderKanban className="w-4 h-4" />
            <span>Digital Platform Portfolio</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">PROJECTS</h1>
          <p className="text-xs text-slate-500 mt-1">
            Core platforms and digital repositories operated by the D-Core technology team for DMK.
          </p>
        </div>

        <button
          onClick={handleOpenAddProject}
          className="bg-dcore-red hover:bg-dcore-red-hover text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-dcore-red/20 flex items-center gap-2 transition-all self-start sm:self-center"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ New Project</span>
        </button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {state.projects.map((proj) => {
          const owner = state.team.find(m => m.id === proj.ownerId);
          const projTasks = state.tasks.filter(t => t.projectId === proj.id);

          return (
            <div
              key={proj.id}
              onClick={() => navigate('projects', proj.id)}
              className="glass-card p-6 rounded-2xl border border-slate-200/90 bg-white hover:border-dcore-red/40 cursor-pointer transition-all space-y-4 group"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={proj.priority === 'P0' ? 'badge-p0' : 'badge-p1'}>
                      {proj.priority}
                    </span>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {proj.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-900 group-hover:text-dcore-red transition-colors flex items-center gap-2">
                    <span>{proj.name}</span>
                  </h3>
                </div>

                {proj.url && (
                  <a
                    href={proj.url}
                    target="_blank"
                    rel="noreferrer"
                    onClick={(e) => e.stopPropagation()}
                    className="p-2 rounded-xl bg-slate-50 hover:bg-red-50 text-slate-400 hover:text-dcore-red border border-slate-200 transition-colors"
                    title="Open Website"
                  >
                    <ExternalLink className="w-4 h-4" />
                  </a>
                )}
              </div>

              {/* Description */}
              <p className="text-xs text-slate-600 leading-relaxed line-clamp-2">
                {proj.description}
              </p>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-semibold">
                  <span className="text-slate-500">Progress</span>
                  <span className="font-mono font-bold text-dcore-red">{proj.progress}%</span>
                </div>
                <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-dcore-red to-dcore-maroon h-full rounded-full transition-all duration-500"
                    style={{ width: `${proj.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Footer details */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <div className="flex items-center gap-1.5">
                  {owner ? (
                    <>
                      <img src={owner.avatar} alt={owner.name} className="w-5 h-5 rounded-full object-cover" />
                      <span className="font-bold text-slate-700">{owner.name}</span>
                    </>
                  ) : (
                    <span>Unassigned</span>
                  )}
                </div>

                <div className="flex items-center gap-3 font-semibold text-slate-600">
                  <span>{projTasks.length} Tasks</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 group-hover:text-dcore-red group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
