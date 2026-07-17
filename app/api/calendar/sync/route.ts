import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/src/lib/prisma';

function formatTime(date: Date): string {
  const h = date.getHours();
  const m = date.getMinutes();
  const period = h >= 12 ? 'PM' : 'AM';
  const hour12 = h % 12 || 12;
  const minStr = m < 10 ? `0${m}` : `${m}`;
  const hourStr = hour12 < 10 ? `0${hour12}` : `${hour12}`;
  return `${hourStr}:${minStr} ${period}`;
}

async function syncCalendar(req: Request) {
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
    const timeMin = new Date().toISOString();

    let listRes = await fetch(
      `https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=10&timeMin=${encodeURIComponent(timeMin)}&singleEvents=true&orderBy=startTime`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    // If token expired, attempt refresh
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
              `https://www.googleapis.com/calendar/v3/calendars/primary/events?maxResults=10&timeMin=${encodeURIComponent(timeMin)}&singleEvents=true&orderBy=startTime`,
              {
                headers: { Authorization: `Bearer ${accessToken}` },
              }
            );
          }
        }
      } catch (refreshErr) {
        console.error('[syncCalendar Token Refresh Error]:', refreshErr);
      }
    }

    if (!listRes.ok) {
      return NextResponse.json({
        success: false,
        message: `Failed to fetch events from Google Calendar: ${listRes.statusText}`,
      });
    }

    const listData = await listRes.json();
    const items = listData.items || [];
    const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    let count = 0;

    for (const event of items) {
      try {
        const summary = event.summary || 'Google Calendar Event';
        const startStr = event.start?.dateTime || event.start?.date;
        const endStr = event.end?.dateTime || event.end?.date;

        if (!startStr) continue;

        const startDate = new Date(startStr);
        const endDate = endStr ? new Date(endStr) : new Date(startDate.getTime() + 3600000);

        const day = daysOfWeek[startDate.getDay()];
        const hour = startDate.getHours();
        const durationHours = Math.max(
          1,
          Math.round((endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60))
        );

        const timeSlot = `${formatTime(startDate)} - ${formatTime(endDate)}`;

        await prisma.timeBlock.upsert({
          where: {
            userId_day_hour: {
              userId,
              day,
              hour,
            },
          },
          update: {
            title: summary,
            timeSlot,
            durationHours,
            variant: 'highlight',
          },
          create: {
            userId,
            title: summary,
            timeSlot,
            day,
            hour,
            durationHours,
            variant: 'highlight',
          },
        });

        count++;
      } catch (eventErr) {
        console.error('[syncCalendar Event Upsert Error]:', eventErr);
      }
    }

    return NextResponse.json({ success: true, count });
  } catch (error: any) {
    console.error('[syncCalendar Route Error]:', error);
    return NextResponse.json(
      { success: false, message: error?.message || 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(req: Request) {
  return syncCalendar(req);
}

export async function POST(req: Request) {
  return syncCalendar(req);
}
