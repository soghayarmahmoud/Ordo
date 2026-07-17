'use client';

import React, { useState, useEffect } from 'react';
import { Search, Bell, Grid, Plus, Command, Menu } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { INITIAL_EVENT_LOGS } from '@/src/data/mockData';

interface CommandTopBarProps {
  userName?: string;
  userImage?: string;
  onNewTaskClick?: () => void;
  onMobileMenuClick?: () => void;
  onProfileClick?: () => void;
  searchPlaceholder?: string;
}

export const CommandTopBar: React.FC<CommandTopBarProps> = ({
  userName,
  userImage,
  onNewTaskClick,
  onMobileMenuClick,
  onProfileClick,
  searchPlaceholder = 'Ordo Command (⌘K)',
}) => {
  const { data: session } = useSession();
  const [isMac, setIsMac] = useState(true);
  const [showNotifications, setShowNotifications] = useState(false);
  const notifications = INITIAL_EVENT_LOGS;

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setIsMac(navigator.userAgent.toUpperCase().indexOf('MAC') >= 0);
    }
  }, []);

  const displayName = session?.user?.name || userName || 'Ordo User';
  const displayImage = session?.user?.image || userImage;
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((part) => part[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'OU';

  const placeholderText = !isMac ? searchPlaceholder.replace('⌘K', 'Ctrl+K') : searchPlaceholder;

  return (
    <header className="h-16 w-full glass-header px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30 border-b border-slate-800/60 bg-[#0b1326]/80 backdrop-blur-xl">
      {/* Left section: Mobile Hamburger Toggle + Search Bar */}
      <div className="flex items-center gap-3 flex-1 max-w-md">
        <button
          onClick={onMobileMenuClick}
          className="lg:hidden p-2.5 rounded-xl text-slate-300 hover:text-white hover:bg-slate-800/80 transition-colors border border-slate-700/50 shadow-sm"
          title="Open Menu"
        >
          <Menu className="w-5 h-5 text-cyan-400" />
        </button>

        <div className="relative flex items-center group flex-1">
          <Search className="absolute left-3.5 w-4 h-4 text-slate-400 group-focus-within:text-cyan-400 transition-colors" />
          <input
            type="text"
            placeholder={placeholderText}
            className="w-full bg-[#131d36]/80 border border-slate-700/60 rounded-xl pl-10 pr-10 py-2 text-sm text-slate-200 placeholder-slate-500 focus:outline-none focus:border-cyan-500/60 focus:ring-1 focus:ring-cyan-500/30 transition-all font-sans"
          />
          <div className="absolute right-3 hidden sm:flex items-center gap-0.5 text-[11px] font-mono text-slate-400 bg-slate-800/80 px-1.5 py-0.5 rounded border border-slate-700/50">
            {isMac ? <Command className="w-3 h-3" /> : <span className="font-bold">Ctrl</span>}
            <span>{isMac ? 'K' : '+K'}</span>
          </div>
        </div>
      </div>

      {/* Right Controls */}
      <div className="flex items-center gap-2 sm:gap-3 ml-2">
        <button
          onClick={onNewTaskClick}
          className="flex items-center gap-1.5 px-3 sm:px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 text-cyan-300 hover:text-cyan-200 border border-cyan-500/40 text-xs sm:text-sm font-medium transition-all hover:shadow-lg hover:shadow-cyan-500/10 active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span className="hidden sm:inline">New Task</span>
        </button>

        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {notifications.length > 0 && (
              <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#38bdf8]" />
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 glass-card bg-[#0f172a]/95 border border-slate-700/80 rounded-2xl shadow-2xl p-4 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-3">
                <span className="font-bold text-sm text-white flex items-center gap-2">
                  <Bell className="w-4 h-4 text-cyan-400" />
                  Notifications ({notifications.length})
                </span>
                <button
                  onClick={() => setShowNotifications(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  Close
                </button>
              </div>

              {notifications.length > 0 ? (
                <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
                  {notifications.map((log) => (
                    <div
                      key={log.id}
                      className="p-2.5 rounded-xl bg-slate-900/80 border border-slate-800/80 hover:border-slate-700/80 transition-all flex items-start justify-between gap-3"
                    >
                      <div className="min-w-0">
                        <h4 className="text-xs font-bold text-slate-200 truncate">{log.title}</h4>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">{log.subtitle}</p>
                      </div>
                      <span className="text-[10px] font-mono text-slate-500 whitespace-nowrap">
                        {log.timeAgo}
                      </span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="py-6 text-center text-xs text-slate-400 font-mono">
                  No unread notifications
                </div>
              )}
            </div>
          )}
        </div>

        <button className="hidden sm:flex p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 transition-colors">
          <Grid className="w-4 h-4" />
        </button>

        {/* User Avatar - Clicking navigates to profile */}
        <div
          onClick={onProfileClick}
          className="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 p-[1.5px] cursor-pointer hover:scale-105 transition-all shadow-md shadow-cyan-500/10 active:scale-95 overflow-hidden"
          title={`View Profile (${displayName})`}
        >
          {displayImage ? (
            <img
              src={displayImage}
              alt={displayName}
              className="w-full h-full rounded-full object-cover bg-[#0b1326]"
            />
          ) : (
            <div className="w-full h-full rounded-full bg-[#0b1326] flex items-center justify-center font-bold text-xs text-white font-mono">
              {initials}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

