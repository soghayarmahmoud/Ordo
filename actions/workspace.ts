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
    // 2. Mock EmailItems generation removed. True 0-count will be reflected.

    // 3. Check if user has TimeBlock records in database
    // 3. Mock TimeBlocks generation removed. True 0-count will be reflected.

    // 4. Check if workspace has KanbanTask records in database
    // 4. Mock KanbanTasks generation removed. True 0-count will be reflected.

    // 5. Check if workspace has WebhookEndpoint records in database
    // 5. Mock Webhooks generation removed. True 0-count will be reflected.

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

    // Sync to Google Calendar
    try {
      const account = await prisma.account.findFirst({
        where: { userId: data.userId, provider: 'google' }
      });
      if (account?.access_token) {
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        const targetDay = days.indexOf(data.day);
        const now = new Date();
        const currentDay = now.getDay();
        let daysToAdd = targetDay - currentDay;
        if (daysToAdd < 0) daysToAdd += 7;
        
        const startDate = new Date();
        startDate.setDate(startDate.getDate() + daysToAdd);
        startDate.setHours(data.hour, 0, 0, 0);
        const endDate = new Date(startDate);
        endDate.setHours(data.hour + (data.durationHours || 1));

        let accessToken = account.access_token;

        let res = await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            summary: data.title,
            start: { dateTime: startDate.toISOString() },
            end: { dateTime: endDate.toISOString() }
          })
        });

        // Basic token refresh logic if expired
        if (res.status === 401 && account.refresh_token && process.env.GOOGLE_CLIENT_ID) {
          const refreshRes = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
              client_id: process.env.GOOGLE_CLIENT_ID,
              client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
              refresh_token: account.refresh_token,
              grant_type: 'refresh_token',
            }),
          });
          if (refreshRes.ok) {
            const refreshData = await refreshRes.json();
            if (refreshData.access_token) {
              accessToken = refreshData.access_token;
              await prisma.account.update({
                where: { id: account.id },
                data: { access_token: accessToken },
              });
              await fetch('https://www.googleapis.com/calendar/v3/calendars/primary/events', {
                method: 'POST',
                headers: {
                  Authorization: `Bearer ${accessToken}`,
                  'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                  summary: data.title,
                  start: { dateTime: startDate.toISOString() },
                  end: { dateTime: endDate.toISOString() }
                })
              });
            }
          }
        }
      }
    } catch (e) {
      console.error('[Google Calendar Sync Error]:', e);
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

