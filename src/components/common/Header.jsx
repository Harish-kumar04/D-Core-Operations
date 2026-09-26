import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import {
  Search,
  Plus,
  Bell,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Sliders,
  ShieldCheck,
  UserCheck,
  ChevronDown
} from 'lucide-react';

export const Header = () => {
  const {
    state,
    activeTab,
    navigate,
    setIsSearchOpen,
    setIsQuickAddOpen,
    setQuickAddType
  } = useApp();

  const [isNotifOpen, setIsNotifOpen] = useState(false);
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const [currentRole, setCurrentRole] = useState('ADMIN');

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
            {/* Clean Geometric D-CORE Logo */}
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-dcore-red to-dcore-maroon text-white flex items-center justify-center font-black text-xl shadow-card shadow-dcore-red/20 group-hover:scale-105 transition-transform">
              <span className="tracking-tighter">D</span>
            </div>
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

          {/* Quick Landing Page Toggle */}
          <button
            onClick={() => navigate(activeTab === 'landing' ? 'dashboard' : 'landing')}
            className={`hidden md:flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border transition-all ${
              activeTab === 'landing'
                ? 'bg-dcore-red text-white border-dcore-red shadow-sm'
                : 'bg-slate-50 text-slate-700 border-slate-200 hover:bg-slate-100 hover:border-slate-300'
            }`}
          >
            <Globe className="w-3.5 h-3.5" />
            <span>{activeTab === 'landing' ? 'Operations Center' : 'Public Landing Page'}</span>
          </button>
        </div>

        {/* Middle: Tagline & Search trigger */}
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
          
          {/* Global Search Mobile trigger */}
          <button
            onClick={() => setIsSearchOpen(true)}
            className="lg:hidden p-2 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600"
            title="Search"
          >
            <Search className="w-4 h-4" />
          </button>

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

            {/* Notification Drawer Popover */}
            {isNotifOpen && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-hover border border-slate-200 p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200">
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

          {/* User Profile & Mock Role Selector */}
          <div className="relative">
            <button
              onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
              className="flex items-center gap-2 p-1.5 rounded-xl bg-slate-50 border border-slate-200 hover:bg-slate-100 transition-colors"
            >
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80"
                alt="Arun Kumar"
                className="w-7 h-7 rounded-lg object-cover ring-2 ring-dcore-red/20"
              />
              <div className="hidden md:block text-left pr-1">
                <p className="text-xs font-bold text-slate-800 leading-tight">Arun Kumar</p>
                <p className="text-[10px] text-slate-500 font-medium">Ops Lead ({currentRole})</p>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>

            {isRoleDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-hover border border-slate-200 p-2 z-50 text-xs">
                <div className="px-2 py-1.5 font-bold text-slate-400 uppercase text-[10px] tracking-wider border-b border-slate-100 mb-1">
                  Role Permission Switcher
                </div>
                {['ADMIN', 'MANAGER', 'TEAM MEMBER', 'VIEWER'].map((role) => (
                  <button
                    key={role}
                    onClick={() => {
                      setCurrentRole(role);
                      setIsRoleDropdownOpen(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 rounded-lg flex items-center justify-between transition-colors ${
                      currentRole === role ? 'bg-red-50 text-dcore-red font-bold' : 'text-slate-700 hover:bg-slate-50'
                    }`}
                  >
                    <span>{role}</span>
                    {currentRole === role && <UserCheck className="w-3.5 h-3.5 text-dcore-red" />}
                  </button>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>
    </header>
  );
};
