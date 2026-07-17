'use client';

import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { AlertTriangle, MessageSquare, Paperclip, CheckCircle2, Trash2, Plus } from 'lucide-react';
import { KanbanTask } from '@/src/types/ordo';

interface KanbanTaskCardProps {
  task: KanbanTask;
  onDelete?: (id: string) => void;
  onIncrementSubtask?: (id: string) => void;
}

export const KanbanTaskCard: React.FC<KanbanTaskCardProps> = ({
  task,
  onDelete,
  onIncrementSubtask,
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    data: {
      type: 'task',
      task,
    },
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const getPriorityStyles = (priority: string) => {
    switch (priority) {
      case 'HIGH PRIORITY':
        return 'bg-rose-500/15 text-rose-300 border-rose-500/30';
      case 'MEDIUM':
        return 'bg-purple-500/15 text-purple-300 border-purple-500/30';
      case 'LOW':
      default:
        return 'bg-slate-700/40 text-slate-400 border-slate-600/30';
    }
  };

  const progressPercentage = task.subtasksTotal > 0 
    ? Math.round((task.subtasksCompleted / task.subtasksTotal) * 100) 
    : 100;

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      className={`group relative glass-card rounded-2xl p-4.5 border transition-all duration-200 select-none cursor-grab active:cursor-grabbing ${
        isDragging
          ? 'opacity-30 scale-95 border-cyan-400 shadow-2xl z-50'
          : 'border-slate-700/60 hover:border-cyan-500/50 hover:shadow-[0_4px_25px_-4px_rgba(56,189,248,0.2)] hover:-translate-y-0.5'
      }`}
    >
      {/* Top Bar: Priority Badge & Task Code */}
      <div className="flex items-center justify-between mb-3">
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md font-mono text-[10px] font-bold border tracking-wider uppercase ${getPriorityStyles(
            task.priority
          )}`}
        >
          {task.priority === 'HIGH PRIORITY' && <AlertTriangle className="w-3 h-3 text-rose-400 animate-pulse" />}
          {task.priority}
        </span>
        
        <div className="flex items-center gap-2">
          <span className="font-mono text-xs text-slate-500 tracking-wide font-medium">
            {task.code}
          </span>
          {onDelete && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onDelete(task.id);
              }}
              className="opacity-0 group-hover:opacity-100 p-1 text-slate-500 hover:text-red-400 transition-opacity"
              title="Delete Task"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Task Title */}
      <h4 className="font-bold text-sm text-white mb-3.5 leading-snug tracking-tight">
        {task.title}
      </h4>

      {/* Subtasks Progress Bar */}
      {task.subtasksTotal > 0 && (
        <div className="mb-4">
          <div className="flex items-center justify-between text-[11px] font-mono text-slate-400 mb-1.5">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-3.5 h-3.5 text-cyan-400" />
              <span>
                {task.subtasksCompleted}/{task.subtasksTotal} Subtasks
              </span>
            </span>
            {onIncrementSubtask && task.subtasksCompleted < task.subtasksTotal && (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onIncrementSubtask(task.id);
                }}
                className="opacity-0 group-hover:opacity-100 text-[10px] text-cyan-400 hover:text-cyan-300 bg-cyan-500/10 px-1.5 py-0.5 rounded border border-cyan-500/20 font-mono transition-opacity"
              >
                +1 Subtask
              </button>
            )}
          </div>
          <div className="w-full h-1.5 bg-slate-800/90 rounded-full overflow-hidden border border-slate-700/40">
            <div
              className={`h-full transition-all duration-300 rounded-full ${
                progressPercentage === 100
                  ? 'bg-gradient-to-r from-emerald-400 to-teal-500 shadow-[0_0_8px_#34d399]'
                  : 'bg-gradient-to-r from-cyan-400 to-indigo-500 shadow-[0_0_8px_#38bdf8]'
              }`}
              style={{ width: `${progressPercentage}%` }}
            />
          </div>
        </div>
      )}

      {/* Card Footer */}
      <div className="flex items-center justify-between pt-3 border-t border-slate-800/60">
        {/* Assignees Avatars */}
        <div className="flex -space-x-2 overflow-hidden items-center">
          {task.assignees.map((assignee, idx) => {
            const isUrl = assignee.startsWith('http') || assignee.startsWith('/');
            const initials = !isUrl && assignee.length <= 3 
              ? assignee.toUpperCase() 
              : !isUrl 
              ? assignee.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase()
              : `A${idx + 1}`;

            return (
              <div
                key={idx}
                className="inline-block h-6 w-6 rounded-full ring-2 ring-[#0f172a] bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1px] overflow-hidden shrink-0 relative"
                title={`Assignee: ${assignee}`}
              >
                {isUrl && (
                  <img
                    src={assignee}
                    alt="Assignee"
                    className="w-full h-full rounded-full object-cover bg-[#1e293b]"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                      const fb = e.currentTarget.nextElementSibling as HTMLElement;
                      if (fb) fb.style.display = 'flex';
                    }}
                  />
                )}
                <div
                  style={{ display: isUrl ? 'none' : 'flex' }}
                  className="w-full h-full rounded-full bg-[#1e293b] items-center justify-center font-mono text-[9px] font-bold text-cyan-200"
                >
                  {initials}
                </div>
              </div>
            );
          })}
          <div className="inline-block h-6 w-6 rounded-full ring-2 ring-[#0f172a] bg-slate-800 flex items-center justify-center text-[10px] font-mono text-slate-400 hover:text-white cursor-pointer shrink-0">
            +
          </div>
        </div>

        {/* Comments & Attachments */}
        <div className="flex items-center gap-3 text-slate-400 font-mono text-xs">
          <div className="flex items-center gap-1">
            <MessageSquare className="w-3.5 h-3.5" />
            <span>{task.commentsCount}</span>
          </div>
          {task.attachmentsCount !== undefined && task.attachmentsCount > 0 && (
            <div className="flex items-center gap-1">
              <Paperclip className="w-3.5 h-3.5" />
              <span>{task.attachmentsCount}</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
