import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QuoteCard } from '../common/QuoteCard';
import {
  ListOrdered,
  Plus,
  Clock,
  Calendar,
  Edit3
} from 'lucide-react';

export const WorkQueueView = () => {
  const { state, setIsQuickAddOpen, setQuickAddType, openEditModal } = useApp();

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
    <div className="space-y-6 pb-12 animate-in fade-in duration-300 select-none">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8E8E8] shadow-soft">
        <div>
          <div className="flex items-center gap-2 text-amber-600 text-xs font-black uppercase tracking-wider mb-1">
            <ListOrdered className="w-4 h-4" />
            <span>Approved Work Repository</span>
          </div>
          <h1 className="text-2xl font-black text-[#111111] tracking-tight">WORKS TO BE DONE</h1>
          <p className="text-xs text-[#666666] font-medium mt-1">
            Approved and planned requirements scheduled for execution. Track progress and manage task details.
          </p>
        </div>

        <button
          onClick={handleOpenAddPlanned}
          className="btn-primary self-start sm:self-center shrink-0 bg-amber-600 hover:bg-amber-700 shadow-amber-600/20"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Add Planned Work</span>
        </button>
      </div>

      {/* Integrated Kalaignar Service Quote Card */}
      <QuoteCard
        quote="நம்மால் பயனடைந்தவர்கள் நம்மிடம் நன்றி காட்டுவார்கள் என்று எதிர்பார்க்க வேண்டாம். நாம் செய்தது மனிதத்திற்காக... புகழுக்காக அல்ல."
        speaker="கலைஞர் மு.கருணாநிதி"
        variant="minimal"
      />

      {/* Workflow Indicator Banner */}
      <div className="p-4 rounded-2xl bg-[#F5F5F5] border border-[#E8E8E8] flex flex-col md:flex-row items-center justify-between gap-4 text-xs font-bold text-[#111111]">
        <div className="flex items-center gap-3">
          <span className="px-2.5 py-1 rounded-lg bg-amber-100 text-amber-900 uppercase">
            Work Queue Flow:
          </span>
          <span className="font-mono">IDEA → PLANNED → IN PROGRESS → ✅ COMPLETED</span>
        </div>
        <span className="text-[#666666] font-medium">
          Update task status to track progress through the pipeline.
        </span>
      </div>

      {/* Queue Items List */}
      <div className="space-y-4">
        {queueItems.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-2xl border border-[#E8E8E8] text-slate-400 space-y-3">
            <ListOrdered className="w-12 h-12 mx-auto text-slate-300" />
            <h3 className="text-base font-extrabold text-[#111111]">No pending work in queue</h3>
            <p className="text-xs text-[#666666] font-medium max-w-sm mx-auto">
              All approved projects are completed or no new requirements are pending.
            </p>
            <button
              onClick={handleOpenAddPlanned}
              className="btn-primary mt-2"
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
                className="glass-card p-6 rounded-2xl border border-[#E8E8E8] bg-white hover:border-[#E42129]/40 transition-all space-y-4 relative"
              >
                <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                  {/* Left Metadata */}
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={item.priority === 'P0' ? 'badge-p0' : item.priority === 'P1' ? 'badge-p1' : 'badge-p2'}>
                        {item.priority}
                      </span>
                      <span className="text-[10px] font-black px-2 py-0.5 rounded bg-amber-100 text-amber-900 uppercase border border-amber-200">
                        {item.status}
                      </span>
                      <span className="text-[11px] font-bold text-[#666666] bg-[#F5F5F5] border border-[#E8E8E8] px-2.5 py-0.5 rounded">
                        Project: {project?.name || 'DMK Core'}
                      </span>
                      <button
                        onClick={() => openEditModal('TASK', item)}
                        className="p-1.5 rounded bg-[#F5F5F5] hover:bg-red-50 text-[#666666] hover:text-[#E42129] border border-[#E8E8E8] transition-colors ml-1"
                        title="Edit Queue Item"
                      >
                        <Edit3 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <h3 className="text-base font-black text-[#111111] mt-2">
                      {item.title}
                    </h3>
                    <p className="text-xs text-[#333333] font-medium leading-relaxed max-w-3xl">
                      {item.description}
                    </p>
                  </div>

                </div>

                {/* Bottom Details Grid */}
                <div className="pt-4 border-t border-[#E8E8E8] grid grid-cols-2 md:grid-cols-4 gap-3 text-xs text-[#666666] font-medium">
                  <div>
                    <span className="text-[#666666] font-black uppercase text-[10px] block">Suggested Owner</span>
                    <div className="flex items-center gap-1.5 mt-0.5 font-bold text-[#111111]">
                      {owner ? (
                        <span>{owner.name}</span>
                      ) : (
                        <span>DMK Ops</span>
                      )}
                    </div>
                  </div>

                  <div>
                    <span className="text-[#666666] font-black uppercase text-[10px] block">Target Start Date</span>
                    <div className="flex items-center gap-1 mt-0.5 font-bold text-[#E42129] font-mono">
                      <Calendar className="w-3.5 h-3.5 text-[#E42129]" />
                      <span>{item.dueDate || item.targetDate || 'TBD'}</span>
                    </div>
                  </div>

                  <div>
                    <span className="text-[#666666] font-black uppercase text-[10px] block">Dependencies</span>
                    <span className="font-bold text-[#111111] truncate block mt-0.5">
                      {item.dependencies || 'None'}
                    </span>
                  </div>

                  <div>
                    <span className="text-[#666666] font-black uppercase text-[10px] block">Est. Effort</span>
                    <div className="flex items-center gap-1 mt-0.5 font-bold text-[#111111] font-mono">
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
