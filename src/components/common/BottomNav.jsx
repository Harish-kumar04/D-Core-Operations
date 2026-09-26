import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Kanban,
  ListOrdered,
  Lightbulb,
  FolderKanban,
  Users
} from 'lucide-react';

export const BottomNav = () => {
  const { activeTab, navigate } = useApp();

  const mobileTabs = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'current-works', label: 'Current', icon: Kanban },
    { id: 'work-queue', label: 'Queue', icon: ListOrdered },
    { id: 'future-ideas', label: 'Ideas', icon: Lightbulb },
    { id: 'projects', label: 'Projects', icon: FolderKanban },
  ];

  return (
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-md border-t border-slate-200 px-2 py-1.5 shadow-lg flex items-center justify-around">
      {mobileTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.id)}
            className={`flex flex-col items-center py-1 px-2.5 rounded-xl transition-all ${
              isActive ? 'text-dcore-red font-bold bg-red-50' : 'text-slate-500 font-medium hover:text-slate-800'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-dcore-red scale-110' : 'text-slate-400'}`} />
            <span className="text-[10px] mt-0.5">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
