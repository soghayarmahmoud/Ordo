'use client';

import React from 'react';
import { Search, Bell, Grid, Plus, Command } from 'lucide-react';

interface CommandTopBarProps {
  onNewTaskClick?: () => void;
  searchPlaceholder?: string;
}

export const CommandTopBar: React.FC<CommandTopBarProps> = ({
  onNewTaskClick,
  searchPlaceholder = 'Command (⌘K)',
}) => {
  return (
    <header className="h-16 w-full glass-header px-6 flex items-center justify-between sticky top-0 z-30">
      {/* Search Bar / Command Palette Trigger */}
      <div className="flex-1 max-w-md">
        <div className="relative flex items-center group">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
          <input
            type="text"
            placeholder={searchPlaceholder}
            className="w-full bg-[#131d36]/80 border border-slate-700/60 rounded-xl pl-10 pr-10 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all font-sans"
          />
          <div className="absolute right-3 flex items-center gap-0.5 text-[11px] font-mono text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/50">
            <Command className="w-3 h-3" />
            <span>K</span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-3">
        <button
          onClick={onNewTaskClick}
          className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-cyan-400 border border-slate-700/60 text-sm font-medium transition-all hover:shadow-lg hover:shadow-cyan-500/10 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>

        <button className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors relative">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
        </button>

        <button className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors">
          <Grid className="w-4 h-4" />
        </button>

        {/* User Avatar */}
        <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1.5px] cursor-pointer hover:scale-105 transition-transform">
          <div className="w-full h-full rounded-full bg-[#0b1326] flex items-center justify-center font-bold text-xs text-white">
            SJ
          </div>
        </div>
      </div>
    </header>
  );
};
