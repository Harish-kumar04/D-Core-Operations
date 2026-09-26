import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Settings, Download, Upload, RotateCcw, ShieldCheck, Database, Sliders, Bell } from 'lucide-react';

export const SettingsView = () => {
  const { state, exportJSON, importJSON, resetDemoData, showToast } = useApp();
  const [importString, setImportString] = useState('');
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target.result;
      const success = importJSON(content);
      if (success) {
        setIsImportModalOpen(false);
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
        <div>
          <div className="flex items-center gap-2 text-slate-700 text-xs font-bold uppercase tracking-wider mb-1">
            <Settings className="w-4 h-4" />
            <span>System Preferences & Data Center</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">SETTINGS</h1>
          <p className="text-xs text-slate-500 mt-1">
            Manage workflow defaults, persistent JSON backups, import/export data, and system preferences.
          </p>
        </div>
      </div>

      {/* Sections Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. General & Organization Settings */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200/90 bg-white space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Sliders className="w-4 h-4 text-dcore-red" />
            <h3 className="font-extrabold text-sm text-slate-900">General Information</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <label className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Organization Name</label>
              <input
                type="text"
                readOnly
                value={state.organization?.name || 'D-CORE OPERATIONS'}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Tagline</label>
              <input
                type="text"
                readOnly
                value={state.organization?.tagline || 'Technology at the Core. Operations at Scale.'}
                className="w-full px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl font-bold text-slate-800"
              />
            </div>

            <div>
              <label className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Theme Visual Identity</label>
              <div className="p-3 rounded-xl bg-red-50/60 border border-red-100 flex items-center justify-between text-dcore-red font-bold">
                <span>Full White Background + DMK Deep Red Accent</span>
                <span className="text-[10px] font-mono bg-white px-2 py-0.5 rounded border border-red-200">#9B111E</span>
              </div>
            </div>
          </div>
        </div>

        {/* 2. Data Management (JSON Export / Import / Reset) */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200/90 bg-white space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Database className="w-4 h-4 text-dcore-red" />
            <h3 className="font-extrabold text-sm text-slate-900">Data Persistence & Backup</h3>
          </div>

          <p className="text-xs text-slate-600 leading-relaxed">
            All D-Core projects, tasks, ideas, team profiles, and activity logs are stored locally in your browser. Export backups or restore previous state anytime.
          </p>

          <div className="space-y-2 pt-2">
            {/* Export JSON */}
            <button
              onClick={exportJSON}
              className="w-full p-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs flex items-center justify-between transition-colors shadow-sm"
            >
              <div className="flex items-center gap-2">
                <Download className="w-4 h-4 text-emerald-400" />
                <span>Export Application Data (JSON)</span>
              </div>
              <span className="text-[10px] font-mono text-slate-400">Download .json</span>
            </button>

            {/* Import JSON */}
            <label className="w-full p-3 rounded-xl bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold text-xs flex items-center justify-between cursor-pointer transition-colors">
              <div className="flex items-center gap-2">
                <Upload className="w-4 h-4 text-dcore-red" />
                <span>Import Data Backup (JSON File)</span>
              </div>
              <input
                type="file"
                accept=".json"
                onChange={handleFileUpload}
                className="hidden"
              />
              <span className="text-[10px] font-mono text-slate-400">Select File</span>
            </label>

            {/* Reset Demo Data */}
            <button
              onClick={() => {
                if (window.confirm("Are you sure you want to reset all data back to original DEMO DATA state?")) {
                  resetDemoData();
                }
              }}
              className="w-full p-3 rounded-xl bg-red-50 hover:bg-red-100 border border-red-200 text-dcore-red font-bold text-xs flex items-center justify-between transition-colors"
            >
              <div className="flex items-center gap-2">
                <RotateCcw className="w-4 h-4" />
                <span>Reset Demo Data</span>
              </div>
              <span className="text-[10px] font-mono">Restore 4 Core Projects</span>
            </button>
          </div>
        </div>

        {/* 3. Workflow Configuration */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200/90 bg-white space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <ShieldCheck className="w-4 h-4 text-dcore-red" />
            <h3 className="font-extrabold text-sm text-slate-900">Workflow & Priority System</h3>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Kanban Stages</span>
              <div className="flex flex-wrap gap-1 font-mono font-bold text-[10px] text-slate-700">
                <span className="px-2 py-1 bg-slate-100 rounded">BACKLOG</span>
                <span className="px-2 py-1 bg-slate-100 rounded">TO DO</span>
                <span className="px-2 py-1 bg-red-50 text-dcore-red rounded">IN PROGRESS</span>
                <span className="px-2 py-1 bg-indigo-50 text-indigo-700 rounded">REVIEW</span>
                <span className="px-2 py-1 bg-emerald-50 text-emerald-700 rounded">COMPLETED</span>
              </div>
            </div>

            <div>
              <span className="text-slate-400 font-bold uppercase text-[10px] block mb-1">Priority Hierarchy</span>
              <div className="flex flex-wrap gap-1.5">
                <span className="badge-p0">P0 — CRITICAL</span>
                <span className="badge-p1">P1 — HIGH</span>
                <span className="badge-p2">P2 — MEDIUM</span>
                <span className="badge-p3">P3 — LOW</span>
              </div>
            </div>
          </div>
        </div>

        {/* 4. System Info */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200/90 bg-white space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Bell className="w-4 h-4 text-dcore-red" />
            <h3 className="font-extrabold text-sm text-slate-900">System Information</h3>
          </div>

          <div className="space-y-2 text-xs font-mono">
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400">System Name</span>
              <span className="font-bold text-slate-800">D-CORE WORKFLOW MANAGEMENT SYSTEM</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400">Version</span>
              <span className="font-bold text-dcore-red">v1.0.4-PROD</span>
            </div>
            <div className="flex justify-between py-1 border-b border-slate-100">
              <span className="text-slate-400">Storage Architecture</span>
              <span className="font-bold text-slate-800">LocalStorage Abstraction Layer (DataService)</span>
            </div>
            <div className="flex justify-between py-1">
              <span className="text-slate-400">Status</span>
              <span className="font-bold text-emerald-600">● Operational</span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};
