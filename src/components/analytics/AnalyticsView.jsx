import React from 'react';
import { useApp } from '../../context/AppContext';
import { QuoteCard } from '../common/QuoteCard';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  CartesianGrid,
  Legend
} from 'recharts';
import { BarChart3, PieChart as PieIcon, TrendingUp, Users, ShieldAlert } from 'lucide-react';

export const AnalyticsView = () => {
  const { state } = useApp();

  const projects = state.projects || [];
  const tasks = state.tasks || [];
  const team = state.team || [];

  // 1. Project Progress Data
  const projectProgressData = projects.map(p => ({
    name: p.name,
    progress: p.progress
  }));

  // 2. Task Status Donut Data
  const statusCounts = {
    BACKLOG: tasks.filter(t => t.status === 'BACKLOG').length,
    'TO DO': tasks.filter(t => t.status === 'TO DO').length,
    'IN PROGRESS': tasks.filter(t => t.status === 'IN PROGRESS').length,
    REVIEW: tasks.filter(t => t.status === 'REVIEW').length,
    COMPLETED: tasks.filter(t => t.status === 'COMPLETED').length
  };

  const taskStatusData = Object.keys(statusCounts).map(key => ({
    name: key,
    value: statusCounts[key]
  }));

  const COLORS = ['#94a3b8', '#cbd5e1', '#9b111e', '#6366f1', '#10b981'];

  // 3. Priority Distribution Data
  const priorityData = [
    { priority: 'P0 Critical', count: tasks.filter(t => t.priority === 'P0').length },
    { priority: 'P1 High', count: tasks.filter(t => t.priority === 'P1').length },
    { priority: 'P2 Medium', count: tasks.filter(t => t.priority === 'P2').length },
    { priority: 'P3 Low', count: tasks.filter(t => t.priority === 'P3').length }
  ];

  // 4. Team Workload Data
  const teamWorkloadData = team.map(m => ({
    name: m.name.split(' ')[0],
    tasks: tasks.filter(t => t.ownerId === m.id && t.status !== 'COMPLETED').length
  }));

  // 5. Work Completion Line Chart Mocked Trend
  const completionTrendData = [
    { week: 'Wk 1', completed: 4, planned: 8 },
    { week: 'Wk 2', completed: 7, planned: 12 },
    { week: 'Wk 3', completed: 14, planned: 16 },
    { week: 'Wk 4', completed: 22, planned: 25 },
    { week: 'Wk 5', completed: tasks.filter(t => t.status === 'COMPLETED').length, planned: tasks.length }
  ];

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
        <div>
          <div className="flex items-center gap-2 text-dcore-red text-xs font-bold uppercase tracking-wider mb-1">
            <BarChart3 className="w-4 h-4" />
            <span>Operational Intelligence</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">ANALYTICS & METRICS</h1>
          <p className="text-xs text-slate-500 mt-1">
            Real-time visual reports calculated directly from D-Core project, task, and team operational data.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-red-50 text-dcore-red border border-red-200">
            DEMO DATA VERIFIED
          </span>
        </div>
      </div>


      {/* Grid of 4 Recharts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* 1. Project Progress Bar Chart */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200/90 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-dcore-red" />
              PROJECT PROGRESS (%)
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Core Ecosystem</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={projectProgressData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="name" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} domain={[0, 100]} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="progress" fill="#9b111e" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 2. Task Status Donut Chart */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200/90 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <PieIcon className="w-4 h-4 text-emerald-600" />
              TASK STATUS DISTRIBUTION
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Total: {tasks.length} Tasks</span>
          </div>
          <div className="h-64 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={taskStatusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={85}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {taskStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Legend wrapperStyle={{ fontSize: '11px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 3. Work Completion Line Chart */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200/90 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              WORK COMPLETION TREND
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Weekly Progress</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={completionTrendData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="week" stroke="#64748b" fontSize={11} />
                <YAxis stroke="#64748b" fontSize={11} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Line type="monotone" dataKey="completed" stroke="#10b981" strokeWidth={3} dot={{ r: 5 }} />
                <Line type="monotone" dataKey="planned" stroke="#94a3b8" strokeDasharray="5 5" strokeWidth={2} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* 4. Priority Distribution Bar Chart */}
        <div className="glass-card p-6 rounded-2xl border border-slate-200/90 bg-white space-y-4">
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <h3 className="font-extrabold text-sm text-slate-900 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-amber-500" />
              PRIORITY BREAKDOWN (P0–P3)
            </h3>
            <span className="text-[10px] font-mono text-slate-400">Urgency Levels</span>
          </div>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={priorityData} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis type="number" stroke="#64748b" fontSize={11} />
                <YAxis dataKey="priority" type="category" stroke="#64748b" fontSize={11} width={80} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#0f172a', borderRadius: '12px', border: 'none', color: '#fff', fontSize: '12px' }}
                />
                <Bar dataKey="count" fill="#7f0d18" radius={[0, 6, 6, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>
    </div>
  );
};
