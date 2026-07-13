export type TabType = 'dashboard' | 'calendar' | 'inbox' | 'projects' | 'automations' | 'settings' | 'support' | 'profile';

export interface EmailItem {
  id: string;
  sender: string;
  time: string;
  subject: string;
  summaryBadge?: {
    text: string;
    variant: 'summarized' | 'action';
  };
  body?: string;
  isScheduled?: boolean;
}

export interface TimeBlock {
  id: string;
  title: string;
  timeSlot: string; // e.g., "09:30 Daily ...", "11:00 Desig..."
  day: 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
  hour: number; // e.g., 9, 10, 11, 12, 13, 14, 15
  durationHours: number;
  variant: 'default' | 'accent' | 'highlight' | 'glow';
  emailId?: string;
}

export type KanbanPriority = 'HIGH PRIORITY' | 'MEDIUM' | 'LOW';

export interface KanbanTask {
  id: string;
  code: string; // e.g., "NEX-402"
  title: string;
  priority: KanbanPriority;
  subtasksCompleted: number;
  subtasksTotal: number;
  commentsCount: number;
  attachmentsCount?: number;
  assignees: string[]; // Avatar URLs or initials
  columnId: 'todo' | 'in-progress' | 'done';
}

export interface KanbanColumnData {
  id: 'todo' | 'in-progress' | 'done';
  title: string;
  colorIndicator?: string;
}

export interface AutomationWebhook {
  id: string;
  name: string;
  version?: string;
  cloudApiBadge?: string;
  statusText: string;
  statusVariant: 'active' | 'disconnected';
  stats?: string;
  endpointUrl?: string;
  enabled: boolean;
  iconType: 'telegram' | 'whatsapp';
}

export interface EventLogItem {
  id: string;
  title: string;
  subtitle: string;
  timeAgo: string;
  iconVariant: 'success' | 'message' | 'error' | 'sync';
}
