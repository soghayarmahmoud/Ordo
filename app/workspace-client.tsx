import React, { useState, useEffect, useCallback } from 'react';
import { TabType, EmailItem, TimeBlock, KanbanTask, AutomationWebhook } from '@/src/types/ordo';
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
import { INITIAL_KANBAN_COLUMNS, INITIAL_EVENT_LOGS } from '@/src/data/mockData';
import { Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { createTimeBlockAction } from '@/actions/workspace';

interface WorkspaceClientProps {
  session: Session | null;
  initialDbTimeBlocks: any[];
  initialDbTasks: any[];
  initialDbEmails: any[];
  initialDbWebhooks: any[];
  workspaceId: string;
}

export function OrdoWorkspaceClient({
  session,
  initialDbTimeBlocks,
  initialDbTasks,
  initialDbEmails,
  initialDbWebhooks,
  workspaceId,
}: WorkspaceClientProps) {
  const [activeTab, setActiveTab] = useState<TabType>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);

  const isUserAuthenticated = Boolean(session?.user?.id);
  const userId = session?.user?.id || 'anonymous';

  // Format TimeBlocks: use actual database data if authenticated
  const formattedTimeBlocks: TimeBlock[] =
    isUserAuthenticated && initialDbTimeBlocks && initialDbTimeBlocks.length > 0
      ? initialDbTimeBlocks.map((b) => ({
          id: b.id,
          title: b.title,
          timeSlot: b.timeSlot,
          day: (b.day as any) || 'Wed',
          hour: b.hour,
          durationHours: b.durationHours || 1,
          variant: (b.variant as any) || 'default',
          emailId: b.emailId || undefined,
        }))
      : [];

  // Format KanbanTasks: use actual database data
  const formattedKanbanTasks: KanbanTask[] =
    isUserAuthenticated && initialDbTasks && initialDbTasks.length > 0
      ? initialDbTasks.map((t) => ({
          id: t.id,
          code: t.code,
          title: t.title,
          priority: (t.priority as any) || 'HIGH PRIORITY',
          subtasksCompleted: 1,
          subtasksTotal: 4,
          commentsCount: 2,
          assignees: [session?.user?.image || '/avatars/01.png', '/avatars/02.png'],
          columnId: (t.columnId as any) || 'todo',
          dueDate: t.dueDate ? new Date(t.dueDate).toLocaleDateString() : undefined,
        }))
      : [];

  // Format Emails/Smart Inbox Items
  const formattedEmails: EmailItem[] =
    isUserAuthenticated && initialDbEmails && initialDbEmails.length > 0
      ? initialDbEmails.map((e) => ({
          id: e.id,
          sender: e.sender,
          time: new Date(e.createdAt || Date.now()).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          subject: e.subject,
          body: e.body || undefined,
          summaryBadge: e.summaryText
            ? { text: e.summaryText, variant: (e.summaryVariant as any) || 'summarized' }
            : undefined,
          isScheduled: e.isScheduled || false,
        }))
      : [];

  // Format Webhooks
  const formattedWebhooks: AutomationWebhook[] =
    isUserAuthenticated && initialDbWebhooks && initialDbWebhooks.length > 0
      ? initialDbWebhooks.map((w) => ({
          id: w.id,
          name: w.name,
          version: 'v1.0',
          statusText: w.active ? 'Routing active' : 'Paused',
          stats: `${w.totalThroughput || 0} msg/hr`,
          statusVariant: w.active ? 'active' : 'disconnected',
          endpointUrl: w.url,
          enabled: w.active,
          iconType: w.name.toLowerCase().includes('what') ? 'whatsapp' : 'telegram',
        }))
      : [];

  // Reactive state synced across Dashboard, Inbox, and Calendar views
  const [emails, setEmails] = useState<EmailItem[]>(formattedEmails);
  const [timeBlocks, setTimeBlocks] = useState<TimeBlock[]>(formattedTimeBlocks);

  // Auto-sync effect
  const syncWorkspaceData = useCallback(async () => {
    if (!isUserAuthenticated) return;
    setIsSyncing(true);
    try {
      await Promise.all([
        fetch('/api/gmail/sync', { method: 'POST' }),
        fetch('/api/calendar/sync', { method: 'POST' })
      ]);
      // Note: A full page refresh or re-fetch could happen here, 
      // but for now the APIs return the data count and next page load will have it.
      // Or we can manually trigger a router.refresh() 
    } catch (error) {
      console.error('Failed to auto-sync:', error);
    } finally {
      setIsSyncing(false);
    }
  }, [isUserAuthenticated]);

  useEffect(() => {
    // Fire sync only once on mount if authenticated
    syncWorkspaceData();
  }, [syncWorkspaceData]);

  const renderActiveView = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardView
            onSelectTab={(tab) => setActiveTab(tab)}
            initialEmails={emails}
            initialTimeBlocks={timeBlocks}
            userId={userId}
            session={session}
            initialTasksCount={formattedKanbanTasks.length}
            initialWebhooksCount={formattedWebhooks.length}
          />
        );
      case 'inbox':
        return (
          <InboxView
            initialEmails={emails}
            userId={userId}
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
              setEmails((prev) => prev.map((e) => (e.id === email.id ? { ...e, isScheduled: true } : e)));
              if (isUserAuthenticated && userId !== 'anonymous') {
                createTimeBlockAction({
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
              setActiveTab('calendar');
            }}
          />
        );
      case 'calendar':
        return (
          <SmartInboxCalendarView
            initialEmails={emails}
            initialTimeBlocks={timeBlocks}
            userId={userId}
          />
        );
      case 'projects':
        return (
          <KanbanBoard
            initialColumns={INITIAL_KANBAN_COLUMNS}
            initialTasks={formattedKanbanTasks}
            workspaceId={workspaceId}
          />
        );
      case 'automations':
        return (
          <AutomationsView
            initialWebhooks={formattedWebhooks}
            initialLogs={INITIAL_EVENT_LOGS}
            workspaceId={workspaceId}
          />
        );
      case 'settings':
        return <SettingsView />;
      case 'profile':
        return (
          <ProfileView
            initialTasksCount={formattedKanbanTasks.length}
            initialTimeBlocksCount={timeBlocks.length}
            initialEmailsCount={emails.length}
            initialWebhooksCount={formattedWebhooks.length}
          />
        );
      case 'support':
        return <SupportView />;
      default:
        return (
          <DashboardView
            onSelectTab={(tab) => setActiveTab(tab)}
            initialEmails={emails}
            initialTimeBlocks={timeBlocks}
            userId={userId}
            session={session}
            initialTasksCount={formattedKanbanTasks.length}
            initialWebhooksCount={formattedWebhooks.length}
          />
        );
    }
  };

  return (
    <SessionProvider session={session}>
      <div className="flex min-h-screen bg-[#0b1326] text-slate-100 font-sans selection:bg-cyan-500/30">
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

        <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
          <CommandTopBar
            userName={session?.user?.name || undefined}
            userImage={session?.user?.image || undefined}
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
                : `Ordo Command (⌘K) — ${session?.user?.name || 'Workspace'}`
            }
          />

          <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
            {renderActiveView()}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}
