'use client';

import React, { useState } from 'react';
import { TabType, EmailItem, TimeBlock } from '@/src/types/ordo';
import { SidebarNavigation } from '@/src/components/SidebarNavigation';
import { CommandTopBar } from '@/src/components/CommandTopBar';
import { SmartInboxCalendarView } from '@/src/components/SmartInboxCalendarView';
import { KanbanBoard } from '@/src/components/KanbanBoard';
import { AutomationsView } from '@/src/components/AutomationsView';
import { DashboardView } from '@/src/components/DashboardView';
import { InboxView } from '@/src/components/InboxView';
import { SettingsView } from '@/src/components/SettingsView';
import { ProfileView } from '@/src/components/ProfileView';
import { SupportView } from '@/src/components/SupportView';
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
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Shared reactive state so time blocks & emails sync across Dashboard, Inbox, and Calendar
  const [emails, setEmails] = useState<EmailItem[]>(INITIAL_INBOX_ITEMS);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>(INITIAL_TIME_BLOCKS);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            onSelectTab={(tab) => setActiveTab(tab)}
            initialEmails={emails}
            initialTimeBlocks={timeBlocks}
          />
        );
      case 'inbox':
        return (
          <InboxView
            initialEmails={emails}
            onQuickSchedule={(email) => {
              const newBlock: TimeBlock = {
                id: `block-${Date.now()}`,
                title: email.subject.substring(0, 18),
                timeSlot: '2:00 PM - 3:00 PM',
                day: 'Wed',
                hour: 14,
                durationHours: 1,
                variant: 'highlight',
                emailId: email.id,
              };
              setTimeBlocks((prev) => [newBlock, ...prev]);
              setActiveTab('calendar');
            }}
          />
        );
      case 'calendar':
        return (
          <SmartInboxCalendarView
            initialEmails={emails}
            initialTimeBlocks={timeBlocks}
          />
        );
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
      case 'settings':
        return <SettingsView />;
      case 'profile':
        return <ProfileView />;
      case 'support':
        return <SupportView />;
      default:
        return (
          <DashboardView
            onSelectTab={(tab) => setActiveTab(tab)}
            initialEmails={emails}
            initialTimeBlocks={timeBlocks}
          />
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-[#0b1326] text-slate-100 font-sans selection:bg-cyan-500/30">
      {/* Sidebar Navigation (with Mobile Slide-over Drawer support) */}
      <SidebarNavigation
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          setIsMobileMenuOpen(false);
        }}
        inboxCount={emails.filter((e) => !e.isScheduled).length}
        isOpen={isMobileMenuOpen}
        onClose={() => setIsMobileMenuOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        {/* Top Command Bar */}
        <CommandTopBar
          onNewTaskClick={() => setActiveTab('projects')}
          onMobileMenuClick={() => setIsMobileMenuOpen(true)}
          onProfileClick={() => setActiveTab('profile')}
          searchPlaceholder={
            activeTab === 'automations'
              ? 'Search automations, webhooks...'
              : activeTab === 'projects'
              ? 'Search sprint board (ORD-xxx)...'
              : activeTab === 'inbox'
              ? 'Search action items and summaries...'
              : 'Ordo Command (⌘K)'
          }
        />

        {/* Dynamic Workspace View Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderActiveView()}
        </main>
      </div>
    </div>
  );
}
