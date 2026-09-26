import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import {
  Kanban,
  Plus,
  Filter,
  Calendar,
  User,
  Clock,
  CheckCircle2,
  AlertCircle,
  Tag,
  ChevronRight,
  ChevronLeft
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
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-6 rounded-2xl border border-slate-200 shadow-soft">
        <div>
          <div className="flex items-center gap-2 text-dcore-red text-xs font-bold uppercase tracking-wider mb-1">
            <Kanban className="w-4 h-4" />
            <span>Active Operations Pipeline</span>
          </div>
          <h1 className="text-2xl font-black text-slate-900 tracking-tight">CURRENT WORKS</h1>
          <p className="text-xs text-slate-500 mt-1">
            Everything the D-Core technology operations team is actively working on. Drag tasks across columns to update stage.
          </p>
        </div>

        <button
          onClick={handleOpenAddTask}
          className="bg-dcore-red hover:bg-dcore-red-hover text-white px-4 py-2.5 rounded-xl font-bold text-xs shadow-md shadow-dcore-red/20 flex items-center gap-2 transition-all self-start sm:self-center"
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>+ Add Current Task</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-3 flex-1">
          <div className="flex items-center gap-1.5 font-bold text-slate-700">
            <Filter className="w-3.5 h-3.5 text-dcore-red" />
            <span>Filters:</span>
          </div>

          {/* Project Filter */}
          <select
            value={projectFilter}
            onChange={(e) => setProjectFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 font-semibold focus:outline-none focus:border-dcore-red"
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
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 font-semibold focus:outline-none focus:border-dcore-red"
          >
            <option value="ALL">All Priorities</option>
            <option value="P0">P0 — Critical</option>
            <option value="P1">P1 — High</option>
            <option value="P2">P2 — Medium</option>
            <option value="P3">P3 — Low</option>
          </select>

          {/* Owner Filter */}
          <select
            value={ownerFilter}
            onChange={(e) => setOwnerFilter(e.target.value)}
            className="px-3 py-1.5 rounded-xl bg-white border border-slate-300 font-semibold focus:outline-none focus:border-dcore-red"
          >
            <option value="ALL">All Team Members</option>
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
            className="text-dcore-red font-bold hover:underline text-xs"
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
                        ? 'bg-red-50/50 border-dcore-red/40'
                        : 'bg-slate-50/70 border-slate-200'
                    }`}
                  >
                    {/* Column Header */}
                    <div className="flex items-center justify-between pb-3 mb-2 border-b border-slate-200">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${
                          colStatus === 'COMPLETED' ? 'bg-emerald-500' :
                          colStatus === 'IN PROGRESS' ? 'bg-dcore-red' :
                          colStatus === 'REVIEW' ? 'bg-indigo-500' : 'bg-slate-400'
                        }`}></span>
                        <h3 className="font-extrabold text-xs text-slate-800 tracking-wider uppercase">
                          {colStatus}
                        </h3>
                      </div>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-slate-600 border border-slate-200 shadow-2xs font-mono">
                        {colTasks.length}
                      </span>
                    </div>

                    {/* Column Items */}
                    <div className="space-y-3 flex-1">
                      {colTasks.length === 0 ? (
                        <div className="text-center py-8 text-slate-400 text-[11px] italic">
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
                                  className={`glass-card p-4 rounded-xl border border-slate-200 bg-white hover:border-dcore-red/40 cursor-pointer transition-all space-y-3 select-none ${
                                    snapshot.isDragging ? 'shadow-2xl ring-2 ring-dcore-red scale-105 z-50' : ''
                                  }`}
                                >
                                  {/* Card Top: Priority & Project */}
                                  <div className="flex items-center justify-between gap-2">
                                    <span className={t.priority === 'P0' ? 'badge-p0' : t.priority === 'P1' ? 'badge-p1' : 'badge-p2'}>
                                      {t.priority}
                                    </span>
                                    <span className="text-[10px] font-bold text-slate-500 bg-slate-100 px-2 py-0.5 rounded truncate max-w-[110px]">
                                      {project?.name || 'DMK Ecosystem'}
                                    </span>
                                  </div>

                                  {/* Task Title */}
                                  <h4 className="font-bold text-xs text-slate-900 leading-snug line-clamp-2 hover:text-dcore-red transition-colors">
                                    {t.title}
                                  </h4>

                                  {/* Progress bar */}
                                  <div className="space-y-1">
                                    <div className="flex items-center justify-between text-[10px] text-slate-500 font-semibold">
                                      <span>Progress</span>
                                      <span className="font-mono font-bold text-dcore-red">{t.progress}%</span>
                                    </div>
                                    <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
                                      <div
                                        className={`h-full rounded-full ${
                                          t.status === 'COMPLETED' ? 'bg-emerald-500' : 'bg-dcore-red'
                                        }`}
                                        style={{ width: `${t.progress}%` }}
                                      ></div>
                                    </div>
                                  </div>

                                  {/* Card Footer: Owner & Due Date */}
                                  <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                                    <div className="flex items-center gap-1.5">
                                      {owner ? (
                                        <>
                                          <img src={owner.avatar} alt={owner.name} className="w-4 h-4 rounded-full object-cover" />
                                          <span className="font-medium truncate max-w-[80px]">{owner.name.split(' ')[0]}</span>
                                        </>
                                      ) : (
                                        <span>Unassigned</span>
                                      )}
                                    </div>
                                    {t.dueDate && (
                                      <div className="flex items-center gap-1 text-slate-400 font-mono">
                                        <Calendar className="w-3 h-3 text-dcore-red" />
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
