import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/src/lib/prisma';
import { analyzeEmailContentAction } from '@/actions/ai';

async function syncGmail(req: Request) {
  try {
    const session = await auth();
    if (!session || !session.user || !(session.user as any).id) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized: Session missing' },
        { status: 401 }
      );
    }

    const userId = (session.user as any).id as string;

    const account = await prisma.account.findFirst({
      where: {
        userId,
        provider: 'google',
      },
    });

    if (!account || !account.access_token) {
      return NextResponse.json({
        success: false,
        message: 'Google account not linked or token missing',
      });
    }

    let accessToken = account.access_token;

    // Call Gmail API list messages
    let listRes = await fetch(
      'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5&q=in:inbox',
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // If unauthorized and we have a refresh_token, attempt token refresh
    if (listRes.status === 401 && account.refresh_token && process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
      try {
        const refreshRes = await fetch('https://oauth2.googleapis.com/token', {
          method: 'POST',
          headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
          body: new URLSearchParams({
            client_id: process.env.GOOGLE_CLIENT_ID,
            client_secret: process.env.GOOGLE_CLIENT_SECRET,
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
            listRes = await fetch(
              'https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=5&q=in:inbox',
              {
                headers: { Authorization: `Bearer ${accessToken}` },
              }
            );
          }
        }
      } catch (refreshErr) {
        console.error('[syncGmail Token Refresh Error]:', refreshErr);
      }
    }

    if (!listRes.ok) {
      return NextResponse.json({
        success: false,
        message: `Failed to fetch messages from Gmail: ${listRes.statusText}`,
      });
    }

    const listData = await listRes.json();
    const messages = listData.messages || [];
    let count = 0;

    for (const msg of messages) {
      try {
        const detailRes = await fetch(
          `https://gmail.googleapis.com/gmail/v1/users/me/messages/${msg.id}?format=metadata&metadataHeaders=Subject&metadataHeaders=From`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
            },
          }
        );

        if (!detailRes.ok) continue;

        const detailData = await detailRes.json();
        const headers = detailData.payload?.headers || [];
        
        let subject = 'No Subject';
        let fromHeader = 'Unknown Sender';

        for (const h of headers) {
          if (h.name?.toLowerCase() === 'subject') subject = h.value || 'No Subject';
          if (h.name?.toLowerCase() === 'from') fromHeader = h.value || 'Unknown Sender';
        }

        const snippet = detailData.snippet || '';
        const body = snippet || subject;

        // Parse Sender & Email from header like "Sarah Jenkins <s.jenkins@ordo.io>"
        let sender = fromHeader;
        let senderEmail = fromHeader;
        const match = fromHeader.match(/^(.*?)\s*<([^>]+)>$/);
        if (match) {
          sender = match[1].replace(/^"|"$/g, '').trim() || match[2].trim();
          senderEmail = match[2].trim();
        }

        // Check if message is already synced
        const existing = await prisma.emailItem.findFirst({
          where: {
            userId,
            subject,
            sender,
          },
        });

        if (!existing) {
          const analyzed = await analyzeEmailContentAction(subject, body);

          await prisma.emailItem.create({
            data: {
              userId,
              sender,
              senderEmail,
              subject,
              body,
              summaryText: analyzed.summaryText,
              summaryVariant: analyzed.category,
              isScheduled: false,
            },
          });
          count++;
        }
      } catch (msgErr) {
        console.error('[syncGmail Message Detail Error]:', msgErr);
      }
    }

    return NextResponse.json({ success: true, count });
  } catch (error: any) {
    console.error('[syncGmail Route Error]:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  return syncGmail(req);
}

export async function POST(req: Request) {
  return syncGmail(req);
}
