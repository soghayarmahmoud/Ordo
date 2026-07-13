'use client';

import React from 'react';
import { 
  LayoutGrid, 
  Calendar, 
  Inbox, 
  Layers, 
  Zap, 
  Settings, 
  HelpCircle,
  Terminal
} from 'lucide-react';
import { TabType } from '@/src/types/ordo';

interface SidebarNavigationProps {
  activeTab: TabType;
  onSelectTab: (tab: TabType) => void;
  inboxCount?: number;
}

export const SidebarNavigation: React.FC<SidebarNavigationProps> = ({
  activeTab,
  onSelectTab,
  inboxCount = 3,
}) => {
  const mainNavItems = [
    { id: 'dashboard' as TabType, label: 'Dashboard', icon: LayoutGrid },
    { id: 'calendar' as TabType, label: 'Calendar', icon: Calendar },
    { id: 'inbox' as TabType, label: 'Inbox', icon: Inbox, badge: inboxCount },
    { id: 'projects' as TabType, label: 'Projects', icon: Layers, brandPrefix: 'ALLO' },
    { id: 'automations' as TabType, label: 'Automations', icon: Zap },
  ];

  const bottomNavItems = [
    { id: 'settings' as TabType, label: 'Settings', icon: Settings },
    { id: 'support' as TabType, label: 'Support', icon: HelpCircle },
  ];

  return (
    <aside className="w-64 min-w-[16rem] bg-[#0b1326]/90 backdrop-blur-xl border-r border-slate-800/60 flex flex-col justify-between h-screen sticky top-0 z-40 select-none">
      {/* Brand Logo Header */}
      <div>
        <div className="p-5 flex items-center gap-3 border-b border-slate-800/40">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20 border border-cyan-400/30">
            <Terminal className="w-5 h-5 text-white animate-pulse" />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-tight text-white flex items-center gap-1.5">
              Nexus OS
            </h1>
            <p className="text-[11px] font-mono tracking-wide text-cyan-400/80 uppercase">
              Productivity Engine
            </p>
          </div>
        </div>

        {/* Main Navigation */}
        <nav className="p-3 space-y-1.5 mt-2">
          {mainNavItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all duration-200 group relative ${
                  isActive
                    ? 'bg-slate-800/80 text-cyan-400 shadow-md border border-slate-700/50 glow-effect'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                }`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <span className="absolute left-0 top-1.5 bottom-1.5 w-1 bg-cyan-400 rounded-r-full shadow-[0_0_12px_#38bdf8]" />
                )}

                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 transition-transform duration-200 group-hover:scale-110 ${
                      isActive ? 'text-cyan-400' : 'text-slate-400 group-hover:text-slate-300'
                    }`}
                  />
                  {item.brandPrefix ? (
                    <span className="flex items-center gap-1.5">
                      <span className="font-mono font-bold tracking-widest text-slate-300 text-xs px-1.5 py-0.5 rounded bg-slate-800/60 border border-slate-700/40">
                        {item.brandPrefix}
                      </span>
                      <span>{item.label}</span>
                    </span>
                  ) : (
                    <span>{item.label}</span>
                  )}
                </div>

                {item.badge !== undefined && item.badge > 0 && (
                  <span
                    className={`text-xs font-mono px-2 py-0.5 rounded-full ${
                      isActive
                        ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold'
                        : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Navigation & Workspace Info */}
      <div className="p-3 border-t border-slate-800/40 space-y-1">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectTab(item.id)}
              className={`w-full flex items-center gap-3 px-3.5 py-2 rounded-xl text-sm transition-all duration-200 ${
                isActive
                  ? 'bg-slate-800/80 text-cyan-400'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{item.label}</span>
            </button>
          );
        })}

        <div className="mt-4 pt-3 border-t border-slate-800/40 px-3 py-2 flex items-center justify-between text-xs font-mono text-slate-500">
          <span>ORDO v1.4.2</span>
          <span className="flex items-center gap-1.5 text-cyan-400/80">
            <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-ping" />
            Online
          </span>
        </div>
      </div>
    </aside>
  );
};
