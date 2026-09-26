import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QuoteCard } from '../common/QuoteCard';
import {
  ListOrdered,
  Plus,
  ArrowRight,
  Clock,
  Calendar,
  Layers,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export const WorkQueueView = () => {
  const { state, moveWorkQueueToCurrentWork, setIsQuickAddOpen, setQuickAddType } = useApp();

  const [filterProject, setFilterProject] = useState('ALL');

  let queueItems = (state.tasks || []).filter(t => t.type === 'WORK_QUEUE');

  if (filterProject !== 'ALL') {
    queueItems = queueItems.filter(t => t.projectId === filterProject);
  }

  const handleOpenAddPlanned = () => {
    setQuickAddType('task');
    setIsQuickAddOpen(true);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
        <div>
          <div className="flex items-center gap-2 text-amber-600 text-xs font-bold uppercase tracking-wider mb-1">
            <ListOrdered className="w-4 h-4" />
            <span>Approved Work Repository</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">WORKS TO BE DONE</h1>
          <p className="text-xs text-slate-500 mt-1">
            Approved and planned requirements waiting to be scheduled. Move any item to Current Works when ready.
          </p>
        </div>

        <button
          onClick={handleOpenAddPlanned}
          className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-amber-600/20 flex items-center gap-2 transition-all self-start sm:self-center shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Add Planned Work</span>
        </button>
      </div>

      {/* Integrated Kalaignar Challenge Quote */}
      <QuoteCard
        quote="துணிவிருந்தால் துக்கமில்லை."
        speaker="கலைஞர் மு. கருணாநிதி"
        variant="minimal"
      />

      {/* Workflow Indicator Banner */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-slate-700">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 uppercase">
            Work Queue Flow:
          </span>
          <span className="font-mono">IDEA → PLANNED → READY → 🟢 CURRENT WORK</span>
        </div>
        <span className="text-slate-500 font-normal">
          Clicking <strong>Move to Current Work</strong> transfers task to active Kanban board.
        </span>
      </div>

      {/* Queue Items List */}
      <div className="space-y-4">
        {queueItems.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-slate-200 text-slate-400 space-y-3">
            <ListOrdered className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="text-base font-extrabold text-slate-700">No pending work in queue</h3>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              All approved projects have been transferred to Current Works or no new requirements are pending.
            </p>
            <button
              onClick={handleOpenAddPlanned}
              className="mt-2 bg-amber-600 text-white px-4 py-2 rounded-xl font-bold text-xs hover:bg-amber-700"
            >
              + Add Planned Work Item
            </button>
          </div>
        ) : (
          queueItems.map((item) => {
            const project = state.projects.find(p => p.id === item.projectId);
            const owner = state.team.find(m => m.id === item.ownerId);

            return (
              <div
                key={item.id}
                className="glass-card p-6 rounded-2xl border border-slate-200/90 bg-white hover:border-amber-400/60 transition-all space-y-4"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Metadata */}
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={item.priority === 'P0' ? 'badge-p0' : item.priority === 'P1' ? 'badge-p1' : 'badge-p2'}>
                        {item.priority}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 uppercase">
                        {item.status}
                      </span>
                      <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-0.5 rounded">
                        Project: {project?.name || 'DMK Core'}
                      </span>
                    </div>

                    <h3 className="text-base font-extrabold text-slate-900 mt-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-slate-600 leading-relaxed max-w-3xl">
                      {item.description}
                    </p>
                  </div>

                  {/* Move CTA Button */}
                  <button
                    onClick={() => moveWorkQueueToCurrentWork(item.id)}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-5 py-3 rounded-xl font-extrabold text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all hover:scale-105 shrink-0 self-start lg:self-center"
                  >
                    <span>Move to Current Work</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>

                {/* Bottom Details Grid */}
                <div className="pt-4 border-t border-slate-100 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-slate-600 font-medium">
                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Suggested Owner</span>
                    <div className="flex items-center gap-1.5 mt-0.5 font-bold text-slate-800">
                      {owner ? (
                        <>
                          <img src={owner.avatar} alt={owner.name} className="w-4 h-4 rounded-full object-cover" />
                          <span>{owner.name}</span>
                        </>
                      ) : (
                        <span>Unassigned</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Target Start Date</span>
                    <div className="flex items-center gap-1 mt-0.5 font-bold text-slate-800 font-mono">
                      <Calendar className="w-3.5 h-3.5 text-amber-500" />
                      <span>{item.dueDate || item.targetDate || 'TBD'}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Dependencies</span>
                    <span className="font-semibold text-slate-700 truncate block mt-0.5">
                      {item.dependencies || 'None'}
                    </span>
                  </div>

                  <div>
                    <span className="text-slate-400 font-bold uppercase text-[10px] block">Est. Effort</span>
                    <div className="flex items-center gap-1 mt-0.5 font-bold text-slate-800 font-mono">
                      <Clock className="w-3.5 h-3.5 text-amber-500" />
                      <span>{item.estimatedHours || 16} Hours</span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};
