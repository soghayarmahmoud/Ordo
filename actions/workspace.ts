'use server';

import { prisma } from '@/src/lib/prisma';
import { revalidatePath } from 'next/cache';

/**
 * Ensures that the user has an initialized Workspace and initial database items.
 * If their PostgreSQL tables are completely empty, seeds realistic default items
 * directly into their database so the platform operates 100% on actual DB data.
 */
export async function ensureUserWorkspace(userId: string) {
  try {
    // 1. Check if user already belongs to a workspace
    let membership = await prisma.workspaceMember.findFirst({
      where: { userId },
      include: { workspace: true },
    });

    if (!membership) {
      // Create default workspace for user
      const slug = `ordo-${userId.substring(0, 8)}-${Date.now().toString(36)}`;
      const workspace = await prisma.workspace.create({
        data: {
          name: 'Ordo Productivity Studio',
          slug,
          members: {
            create: {
              userId,
              role: 'OWNER',
            },
          },
        },
      });
      membership = await prisma.workspaceMember.findFirst({
        where: { userId, workspaceId: workspace.id },
        include: { workspace: true },
      });
    }

    const workspaceId = membership!.workspaceId;

    // 2. Check if user has EmailItem records in database
    const emailCount = await prisma.emailItem.count({ where: { userId } });
    if (emailCount === 0) {
      await prisma.emailItem.createMany({
        data: [
          {
            userId,
            sender: 'Sarah Jenkins (VP Prod)',
            senderEmail: 's.jenkins@ordo.io',
            subject: 'Q3 Roadmap Alignment & Key KRAs',
            body: 'Hey Soghayar, please review the newly attached Q3 roadmap targets before tomorrow afternoon. We need to lock in the 3 core engineering deliverables and align with the design lead on the UI component library refactor.',
            summaryText: 'Action Required: Review Q3 engineering deliverables and prepare timeline.',
            summaryVariant: 'action',
            isScheduled: false,
          },
          {
            userId,
            sender: 'Engineering System Alerts',
            senderEmail: 'bot@ordo.io',
            subject: '[Alert] Production Latency Optimization on US-East-1',
            body: 'Automated telemetry detected a transient spike in database query latency around 14:00 UTC. Cache hit rates dropped to 89%. Please allocate an engineering time-block to review connection pool sizing and Prisma read replicas.',
            summaryText: 'Summarized: DB query latency spike detected; inspect connection pool.',
            summaryVariant: 'summarized',
            isScheduled: false,
          },
          {
            userId,
            sender: 'Alex Chen (Lead Architect)',
            senderEmail: 'a.chen@ordo.io',
            subject: 'Design System & Tailwind v4 Migration Notes',
            body: 'The glassmorphic tokens and CSS variables for #0b1326 background have been published to the internal npm registry. Let me know if you need help syncing the sprint board components.',
            summaryText: 'Summarized: New glassmorphic tokens published to internal registry.',
            summaryVariant: 'summarized',
            isScheduled: false,
          },
          {
            userId,
            sender: 'Google Workspace Sync',
            senderEmail: 'calendar-notification@google.com',
            subject: 'Daily Executive Standup & Architecture Sync',
            body: 'Calendar invite confirmed: Executive Standup and Architecture Sync scheduled for Wednesday at 09:00 AM GMT+03. Click to join Google Meet.',
            summaryText: 'Summarized: Calendar sync active. Meeting confirmed for Wed 9am.',
            summaryVariant: 'summarized',
            isScheduled: true,
          },
        ],
      });
    }

    // 3. Check if user has TimeBlock records in database
    const blockCount = await prisma.timeBlock.count({ where: { userId } });
    if (blockCount === 0) {
      // Find the scheduled email item if exists to link
      const scheduledEmail = await prisma.emailItem.findFirst({
        where: { userId, isScheduled: true },
      });

      await prisma.timeBlock.createMany({
        data: [
          {
            userId,
            title: '09:00 Daily Executive Standup',
            timeSlot: '09:00 AM - 10:00 AM',
            day: 'Wed',
            hour: 9,
            durationHours: 1,
            variant: 'highlight',
            emailId: scheduledEmail?.id || null,
          },
          {
            userId,
            title: '11:00 Design System Architecture Sync',
            timeSlot: '11:00 AM - 12:30 PM',
            day: 'Wed',
            hour: 11,
            durationHours: 1,
            variant: 'accent',
          },
          {
            userId,
            title: '14:00 Deep Focus: Core Auth & Prisma Engine',
            timeSlot: '2:00 PM - 4:00 PM',
            day: 'Wed',
            hour: 14,
            durationHours: 2,
            variant: 'default',
          },
        ],
      });
    }

    // 4. Check if workspace has KanbanTask records in database
    const taskCount = await prisma.kanbanTask.count({ where: { workspaceId } });
    if (taskCount === 0) {
      await prisma.kanbanTask.createMany({
        data: [
          {
            workspaceId,
            code: 'ORD-401',
            title: 'Implement NextAuth v5 Google Workspace OAuth & Calendar Sync',
            priority: 'HIGH PRIORITY',
            columnId: 'todo',
          },
          {
            workspaceId,
            code: 'ORD-402',
            title: 'Replace Mock State with Dynamic Prisma Server Components',
            priority: 'HIGH PRIORITY',
            columnId: 'in-progress',
          },
          {
            workspaceId,
            code: 'ORD-403',
            title: 'Design Glassmorphic Console Layout & Sidebar Navigation',
            priority: 'MEDIUM',
            columnId: 'done',
          },
          {
            workspaceId,
            code: 'ORD-404',
            title: 'Build Drag and Drop Kanban Board and Calendar Time-slots',
            priority: 'HIGH PRIORITY',
            columnId: 'done',
          },
        ],
      });
    }

    // 5. Check if workspace has WebhookEndpoint records in database
    const webhookCount = await prisma.webhookEndpoint.count({ where: { workspaceId } });
    if (webhookCount === 0) {
      await prisma.webhookEndpoint.createMany({
        data: [
          {
            workspaceId,
            name: 'Telegram Action Bot',
            url: `https://api.ordo.io/v1/webhooks/tg_${workspaceId.substring(0, 6)}`,
            active: true,
            totalThroughput: 142,
          },
          {
            workspaceId,
            name: 'WhatsApp Executive Alerts',
            url: `https://api.ordo.io/v1/webhooks/wa_${workspaceId.substring(0, 6)}`,
            active: true,
            totalThroughput: 89,
          },
        ],
      });
    }

    return { success: true, workspaceId };
  } catch (error: any) {
    console.error('[ensureUserWorkspace Error]:', error);
    return { success: false, error: error.message };
  }
}

/**
 * TimeBlock Mutations
 */
export async function createTimeBlockAction(data: {
  userId: string;
  title: string;
  timeSlot: string;
  day: string;
  hour: number;
  durationHours?: number;
  variant?: string;
  emailId?: string;
}) {
  try {
    const block = await prisma.timeBlock.upsert({
      where: {
        userId_day_hour: {
          userId: data.userId,
          day: data.day,
          hour: data.hour,
        },
      },
      update: {
        title: data.title,
        timeSlot: data.timeSlot,
        durationHours: data.durationHours || 1,
        variant: data.variant || 'default',
        emailId: data.emailId || null,
      },
      create: {
        userId: data.userId,
        title: data.title,
        timeSlot: data.timeSlot,
        day: data.day,
        hour: data.hour,
        durationHours: data.durationHours || 1,
        variant: data.variant || 'default',
        emailId: data.emailId || null,
      },
    });

    if (data.emailId) {
      await prisma.emailItem.update({
        where: { id: data.emailId },
        data: { isScheduled: true },
      });
    }

    revalidatePath('/');
    return { success: true, block };
  } catch (error: any) {
    console.error('[createTimeBlockAction Error]:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteTimeBlockAction(blockId: string) {
  try {
    await prisma.timeBlock.delete({ where: { id: blockId } });
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('[deleteTimeBlockAction Error]:', error);
    return { success: false, error: error.message };
  }
}

/**
 * KanbanTask Mutations
 */
export async function createKanbanTaskAction(data: {
  workspaceId: string;
  title: string;
  priority: string;
  columnId: string;
}) {
  try {
    const randomNum = Math.floor(400 + Math.random() * 599);
    const code = `ORD-${randomNum}`;
    const task = await prisma.kanbanTask.create({
      data: {
        workspaceId: data.workspaceId,
        title: data.title,
        priority: data.priority,
        columnId: data.columnId,
        code,
      },
    });
    revalidatePath('/');
    return { success: true, task };
  } catch (error: any) {
    console.error('[createKanbanTaskAction Error]:', error);
    return { success: false, error: error.message };
  }
}

export async function updateKanbanTaskColumnAction(taskId: string, columnId: string) {
  try {
    const task = await prisma.kanbanTask.update({
      where: { id: taskId },
      data: { columnId },
    });
    revalidatePath('/');
    return { success: true, task };
  } catch (error: any) {
    console.error('[updateKanbanTaskColumnAction Error]:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteKanbanTaskAction(taskId: string) {
  try {
    await prisma.kanbanTask.delete({ where: { id: taskId } });
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('[deleteKanbanTaskAction Error]:', error);
    return { success: false, error: error.message };
  }
}

/**
 * EmailItem / Smart Inbox Mutations
 */
export async function createEmailItemAction(data: {
  userId: string;
  sender: string;
  subject: string;
  body: string;
  summaryText?: string;
  summaryVariant?: string;
}) {
  try {
    const email = await prisma.emailItem.create({
      data: {
        userId: data.userId,
        sender: data.sender,
        subject: data.subject,
        body: data.body,
        summaryText: data.summaryText || null,
        summaryVariant: data.summaryVariant || null,
        isScheduled: false,
      },
    });
    revalidatePath('/');
    return { success: true, email };
  } catch (error: any) {
    console.error('[createEmailItemAction Error]:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteEmailItemAction(emailId: string) {
  try {
    await prisma.emailItem.delete({ where: { id: emailId } });
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('[deleteEmailItemAction Error]:', error);
    return { success: false, error: error.message };
  }
}

/**
 * WebhookEndpoint Mutations
 */
export async function createWebhookAction(data: {
  workspaceId: string;
  name: string;
  url: string;
}) {
  try {
    const webhook = await prisma.webhookEndpoint.create({
      data: {
        workspaceId: data.workspaceId,
        name: data.name,
        url: data.url,
        active: true,
      },
    });
    revalidatePath('/');
    return { success: true, webhook };
  } catch (error: any) {
    console.error('[createWebhookAction Error]:', error);
    return { success: false, error: error.message };
  }
}

export async function toggleWebhookAction(webhookId: string, active: boolean) {
  try {
    const webhook = await prisma.webhookEndpoint.update({
      where: { id: webhookId },
      data: { active },
    });
    revalidatePath('/');
    return { success: true, webhook };
  } catch (error: any) {
    console.error('[toggleWebhookAction Error]:', error);
    return { success: false, error: error.message };
  }
}

export async function deleteWebhookAction(webhookId: string) {
  try {
    await prisma.webhookEndpoint.delete({ where: { id: webhookId } });
    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('[deleteWebhookAction Error]:', error);
    return { success: false, error: error.message };
  }
}

/**
 * Workspace Settings & Member Mutations
 */
export async function updateWorkspaceSettingsAction(data: {
  userId: string;
  name: string;
  url?: string;
  timezone?: string;
}) {
  try {
    const membership = await prisma.workspaceMember.findFirst({
      where: { userId: data.userId },
      include: { workspace: true },
    });

    if (membership) {
      await prisma.workspace.update({
        where: { id: membership.workspaceId },
        data: {
          name: data.name,
          slug: data.url ? data.url.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase() : undefined,
        },
      });
    }

    revalidatePath('/');
    return { success: true };
  } catch (error: any) {
    console.error('[updateWorkspaceSettingsAction Error]:', error);
    return { success: false, error: error.message };
  }
}

export async function inviteWorkspaceMemberAction(data: {
  userId?: string;
  workspaceId?: string;
  email: string;
  role: string;
}) {
  try {
    let workspaceId = data.workspaceId;
    if (!workspaceId && data.userId) {
      const membership = await prisma.workspaceMember.findFirst({
        where: { userId: data.userId },
      });
      workspaceId = membership?.workspaceId;
    }

    if (!workspaceId) {
      const firstWorkspace = await prisma.workspace.findFirst();
      workspaceId = firstWorkspace?.id;
    }

    if (!workspaceId) {
      return { success: false, error: 'No workspace found to invite member into.' };
    }

    // Check if user already exists
    let user = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (!user) {
      const namePart = data.email.split('@')[0].replace(/\./g, ' ');
      const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
      user = await prisma.user.create({
        data: {
          email: data.email,
          name: formattedName,
          role: data.role.toUpperCase() === 'OWNER' || data.role.toUpperCase() === 'ADMIN' ? 'ADMIN' : 'MEMBER',
        },
      });
    }

    // Check if membership already exists
    const existingMember = await prisma.workspaceMember.findUnique({
      where: {
        workspaceId_userId: {
          workspaceId,
          userId: user.id,
        },
      },
    });

    if (!existingMember) {
      await prisma.workspaceMember.create({
        data: {
          workspaceId,
          userId: user.id,
          role: data.role.toUpperCase() === 'ADMIN' ? 'ADMIN' : data.role.toUpperCase() === 'LEAD ENGINEER' ? 'LEAD_ENGINEER' : 'MEMBER',
        },
      });
    }

    revalidatePath('/');
    const avatar = (user.name || data.email).substring(0, 2).toUpperCase();
    return {
      success: true,
      member: {
        id: user.id,
        name: user.name || data.email,
        email: data.email,
        role: data.role,
        avatar,
      },
    };
  } catch (error: any) {
    console.error('[inviteWorkspaceMemberAction Error]:', error);
    return { success: false, error: error.message };
  }
}

