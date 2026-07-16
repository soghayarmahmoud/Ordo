'use client';

import React, { useState, useEffect } from 'react';
import { 
  DndContext, 
  DragOverlay, 
  useDraggable, 
  useDroppable, 
  DragEndEvent, 
  DragStartEvent,
  PointerSensor,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { 
  Filter, 
  Sparkles, 
  Calendar as CalendarIcon, 
  Clock, 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  Trash2, 
  CheckCircle2,
  Mail
} from 'lucide-react';
import { EmailItem, TimeBlock } from '@/src/types/ordo';
import { 
  createTimeBlockAction, 
  deleteTimeBlockAction, 
  createEmailItemAction, 
  deleteEmailItemAction 
} from '@/actions/workspace';

interface SmartInboxCalendarViewProps {
  initialEmails: EmailItem[];
  initialTimeBlocks: TimeBlock[];
  userId?: string;
}

/* Draggable Inbox Item Component */
const DraggableInboxItem: React.FC<{
  email: EmailItem;
  onDelete: (id: string) => void;
  onScheduleClick: (email: EmailItem) => void;
}> = ({ email, onDelete, onScheduleClick }) => {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: email.id,
    data: { type: 'email', email },
  });

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`group relative glass-card rounded-2xl p-4.5 border transition-all duration-200 cursor-grab active:cursor-grabbing ${
        isDragging
          ? 'opacity-40 scale-95 border-cyan-500/50 shadow-2xl'
          : 'border-slate-700/50 hover:border-cyan-500/40 hover:shadow-[0_4px_20px_-4px_rgba(56,189,248,0.15)] hover:-translate-y-0.5'
      } ${email.isScheduled ? 'opacity-60 bg-slate-900/40 border-slate-800' : ''}`}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="font-semibold text-xs text-slate-300 flex items-center gap-2">
          {email.sender}
          {email.isScheduled && (
            <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded font-mono">
              Scheduled
            </span>
          )}
        </span>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-mono text-slate-500">{email.time}</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onDelete(email.id);
            }}
            className="opacity-0 group-hover:opacity-100 p-1 text-slate-400 hover:text-red-400 transition-opacity"
            title="Delete Item"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      <h4 className="font-bold text-sm text-white mb-2 leading-snug">{email.subject}</h4>

      {email.summaryBadge && (
        <div className="mb-3 inline-block">
          <span
            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg font-mono text-[11px] font-medium border ${
              email.summaryBadge.variant === 'summarized'
                ? 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                : 'bg-teal-500/15 text-teal-300 border-teal-500/30'
            }`}
          >
            <Sparkles className="w-3 h-3 animate-pulse" />
            {email.summaryBadge.text}
          </span>
        </div>
      )}

      {email.body && (
        <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-sans">
          {email.body}
        </p>
      )}

      {/* Quick Schedule Trigger */}
      {!email.isScheduled && (
        <div className="mt-3 pt-2.5 border-t border-slate-800/60 flex justify-between items-center opacity-0 group-hover:opacity-100 transition-opacity">
          <span className="text-[10px] font-mono text-slate-500">Drag onto calendar or</span>
          <button
            onClick={(e) => {
              e.stopPropagation();
              onScheduleClick(email);
            }}
            className="text-[11px] font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-cyan-500/10 px-2 py-0.5 rounded border border-cyan-500/20"
          >
            <Clock className="w-3 h-3" />
            Quick block
          </button>
        </div>
      )}
    </div>
  );
};

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
      className={`group w-full h-full rounded-xl p-2 flex flex-col justify-between border relative overflow-hidden transition-all duration-200 cursor-grab active:cursor-grabbing shadow-md select-none ${
        isDragging
          ? 'opacity-30 scale-95 ring-2 ring-cyan-400 shadow-2xl'
          : block.variant === 'highlight'
          ? 'bg-teal-950/70 border-teal-500/50 text-teal-200 shadow-teal-500/10 hover:border-teal-400'
          : block.variant === 'accent'
          ? 'bg-indigo-950/70 border-indigo-500/50 text-indigo-200 shadow-indigo-500/10 hover:border-indigo-400'
          : 'bg-slate-800/90 border-slate-700/80 text-slate-200 hover:border-cyan-400/50'
      }`}
    >
      <div className="flex items-start justify-between gap-1">
        <span className="font-mono text-[11px] font-bold tracking-tight line-clamp-1">
          {block.title}
        </span>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onDeleteBlock(block.id);
          }}
          className="opacity-0 group-hover:opacity-100 p-0.5 text-slate-400 hover:text-red-400 transition-opacity"
        >
          <Trash2 className="w-3 h-3" />
        </button>
      </div>
      <span className="text-[10px] font-mono opacity-70 truncate">{block.timeSlot}</span>
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
      className={`h-20 border-b border-r border-slate-800/50 p-1.5 relative transition-all duration-200 ${
        isOver && !block
          ? 'bg-cyan-500/15 border-2 border-dashed border-cyan-400 shadow-[inset_0_0_20px_rgba(56,189,248,0.25)] z-20'
          : isDraggingOverSwap
          ? 'bg-amber-500/20 border-2 border-dashed border-amber-400 shadow-[inset_0_0_20px_rgba(245,158,11,0.25)] z-20'
          : 'hover:bg-slate-800/20'
      }`}
    >
      {/* Drop Indicator when hovering over empty */}
      {isOver && !block && (
        <div className="w-full h-full rounded-xl border-2 border-dashed border-cyan-400 bg-cyan-950/40 flex items-center justify-center p-2 text-center animate-pulse">
          <span className="font-mono text-xs text-cyan-300 font-bold">
            Drop to schedule {formattedHour}
          </span>
        </div>
      )}

      {/* Swap Indicator when hovering over existing block */}
      {isDraggingOverSwap && (
        <div className="absolute inset-1.5 rounded-xl border-2 border-dashed border-amber-400 bg-amber-950/80 flex items-center justify-center p-1 text-center z-30 animate-pulse">
          <span className="font-mono text-[10px] text-amber-300 font-bold">
            ⚡ Swap time
          </span>
        </div>
      )}

      {/* Existing Scheduled Block */}
      {block && <DraggableTimeBlock block={block} onDeleteBlock={onDeleteBlock} />}
    </div>
  );
};

/* Main Modular Component */
export const SmartInboxCalendarView: React.FC<SmartInboxCalendarViewProps> = ({
  initialEmails,
  initialTimeBlocks,
  userId,
}) => {
  const [emails, setEmails] = useState<EmailItem[]>(initialEmails);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>(initialTimeBlocks);
  const [activeEmail, setActiveEmail] = useState<EmailItem | null>(null);
  const [activeBlock, setActiveBlock] = useState<TimeBlock | null>(null);
  const [selectedDay, setSelectedDay] = useState<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'>('Wed');
  const [viewMode, setViewMode] = useState<'Week' | 'Day'>('Week');
  
  // New action item state
  const [isAddingEmail, setIsAddingEmail] = useState(false);
  const [newSender, setNewSender] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newSummary, setNewSummary] = useState('');

  useEffect(() => {
    setEmails(initialEmails);
  }, [initialEmails]);

  useEffect(() => {
    setTimeBlocks(initialTimeBlocks);
  }, [initialTimeBlocks]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 5,
      },
    })
  );

  const days: Array<'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'> = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
  const hours = [9, 10, 11, 12, 13, 14, 15]; // 9 AM to 3 PM

  /* Handlers */
  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    if (active.data.current?.type === 'email') {
      setActiveEmail(active.data.current.email as EmailItem);
    }
    if (active.data.current?.type === 'block') {
      setActiveBlock(active.data.current.block as TimeBlock);
    }
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveEmail(null);
    setActiveBlock(null);

    if (!over) return;

    // 1. Dragging email onto slot
    if (active.data.current?.type === 'email' && over.data.current?.type === 'slot') {
      const email = active.data.current.email as EmailItem;
      const { day, hour } = over.data.current as { day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'; hour: number };

      // Create new timeblock
      const hourLabel = hour > 12 ? `${hour - 12}:00 PM` : `${hour}:00 AM`;
      const newBlock: TimeBlock = {
        id: `block-${Date.now()}`,
        title: `${hourLabel.split(' ')[0]} ${email.subject.substring(0, 15)}...`,
        timeSlot: `${hourLabel} - ${hour + 1 > 12 ? hour + 1 - 12 : hour + 1}:00 ${hour >= 12 ? 'PM' : 'AM'}`,
        day,
        hour,
        durationHours: 1,
        variant: 'highlight',
        emailId: email.id,
      };

      setTimeBlocks((prev) => [...prev.filter((b) => !(b.day === day && b.hour === hour)), newBlock]);
      setEmails((prev) =>
        prev.map((e) => (e.id === email.id ? { ...e, isScheduled: true } : e))
      );

      if (userId && userId !== 'anonymous') {
        await createTimeBlockAction({
          userId,
          title: newBlock.title,
          timeSlot: newBlock.timeSlot,
          day: newBlock.day,
          hour: newBlock.hour,
          durationHours: 1,
          variant: newBlock.variant,
          emailId: email.id,
        });
      }
    }

    // 2. Dragging existing time block across slots -> SWAP or MOVE
    if (active.data.current?.type === 'block' && over.data.current?.type === 'slot') {
      const draggedBlock = active.data.current.block as TimeBlock;
      const { day: targetDay, hour: targetHour, existingBlock: targetBlock } = over.data.current as {
        day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
        hour: number;
        existingBlock?: TimeBlock;
      };

      if (draggedBlock.day === targetDay && draggedBlock.hour === targetHour) return;

      const getSlotString = (h: number) => {
        const h1 = h > 12 ? `${h - 12}:00 PM` : `${h}:00 AM`;
        const nextH = h + 1 > 12 ? (h + 1 === 13 ? 1 : h + 1 - 12) : h + 1;
        const h2 = `${nextH}:00 ${h + 1 >= 12 ? 'PM' : 'AM'}`;
        return `${h1} - ${h2}`;
      };

      if (targetBlock && targetBlock.id !== draggedBlock.id) {
        // SWAP
        setTimeBlocks((prev) =>
          prev.map((b) => {
            if (b.id === draggedBlock.id) {
              return { ...b, day: targetDay, hour: targetHour, timeSlot: getSlotString(targetHour) };
            }
            if (b.id === targetBlock.id) {
              return { ...b, day: draggedBlock.day, hour: draggedBlock.hour, timeSlot: getSlotString(draggedBlock.hour) };
            }
            return b;
          })
        );
        if (userId && userId !== 'anonymous') {
          await createTimeBlockAction({
            userId,
            title: draggedBlock.title,
            timeSlot: getSlotString(targetHour),
            day: targetDay,
            hour: targetHour,
            durationHours: draggedBlock.durationHours,
            variant: draggedBlock.variant,
            emailId: draggedBlock.emailId,
          });
          await createTimeBlockAction({
            userId,
            title: targetBlock.title,
            timeSlot: getSlotString(draggedBlock.hour),
            day: draggedBlock.day,
            hour: draggedBlock.hour,
            durationHours: targetBlock.durationHours,
            variant: targetBlock.variant,
            emailId: targetBlock.emailId,
          });
        }
      } else {
        // MOVE
        setTimeBlocks((prev) =>
          prev.map((b) =>
            b.id === draggedBlock.id
              ? { ...b, day: targetDay, hour: targetHour, timeSlot: getSlotString(targetHour) }
              : b
          )
        );
        if (userId && userId !== 'anonymous') {
          await createTimeBlockAction({
            userId,
            title: draggedBlock.title,
            timeSlot: getSlotString(targetHour),
            day: targetDay,
            hour: targetHour,
            durationHours: draggedBlock.durationHours,
            variant: draggedBlock.variant,
            emailId: draggedBlock.emailId,
          });
        }
      }
    }
  };

  const handleDeleteEmail = async (id: string) => {
    setEmails((prev) => prev.filter((e) => e.id !== id));
    if (userId && userId !== 'anonymous' && !id.startsWith('email-')) {
      await deleteEmailItemAction(id);
    }
  };

  const handleDeleteBlock = async (id: string) => {
    setTimeBlocks((prev) => prev.filter((b) => b.id !== id));
    if (userId && userId !== 'anonymous' && !id.startsWith('block-')) {
      await deleteTimeBlockAction(id);
    }
  };

  const handleQuickSchedule = async (email: EmailItem) => {
    // Find first open slot on selectedDay
    for (const h of hours) {
      const exists = timeBlocks.some((b) => b.day === selectedDay && b.hour === h);
      if (!exists) {
        const hourLabel = h > 12 ? `${h - 12}:00 PM` : `${h}:00 AM`;
        const newBlock: TimeBlock = {
          id: `block-${Date.now()}`,
          title: `${hourLabel.split(' ')[0]} ${email.subject.substring(0, 15)}...`,
          timeSlot: `${hourLabel} - ${h + 1 > 12 ? h + 1 - 12 : h + 1}:00 ${h >= 12 ? 'PM' : 'AM'}`,
          day: selectedDay,
          hour: h,
          durationHours: 1,
          variant: 'accent',
          emailId: email.id,
        };
        setTimeBlocks((prev) => [...prev, newBlock]);
        setEmails((prev) => prev.map((e) => (e.id === email.id ? { ...e, isScheduled: true } : e)));
        if (userId && userId !== 'anonymous') {
          await createTimeBlockAction({
            userId,
            title: newBlock.title,
            timeSlot: newBlock.timeSlot,
            day: newBlock.day,
            hour: newBlock.hour,
            durationHours: 1,
            variant: newBlock.variant,
            emailId: email.id,
          });
        }
        break;
      }
    }
  };

  const handleAddNewEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSender || !newSubject) return;

    const newEmail: EmailItem = {
      id: `email-${Date.now()}`,
      sender: newSender,
      time: 'Just now',
      subject: newSubject,
      body: 'Simulated incoming message content via Ordo Console.',
      summaryBadge: newSummary
        ? { text: `✨ Summarized: ${newSummary}`, variant: 'summarized' }
        : undefined,
      isScheduled: false,
    };

    setEmails((prev) => [newEmail, ...prev]);
    setNewSender('');
    setNewSubject('');
    setNewSummary('');
    setIsAddingEmail(false);

    if (userId && userId !== 'anonymous') {
      const res = await createEmailItemAction({
        userId,
        sender: newSender,
        subject: newSubject,
        body: 'Simulated incoming message content via Ordo Console.',
        summaryText: newSummary ? `Summarized: ${newSummary}` : undefined,
        summaryVariant: 'summarized',
      });
      if (res.success && res.email) {
        setEmails((prev) => prev.map((item) => (item.id === newEmail.id ? { ...item, id: res.email.id } : item)));
      }
    }
  };

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-6rem)]">
        
        {/* Left Panel: Smart Inbox */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 flex flex-col h-full border border-slate-700/50 shadow-2xl relative overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="font-bold text-lg text-white tracking-tight flex items-center gap-2">
                Smart Inbox
              </h2>
              <p className="text-xs font-mono text-slate-400">
                {emails.filter((e) => !e.isScheduled).length} Action Items
              </p>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddingEmail(!isAddingEmail)}
                className="p-2 rounded-xl bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-400 border border-cyan-500/30 transition-all flex items-center gap-1.5 text-xs font-medium"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Item</span>
              </button>
              <button className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 border border-slate-700/50 transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Add Item Form Modal/Collapsible */}
          {isAddingEmail && (
            <form onSubmit={handleAddNewEmail} className="mb-4 p-4 rounded-2xl bg-[#0f172a]/90 border border-cyan-500/40 space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
              <div className="flex justify-between items-center text-xs font-bold text-cyan-400">
                <span>Simulate Incoming Email</span>
                <button type="button" onClick={() => setIsAddingEmail(false)} className="text-slate-400 hover:text-white">✕</button>
              </div>
              <input
                type="text"
                placeholder="Sender (e.g., Alex Chen)"
                value={newSender}
                onChange={(e) => setNewSender(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              <input
                type="text"
                placeholder="Subject (e.g., Design System Sync)"
                value={newSubject}
                onChange={(e) => setNewSubject(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500"
              />
              <input
                type="text"
                placeholder="AI Summary (Optional: e.g., Needs scheduling)"
                value={newSummary}
                onChange={(e) => setNewSummary(e.target.value)}
                className="w-full bg-slate-900/80 border border-slate-700 rounded-xl px-3 py-1.5 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
              />
              <button
                type="submit"
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-[#0b1326] font-bold text-xs py-2 rounded-xl transition-all shadow-md shadow-cyan-500/20"
              >
                Insert into Smart Inbox
              </button>
            </form>
          )}

          {/* Inbox List */}
          <div className="flex-1 overflow-y-auto pr-1 space-y-3.5">
            {emails.map((email) => (
              <DraggableInboxItem
                key={email.id}
                email={email}
                onDelete={handleDeleteEmail}
                onScheduleClick={handleQuickSchedule}
              />
            ))}
            {emails.length === 0 && (
              <div className="h-48 flex flex-col items-center justify-center text-slate-500 text-sm">
                <CheckCircle2 className="w-8 h-8 text-cyan-400/60 mb-2" />
                <span>Inbox zero! You're all caught up.</span>
              </div>
            )}
          </div>
        </div>

        {/* Right Panel: Calendar Time-blocking Grid */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 flex flex-col h-full border border-slate-700/50 shadow-2xl overflow-hidden">
          {/* Calendar Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="font-bold text-lg text-white tracking-tight">This Week</h2>
              <div className="flex items-center gap-1 text-xs font-mono text-slate-400 bg-slate-800/80 px-2.5 py-1 rounded-xl border border-slate-700/60">
                <button className="hover:text-white"><ChevronLeft className="w-3.5 h-3.5" /></button>
                <span>Oct 24 - 30</span>
                <button className="hover:text-white"><ChevronRight className="w-3.5 h-3.5" /></button>
              </div>
            </div>

            <div className="flex items-center gap-1 bg-slate-900/90 p-1 rounded-xl border border-slate-800">
              <button
                onClick={() => setViewMode('Week')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'Week' ? 'bg-slate-700/80 text-white font-bold shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Week
              </button>
              <button
                onClick={() => setViewMode('Day')}
                className={`px-3 py-1 rounded-lg text-xs font-medium transition-all ${
                  viewMode === 'Day' ? 'bg-slate-700/80 text-white font-bold shadow' : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                Day
              </button>
            </div>
          </div>

          {/* Calendar Grid Container */}
          <div className="flex-1 overflow-y-auto border border-slate-800/80 rounded-2xl bg-[#0f172a]/40 backdrop-blur-md">
            {/* Days Header */}
            <div className="grid grid-cols-6 border-b border-slate-800/80 sticky top-0 bg-[#0f172a]/95 z-20">
              <div className="p-2 text-right font-mono text-[11px] text-slate-500 self-center">GMT+03</div>
              {(viewMode === 'Week' ? days : [selectedDay]).map((d) => (
                <button
                  key={d}
                  onClick={() => setSelectedDay(d)}
                  className={`p-3 text-center transition-colors border-l border-slate-800/50 ${
                    selectedDay === d
                      ? 'bg-cyan-500/10 text-cyan-400 font-bold border-b-2 border-b-cyan-400'
                      : 'text-slate-400 hover:bg-slate-800/40'
                  }`}
                >
                  <div className="font-mono text-xs">{d}</div>
                </button>
              ))}
            </div>

            {/* Time Grid Rows */}
            <div className="divide-y divide-slate-800/50">
              {hours.map((hour) => {
                const hourLabel = hour > 12 ? `${hour - 12} PM` : `${hour} AM`;
                return (
                  <div key={hour} className="grid grid-cols-6 min-h-[5rem]">
                    {/* Time Label */}
                    <div className="p-2 text-right font-mono text-[11px] text-slate-500 border-r border-slate-800/50 pr-3 select-none flex justify-end items-start pt-3">
                      {hourLabel}
                    </div>

                    {/* Day Slots */}
                    {(viewMode === 'Week' ? days : [selectedDay]).map((d) => {
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

      {/* Drag Overlay for Glowing Drag & Drop effect */}
      <DragOverlay dropAnimation={{ duration: 250, easing: 'cubic-bezier(0.18, 0.67, 0.6, 1.22)' }}>
        {activeEmail ? (
          <div className="w-64 glass-card rounded-2xl p-4 border-2 border-cyan-400 shadow-[0_0_35px_rgba(56,189,248,0.4)] bg-[#0f172a]/95 text-white scale-105 pointer-events-none rotate-2 animate-pulse">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs text-cyan-400">{activeEmail.sender}</span>
              <span className="text-[10px] font-mono bg-cyan-500/20 text-cyan-300 px-1.5 py-0.5 rounded">
                Scheduling...
              </span>
            </div>
            <h4 className="font-bold text-sm text-white mb-2 leading-snug">{activeEmail.subject}</h4>
            <div className="text-[11px] font-mono text-cyan-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5" />
              <span>Drag to calendar slot to schedule</span>
            </div>
          </div>
        ) : activeBlock ? (
          <div className="w-64 glass-card rounded-2xl p-4 border-2 border-amber-400 shadow-[0_0_35px_rgba(245,158,11,0.5)] bg-[#0f172a]/95 text-white scale-105 pointer-events-none rotate-3 animate-pulse">
            <div className="flex items-center justify-between mb-1">
              <span className="font-bold text-xs text-amber-400">⚡ Swapping / Moving</span>
              <Clock className="w-3.5 h-3.5 text-amber-400" />
            </div>
            <h4 className="font-bold text-sm text-white mb-2 leading-snug">{activeBlock.title}</h4>
            <div className="text-[11px] font-mono text-slate-300">Hover over another slot to drop or swap</div>
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};
