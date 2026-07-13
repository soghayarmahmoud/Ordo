'use client';

import React, { useState } from 'react';
import { TabType } from '@/src/types/ordo';
import { SidebarNavigation } from '@/src/components/SidebarNavigation';
import { CommandTopBar } from '@/src/components/CommandTopBar';
import { SmartInboxCalendarView } from '@/src/components/SmartInboxCalendarView';
import { KanbanBoard } from '@/src/components/KanbanBoard';
import { AutomationsView } from '@/src/components/AutomationsView';
import {
  INITIAL_INBOX_ITEMS,
  INITIAL_TIME_BLOCKS,
  INITIAL_KANBAN_COLUMNS,
  INITIAL_KANBAN_TASKS,
  INITIAL_WEBHOOKS,
  INITIAL_EVENT_LOGS,
} from '@/src/data/mockData';

export default function OrdoWorkspacePage() {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');

  const renderActiveView = () => {
    switch (activeTab) {
      case 'projects':
        return (
          <KanbanBoard
            initialColumns={INITIAL_KANBAN_COLUMNS}
            initialTasks={INITIAL_KANBAN_TASKS}
          />
        );
      case 'automations':
        return (
          <AutomationsView
            initialWebhooks={INITIAL_WEBHOOKS}
            initialLogs={INITIAL_EVENT_LOGS}
          />
        );
      case 'dashboard':
      case 'calendar':
      case 'inbox':
      default:
        return (
          <SmartInboxCalendarView
            initialEmails={INITIAL_INBOX_ITEMS}
            initialTimeBlocks={INITIAL_TIME_BLOCKS}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0b1326] text-slate-100 font-sans selection:bg-cyan-500/30">
      {/* Sidebar Navigation */}
      <SidebarNavigation
        activeTab={activeTab}
        onSelectTab={(tab) => setActiveTab(tab)}
        inboxCount={INITIAL_INBOX_ITEMS.length}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Command Bar */}
        <CommandTopBar
          onNewTaskClick={() => setActiveTab('projects')}
          searchPlaceholder={
            activeTab === 'automations'
              ? 'Search automations, logs...'
              : activeTab === 'projects'
              ? 'Search tasks (⌘K)...'
              : 'Command (⌘K)'
          }
        />

        {/* Dynamic Workspace View Container */}
        <main className="flex-1 p-6 lg:p-8 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}
