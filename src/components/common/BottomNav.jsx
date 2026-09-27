import React from 'react';
import { useApp } from '../../context/AppContext';
import {
  LayoutDashboard,
  Kanban,
  ListOrdered,
  Lightbulb,
  FolderKanban
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
    <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-[#E8E8E8] px-2 py-1.5 shadow-lg flex items-center justify-around select-none">
      {mobileTabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => navigate(tab.id)}
            className={`flex flex-col items-center py-1.5 px-3 rounded-xl transition-all ${
              isActive ? 'text-[#E42129] font-black bg-red-50 border border-red-100' : 'text-[#666666] font-semibold hover:text-[#111111]'
            }`}
          >
            <Icon className={`w-4 h-4 ${isActive ? 'text-[#E42129] scale-110' : 'text-[#666666]'}`} />
            <span className="text-[10px] mt-0.5">{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
};
