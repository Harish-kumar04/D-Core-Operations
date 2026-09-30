import React from 'react';
import { useApp } from '../../context/AppContext';
import { QuoteCard } from '../common/QuoteCard';
import {
  FolderKanban,
  ListOrdered,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  AlertOctagon,
  Sparkles,
  TrendingUp,
  Activity
} from 'lucide-react';

export const DashboardView = () => {
  const { state, navigate } = useApp();

  const projects = state.projects || [];
  const tasks = state.tasks || [];
  const ideas = state.ideas || [];

  // Dynamic stat counts
  const activeProjectsCount = projects.filter(p => p.status === 'active').length;
  const workQueueCount = tasks.filter(t => t.type === 'WORK_QUEUE').length;
  const futureIdeasCount = ideas.filter(i => i.status !== 'CONVERTED TO PROJECT').length;
  const completedCount = tasks.filter(t => t.status === 'COMPLETED').length;

  // Workflow stage counts
  const stageCounts = {
    IDEAS: ideas.length,
    PLANNED: tasks.filter(t => t.status === 'PLANNED').length,
    'TO DO': tasks.filter(t => t.status === 'TO DO').length,
    'IN PROGRESS': tasks.filter(t => t.status === 'IN PROGRESS').length,
    REVIEW: tasks.filter(t => t.status === 'REVIEW').length,
    COMPLETED: completedCount
  };

  const urgentTasks = tasks
    .filter(t => t.priority === 'P0' || t.priority === 'P1')
    .slice(0, 4);

  const recentActivities = (state.activities || []).slice(0, 6);

  return (
    <div className="space-y-8 pb-12 animate-in fade-in duration-300 select-none">
      
      {/* Header Banner — Editorial DMK Dark Container */}
      <div className="relative overflow-hidden rounded-3xl bg-[#111111] text-white p-6 sm:p-8 shadow-card border border-[#E8E8E8]">
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <img
            src="https://res.cloudinary.com/dikaxqooz/image/upload/w_800,f_auto,q_auto/v1790532799/5_qfwfnk.png"
            alt="DMK Operations Background"
            className="w-full h-full object-cover opacity-30"
            width="800"
            height="300"
            loading="lazy"
            decoding="async"
          />
        </div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E42129] text-white text-xs font-black uppercase tracking-wider mb-3 shadow-xs">
              <Sparkles className="w-3.5 h-3.5" />
              <span>D-Core Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Good Morning, D-Core 👋
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-xl leading-relaxed font-medium">
              Here's what's happening across the digital operations pipeline for DMK platforms & IT infrastructure.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('work-queue')}
              className="btn-primary px-5 py-3"
            >
              <ListOrdered className="w-4 h-4" />
              <span>Go to Work Queue</span>
            </button>
            <button
              onClick={() => navigate('analytics')}
              className="btn-secondary text-white border-white/30 hover:border-white hover:text-white bg-white/10 hover:bg-white/20 backdrop-blur-md px-4 py-3"
            >
              View Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Integrated Periyar Self-Respect Quote Card */}
      <QuoteCard
        quote="சுயமரியாதை இல்லாத வாழ்க்கை, பிறர் கருணையில் உயிர்வாழும் அடிமைத்தனமே."
        speaker="தந்தை பெரியார்"
        variant="minimal"
      />

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Active Projects */}
        <div
          onClick={() => navigate('projects')}
          className="glass-card p-4 rounded-2xl cursor-pointer hover:border-[#E42129]/40 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#666666]">
              Active Projects
            </span>
            <div className="p-2 rounded-xl bg-red-50 text-[#E42129] group-hover:scale-110 transition-transform">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
              {String(activeProjectsCount).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-bold text-[#666666]">Ecosystem</span>
          </div>
        </div>

        {/* Works To Do */}
        <div
          onClick={() => navigate('work-queue')}
          className="glass-card p-4 rounded-2xl cursor-pointer hover:border-amber-300 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#666666]">
              Work Queue
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
              <ListOrdered className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
              {String(workQueueCount).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-bold text-amber-600 font-mono">🟡 Queue</span>
          </div>
        </div>

        {/* Future Ideas */}
        <div
          onClick={() => navigate('future-ideas')}
          className="glass-card p-4 rounded-2xl cursor-pointer hover:border-blue-300 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#666666]">
              Future Ideas
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
              <Lightbulb className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
              {String(futureIdeasCount).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-bold text-blue-600 font-mono">🔵 Ideas</span>
          </div>
        </div>

        {/* Completed */}
        <div
          onClick={() => navigate('work-queue')}
          className="glass-card p-4 rounded-2xl cursor-pointer hover:border-purple-300 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[10px] font-black uppercase tracking-wider text-[#666666]">
              Completed
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-[#111111] tracking-tight">
              {String(completedCount).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-bold text-purple-600 font-mono">✓ Finished</span>
          </div>
        </div>
      </div>

      {/* DASHBOARD WORK STATUS VISUALIZATION */}
      <div className="glass-card p-6 rounded-2xl border border-[#E8E8E8]">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-black text-[#111111] flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-[#E42129]" />
              Digital Operational Workflow Pipeline
            </h3>
            <p className="text-xs text-[#666666] font-medium mt-0.5">
              Lifecycle of operational requirements from initial idea to production release.
            </p>
          </div>
        </div>

        {/* Stage Visualization Flow */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 relative">
          {[
            { key: 'IDEAS', label: 'IDEAS', count: stageCounts.IDEAS, color: 'border-blue-200 bg-blue-50/50 text-blue-700', tab: 'future-ideas' },
            { key: 'PLANNED', label: 'PLANNED', count: stageCounts.PLANNED, color: 'border-amber-200 bg-amber-50/50 text-amber-700', tab: 'work-queue' },
            { key: 'TO DO', label: 'TO DO', count: stageCounts['TO DO'], color: 'border-slate-200 bg-slate-50 text-slate-700', tab: 'work-queue' },
            { key: 'IN PROGRESS', label: 'IN PROGRESS', count: stageCounts['IN PROGRESS'], color: 'border-rose-200 bg-rose-50 text-[#E42129]', tab: 'work-queue' },
            { key: 'REVIEW', label: 'REVIEW', count: stageCounts.REVIEW, color: 'border-indigo-200 bg-indigo-50 text-indigo-700', tab: 'work-queue' },
            { key: 'COMPLETED', label: 'COMPLETED', count: stageCounts.COMPLETED, color: 'border-emerald-200 bg-emerald-50 text-emerald-700', tab: 'work-queue' }
          ].map((stage) => (
            <div
              key={stage.key}
              onClick={() => navigate(stage.tab)}
              className={`p-4 rounded-xl border-2 ${stage.color} cursor-pointer hover:scale-105 transition-all text-center group flex flex-col justify-between`}
            >
              <div>
                <p className="text-[10px] font-black tracking-widest uppercase opacity-80 mb-1">
                  {stage.label}
                </p>
                <p className="text-2xl font-black">{stage.count}</p>
              </div>
              <div className="mt-3 flex items-center justify-center text-[10px] font-bold group-hover:underline gap-1">
                <span>View Stage</span>
                <ArrowRight className="w-3 h-3" />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Two-Column Grid: Urgent Watchlist & Activity Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 2 Cols: Priority Watchlist */}
        <div className="lg:col-span-2 glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-[#E42129]" />
              <h3 className="font-extrabold text-sm text-[#111111]">Priority Operational Watchlist</h3>
            </div>
            <button
              onClick={() => navigate('work-queue')}
              className="text-xs font-bold text-[#E42129] hover:underline flex items-center gap-1"
            >
              <span>View All Tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {urgentTasks.map((t) => {
              const proj = projects.find(p => p.id === t.projectId);

              return (
                <div
                  key={t.id}
                  onClick={() => navigate('work-queue')}
                  className="p-4 rounded-xl border border-[#E8E8E8] hover:border-[#E42129]/40 bg-white hover:bg-[#F5F5F5] transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3">
                    <span className={t.priority === 'P0' ? 'badge-p0' : 'badge-p1'}>
                      {t.priority}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-[#111111] group-hover:text-[#E42129] transition-colors">
                        {t.title}
                      </h4>
                      <p className="text-[11px] text-[#666666] mt-0.5 font-medium">
                        Project: <span className="font-bold text-[#111111]">{proj?.name || 'DMK Core'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs shrink-0 self-end sm:self-center">
                    <div className="text-right">
                      <p className="text-[10px] text-[#666666] font-black uppercase">Progress</p>
                      <p className="font-mono font-bold text-[#E42129]">{t.progress}%</p>
                    </div>
                    <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden border border-[#E8E8E8]">
                      <div className="bg-[#E42129] h-full rounded-full" style={{ width: `${t.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Centralized Activity Feed */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-[#E42129]" />
              <h3 className="font-extrabold text-sm text-[#111111]">Centralized Activity</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-red-50 text-[#E42129] rounded border border-red-100">Live</span>
          </div>

          <div className="space-y-4">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-[#E42129] mt-1.5 shrink-0 ring-4 ring-red-50"></div>
                <div>
                  <p className="font-medium text-[#111111] leading-tight">{act.text}</p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-[#666666] font-bold">
                    <span>{act.user}</span>
                    <span>•</span>
                    <span className="font-mono">{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};
