import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Kanban,
  ListOrdered,
  Lightbulb,
  FolderKanban,
  Users,
  BarChart3,
  History,
  Settings,
  Sparkles,
  ArrowUpRight
} from 'lucide-react';

export const Sidebar = () => {
  const { activeTab, navigate, state } = useApp();

  const currentWorksCount = (state.tasks || []).filter(t => t.type === 'CURRENT_WORK' && t.status !== 'COMPLETED').length;
  const workQueueCount = (state.tasks || []).filter(t => t.type === 'WORK_QUEUE').length;
  const ideasCount = (state.ideas || []).filter(i => i.status !== 'CONVERTED TO PROJECT').length;
  const projectsCount = (state.projects || []).length;
  const historyCount = (state.history || []).length;

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'current-works', label: 'Current Works', icon: Kanban, badge: currentWorksCount, badgeColor: 'bg-emerald-100 text-emerald-800' },
    { id: 'work-queue', label: 'Work Queue', icon: ListOrdered, badge: workQueueCount, badgeColor: 'bg-amber-100 text-amber-800' },
    { id: 'future-ideas', label: 'Future Ideas', icon: Lightbulb, badge: ideasCount, badgeColor: 'bg-blue-100 text-blue-800' },
    { id: 'projects', label: 'Projects', icon: FolderKanban, badge: projectsCount },
    { id: 'team', label: 'Team & Workload', icon: Users },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'history', label: 'History Log', icon: History, badge: historyCount, badgeColor: 'bg-red-100 text-dcore-red' },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-slate-200/80 bg-white min-h-[calc(100vh-61px)] p-4 select-none shrink-0">
      
      {/* Primary Navigation Menu */}
      <div className="space-y-1">
        <p className="px-3 text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-2">
          Navigation Pipeline
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl font-semibold text-xs transition-all duration-200 group ${
                isActive
                  ? 'bg-red-50/90 text-dcore-red shadow-sm border border-red-100/80'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-dcore-red' : 'text-slate-400 group-hover:text-slate-600'
                }`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-slate-100 text-slate-600'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* DMK Core Ecosystem Showcase Card */}
      <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-slate-900 via-slate-800 to-dcore-maroon text-white shadow-card relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-dcore-red/10 rounded-full blur-xl group-hover:scale-150 transition-transform"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 text-xs font-bold text-red-300 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Ecosystem</span>
          </div>
          <h4 className="font-extrabold text-sm text-white leading-tight">
            DMK Technology Infrastructure
          </h4>
          <p className="text-[11px] text-slate-300 mt-1.5 leading-relaxed">
            Managing Periyar.net, Makkalveeran.com, Kalaignar.org & TVK Files.
          </p>
          <button
            onClick={() => navigate('projects')}
            className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-white bg-dcore-red hover:bg-dcore-red-hover px-3 py-1.5 rounded-lg transition-colors shadow-sm"
          >
            <span>View All Platforms</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Footer System Status */}
      <div className="mt-auto pt-4 border-t border-slate-100 px-3">
        <div className="flex items-center justify-between text-[11px] text-slate-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-medium">NOC Active</span>
          </div>
          <span className="font-mono text-[10px] bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
            v1.0.5
          </span>
        </div>
      </div>
    </aside>
  );
};
