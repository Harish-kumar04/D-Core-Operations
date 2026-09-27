import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { QuoteCard } from '../common/QuoteCard';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  Kanban,
  Plus,
  Filter,
  Calendar,
  CheckCircle2
} from 'lucide-react';

export const CurrentWorksView = () => {
  const { state, moveTaskStatus, openTaskDrawer, setIsQuickAddOpen, setQuickAddType } = useApp();

  const [projectFilter, setProjectFilter] = useState('ALL');
  const [priorityFilter, setPriorityFilter] = useState('ALL');
  const [ownerFilter, setOwnerFilter] = useState('ALL');

  // Kanban Columns
  const columns = ['BACKLOG', 'TO DO', 'IN PROGRESS', 'REVIEW', 'COMPLETED'];

  // Filter tasks belonging to CURRENT_WORK
  let currentTasks = (state.tasks || []).filter(t => t.type === 'CURRENT_WORK');

  if (projectFilter !== 'ALL') {
    currentTasks = currentTasks.filter(t => t.projectId === projectFilter);
  }
  if (priorityFilter !== 'ALL') {
    currentTasks = currentTasks.filter(t => t.priority === priorityFilter);
  }
  if (ownerFilter !== 'ALL') {
    currentTasks = currentTasks.filter(t => t.ownerId === ownerFilter);
  }

  // Handle Drag End
  const handleOnDragEnd = (result) => {
    const { destination, source, draggableId } = result;
    if (!destination) return;

    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    const newStatus = destination.droppableId;
    moveTaskStatus(draggableId, newStatus);
  };

  const handleOpenAddTask = () => {
    setQuickAddType('task');
    setIsQuickAddOpen(true);
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300 select-none">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-[#E8E8E8] shadow-soft">
        <div>
          <div className="flex items-center gap-2 text-[#E42129] text-xs font-black uppercase tracking-wider mb-1">
            <Kanban className="w-4 h-4" />
            <span>Active Operations Pipeline</span>
          </div>
          <h1 className="text-2xl font-black text-[#111111] tracking-tight">CURRENT WORKS</h1>
          <p className="text-xs text-[#666666] font-medium mt-1">
            Everything the D-Core technology operations team is actively working on. Drag tasks across columns to update stage.
          </p>
        </div>

        <button
          onClick={handleOpenAddTask}
          className="btn-primary self-start sm:self-center shrink-0"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Add Current Task</span>
        </button>
      </div>

      {/* Integrated Kalaignar Action Motivational Quote */}
      <QuoteCard
        quote="முடித்தே தீருவோம் என்பது வெற்றிக்கான தொடக்கம்."
        speaker="கலைஞர் மு. கருணாநிதி"
        variant="minimal"
      />

      {/* Filter Bar */}
      <div className="bg-[#F5F5F5] p-4 rounded-2xl border border-[#E8E8E8] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="flex items-center gap-1.5 font-bold text-[#111111]">
            <Filter className="w-3.5 h-3.5 text-[#E42129]" />
            <span>Filters:</span>
          </div>

          {/* Project Filter */}
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white border border-[#E8E8E8] font-bold text-[#111111] focus:outline-none focus:border-[#E42129]"
          >
            <option value="ALL">All Projects ({state.projects.length})</option>
            {state.projects.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>

          {/* Priority Filter */}
          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white border border-[#E8E8E8] font-bold text-[#111111] focus:outline-none focus:border-[#E42129]"
          >
            <option value="ALL">All Priorities</option>
            <option value="P0">P0 — Critical</option>
            <option value="P1">P1 — High</option>
            <option value="P2">P2 — Medium</option>
            <option value="P3">P3 — Low</option>
          </select>

          {/* Owner / Operational Unit Filter */}
          <select
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white border border-[#E8E8E8] font-bold text-[#111111] focus:outline-none focus:border-[#E42129]"
          >
            <option value="ALL">All Operational Units</option>
            {state.team.map(m => (
              <option key={m.id} value={m.id}>{m.name}</option>
            ))}
          </select>
        </div>

        {(projectFilter !== 'ALL' || priorityFilter !== 'ALL' || ownerFilter !== 'ALL') && (
          <button
            onClick={() => {
              setProjectFilter('ALL');
              setPriorityFilter('ALL');
              setOwnerFilter('ALL');
            }}
            className="text-[#E42129] font-bold hover:underline text-xs"
          >
            Clear Filters
          </button>
        )}
      </div>

      {/* Kanban Drag and Drop Context */}
      <DragDropContext onDragEnd={handleOnDragEnd}>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto pb-4">
          {columns.map((colStatus) => {
            const colTasks = currentTasks.filter(t => t.status === colStatus);

            return (
              <Droppable key={colStatus} droppableId={colStatus}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                    className={`flex flex-col min-h-[500px] rounded-2xl border p-3 transition-colors ${
                      snapshot.isDraggingOver
                        ? 'bg-red-50/50 border-[#E42129]'
                        : 'bg-[#F5F5F5] border-[#E8E8E8]'
                    }`}
                  >
                    {/* Column Header */}
                    <div className="flex items-center justify-between pb-3 mb-2 border-b border-[#E8E8E8]">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          colStatus === 'COMPLETED' ? 'bg-emerald-500' :
                          colStatus === 'IN PROGRESS' ? 'bg-[#E42129]' :
                          colStatus === 'REVIEW' ? 'bg-indigo-500' : 'bg-slate-400'
                        }`}></span>
                        <h3 className="font-black text-xs text-[#111111] tracking-wider uppercase">
                          {colStatus}
                        </h3>
                      </div>
                      <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-white text-[#111111] border border-[#E8E8E8] shadow-xs font-mono">
                        {colTasks.length}
                      </span>
                    </div>

                    {/* Column Items */}
                    <div className="space-y-3 flex-1">
                      {colTasks.length === 0 ? (
                        <div className="text-center py-8 text-[#666666] text-[11px] font-medium italic">
                          No tasks in {colStatus}
                        </div>
                      ) : (
                        colTasks.map((t, index) => {
                          const project = state.projects.find(p => p.id === t.projectId);
                          const owner = state.team.find(m => m.id === t.ownerId);

                          return (
                            <Draggable key={t.id} draggableId={t.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  onClick={() => openTaskDrawer(t.id)}
                                  className={`glass-card p-4 rounded-xl border border-[#E8E8E8] bg-white hover:border-[#E42129]/40 cursor-pointer transition-all space-y-3 select-none ${
                                    snapshot.isDragging ? 'shadow-2xl ring-2 ring-[#E42129] scale-105 z-50' : ''
                                  }`}
                                >
                                  {/* Card Top: Priority & Project */}
                                  <div className="flex items-center justify-between gap-2">
                                    <span className={t.priority === 'P0' ? 'badge-p0' : t.priority === 'P1' ? 'badge-p1' : 'badge-p2'}>
                                      {t.priority}
                                    </span>
                                    <span className="text-[10px] font-bold text-[#666666] bg-[#F5F5F5] px-2 py-0.5 rounded border border-[#E8E8E8] truncate max-w-[110px]">
                                      {project?.name || 'DMK Ecosystem'}
                                    </span>
                                  </div>

                                  {/* Task Title */}
                                  <h4 className="font-extrabold text-xs text-[#111111] leading-snug line-clamp-2 group-hover:text-[#E42129] transition-colors">
                                    {t.title}
                                  </h4>

                                  {/* Progress bar */}
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between text-[10px] text-[#666666] font-bold">
                                      <span>Progress</span>
                                      <span className="font-mono font-bold text-[#E42129]">{t.progress}%</span>
                                    </div>
                                    <div className="w-full bg-[#F5F5F5] h-1.5 rounded-full overflow-hidden border border-[#E8E8E8]">
                                      <div
                                        className={`h-full rounded-full ${
                                          t.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-[#E42129]'
                                        }`}
                                        style={{ width: `${t.progress}%` }}
                                      ></div>
                                    </div>
                                  </div>

                                  {/* Card Footer */}
                                  <div className="pt-2 border-t border-[#E8E8E8] flex items-center justify-between text-[10px] text-[#666666]">
                                    <div className="flex items-center gap-1.5 font-bold text-[#111111]">
                                      {owner ? (
                                        <span className="truncate max-w-[100px] text-[10px] bg-[#F5F5F5] px-1.5 py-0.5 rounded border border-[#E8E8E8]">{owner.name}</span>
                                      ) : (
                                        <span className="text-[10px] bg-[#F5F5F5] px-1.5 py-0.5 rounded border border-[#E8E8E8]">D-Core Ops Unit</span>
                                      )}
                                    </div>
                                    {t.dueDate && (
                                      <div className="flex items-center gap-1 text-[#E42129] font-mono font-bold">
                                        <Calendar className="w-3 h-3 text-[#E42129]" />
                                        <span>{t.dueDate}</span>
                                      </div>
                                    )}
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })
                      )}
                      {provided.placeholder}
                    </div>
                  </div>
                )}
              </Droppable>
            );
          })}
        </div>
      </DragDropContext>
    </div>
  );
};
