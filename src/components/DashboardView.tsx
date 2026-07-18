'use client';

import React from 'react';
import { 
  LayoutGrid, 
  Clock, 
  Layers, 
  Zap, 
  ArrowUpRight, 
  Sparkles, 
  CheckCircle2, 
  Activity, 
  Terminal,
  Calendar,
  Inbox,
  Map,
  Plus
} from 'lucide-react';
import { TabType, EmailItem, TimeBlock } from '@/src/types/ordo';
import { SmartInboxCalendarView } from './SmartInboxCalendarView';
import { useSession } from 'next-auth/react';

interface DashboardViewProps {
  onSelectTab: (tab: TabType) => void;
  initialEmails: EmailItem[];
  initialTimeBlocks: TimeBlock[];
  userId?: string;
  session?: any;
  initialTasksCount?: number;
  initialWebhooksCount?: number;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  onSelectTab,
  initialEmails,
  initialTimeBlocks,
  userId,
  session: propSession,
  initialTasksCount = 4,
  initialWebhooksCount = 2,
}) => {
  const { data: sessionData } = useSession();
  const session = sessionData || propSession;
  const firstName = session?.user?.name ? session.user.name.split(' ')[0] : 'Architect';

  const actionItemsCount = initialEmails.filter((e) => !e.isScheduled).length;
  const nextBlockText = initialTimeBlocks.length > 0 ? initialTimeBlocks[0].timeSlot.split(' ')[0] + ' Today' : 'No blocks today';
  const sprintVelocity = initialTasksCount > 0 ? 100 : 0; // Or dynamically calculate from completed tasks later
  const throughputText = `${initialWebhooksCount} active endpoints`;

  return (
    <div className="space-y-6">
      {/* Welcome Banner exact to design aesthetic */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase mb-1">
            <Terminal className="w-3.5 h-3.5" />
            <span>EXECUTIVE COMMAND CONSOLE</span>
          </div>
          <h1 className="font-bold text-3xl text-white tracking-tight flex items-center gap-3">
            Welcome back, {firstName}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Ordo AI Productivity Engine is active and routing across 4 workspace modules.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={() => onSelectTab('calendar')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-cyan-300 border border-slate-700/60 text-xs font-medium transition-all"
          >
            <Calendar className="w-3.5 h-3.5 text-cyan-400" />
            <span>Carve Time</span>
          </button>
          <button
            onClick={() => onSelectTab('projects')}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-purple-300 border border-slate-700/60 text-xs font-medium transition-all"
          >
            <Layers className="w-3.5 h-3.5 text-purple-400" />
            <span>Sprint Board</span>
          </button>
          <button
            onClick={() => onSelectTab('inbox')}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-[#0b1326] font-bold text-xs transition-all shadow-lg shadow-cyan-500/20"
          >
            <Inbox className="w-3.5 h-3.5" />
            <span>Smart Inbox ⚡</span>
          </button>
        </div>
      </div>

      {/* 4 KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {/* KPI 1: Smart Inbox */}
        <div 
          onClick={() => onSelectTab('inbox')}
          className="glass-card rounded-3xl p-5 border border-slate-700/60 hover:border-cyan-500/50 transition-all duration-200 cursor-pointer group relative overflow-hidden shadow-xl"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center">
              <Inbox className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-cyan-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">
            SMART INBOX
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white tracking-tight">
              {actionItemsCount}
            </span>
            <span className="text-xs font-mono text-cyan-400">Action items</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>AI Summarized</span>
            <span className="text-cyan-300 font-bold">100% Processed</span>
          </div>
        </div>

        {/* KPI 2: Time Blocks */}
        <div 
          onClick={() => onSelectTab('calendar')}
          className="glass-card rounded-3xl p-5 border border-slate-700/60 hover:border-teal-500/50 transition-all duration-200 cursor-pointer group relative overflow-hidden shadow-xl"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-teal-500/15 text-teal-400 border border-teal-500/30 flex items-center justify-center">
              <Clock className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-teal-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">
            SCHEDULE BLOCKS
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white tracking-tight">
              {initialTimeBlocks.length}
            </span>
            <span className="text-xs font-mono text-teal-400">Carved blocks</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Next Block</span>
            <span className="text-teal-300 font-bold">{nextBlockText}</span>
          </div>
        </div>

        {/* KPI 3: Projects */}
        <div 
          onClick={() => onSelectTab('projects')}
          className="glass-card rounded-3xl p-5 border border-slate-700/60 hover:border-purple-500/50 transition-all duration-200 cursor-pointer group relative overflow-hidden shadow-xl"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center">
              <Layers className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-purple-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">
            KANBAN SPRINT
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white tracking-tight">{initialTasksCount}</span>
            <span className="text-xs font-mono text-purple-400">Active tasks</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Sprint Active</span>
            <span className="text-purple-300 font-bold">{sprintVelocity}% Velocity</span>
          </div>
        </div>

        {/* KPI 4: Automations */}
        <div 
          onClick={() => onSelectTab('automations')}
          className="glass-card rounded-3xl p-5 border border-slate-700/60 hover:border-emerald-500/50 transition-all duration-200 cursor-pointer group relative overflow-hidden shadow-xl"
        >
          <div className="flex items-start justify-between mb-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
              <Zap className="w-5 h-5" />
            </div>
            <ArrowUpRight className="w-4 h-4 text-slate-500 group-hover:text-emerald-400 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all" />
          </div>
          <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">
            API WEBHOOKS
          </span>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-bold text-white tracking-tight">{initialWebhooksCount}</span>
            <span className="text-xs font-mono text-emerald-400">Connected</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-800/80 flex items-center justify-between text-[11px] font-mono text-slate-500">
            <span>Throughput</span>
            <span className="text-emerald-300 font-bold">{throughputText}</span>
          </div>
        </div>
      </div>

      {/* Main Interactive Workspace Area: Smart Inbox + Calendar Schedule */}
      <div className="space-y-4 pt-2">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-xl text-white tracking-tight flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            <span>Interactive Workspace Preview</span>
          </h2>
          <div className="text-xs font-mono text-slate-400 bg-slate-800/80 px-3 py-1 rounded-xl border border-slate-700">
            💡 Tip: Drag & drop across slots to swap schedules right here on your dashboard
          </div>
        </div>

        {/* Embedded SmartInboxCalendarView */}
        <SmartInboxCalendarView
          initialEmails={initialEmails}
          initialTimeBlocks={initialTimeBlocks}
          userId={userId}
        />
      </div>
    </div>
  );
};

