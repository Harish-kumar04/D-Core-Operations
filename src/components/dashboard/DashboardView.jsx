import React from 'react';
import { useApp } from '../../context/AppContext';
import { QuoteCard } from '../common/QuoteCard';
import {
  FolderKanban,
  Kanban,
  ListOrdered,
  Lightbulb,
  CheckCircle2,
  ArrowRight,
  Clock,
  AlertOctagon,
  Sparkles,
  TrendingUp,
  Activity,
  UserCheck
} from 'lucide-react';

export const DashboardView = () => {
  const { state, navigate, openTaskDrawer } = useApp();

  const projects = state.projects || [];
  const tasks = state.tasks || [];
  const ideas = state.ideas || [];

  // Dynamic stat counts
  const activeProjectsCount = projects.filter(p => p.status === 'active').length;
  const currentWorksCount = tasks.filter(t => t.type === 'CURRENT_WORK' && t.status !== 'COMPLETED').length;
  const worksToDoCount = tasks.filter(t => t.type === 'WORK_QUEUE').length;
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
    <div className="space-y-8 pb-12 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-dcore-maroon text-white p-6 sm:p-8 shadow-card">
        {/* Subtle Background Elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-dcore-red/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-dcore-red/20 border border-dcore-red/40 text-red-300 text-xs font-bold uppercase tracking-wider mb-3">
              <Sparkles className="w-3.5 h-3.5" />
              <span>D-Core Command Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Good Morning, D-Core 👋
            </h1>
            <p className="text-sm text-slate-300 mt-1 max-w-xl leading-relaxed font-medium">
              Here's what's happening across the digital operations pipeline for DMK platforms & IT infrastructure.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('current-works')}
              className="bg-dcore-red hover:bg-dcore-red-hover text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-lg shadow-dcore-red/30 flex items-center gap-2 transition-all hover:scale-105"
            >
              <Kanban className="w-4 h-4" />
              <span>Go to Current Works</span>
            </button>
            <button
              onClick={() => navigate('analytics')}
              className="bg-white/10 hover:bg-white/20 text-white px-4 py-2.5 rounded-xl font-bold text-xs backdrop-blur-md border border-white/20 transition-all"
            >
              View Analytics
            </button>
          </div>
        </div>
      </div>

      {/* Integrated Periyar Inspirational Value Quote */}
      <QuoteCard
        quote="மனிதன் தனது தன்மானத்தையும் சுயமரியாதையையும் உயிரைவிட உயர்வாகக் கருத வேண்டும்."
        speaker="தந்தை பெரியார்"
        variant="minimal"
      />

      {/* 5 Summary Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-5 gap-3 sm:gap-4">
        {/* Active Projects */}
        <div
          onClick={() => navigate('projects')}
          className="glass-card p-4 rounded-2xl cursor-pointer hover:border-dcore-red/30 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Active Projects
            </span>
            <div className="p-2 rounded-xl bg-red-50 text-dcore-red group-hover:scale-110 transition-transform">
              <FolderKanban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {String(activeProjectsCount).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-semibold text-slate-400">Preloaded Ecosystem</span>
          </div>
        </div>

        {/* Current Works */}
        <div
          onClick={() => navigate('current-works')}
          className="glass-card p-4 rounded-2xl cursor-pointer hover:border-emerald-300 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Current Works
            </span>
            <div className="p-2 rounded-xl bg-emerald-50 text-emerald-600 group-hover:scale-110 transition-transform">
              <Kanban className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {String(currentWorksCount).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-semibold text-emerald-600 font-mono">🟢 Active Now</span>
          </div>
        </div>

        {/* Works To Do */}
        <div
          onClick={() => navigate('work-queue')}
          className="glass-card p-4 rounded-2xl cursor-pointer hover:border-amber-300 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Works To Do
            </span>
            <div className="p-2 rounded-xl bg-amber-50 text-amber-600 group-hover:scale-110 transition-transform">
              <ListOrdered className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {String(worksToDoCount).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-semibold text-amber-600 font-mono">🟡 Work Queue</span>
          </div>
        </div>

        {/* Future Ideas */}
        <div
          onClick={() => navigate('future-ideas')}
          className="glass-card p-4 rounded-2xl cursor-pointer hover:border-blue-300 transition-all group"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Future Ideas
            </span>
            <div className="p-2 rounded-xl bg-blue-50 text-blue-600 group-hover:scale-110 transition-transform">
              <Lightbulb className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {String(futureIdeasCount).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-semibold text-blue-600 font-mono">🔵 Idea Vault</span>
          </div>
        </div>

        {/* Completed */}
        <div
          onClick={() => navigate('current-works')}
          className="glass-card p-4 rounded-2xl cursor-pointer hover:border-purple-300 transition-all group col-span-2 lg:col-span-1"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
              Completed
            </span>
            <div className="p-2 rounded-xl bg-purple-50 text-purple-600 group-hover:scale-110 transition-transform">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline justify-between">
            <span className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">
              {String(completedCount).padStart(2, '0')}
            </span>
            <span className="text-[10px] font-semibold text-purple-600 font-mono">✓ Finished</span>
          </div>
        </div>
      </div>

      {/* DASHBOARD WORK STATUS VISUALIZATION */}
      <div className="glass-card p-6 rounded-2xl border border-slate-200/80">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-base font-extrabold text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-dcore-red" />
              Digital Operational Workflow Pipeline
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Lifecycle of operational requirements from initial idea to production release.
            </p>
          </div>
        </div>

        {/* Stage Visualization Flow */}
        <div className="grid grid-cols-2 md:grid-cols-6 gap-3 relative">
          {[
            { key: 'IDEAS', label: 'IDEAS', count: stageCounts.IDEAS, color: 'border-blue-200 bg-blue-50/50 text-blue-700', tab: 'future-ideas' },
            { key: 'PLANNED', label: 'PLANNED', count: stageCounts.PLANNED, color: 'border-amber-200 bg-amber-50/50 text-amber-700', tab: 'work-queue' },
            { key: 'TO DO', label: 'TO DO', count: stageCounts['TO DO'], color: 'border-slate-200 bg-slate-50 text-slate-700', tab: 'current-works' },
            { key: 'IN PROGRESS', label: 'IN PROGRESS', count: stageCounts['IN PROGRESS'], color: 'border-rose-200 bg-rose-50 text-dcore-red', tab: 'current-works' },
            { key: 'REVIEW', label: 'REVIEW', count: stageCounts.REVIEW, color: 'border-indigo-200 bg-indigo-50 text-indigo-700', tab: 'current-works' },
            { key: 'COMPLETED', label: 'COMPLETED', count: stageCounts.COMPLETED, color: 'border-emerald-200 bg-emerald-50 text-emerald-700', tab: 'current-works' }
          ].map((stage, idx, arr) => (
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
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <AlertOctagon className="w-5 h-5 text-dcore-red" />
              <h3 className="font-extrabold text-sm text-slate-900">Priority Operational Watchlist</h3>
            </div>
            <button
              onClick={() => navigate('current-works')}
              className="text-xs font-bold text-dcore-red hover:underline flex items-center gap-1"
            >
              <span>View All Tasks</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {urgentTasks.map((t) => {
              const proj = projects.find(p => p.id === t.projectId);
              const owner = state.team.find(m => m.id === t.ownerId);

              return (
                <div
                  key={t.id}
                  onClick={() => openTaskDrawer(t.id)}
                  className="p-4 rounded-xl border border-slate-200/90 hover:border-dcore-red/40 bg-white hover:bg-slate-50/50 transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                >
                  <div className="flex items-start gap-3">
                    <span className={t.priority === 'P0' ? 'badge-p0' : 'badge-p1'}>
                      {t.priority}
                    </span>
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 group-hover:text-dcore-red transition-colors">
                        {t.title}
                      </h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        Project: <span className="font-semibold text-slate-700">{proj?.name || 'DMK Core'}</span> • Owner: <span className="font-semibold text-slate-700">{owner?.name || 'Unassigned'}</span>
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs shrink-0 self-end sm:self-center">
                    <div className="text-right">
                      <p className="text-[10px] text-slate-400 font-bold uppercase">Progress</p>
                      <p className="font-mono font-bold text-dcore-red">{t.progress}%</p>
                    </div>
                    <div className="w-16 bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div className="bg-dcore-red h-full rounded-full" style={{ width: `${t.progress}%` }}></div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right 1 Col: Centralized Activity Feed */}
        <div className="glass-card p-6 rounded-2xl space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-dcore-red" />
              <h3 className="font-extrabold text-sm text-slate-900">Centralized Activity</h3>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 bg-red-50 text-dcore-red rounded">Live</span>
          </div>

          <div className="space-y-4">
            {recentActivities.map((act) => (
              <div key={act.id} className="flex items-start gap-3 text-xs">
                <div className="w-2 h-2 rounded-full bg-dcore-red mt-1.5 shrink-0 ring-4 ring-red-50"></div>
                <div>
                  <p className="font-medium text-slate-800 leading-tight">{act.text}</p>
                  <div className="flex items-center gap-2 mt-1 text-[10px] text-slate-400 font-semibold">
                    <span>{act.user}</span>
                    <span>•</span>
                    <span>{new Date(act.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
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
