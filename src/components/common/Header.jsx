import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { lockStealthMode } from './StealthGate';
import {
  Search,
  Plus,
  Bell,
  CheckCircle2,
  Lock,
  LogOut,
  History,
  EyeOff
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
    passwordExpiry
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const unreadNotifs = (state.notifications || []).filter(n => !n.read);

  const handleOpenQuickAdd = (type = 'task') => {
    setQuickAddType(type);
    setIsQuickAddOpen(true);
  };

  return (
    <>
      {/* 14-Day Mandatory Password Expiry Warning Banner */}
      {(passwordExpiry?.isExpiringSoon || passwordExpiry?.isExpired) && (
        <div className="bg-[#E42129] text-white px-4 py-2 text-xs font-bold flex items-center justify-between shadow-md z-40 select-none">
          <div className="flex items-center gap-2 max-w-5xl mx-auto w-full justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-white animate-ping"></span>
              <span>
                {passwordExpiry?.isExpired
                  ? '⚠️ MANDATORY SECURITY ACTION REQUIRED: Your Admin Password has EXPIRED after 14 days.'
                  : '⚠️ SECURITY WARNING: Your Admin Password expires TOMORROW (14-day rotation policy).'}
              </span>
            </div>
            <button
              onClick={() => navigate('settings')}
              className="bg-white text-[#E42129] px-3 py-1 rounded-lg font-black uppercase text-[10px] hover:bg-slate-100 transition-colors shadow-xs shrink-0"
            >
              Change Password Now →
            </button>
          </div>
        </div>
      )}

      <header className="sticky top-0 z-30 bg-white border-b border-[#E8E8E8] px-4 lg:px-8 py-3 transition-all select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
        
        {/* Left: Brand Identity */}
        <div className="flex items-center gap-6">
          <div
            onClick={() => navigate('dashboard')}
            className="flex items-center gap-3 cursor-pointer group"
          >
            <img
              src="https://res.cloudinary.com/dikaxqooz/image/upload/w_80,f_auto,q_auto/v1790443218/ChatGPT_Image_Sep_26_2026_10_47_31_PM_mtiwsu.png"
              alt="D-CORE Operations Logo"
              className="w-10 h-10 object-contain rounded-xl shadow-xs border border-[#E8E8E8] group-hover:scale-105 transition-transform"
              width="40"
              height="40"
            />
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold tracking-tight text-xl text-[#111111] group-hover:text-[#E42129] transition-colors">
                  D-CORE
                </span>
                <span className="text-[10px] font-black uppercase tracking-widest px-1.5 py-0.5 rounded bg-red-50 text-[#E42129] border border-red-100">
                  OPS
                </span>
              </div>
              <p className="text-[10px] font-bold tracking-wider text-slate-600 uppercase -mt-0.5">
                OPERATIONS
              </p>
            </div>
          </div>

          {/* History Log Toggle & Stealth Lock Button */}
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => navigate('history')}
              aria-label="View History Audit Log"
              className={`flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-lg border transition-all ${
                activeTab === 'history'
                  ? 'bg-[#E42129] text-white border-[#E42129] shadow-xs'
                  : 'bg-red-50 text-[#E42129] border-red-200 hover:bg-red-100'
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
            aria-label="Search projects, tasks, and future ideas"
            className="w-full flex items-center justify-between px-3.5 py-2 rounded-xl bg-[#F5F5F5] hover:bg-slate-100 border border-[#E8E8E8] text-slate-500 text-sm transition-all hover:border-slate-300"
          >
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-slate-500" />
              <span className="text-slate-600 font-medium">Search projects, tasks, ideas...</span>
            </div>
            <kbd className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-mono text-slate-600 bg-white border border-[#E8E8E8] rounded">
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
              aria-label="Notifications"
              className="relative p-2.5 rounded-xl bg-[#F5F5F5] hover:bg-slate-100 border border-[#E8E8E8] text-[#111111] transition-colors"
              title="Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadNotifs.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#E42129] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {unreadNotifs.length}
                </span>
              )}
            </button>

            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-xl border border-[#E8E8E8] p-4 z-50 animate-in fade-in duration-200">
                <div className="flex items-center justify-between pb-3 border-b border-[#E8E8E8]">
                  <div className="flex items-center gap-2">
                    <Bell className="w-4 h-4 text-[#E42129]" />
                    <h4 className="font-extrabold text-sm text-[#111111]">Notifications</h4>
                  </div>
                  <span className="text-xs font-bold text-[#E42129] bg-red-50 px-2.5 py-0.5 rounded-full border border-red-100">
                    {unreadNotifs.length} new
                  </span>
                </div>
                <div className="divide-y divide-slate-100 max-h-80 overflow-y-auto my-2">
                  {(state.notifications || []).map((n) => (
                    <div key={n.id} className="py-3 px-1 hover:bg-[#F5F5F5] rounded-lg transition-colors flex items-start gap-3">
                      <div className="p-2 rounded-lg bg-red-50 text-[#E42129] mt-0.5">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-bold text-[#111111]">{n.title}</p>
                        <p className="text-xs text-[#333333] mt-0.5">{n.message}</p>
                        <span className="text-[10px] text-slate-600 mt-1 block font-mono">{n.time}</span>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="pt-2 border-t border-[#E8E8E8] text-center">
                  <button
                    onClick={() => setIsNotifOpen(false)}
                    aria-label="Close notification drawer"
                    className="text-xs font-bold text-[#E42129] hover:underline"
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
            aria-label="Quick add new task or idea"
            className="btn-primary"
          >
            <Plus className="w-4 h-4 stroke-[3]" />
            <span className="hidden sm:inline">Quick Add</span>
          </button>

          {/* User Session Profile & Sign Out Control */}
          <div className="flex items-center gap-2 bg-[#F5F5F5] border border-[#E8E8E8] px-3 py-1.5 rounded-xl text-xs">
            <div className="text-left hidden sm:block">
              <p className="text-[10px] font-black uppercase text-[#E42129] leading-none">
                {isAdminLoggedIn ? 'ADMIN' : 'INTERNAL USER'}
              </p>
              <p className="text-xs font-extrabold text-[#111111] leading-tight mt-0.5">
                OPERATOR
              </p>
            </div>

            {!isAdminLoggedIn && (
              <button
                onClick={() => setIsAdminLoginOpen(true)}
                aria-label="Admin Login"
                className="text-[10px] bg-[#111111] text-white font-bold px-2.5 py-1 rounded-lg hover:bg-slate-800 transition-colors flex items-center gap-1"
                title="Unlock Admin Edit Access"
              >
                <Lock className="w-3 h-3 text-[#E42129]" />
                <span>Admin Login</span>
              </button>
            )}

            <button
              onClick={lockStealthMode}
              aria-label="Lock Stealth Mode (Show Blank Page)"
              className="p-1.5 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors flex items-center gap-1 text-[11px] font-bold"
              title="Lock Portal (Show Blank Screen)"
            >
              <EyeOff className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden xl:inline">Stealth Lock</span>
            </button>

            <button
              onClick={logoutUserSession}
              aria-label="Sign Out of Portal"
              className="p-1.5 text-slate-600 hover:text-[#E42129] hover:bg-red-50 rounded-lg transition-colors"
              title="Sign Out of Portal"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>

        </div>
      </div>
    </header>
  </>
  );
};
