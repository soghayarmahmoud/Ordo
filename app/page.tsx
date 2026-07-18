import React from 'react';
import { auth } from '@/auth';
import { prisma } from '@/src/lib/prisma';
import { ensureUserWorkspace } from '@/actions/workspace';
import { OrdoWorkspaceClient } from '@/app/workspace-client';

export default async function OrdoWorkspacePage() {
  // 1. Retrieve the authenticated user's session securely on the server
  const session = await auth();

  let initialDbTimeBlocks: any[] = [];
  let initialDbTasks: any[] = [];
  let initialDbEmails: any[] = [];
  let initialDbWebhooks: any[] = [];

  let workspaceId = '';

  // 2. If user is authenticated, ensure their workspace/seed data exist in DB and query real data
  if (session?.user?.id) {
    try {
      // Ensure user has their Workspace and default data rows if their database was empty
      const ensureRes = await ensureUserWorkspace(session.user.id);
      if (ensureRes.success && ensureRes.workspaceId) {
        workspaceId = ensureRes.workspaceId;
      }

      // Query all live database tables from PostgreSQL via Prisma
      [initialDbTimeBlocks, initialDbTasks, initialDbEmails, initialDbWebhooks] =
        await Promise.all([
          // Fetch TimeBlock records associated with the user
          prisma.timeBlock.findMany({
            where: { userId: session.user.id },
            orderBy: { hour: 'asc' },
          }),
          // Fetch KanbanTask records associated with the user's workspace
          prisma.kanbanTask.findMany({
            where: {
              workspace: {
                members: {
                  some: { userId: session.user.id },
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          }),
          // Fetch EmailItem / action items from database
          prisma.emailItem.findMany({
            where: { userId: session.user.id },
            orderBy: { createdAt: 'desc' },
          }),
          // Fetch WebhookEndpoint records
          prisma.webhookEndpoint.findMany({
            where: {
              workspace: {
                members: {
                  some: { userId: session.user.id },
                },
              },
            },
            orderBy: { createdAt: 'desc' },
          }),
        ]);
    } catch (error) {
      console.error('[Prisma Live Data Fetch Error - Dashboard]:', error);
    }
  }

  // 3. Pass retrieved session and real database data down to interactive Client Component
  return (
    <OrdoWorkspaceClient
      session={session}
      initialDbTimeBlocks={initialDbTimeBlocks}
      initialDbTasks={initialDbTasks}
      initialDbEmails={initialDbEmails}
      initialDbWebhooks={initialDbWebhooks}
      workspaceId={workspaceId}
    />
  );
}
