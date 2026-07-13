import { EmailItem, TimeBlock, KanbanTask, AutomationWebhook, EventLogItem, KanbanColumnData } from '@/src/types/ordo';

export const INITIAL_INBOX_ITEMS: EmailItem[] = [
  {
    id: 'email-1',
    sender: 'Sarah Jenkins',
    time: '10:42 AM',
    subject: 'Q3 Roadmap Review',
    summaryBadge: {
      text: '✨ Summarized: Needs scheduling',
      variant: 'summarized',
    },
    body: 'Can we carve out 1 hour this week to align on Q3 goals and roadmap prioritization?',
    isScheduled: false,
  },
  {
    id: 'email-2',
    sender: 'Engineering Team',
    time: 'Yesterday',
    subject: 'Sprint Planning Outcomes',
    summaryBadge: {
      text: '✨ Action: Review PR #442',
      variant: 'action',
    },
    body: 'Key decisions finalized during planning. Action required on pull request #442.',
    isScheduled: false,
  },
  {
    id: 'email-3',
    sender: 'Client Updates',
    time: 'Mon',
    subject: 'Acme Corp Feedback',
    body: 'The design looks solid, but we need to refine the color palette slightly. Can we schedule a brief sync?',
    isScheduled: false,
  },
];

export const INITIAL_TIME_BLOCKS: TimeBlock[] = [
  {
    id: 'block-1',
    title: '09:30 Daily ...',
    timeSlot: '09:30 - 10:30 AM',
    day: 'Tue',
    hour: 9,
    durationHours: 1,
    variant: 'default',
  },
  {
    id: 'block-2',
    title: '11:00 Desig...',
    timeSlot: '11:00 - 12:30 PM',
    day: 'Tue',
    hour: 11,
    durationHours: 1.5,
    variant: 'highlight',
  },
  {
    id: 'block-3',
    title: '12:00 Lunc...',
    timeSlot: '12:00 - 01:00 PM',
    day: 'Wed',
    hour: 12,
    durationHours: 1,
    variant: 'default',
  },
  {
    id: 'block-4',
    title: '01:00 Deep ...',
    timeSlot: '01:00 - 03:00 PM',
    day: 'Fri',
    hour: 13,
    durationHours: 2,
    variant: 'accent',
  },
];

export const INITIAL_KANBAN_COLUMNS: KanbanColumnData[] = [
  { id: 'todo', title: 'TO DO' },
  { id: 'in-progress', title: 'IN PROGRESS', colorIndicator: '#38bdf8' },
  { id: 'done', title: 'DONE', colorIndicator: '#22c55e' },
];

export const INITIAL_KANBAN_TASKS: KanbanTask[] = [
  {
    id: 'task-1',
    code: 'NEX-402',
    title: 'Optimize Database Query for User Feed Pipeline',
    priority: 'HIGH PRIORITY',
    subtasksCompleted: 1,
    subtasksTotal: 4,
    commentsCount: 2,
    attachmentsCount: 1,
    assignees: ['/avatars/01.png'],
    columnId: 'todo',
  },
  {
    id: 'task-2',
    code: 'NEX-405',
    title: 'Design System Token Audit',
    priority: 'MEDIUM',
    subtasksCompleted: 0,
    subtasksTotal: 8,
    commentsCount: 0,
    assignees: ['/avatars/02.png', '/avatars/03.png'],
    columnId: 'todo',
  },
  {
    id: 'task-3',
    code: 'NEX-399',
    title: 'Implement WebGL Shader Backgrounds',
    priority: 'HIGH PRIORITY',
    subtasksCompleted: 4,
    subtasksTotal: 5,
    commentsCount: 8,
    assignees: ['/avatars/04.png'],
    columnId: 'in-progress',
  },
  {
    id: 'task-4',
    code: 'NEX-386',
    title: 'Update Dependencies in package.json',
    priority: 'LOW',
    subtasksCompleted: 3,
    subtasksTotal: 3,
    commentsCount: 1,
    assignees: ['/avatars/05.png'],
    columnId: 'done',
  },
];

export const INITIAL_WEBHOOKS: AutomationWebhook[] = [
  {
    id: 'webhook-1',
    name: 'Telegram Bot API',
    version: 'v2.4',
    statusText: 'Routing active',
    stats: '124 msg/hr',
    statusVariant: 'active',
    endpointUrl: 'https://api.nexus-os.io/v1/webhooks/tg_8f92a1b',
    enabled: true,
    iconType: 'telegram',
  },
  {
    id: 'webhook-2',
    name: 'WhatsApp Business',
    cloudApiBadge: 'CLOUD API',
    statusText: 'Disconnected • Auth required',
    statusVariant: 'disconnected',
    enabled: false,
    iconType: 'whatsapp',
  },
];

export const INITIAL_EVENT_LOGS: EventLogItem[] = [
  {
    id: 'log-1',
    title: 'New lead from Telegram',
    subtitle: 'ID: lead_0912x • Pa...',
    timeAgo: 'Just now',
    iconVariant: 'success',
  },
  {
    id: 'log-2',
    title: 'Inbound Message: Supp...',
    subtitle: 'Tg_user_112: "Need h...',
    timeAgo: '2m ago',
    iconVariant: 'message',
  },
  {
    id: 'log-3',
    title: 'WhatsApp Sync Failed',
    subtitle: 'Error 401: Unauthor...',
    timeAgo: '15m ago',
    iconVariant: 'error',
  },
  {
    id: 'log-4',
    title: 'Daily Summary Generated',
    subtitle: 'Automated workflow t...',
    timeAgo: '1h ago',
    iconVariant: 'sync',
  },
];
