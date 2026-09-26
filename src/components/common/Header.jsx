import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Plus,
  Bell,
  CheckCircle2,
  Globe,
  ShieldCheck,
  Lock,
  LogOut,
  History
} from 'lucide-react';

export const Header = () => {
  const {
    state,
    activeTab,
    navigate,
    setIsSearchOpen,
    setIsQuickAddOpen,
    setQuickAddType,
    userSession,
    logoutUserSession,
    isAdminLoggedIn,
    adminName,
    setIsAdminLoginOpen,
    logoutAdmin
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadNotifs = (state.notifications || []).filter(n => !n.read);

  const handleOpenQuickAdd = (type = 'task') => {
    setQuickAddType(type);
    setIsQuickAddOpen(true);
  };

  return (
    <header className="sticky top-0 z-30 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 lg:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-6">
          <div
            onClick={() => navigate('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src="https://res.cloudinary.com/dikaxqooz/image/upload/v1790443218/ChatGPT_Image_Sep_26_2026_10_47_31_PM_mtiwsu.png"
              alt="D-CORE Logo"
              className="w-10 h-10 object-contain rounded-xl shadow-sm border border-slate-100 group-hover:scale-105 transition-transform"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-xl text-slate-900 group-hover:text-dcore-red transition-colors">
                  D-CORE
                </span>
                <span className="text-[10px] font-bold uppercase tracking-widest px-1.5 py-0.5 rounded bg-red-50 text-dcore-red border border-red-100">
                  OPS
                </span>
              </div>
              <p className="text-[10px] font-semibold tracking-wider text-slate-500 uppercase -mt-0.5">
                OPERATIONS
              </p>
            </div>
          </div>

          {/* Quick Landing Page & History Log Toggles */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => navigate(activeTab === 'landing' ? 'dashboard' : 'landing')}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                activeTab === 'landing'
                  ? 'bg-dcore-red text-white border-dcore-red shadow-sm'
                  : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <Globe className="w-3.5 h-3.5" />
              <span>{activeTab === 'landing' ? 'Operations Center' : 'Public Landing Page'}</span>
            </button>

            <button
              onClick={() => navigate('history')}
              className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
                activeTab === 'history'
                  ? 'bg-dcore-red text-white border-dcore-red shadow-sm'
                  : 'bg-red-50/80 text-dcore-red border-red-200 hover:bg-red-100'
              }`}
            >
              <History className="w-3.5 h-3.5" />
              <span>History Log</span>
            </button>
          </div>
        </div>

        {/* Middle: Search trigger */}
        <div className="hidden lg:flex items-center gap-4 flex-1 max-w-md">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200/90 text-slate-400 text-sm transition-all shadow-inner hover:border-slate-300"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-400" />
              <span className="text-slate-500 font-medium">Search projects, tasks, ideas...</span>
            </div>
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-white border border-slate-200 rounded shadow-2xs">
              ⌘K
            </kbd>
          </button>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-2 lg:gap-3">
          
          {/* Notifications Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsNotifOpen(!isNotifOpen)}
              className="relative p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-dcore-red text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-hover border border-slate-200 p-4 z-50 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-dcore-red" />
                    <h4 className="font-bold text-sm text-slate-900">Notifications</h4>
                  </div>
                  <span className="text-xs font-semibold text-dcore-red bg-red-50 px-2 py-0.5 rounded-full">
                    {unreadNotifs.length} new
                  </span>
                </div>
                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto my-2">
                  {(state.notifications || []).map((n) => (
                    <div key={n.id} className="py-3 px-1 hover:bg-slate-50/80 rounded-lg transition-colors flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-red-50 text-dcore-red mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-slate-800">{n.title}</p>
                        <p className="text-xs text-slate-600 mt-0.5">{n.message}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-slate-100 text-center">
                  <button
                    onClick={() => setIsNotifOpen(false)}
                    className="text-xs font-semibold text-dcore-red hover:underline"
                  >
                    Close Drawer
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Quick Add Button */}
          <button
            onClick={() => handleOpenQuickAdd('task')}
            className="flex items-center gap-1.5 bg-gradient-to-r from-dcore-red to-dcore-maroon text-white px-3.5 py-2 rounded-xl font-bold text-xs shadow-md shadow-dcore-red/20 hover:opacity-95 hover:scale-[1.02] active:scale-[0.98] transition-all"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">Quick Add</span>
          </button>

          {/* User Session Profile & Sign Out Control */}
          <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl text-xs">
            <div className="text-left hidden sm:block">
              <p className="text-[10px] font-black uppercase text-dcore-red leading-none">
                {isAdminLoggedIn ? 'ADMIN' : 'INTERNAL USER'}
              </p>
              <p className="text-xs font-extrabold text-slate-900 leading-tight mt-0.5">
                {userSession.userName || adminName || 'Internal Member'}
              </p>
            </div>

            {!isAdminLoggedIn && (
              <button
                onClick={() => setIsAdminLoginOpen(true)}
                className="text-[10px] bg-slate-900 text-white font-bold px-2 py-1 rounded hover:bg-slate-800 transition-colors flex items-center gap-1"
                title="Unlock Admin Edit Access"
              >
                <Lock className="w-3 h-3 text-red-400" />
                <span>Admin Login</span>
              </button>
            )}

            <button
              onClick={logoutUserSession}
              className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
              title="Sign Out of Portal"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
