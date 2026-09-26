import React from 'react';
import { useApp } from '../../context/AppContext';
import { Users, UserPlus, Mail, Briefcase, Award, CheckCircle2, AlertTriangle, Layers } from 'lucide-react';

export const TeamView = () => {
  const { state, setIsQuickAddOpen, setQuickAddType } = useApp();

  const handleOpenAddTeam = () => {
    setQuickAddType('team');
    setIsQuickAddOpen(true);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
        <div>
          <div className="flex items-center gap-2 text-purple-600 text-xs font-bold uppercase tracking-wider mb-1">
            <Users className="w-4 h-4" />
            <span>Human Resource & Workload Center</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">TEAM MANAGEMENT</h1>
          <p className="text-xs text-slate-500 mt-1">
            D-Core technology team operational assignments, skill profiles, and capacity workload allocation.
          </p>
        </div>

        <button
          onClick={handleOpenAddTeam}
          className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-purple-600/20 flex items-center gap-2 transition-all self-start sm:self-center"
        >
          <UserPlus className="w-4 h-4 stroke-[3]" />
          <span>+ Add Team Member</span>
        </button>
      </div>

      {/* TEAM WORKLOAD VISUALIZATION */}
      <div className="glass-card p-6 rounded-2xl border border-slate-200/90 space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-dcore-red" />
              TEAM WORKLOAD ALLOCATION
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Live capacity utilization dynamically calculated from active task assignments.
            </p>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 bg-purple-50 text-purple-700 rounded font-mono">
            Capacity Monitor
          </span>
        </div>

        <div className="space-y-4">
          {state.team.map((member) => {
            const activeTasks = state.tasks.filter(t => t.ownerId === member.id && t.status !== 'COMPLETED');
            const workloadPct = Math.min(100, Math.max(20, activeTasks.length * 20));
            const isOverloaded = workloadPct >= 80;

            return (
              <div key={member.id} className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <img src={member.avatar} alt={member.name} className="w-6 h-6 rounded-full object-cover" />
                    <span className="font-bold text-slate-800">{member.name}</span>
                    <span className="text-slate-400">({member.role})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-mono text-slate-500">Active Tasks: {activeTasks.length}</span>
                    <span className={`font-mono font-extrabold ${isOverloaded ? 'text-red-600' : 'text-emerald-600'}`}>
                      {workloadPct}%
                    </span>
                  </div>
                </div>

                {/* ASCII & Visual Workload Bar */}
                <div className="flex items-center gap-3">
                  <div className="flex-1 bg-slate-100 h-3 rounded-full overflow-hidden p-0.5">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${
                        isOverloaded ? 'bg-gradient-to-r from-amber-500 to-red-600' : 'bg-gradient-to-r from-emerald-500 to-teal-600'
                      }`}
                      style={{ width: `${workloadPct}%` }}
                    ></div>
                  </div>
                  <span className="font-mono text-[10px] text-slate-400 shrink-0">
                    {'█'.repeat(Math.round(workloadPct / 8))}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Team Member Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {state.team.map((member) => {
          const activeTasks = state.tasks.filter(t => t.ownerId === member.id && t.status !== 'COMPLETED');
          const assignedProjects = state.projects.filter(p => p.ownerId === member.id);

          return (
            <div key={member.id} className="glass-card p-6 rounded-2xl border border-slate-200/90 bg-white space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={member.avatar}
                  alt={member.name}
                  className="w-14 h-14 rounded-2xl object-cover ring-2 ring-dcore-red/20 shrink-0"
                />
                <div className="flex-1">
                  <h3 className="text-base font-extrabold text-slate-900">{member.name}</h3>
                  <p className="text-xs font-bold text-dcore-red mt-0.5">{member.role}</p>
                  <p className="text-[11px] text-slate-500 font-medium">{member.department}</p>
                </div>
              </div>

              {/* Skills */}
              <div>
                <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1.5">Skills & Competencies</span>
                <div className="flex flex-wrap gap-1.5">
                  {(member.skills || []).map((sk, i) => (
                    <span key={i} className="text-[10px] font-semibold bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                      {sk}
                    </span>
                  ))}
                </div>
              </div>

              {/* Stat Pills */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-600 font-medium">
                <div>
                  <span className="text-slate-400 text-[10px] block font-bold">Active Tasks</span>
                  <span className="font-extrabold text-slate-900">{String(activeTasks.length).padStart(2, '0')}</span>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] block font-bold">Projects Led</span>
                  <span className="font-extrabold text-slate-900">{String(assignedProjects.length).padStart(2, '0')}</span>
                </div>

                <div>
                  <span className="text-slate-400 text-[10px] block font-bold">Email</span>
                  <span className="font-mono text-[10px] text-dcore-red">{member.email || 'ops@dcore'}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
