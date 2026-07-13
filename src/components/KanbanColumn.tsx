'use client';

import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import { SortableContext, verticalListSortingStrategy } from '@dnd-kit/sortable';
import { MoreHorizontal, Plus } from 'lucide-react';
import { KanbanColumnData, KanbanTask } from '@/src/types/ordo';
import { KanbanTaskCard } from './KanbanTaskCard';

interface KanbanColumnProps {
  column: KanbanColumnData;
  tasks: KanbanTask[];
  onAddTask: (columnId: 'todo' | 'in-progress' | 'done') => void;
  onDeleteTask?: (taskId: string) => void;
  onIncrementSubtask?: (taskId: string) => void;
}

export const KanbanColumn: React.FC<KanbanColumnProps> = ({
  column,
  tasks,
  onAddTask,
  onDeleteTask,
  onIncrementSubtask,
}) => {
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
    data: {
      type: 'column',
      column,
    },
  });

  const taskIds = tasks.map((task) => task.id);

  return (
    <div className="flex flex-col h-full min-w-[21rem] w-80 lg:w-96 glass-panel rounded-3xl p-5 border border-slate-700/50 shadow-2xl">
      {/* Column Header */}
      <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2.5">
          {column.colorIndicator && (
            <span
              className="w-2.5 h-2.5 rounded-full shadow-sm animate-pulse"
              style={{
                backgroundColor: column.colorIndicator,
                boxShadow: `0 0 10px ${column.colorIndicator}`,
              }}
            />
          )}
          <h3 className="font-bold text-sm text-white tracking-wider font-mono">
            {column.title}
          </h3>
          <span className="px-2 py-0.5 rounded-full bg-slate-800/90 text-slate-300 font-mono text-xs font-bold border border-slate-700/60">
            {tasks.length}
          </span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => onAddTask(column.id)}
            className="p-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/20 transition-all"
            title={`Add task to ${column.title}`}
          >
            <Plus className="w-4 h-4" />
          </button>
          <button className="p-1.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Droppable Task List Area */}
      <div
        ref={setNodeRef}
        className={`flex-1 overflow-y-auto space-y-3.5 pr-1 transition-colors rounded-2xl p-1 -m-1 ${
          isOver
            ? 'bg-cyan-500/10 border-2 border-dashed border-cyan-400/80 shadow-[inset_0_0_20px_rgba(56,189,248,0.15)]'
            : ''
        }`}
      >
        <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
          {tasks.map((task) => (
            <KanbanTaskCard
              key={task.id}
              task={task}
              onDelete={onDeleteTask}
              onIncrementSubtask={onIncrementSubtask}
            />
          ))}
        </SortableContext>

        {tasks.length === 0 && !isOver && (
          <div
            onClick={() => onAddTask(column.id)}
            className="h-32 rounded-2xl border border-dashed border-slate-800 flex flex-col items-center justify-center text-slate-500 hover:text-slate-400 hover:border-slate-700 transition-colors cursor-pointer text-xs font-mono"
          >
            <Plus className="w-5 h-5 mb-1 opacity-60" />
            <span>Click to add a task</span>
          </div>
        )}
      </div>
    </div>
  );
};
