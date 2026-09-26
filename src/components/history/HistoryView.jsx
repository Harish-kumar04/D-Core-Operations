import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { History, ShieldCheck, Search, Filter, Calendar, User, Clock, CheckCircle2 } from 'lucide-react';

export const HistoryView = () => {
  const { state } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [actionFilter, setActionFilter] = useState('ALL');

  const historyLogs = state.history || [];

  let filtered = historyLogs;

  if (searchTerm.trim()) {
    const q = searchTerm.toLowerCase();
    filtered = filtered.filter(
      h => (h.adminName && h.adminName.toLowerCase().includes(q)) ||
           (h.entityName && h.entityName.toLowerCase().includes(q)) ||
           (h.details && h.details.toLowerCase().includes(q))
    );
  }

  if (actionFilter !== 'ALL') {
    filtered = filtered.filter(h => h.action.includes(actionFilter));
  }

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
        <div>
          <div className="flex items-center gap-2 text-dcore-red text-xs font-bold uppercase tracking-wider mb-1">
            <History className="w-4 h-4" />
            <span>Administrative Audit Trail</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">ADMIN EDIT HISTORY LOG</h1>
          <p className="text-xs text-slate-500 mt-1">
            Centralized record of all administrative edits, data additions, updates, and deletions logged with Admin Name & Timestamp.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-red-50 text-dcore-red border border-red-200">
            AUDIT LOG ACTIVE
          </span>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md bg-white border border-slate-300 rounded-xl px-3 py-1.5 shadow-xs">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Admin Name, project, task, or edit details..."
            className="w-full bg-transparent text-slate-900 focus:outline-none text-xs"
          />
        </div>

        <div className="flex items-center gap-2">
          <span className="font-bold text-slate-700">Filter Action:</span>
          <select
            value={actionFilter}
            onChange={(e) => setActionFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 font-semibold focus:outline-none focus:border-dcore-red"
          >
            <option value="ALL">All Actions</option>
            <option value="EDIT">Edits</option>
            <option value="CREATE">Creations</option>
            <option value="DELETE">Deletions</option>
            <option value="LOGIN">Admin Logins</option>
          </select>
        </div>
      </div>

      {/* History Log List */}
      <div className="glass-card p-6 rounded-2xl border border-slate-200/90 bg-white space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100 text-xs font-bold text-slate-500">
          <span>ADMINISTRATOR & ACTION</span>
          <span>TIMESTAMP</span>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-12 text-slate-400 text-xs italic">
            No history entries found matching your filter criteria.
          </div>
        ) : (
          <div className="space-y-4">
            {filtered.map((log) => (
              <div
                key={log.id}
                className="p-4 rounded-xl border border-slate-200/80 hover:border-dcore-red/40 bg-slate-50/50 hover:bg-white transition-all space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-7 h-7 rounded-lg bg-dcore-red/10 text-dcore-red font-bold flex items-center justify-center shrink-0">
                      <User className="w-3.5 h-3.5" />
                    </span>
                    <div>
                      <span className="font-extrabold text-slate-900">{log.adminName || 'Admin User'}</span>
                      <span className="text-slate-400 text-[10px] ml-2 font-mono">({log.action})</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px] self-end sm:self-center">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{new Date(log.timestamp).toLocaleString()}</span>
                  </div>
                </div>

                <div className="pl-9 space-y-1">
                  <p className="text-xs font-bold text-slate-800">
                    Target: <span className="text-dcore-red">{log.entityName}</span> ({log.entityType})
                  </p>
                  <p className="text-xs text-slate-600 bg-white p-2.5 rounded-lg border border-slate-200/70 font-mono leading-relaxed">
                    {log.details}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
