import React from 'react';
import { useApp } from '../../context/AppContext';
import { QuoteCard } from '../common/QuoteCard';
import { ProjectDetailView } from './ProjectDetailView';
import {
  FolderKanban,
  Plus,
  ExternalLink,
  ChevronRight,
  Edit3
} from 'lucide-react';

export const ProjectsView = () => {
  const { state, selectedProjectId, navigate, setIsQuickAddOpen, setQuickAddType, openEditModal } = useApp();

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
    <div className="space-y-6 pb-12 animate-in fade-in duration-300 select-none">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8E8E8] shadow-soft">
        <div>
          <div className="flex items-center gap-2 text-[#E42129] text-xs font-black uppercase tracking-wider mb-1">
            <FolderKanban className="w-4 h-4" />
            <span>Digital Platform Portfolio</span>
          </div>
          <h1 className="text-2xl font-black text-[#111111] tracking-tight">PROJECTS</h1>
          <p className="text-xs text-[#666666] font-medium mt-1">
            Core platforms and digital repositories operated by the D-Core technology team for DMK.
          </p>
        </div>

        <button
          onClick={handleOpenAddProject}
          className="btn-primary self-start sm:self-center shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ New Project</span>
        </button>
      </div>

      {/* Integrated Periyar Rationalism Quote Card */}
      <QuoteCard
        quote="கேள்வி கேட்கத் துணிவில்லாத சமூகம் முன்னேற முடியாது."
        speaker="தந்தை பெரியார்"
        variant="minimal"
      />

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {state.projects.map((proj) => {
          const owner = state.team.find(m => m.id === proj.ownerId);
          const projTasks = state.tasks.filter(t => t.projectId === proj.id);

          return (
            <div
              key={proj.id}
              onClick={() => navigate('projects', proj.id)}
              className="glass-card p-6 rounded-2xl border border-[#E8E8E8] bg-white hover:border-[#E42129]/40 cursor-pointer transition-all space-y-4 group relative"
            >
              {/* Card Header */}
              <div className="flex items-start justify-between gap-3">
                <div>
                  <div className="flex items-center gap-2 mb-1.5">
                    <span className={proj.priority === 'P0' ? 'badge-p0' : 'badge-p1'}>
                      {proj.priority}
                    </span>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-emerald-50 text-emerald-700 border border-emerald-200">
                      {proj.status}
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-[#111111] group-hover:text-[#E42129] transition-colors flex items-center gap-2">
                    <span>{proj.name}</span>
                  </h3>
                </div>

                <div className="flex items-center gap-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      openEditModal('PROJECT', proj);
                    }}
                    className="p-2 rounded-xl bg-[#F5F5F5] hover:bg-red-50 text-[#666666] hover:text-[#E42129] border border-[#E8E8E8] transition-colors"
                    title="Edit Project Entry"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>

                  {proj.url && (
                    <a
                      href={proj.url}
                      target="_blank"
                      rel="noreferrer"
                      onClick={(e) => e.stopPropagation()}
                      className="p-2 rounded-xl bg-[#F5F5F5] hover:bg-red-50 text-[#666666] hover:text-[#E42129] border border-[#E8E8E8] transition-colors"
                      title="Open Website"
                    >
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-xs text-[#333333] font-medium leading-relaxed line-clamp-2">
                {proj.description}
              </p>

              {/* Progress Bar */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs font-bold">
                  <span className="text-[#666666]">Progress</span>
                  <span className="font-mono font-bold text-[#E42129]">{proj.progress}%</span>
                </div>
                <div className="w-full bg-[#F5F5F5] h-2 rounded-full overflow-hidden border border-[#E8E8E8]">
                  <div
                    className="bg-[#E42129] h-full rounded-full transition-all duration-500"
                    style={{ width: `${proj.progress}%` }}
                  ></div>
                </div>
              </div>

              {/* Footer details */}
              <div className="pt-3 border-t border-[#E8E8E8] flex items-center justify-between text-xs text-[#666666] font-medium">
                <div className="flex items-center gap-1.5">
                  {owner ? (
                    <span className="font-bold text-[#111111]">{owner.name}</span>
                  ) : (
                    <span>DMK Technology Team</span>
                  )}
                </div>

                <div className="flex items-center gap-3 font-extrabold text-[#111111]">
                  <span>{projTasks.length} Tasks</span>
                  <ChevronRight className="w-4 h-4 text-[#666666] group-hover:text-[#E42129] group-hover:translate-x-1 transition-all" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
