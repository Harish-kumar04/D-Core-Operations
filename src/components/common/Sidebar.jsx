import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Kanban,
  ListOrdered,
  Lightbulb,
  FolderKanban,
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
    { id: 'current-works', label: 'Current Works', icon: Kanban, badge: currentWorksCount, badgeColor: 'bg-emerald-50 text-emerald-800 border border-emerald-200' },
    { id: 'work-queue', label: 'Work Queue', icon: ListOrdered, badge: workQueueCount, badgeColor: 'bg-amber-50 text-amber-800 border border-amber-200' },
    { id: 'future-ideas', label: 'Future Ideas', icon: Lightbulb, badge: ideasCount, badgeColor: 'bg-blue-50 text-blue-800 border border-blue-200' },
    { id: 'projects', label: 'Projects', icon: FolderKanban, badge: projectsCount },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'history', label: 'History Log', icon: History, badge: historyCount, badgeColor: 'bg-red-50 text-[#E42129] border border-red-200' },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-64 border-r border-[#E8E8E8] bg-white min-h-[calc(100vh-61px)] p-4 select-none shrink-0">
      
      {/* Primary Navigation Menu */}
      <div className="space-y-1">
        <p className="px-3 text-[10px] font-black uppercase tracking-wider text-[#666666] mb-3">
          Navigation Pipeline
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => navigate(item.id)}
              className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 group relative ${
                isActive
                  ? 'bg-red-50 text-[#E42129] border border-red-100 shadow-xs'
                  : 'text-[#333333] hover:text-[#111111] hover:bg-[#F5F5F5]'
              }`}
            >
              <div className="flex items-center gap-3">
                {isActive && (
                  <span className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-[#E42129] rounded-r-full"></span>
                )}
                <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-[#E42129]' : 'text-[#666666] group-hover:text-[#111111]'
                }`} />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && item.badge > 0 && (
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${item.badgeColor || 'bg-[#F5F5F5] text-[#333333] border border-[#E8E8E8]'}`}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* DMK Core Ecosystem Showcase Card */}
      <div className="mt-8 p-4 rounded-2xl bg-gradient-to-br from-[#111111] via-[#1a1a1a] to-[#E42129] text-white shadow-card relative overflow-hidden group">
        <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full blur-xl group-hover:scale-150 transition-transform pointer-events-none"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-1.5 text-xs font-bold text-red-200 uppercase tracking-wider mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Digital Ecosystem</span>
          </div>
          <h4 className="font-extrabold text-sm text-white leading-tight">
            DMK Technology Infrastructure
          </h4>
          <p className="text-[11px] text-slate-200 mt-1.5 leading-relaxed font-medium">
            Managing Periyar.net, Makkalveeran.com, Kalaignar.org & TVK Files.
          </p>
          <button
            onClick={() => navigate('projects')}
            className="mt-3 inline-flex items-center gap-1 text-[11px] font-bold text-white bg-[#E42129] hover:bg-[#c81920] px-3.5 py-1.5 rounded-lg transition-colors shadow-sm"
          >
            <span>View All Platforms</span>
            <ArrowUpRight className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Footer System Status */}
      <div className="mt-auto pt-4 border-t border-[#E8E8E8] px-3">
        <div className="flex items-center justify-between text-[11px] text-[#666666]">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-bold text-[#333333]">NOC Active</span>
          </div>
          <span className="font-mono text-[10px] bg-[#F5F5F5] px-2 py-0.5 rounded text-[#333333] border border-[#E8E8E8] font-bold">
            v1.0.5
          </span>
        </div>
      </div>
    </aside>
  );
};
