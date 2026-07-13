'use client';

import React, { useState } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  useDraggable, 
  useDroppable, 
  DragEndEvent, 
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors,
  closestCorners
} from '@dnd-kit/core';
import { 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  Sparkles,
  ArrowRightLeft,
  Filter,
  RefreshCw,
  CheckCircle2
} from 'lucide-react';
import { TimeBlock, EmailItem } from '@/src/types/ordo';

interface CalendarViewProps {
  initialTimeBlocks: TimeBlock[];
  initialEmails?: EmailItem[];
}

/* Draggable Time Block inside Calendar Slot */
const DraggableTimeBlock: React.FC<{
  block: TimeBlock;
  onDeleteBlock: (id: string) => void;
}> = ({ block, onDeleteBlock }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: block.id,
    data: { type: 'block', block },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`group w-full h-full rounded-2xl p-3 flex flex-col justify-between border relative overflow-hidden transition-all duration-200 cursor-grab active:cursor-grabbing shadow-lg select-none ${
        isDragging
          ? 'opacity-30 scale-95 ring-2 ring-cyan-400 shadow-2xl'
          : block.variant === 'highlight'
          ? 'bg-gradient-to-br from-teal-950/80 to-teal-900/40 border-teal-500/50 text-teal-100 hover:border-teal-400 hover:shadow-[0_4px_20px_-4px_rgba(20,184,166,0.3)]'
          : block.variant === 'accent'
          ? 'bg-gradient-to-br from-indigo-950/80 to-indigo-900/40 border-indigo-500/50 text-indigo-100 hover:border-indigo-400 hover:shadow-[0_4px_20px_-4px_rgba(99,102,241,0.3)]'
          : block.variant === 'glow'
          ? 'bg-gradient-to-br from-cyan-950/80 to-blue-950/40 border-cyan-400/60 text-cyan-100 shadow-[0_0_20px_rgba(56,189,248,0.2)] hover:border-cyan-300'
          : 'bg-gradient-to-br from-slate-800/90 to-slate-900/80 border-slate-700/80 text-slate-100 hover:border-cyan-400/50 hover:shadow-md'
      }`}
    >
      <div className="flex items-start justify-between gap-1">
        <span className="font-mono text-xs font-bold tracking-tight leading-snug line-clamp-2">
          {block.title}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteBlock(block.id);
          }}
          className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-400 transition-opacity rounded-lg hover:bg-slate-800/60 shrink-0"
          title="Delete Time Block"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex items-center justify-between mt-2 pt-1 border-t border-white/10">
        <span className="text-[10px] font-mono opacity-80 flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {block.timeSlot.split(' ')[0]} - {block.timeSlot.split(' - ')[1]}
        </span>
        <span className="text-[9px] font-mono uppercase px-1.5 py-0.2 rounded bg-black/30 border border-white/10">
          Swap / Move
        </span>
      </div>
    </div>
  );
};

/* Droppable Time Slot Cell */
const DroppableTimeSlot: React.FC<{
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
  hour: number;
  block?: TimeBlock;
  onDeleteBlock: (id: string) => void;
}> = ({ day, hour, block, onDeleteBlock }) => {
  const slotId = `slot-${day}-${hour}`;
  const { setNodeRef, isOver, active } = useDroppable({
    id: slotId,
    data: { type: 'slot', day, hour, existingBlock: block },
  });

  const formattedHour = hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;
  const isDraggingOverSwap = isOver && block && active?.id !== block.id;

  return (
    <div
      ref={setNodeRef}
      className={`h-28 border-b border-r border-slate-800/60 p-2 relative transition-all duration-200 ${
        isOver && !block
          ? 'bg-cyan-500/15 border-2 border-dashed border-cyan-400 shadow-[inset_0_0_25px_rgba(56,189,248,0.25)] z-20 rounded-2xl'
          : isDraggingOverSwap
          ? 'bg-amber-500/20 border-2 border-dashed border-amber-400 shadow-[inset_0_0_25px_rgba(245,158,11,0.25)] z-20 rounded-2xl'
          : 'hover:bg-slate-800/20'
      }`}
    >
      {/* Drop Indicator when hovering over an EMPTY slot */}
      {isOver && !block && (
        <div className="w-full h-full rounded-xl border-2 border-dashed border-cyan-400 bg-cyan-950/50 flex flex-col items-center justify-center p-2 text-center animate-pulse">
          <Clock className="w-4 h-4 text-cyan-300 mb-1" />
          <span className="font-mono text-[11px] text-cyan-300 font-bold">
            Drop to schedule at {formattedHour}
          </span>
        </div>
      )}

      {/* Drop Indicator when hovering over an OCCUPIED slot -> SWAP indicator */}
      {isDraggingOverSwap && (
        <div className="absolute inset-2 rounded-xl border-2 border-dashed border-amber-400 bg-amber-950/80 backdrop-blur-sm flex flex-col items-center justify-center p-2 text-center z-30 animate-pulse shadow-xl">
          <ArrowRightLeft className="w-5 h-5 text-amber-300 mb-1 animate-spin" style={{ animationDuration: '3s' }} />
          <span className="font-mono text-[11px] text-amber-200 font-bold">
            SWAP time with {block?.title.substring(0, 14)}...
          </span>
        </div>
      )}

      {/* Existing Scheduled Block */}
      {block && <DraggableTimeBlock block={block} onDeleteBlock={onDeleteBlock} />}
    </div>
  );
};

export const CalendarView: React.FC<CalendarViewProps> = ({
  initialTimeBlocks,
  initialEmails = [],
}) => {
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>(initialTimeBlocks);
  const [activeBlock, setActiveBlock] = useState<TimeBlock | null>(null);
  const [selectedDay, setSelectedDay] = useState<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'>('Tue');
  const [viewMode, setViewMode] = useState<'Week' | '3-Day' | 'Day'>('Week');
  
  // Create block modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDay, setNewDay] = useState<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'>('Tue');
  const [newHour, setNewHour] = useState(10);
  const [newVariant, setNewVariant] = useState<'default' | 'accent' | 'highlight' | 'glow'>('highlight');

  // Notification toast for swaps
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    })
  );

  const days: Array<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'> = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const hours = [9, 10, 11, 12, 13, 14, 15, 16, 17]; // 9 AM to 5 PM

  const getDaysToRender = () => {
    if (viewMode === 'Day') return [selectedDay];
    if (viewMode === '3-Day') {
      const idx = days.indexOf(selectedDay);
      if (idx <= 2) return days.slice(0, 3);
      return days.slice(2, 5);
    }
    return days;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === 'block') {
      setActiveBlock(active.data.current.block as TimeBlock);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveBlock(null);

    if (!over) return;

    // Dragging an existing time block over a calendar slot
    if (active.data.current?.type === 'block' && over.data.current?.type === 'slot') {
      const draggedBlock = active.data.current.block as TimeBlock;
      const { day: targetDay, hour: targetHour, existingBlock: targetBlock } = over.data.current as {
        day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
        hour: number;
        existingBlock?: TimeBlock;
      };

      if (draggedBlock.day === targetDay && draggedBlock.hour === targetHour) {
        return; // No movement
      }

      const getSlotString = (h: number) => {
        const h1 = h > 12 ? `${h - 12}:00 PM` : `${h}:00 AM`;
        const nextH = h + 1 > 12 ? (h + 1 === 13 ? 1 : h + 1 - 12) : h + 1;
        const h2 = `${nextH}:00 ${h + 1 >= 12 ? 'PM' : 'AM'}`;
        return `${h1} - ${h2}`;
      };

      if (targetBlock && targetBlock.id !== draggedBlock.id) {
        // SWAP THE TWO BLOCKS!
        setTimeBlocks((prev) =>
          prev.map((b) => {
            if (b.id === draggedBlock.id) {
              return {
                ...b,
                day: targetDay,
                hour: targetHour,
                timeSlot: getSlotString(targetHour),
              };
            }
            if (b.id === targetBlock.id) {
              return {
                ...b,
                day: draggedBlock.day,
                hour: draggedBlock.hour,
                timeSlot: getSlotString(draggedBlock.hour),
              };
            }
            return b;
          })
        );
        showToast(`⚡ Swapped "${draggedBlock.title}" with "${targetBlock.title}" successfully!`);
      } else {
        // MOVE TO EMPTY SLOT
        setTimeBlocks((prev) =>
          prev.map((b) =>
            b.id === draggedBlock.id
              ? {
                  ...b,
                  day: targetDay,
                  hour: targetHour,
                  timeSlot: getSlotString(targetHour),
                }
              : b
          )
        );
        showToast(`📅 Moved "${draggedBlock.title}" to ${targetDay} at ${targetHour > 12 ? targetHour - 12 + ':00 PM' : targetHour + ':00 AM'}`);
      }
    }
  };

  const handleDeleteBlock = (id: string) => {
    const block = timeBlocks.find((b) => b.id === id);
    setTimeBlocks((prev) => prev.filter((b) => b.id !== id));
    if (block) {
      showToast(`🗑️ Removed "${block.title}" from calendar.`);
    }
  };

  const handleCreateBlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const getSlotString = (h: number) => {
      const h1 = h > 12 ? `${h - 12}:00 PM` : `${h}:00 AM`;
      const nextH = h + 1 > 12 ? (h + 1 === 13 ? 1 : h + 1 - 12) : h + 1;
      const h2 = `${nextH}:00 ${h + 1 >= 12 ? 'PM' : 'AM'}`;
      return `${h1} - ${h2}`;
    };

    const newBlock: TimeBlock = {
      id: `block-${Date.now()}`,
      title: newTitle,
      timeSlot: getSlotString(newHour),
      day: newDay,
      hour: newHour,
      durationHours: 1,
      variant: newVariant,
    };

    // Remove any block that might already be at newDay & newHour or swap
    setTimeBlocks((prev) => [...prev.filter((b) => !(b.day === newDay && b.hour === newHour)), newBlock]);
    setNewTitle('');
    setIsModalOpen(false);
    showToast(`✨ Scheduled "${newTitle}" on ${newDay} at ${newHour > 12 ? newHour - 12 + ' PM' : newHour + ' AM'}`);
  };

  return (
    <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="flex flex-col h-[calc(100vh-6rem)] space-y-5">
        
        {/* Calendar Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800/80">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase mb-1">
              <CalendarIcon className="w-3.5 h-3.5" />
              <span>TIME-BLOCKING & SCHEDULE ENGINE</span>
            </div>
            <h1 className="font-bold text-2xl sm:text-3xl text-white tracking-tight flex items-center gap-3">
              Ordo Interactive Calendar
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 flex items-center gap-2">
              <span>Drag & drop blocks to change slots</span>
              <span className="text-slate-600">•</span>
              <span className="text-amber-400 font-medium flex items-center gap-1">
                <ArrowRightLeft className="w-3.5 h-3.5" />
                Drop onto another task to SWAP times
              </span>
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-[#0b1326] font-bold text-xs transition-all shadow-lg shadow-cyan-500/20 active:scale-95"
            >
              <Plus className="w-4 h-4" />
              <span>Carve Time Block</span>
            </button>

            {/* View Mode Switcher */}
            <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              {(['Week', '3-Day', 'Day'] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setViewMode(mode)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                    viewMode === mode ? 'bg-slate-700 text-white font-bold shadow' : 'text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Toast Notification for Swap/Move feedback */}
        {toastMessage && (
          <div className="fixed bottom-6 right-6 z-50 glass-card bg-[#0f172a]/95 border-2 border-cyan-400 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-5 duration-300">
            <Sparkles className="w-5 h-5 text-cyan-400 animate-spin" style={{ animationDuration: '3s' }} />
            <span className="text-xs font-mono font-bold">{toastMessage}</span>
          </div>
        )}

        {/* Main Calendar Grid Container */}
        <div className="flex-1 overflow-x-auto overflow-y-auto border border-slate-800/80 rounded-3xl bg-[#0f172a]/40 backdrop-blur-md relative shadow-2xl">
          <div className="min-w-[700px] h-full flex flex-col">
            {/* Days Header */}
            <div 
              className="grid border-b border-slate-800/80 sticky top-0 bg-[#0f172a]/95 z-20 shadow-md"
              style={{ gridTemplateColumns: `5rem repeat(${getDaysToRender().length}, minmax(0, 1fr))` }}
            >
              <div className="p-3 text-right font-mono text-[11px] text-slate-500 self-center border-r border-slate-800/50">
                GMT+03
              </div>
              {getDaysToRender().map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`p-3.5 text-center transition-colors border-r border-slate-800/50 flex flex-col items-center justify-center ${
                    selectedDay === d
                      ? 'bg-cyan-500/10 text-cyan-400 font-bold border-b-2 border-b-cyan-400'
                      : 'text-slate-400 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="font-mono text-xs font-bold uppercase tracking-widest">{d}</div>
                  <div className="text-[11px] font-mono opacity-60 mt-0.5">
                    {d === 'Mon' ? 'Oct 24' : d === 'Tue' ? 'Oct 25' : d === 'Wed' ? 'Oct 26' : d === 'Thu' ? 'Oct 27' : 'Oct 28'}
                  </div>
                </button>
              ))}
            </div>

            {/* Time Rows */}
            <div className="divide-y divide-slate-800/50 flex-1">
              {hours.map((hour) => {
                const hourLabel = hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;
                return (
                  <div 
                    key={hour} 
                    className="grid min-h-[7rem]"
                    style={{ gridTemplateColumns: `5rem repeat(${getDaysToRender().length}, minmax(0, 1fr))` }}
                  >
                    {/* Time Label */}
                    <div className="p-2.5 text-right font-mono text-xs text-slate-500 border-r border-slate-800/50 pr-3.5 select-none flex justify-end items-start pt-3 bg-[#0b1326]/40">
                      {hourLabel}
                    </div>

                    {/* Day Slots */}
                    {getDaysToRender().map((d) => {
                      const block = timeBlocks.find((b) => b.day === d && b.hour === hour);
                      return (
                        <DroppableTimeSlot
                          key={`${d}-${hour}`}
                          day={d}
                          hour={hour}
                          block={block}
                          onDeleteBlock={handleDeleteBlock}
                        />
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Drag Overlay for Glowing Drag & Drop & Swap effect */}
      <DragOverlay dropAnimation={{ duration: 250, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
        {activeBlock ? (
          <div className="w-64 glass-card rounded-2xl p-4 border-2 border-amber-400 shadow-[0_0_45px_rgba(245,158,11,0.5)] bg-[#0f172a]/95 text-white scale-105 pointer-events-none rotate-3 animate-pulse">
            <div className="flex items-center justify-between mb-1.5">
              <span className="font-mono text-[10px] uppercase bg-amber-500/20 text-amber-300 px-2 py-0.5 rounded border border-amber-500/30">
                ⚡ Swapping / Moving
              </span>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <h4 className="font-bold text-sm text-white mb-2 leading-snug">{activeBlock.title}</h4>
            <div className="text-[11px] font-mono text-slate-300 flex items-center gap-1.5">
              <span>Hover over another slot to drop or swap</span>
            </div>
          </div>
        ) : null}
      </DragOverlay>

      {/* Carve Time Block Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1326]/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md glass-panel rounded-3xl p-6 border border-cyan-500/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-cyan-400" />
                Schedule Ordo Time Block
              </h3>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-white text-sm">
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateBlock} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Block Title</label>
                <input
                  type="text"
                  placeholder="e.g., Deep Work: Architecture Review"
                  value={newTitle}
                  onChange={(e) => setNewTitle(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 transition-colors font-sans"
                  autoFocus
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Day</label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value as any)}
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    {days.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono text-slate-400 mb-1">Time Slot</label>
                  <select
                    value={newHour}
                    onChange={(e) => setNewHour(Number(e.target.value))}
                    className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                  >
                    {hours.map((h) => (
                      <option key={h} value={h}>
                        {h > 12 ? `${h - 12}:00 PM` : `${h}:00 AM`}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Visual Theme</label>
                <div className="grid grid-cols-2 gap-2">
                  {(['highlight', 'accent', 'glow', 'default'] as const).map((v) => (
                    <button
                      key={v}
                      type="button"
                      onClick={() => setNewVariant(v)}
                      className={`p-2 rounded-xl text-xs font-mono uppercase font-bold border transition-all ${
                        newVariant === v
                          ? 'bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-[0_0_12px_rgba(56,189,248,0.3)]'
                          : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                      }`}
                    >
                      {v}
                    </button>
                  ))}
                </div>
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
                  Schedule Block
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </DndContext>
  );
};
