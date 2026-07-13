'use client';

import React, { useState } from 'react';
import {
  DndContext,
  DragOverlay,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragOverEvent,
  DragEndEvent,
} from '@dnd-kit/core';
import { arrayMove, sortableKeyboardCoordinates } from '@dnd-kit/sortable';
import { Filter, Plus, Users, Sparkles } from 'lucide-react';
import { KanbanColumnData, KanbanTask, KanbanPriority } from '@/src/types/ordo';
import { KanbanColumn } from './KanbanColumn';
import { KanbanTaskCard } from './KanbanTaskCard';

interface KanbanBoardProps {
  initialColumns: KanbanColumnData[];
  initialTasks: KanbanTask[];
}

export const KanbanBoard: React.FC<KanbanBoardProps> = ({
  initialColumns,
  initialTasks,
}) => {
  const [columns] = useState<KanbanColumnData[]>(initialColumns);
  const [tasks, setTasks] = useState<KanbanTask[]>(initialTasks);
  const [activeTask, setActiveTask] = useState<KanbanTask | null>(null);

  // Add Task Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [targetColumnId, setTargetColumnId] = useState<'todo' | 'in-progress' | 'done'>('todo');
  const [newTitle, setNewTitle] = useState('');
  const [newPriority, setNewPriority] = useState<KanbanPriority>('HIGH PRIORITY');
  const [newSubtasksCount, setNewSubtasksCount] = useState(4);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  /* Drag Start */
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === 'task') {
      setActiveTask(active.data.current.task as KanbanTask);
    }
  };

  /* Drag Over - moving tasks across columns */
  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    if (activeId === overId) return;

    const isActiveTask = active.data.current?.type === 'task';
    const isOverTask = over.data.current?.type === 'task';
    const isOverColumn = over.data.current?.type === 'column';

    if (!isActiveTask) return;

    // 1. Dropping task over another task in a different column
    if (isActiveTask && isOverTask) {
      setTasks((prevTasks) => {
        const activeIndex = prevTasks.findIndex((t) => t.id === activeId);
        const overIndex = prevTasks.findIndex((t) => t.id === overId);

        if (prevTasks[activeIndex].columnId !== prevTasks[overIndex].columnId) {
          const newTasks = [...prevTasks];
          newTasks[activeIndex] = {
            ...newTasks[activeIndex],
            columnId: prevTasks[overIndex].columnId,
          };
          return arrayMove(newTasks, activeIndex, overIndex);
        }
        return prevTasks;
      });
    }

    // 2. Dropping task over an empty column
    if (isActiveTask && isOverColumn) {
      setTasks((prevTasks) => {
        const activeIndex = prevTasks.findIndex((t) => t.id === activeId);
        if (prevTasks[activeIndex].columnId !== overId) {
          const newTasks = [...prevTasks];
          newTasks[activeIndex] = {
            ...newTasks[activeIndex],
            columnId: overId as 'todo' | 'in-progress' | 'done',
          };
          return arrayMove(newTasks, activeIndex, activeIndex);
        }
        return prevTasks;
      });
    }
  };

  /* Drag End */
  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);

    if (!over) return;

    const activeId = active.id as string;
    const overId = over.id as string;

    const activeIndex = tasks.findIndex((t) => t.id === activeId);
    const overIndex = tasks.findIndex((t) => t.id === overId);

    if (activeIndex !== overIndex && overIndex !== -1) {
      setTasks((prevTasks) => arrayMove(prevTasks, activeIndex, overIndex));
    }
  };

  /* Add Task Handler */
  const handleOpenAddTaskModal = (columnId: 'todo' | 'in-progress' | 'done') => {
    setTargetColumnId(columnId);
    setNewTitle('');
    setIsModalOpen(true);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const newTask: KanbanTask = {
      id: `task-${Date.now()}`,
      code: `ORD-${Math.floor(400 + Math.random() * 99)}`,
      title: newTitle,
      priority: newPriority,
      subtasksCompleted: 0,
      subtasksTotal: newSubtasksCount,
      commentsCount: 1,
      attachmentsCount: Math.random() > 0.5 ? 1 : 0,
      assignees: ['/avatars/01.png', '/avatars/02.png'],
      columnId: targetColumnId,
    };

    setTasks((prev) => [...prev, newTask]);
    setIsModalOpen(false);
  };

  /* Delete Task Handler */
  const handleDeleteTask = (taskId: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== taskId));
  };

  /* Increment Subtask Handler */
  const handleIncrementSubtask = (taskId: string) => {
    setTasks((prev) =>
      prev.map((t) =>
        t.id === taskId && t.subtasksCompleted < t.subtasksTotal
          ? { ...t, subtasksCompleted: t.subtasksCompleted + 1 }
          : t
      )
    );
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)]">
      {/* Board Top Bar exact to project_board_sprint.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 pb-4 border-b border-slate-800/80 gap-4">
        <div>
          <h1 className="font-bold text-2xl text-white tracking-tight flex items-center gap-3">
            Core Protocol Refactor
          </h1>
          <p className="text-xs font-mono text-slate-400 mt-1 flex items-center gap-2">
            <span>Sprint 42</span>
            <span>•</span>
            <span className="text-cyan-400">Ends in 3 days</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {/* Avatar Group exact to sprint board */}
          <div className="flex -space-x-2.5 overflow-hidden">
            <div className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0b1326] bg-gradient-to-tr from-cyan-400 to-blue-500 p-[1px]">
              <div className="w-full h-full rounded-full bg-[#1e293b] flex items-center justify-center font-mono text-xs font-bold text-cyan-200">
                SJ
              </div>
            </div>
            <div className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0b1326] bg-gradient-to-tr from-purple-500 to-pink-500 p-[1px]">
              <div className="w-full h-full rounded-full bg-[#1e293b] flex items-center justify-center font-mono text-xs font-bold text-purple-200">
                MK
              </div>
            </div>
            <div className="inline-block h-8 w-8 rounded-full ring-2 ring-[#0b1326] bg-gradient-to-tr from-emerald-400 to-teal-500 p-[1px]">
              <div className="w-full h-full rounded-full bg-[#1e293b] flex items-center justify-center font-mono text-xs font-bold text-emerald-200">
                AC
              </div>
            </div>
          </div>

          <button
            onClick={() => handleOpenAddTaskModal('todo')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-[#0b1326] font-bold text-xs transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
          >
            <Plus className="w-4 h-4" />
            <span>Add Task</span>
          </button>

          <button className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/60 text-xs font-medium transition-colors">
            <Filter className="w-3.5 h-3.5" />
            <span>Filter</span>
          </button>
        </div>
      </div>

      {/* Kanban Columns Container */}
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragOver={handleDragOver}
        onDragEnd={handleDragEnd}
      >
        <div className="flex-1 flex gap-6 overflow-x-auto pb-4 items-start">
          {columns.map((column) => (
            <KanbanColumn
              key={column.id}
              column={column}
              tasks={tasks.filter((t) => t.columnId === column.id)}
              onAddTask={handleOpenAddTaskModal}
              onDeleteTask={handleDeleteTask}
              onIncrementSubtask={handleIncrementSubtask}
            />
          ))}
        </div>

        {/* Drag Overlay for smooth dragging */}
        <DragOverlay dropAnimation={{ duration: 250, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
          {activeTask ? (
            <div className="rotate-3 scale-105 pointer-events-none shadow-[0_0_40px_rgba(56,189,248,0.4)]">
              <KanbanTaskCard task={activeTask} />
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>

      {/* Interactive Add Task Dialog / Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1326]/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md glass-panel rounded-3xl p-6 border border-cyan-500/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Create Task in <span className="text-cyan-400 font-mono uppercase">{targetColumnId}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateTask} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Task Title</label>
                <input
                  type="text"
                  placeholder="e.g., Implement WebGL Shader Backgrounds"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors font-sans"
                  autoFocus
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Priority</label>
                <select
                  value={newPriority}
                  onChange={(e) => setNewPriority(e.target.value as KanbanPriority)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                >
                  <option value="HIGH PRIORITY">HIGH PRIORITY</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="LOW">LOW</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Subtasks Count</label>
                <input
                  type="number"
                  min={1}
                  max={15}
                  value={newSubtasksCount}
                  onChange={(e) => setNewSubtasksCount(Number(e.target.value))}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors font-mono"
                />
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs py-2.5 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-[#0b1326] font-bold text-xs py-2.5 rounded-xl transition-all shadow-md shadow-cyan-500/20"
                >
                  Create Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
