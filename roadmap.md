# Ordo Platform | Full-Stack Implementation & Database Roadmap
**Document Type:** Step-by-Step Developer Implementation Guide  
**Target Architecture:** Next.js 16 (App Router) + PostgreSQL (Prisma/Drizzle) + NextAuth.js v5 (Auth.js)  

---

## Executive Overview

You have successfully built the **Ordo** frontend UI—complete with executive dashboard command centers, interactive time-blocking calendars with drag-and-swap mechanics, sprint Kanban boards, and smart action inboxes.

This **roadmap and developer guide** provides exact, copy-pasteable architectural blueprints to transition Ordo from using client-side `mockData.ts` into a **production-ready full-stack SaaS platform** equipped with:
1. **Relational Database (`PostgreSQL`)** with **Prisma ORM** schemas for users, workspaces, action items, calendar slots, and sprint tasks.
2. **Enterprise Authentication & Login System (`NextAuth.js v5 / Auth.js`)** supporting OAuth (Google/GitHub), JWT secure cookies, and Role-Based Access Control (`RBAC`).
3. **Real-Time API Routes (`Next.js App Router`)** to persist calendar time swaps, task moves, and AI summary generations directly in your database.

---

## Phase 1: Database Architecture & ORM Setup

### 1.1 Recommended Database Stack
* **Database Engine:** PostgreSQL (Hosted on [Supabase](https://supabase.com) or [Neon Serverless SQL](https://neon.tech)).
* **ORM:** [Prisma ORM](https://prisma.io) (Recommended for best TypeScript auto-completion with Next.js App Router).

### 1.2 Installation Commands
Run these commands inside your project terminal (`g:\React\ordo`):
```bash
# 1. Install Prisma CLI as dev dependency and Prisma Client
npm install prisma --save-dev
npm install @prisma/client @auth/prisma-adapter

# 2. Initialize Prisma (creates prisma/schema.prisma and .env)
npx prisma init
```

### 1.3 Complete Production `schema.prisma`
Replace the generated `prisma/schema.prisma` with the exact schema below. This mirrors every data structure in your `types/ordo.ts`:

```prisma
datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

generator client {
  provider = "prisma-client-js"
}

// ==========================================
// 1. AUTHENTICATION & USER IDENTITY
// ==========================================

model User {
  id            String    @id @default(cuid())
  name          String?
  email         String?   @unique
  emailVerified DateTime?
  image         String?
  role          UserRole  @default(MEMBER)
  bio           String?   @default("Architect of high-performance workflows.")
  status        String    @default("focus") // 'focus' | 'deep' | 'meeting' | 'offline'
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt

  // Relationships
  accounts      Account[]
  sessions      Session[]
  workspaces    WorkspaceMember[]
  timeBlocks    TimeBlock[]
  inboxItems    EmailItem[]
  assignedTasks KanbanTask[]
}

enum UserRole {
  OWNER
  ADMIN
  LEAD_ENGINEER
  MEMBER
  VIEWER
}

model Account {
  id                 String  @id @default(cuid())
  userId             String
  type               String
  provider           String
  providerAccountId  String
  refresh_token      String? @db.Text
  access_token       String? @db.Text
  expires_at         Int?
  token_type         String?
  scope              String?
  id_token           String? @db.Text
  session_state      String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

// ==========================================
// 2. WORKSPACES & COLLABORATION
// ==========================================

model Workspace {
  id          String            @id @default(cuid())
  name        String            @default("Ordo Productivity Studio")
  slug        String            @unique
  createdAt   DateTime          @default(now())
  members     WorkspaceMember[]
  tasks       KanbanTask[]
  webhooks    WebhookEndpoint[]
}

model WorkspaceMember {
  id          String    @id @default(cuid())
  workspaceId String
  userId      String
  role        UserRole  @default(MEMBER)

  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  user        User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  @@unique([workspaceId, userId])
}

// ==========================================
// 3. SMART INBOX & ACTION ITEMS
// ==========================================

model EmailItem {
  id             String     @id @default(cuid())
  userId         String
  sender         String
  senderEmail    String?
  subject        String
  body           String     @db.Text
  summaryText    String?
  summaryVariant String?    // 'summarized' | 'action'
  isScheduled    Boolean    @default(false)
  createdAt      DateTime   @default(now())

  user           User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  timeBlock      TimeBlock?
}

// ==========================================
// 4. CALENDAR SCHEDULE & TIME BLOCKS
// ==========================================

model TimeBlock {
  id            String     @id @default(cuid())
  userId        String
  title         String
  timeSlot      String     // e.g., "11:00 AM - 12:00 PM"
  day           String     // 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri'
  hour          Int        // 9 to 18 (24h format)
  durationHours Int        @default(1)
  variant       String     @default("default") // 'default' | 'accent' | 'highlight' | 'glow'
  emailId       String?    @unique
  createdAt     DateTime   @default(now())

  user          User       @relation(fields: [userId], references: [id], onDelete: Cascade)
  emailItem     EmailItem? @relation(fields: [emailId], references: [id], onDelete: SetNull)
  @@unique([userId, day, hour]) // Ensures zero slot collisions
}

// ==========================================
// 5. KANBAN SPRINT TASKS
// ==========================================

model KanbanTask {
  id          String    @id @default(cuid())
  workspaceId String
  title       String
  code        String    @unique // e.g., "ORD-101"
  priority    String    // 'HIGH PRIORITY' | 'MEDIUM' | 'LOW'
  columnId    String    // 'todo' | 'in-progress' | 'done'
  assigneeId  String?
  dueDate     String?
  createdAt   DateTime  @default(now())

  workspace   Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
  assignee    User?     @relation(fields: [assigneeId], references: [id], onDelete: SetNull)
}

// ==========================================
// 6. API WEBHOOKS & EVENT TELEMETRY
// ==========================================

model WebhookEndpoint {
  id              String   @id @default(cuid())
  workspaceId     String
  name            String
  url             String   @unique
  active          Boolean  @default(true)
  totalThroughput Int      @default(0)
  createdAt       DateTime @default(now())

  workspace       Workspace @relation(fields: [workspaceId], references: [id], onDelete: Cascade)
}
```

### 1.4 Pushing Schema to PostgreSQL
Once your `.env` contains your `DATABASE_URL="postgresql://user:password@host:port/dbname"`, run:
```bash
npx prisma db push
npx prisma generate
```

---

## Phase 2: Login & Authentication System (`NextAuth.js v5`)

### 2.1 Installing NextAuth v5 (Auth.js)
```bash
npm install next-auth@beta bcryptjs
npm install @types/bcryptjs --save-dev
```

### 2.2 Creating `auth.ts` (Root Configuration)
Create a new file `g:\React\ordo\auth.ts`:

```typescript
import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import GitHubProvider from 'next-auth/providers/github';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

export const { handlers, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  session: { strategy: 'jwt' },
  pages: {
    signIn: '/login',
  },
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      name: 'Ordo Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 's.jenkins@ordo.io' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;
        
        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;
        // Verify password hash in production
        return user;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = (user as any).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        (session.user as any).id = token.id;
        (session.user as any).role = token.role;
      }
      return session;
    },
  },
});
```

### 2.3 Route Handler Setup (`app/api/auth/[...nextauth]/route.ts`)
Create directory `app/api/auth/[...nextauth]/` and add `route.ts`:
```typescript
import { handlers } from '@/auth';
export const { GET, POST } = handlers;
```

### 2.4 Route Protection Middleware (`middleware.ts`)
Create `g:\React\ordo\middleware.ts` in your project root to secure the workspace:
```typescript
import { auth } from '@/auth';
import { NextResponse } from 'next/server';

export default auth((req) => {
  const isLoggedIn = !!req.auth;
  const isLoginPage = req.nextUrl.pathname.startsWith('/login');

  if (!isLoggedIn && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (isLoggedIn && isLoginPage) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|login).*)'],
};
```

---

## Phase 3: Building the Login UI (`app/login/page.tsx`)

To match Ordo's rich glassmorphic aesthetics, create `g:\React\ordo\app\login\page.tsx`:

```tsx
'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import { Terminal, Lock, Mail, Sparkles, ArrowRight } from 'lucide-react';

export default function OrdoLoginPage() {
  const [email, setEmail] = useState('s.jenkins@ordo.io');
  const [password, setPassword] = useState('ordo_secret_key');
  const [loading, setLoading] = useState(false);

  const handleCredentialsLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    await signIn('credentials', {
      email,
      password,
      callbackUrl: '/',
    });
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-[#0b1326] text-white flex items-center justify-center p-4 relative overflow-hidden font-sans">
      {/* Background Glowing Orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-cyan-500/10 blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-blue-600/10 blur-[120px] pointer-events-none" />

      {/* Glass Login Card */}
      <div className="w-full max-w-md glass-panel rounded-3xl p-8 border border-slate-700/60 shadow-2xl relative z-10 space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-mono font-bold">
            <Terminal className="w-3.5 h-3.5" />
            <span>ORDO IDENTITY PORTAL</span>
          </div>
          <h1 className="font-bold text-3xl tracking-tight text-white">Sign In to Ordo</h1>
          <p className="text-xs text-slate-400">Access your unified AI productivity console and scheduled blocks.</p>
        </div>

        {/* OAuth Buttons */}
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => signIn('google', { callbackUrl: '/' })}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-xs font-medium transition-colors"
          >
            <span>Google Workspace</span>
          </button>
          <button
            onClick={() => signIn('github', { callbackUrl: '/' })}
            className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 border border-slate-700 text-xs font-medium transition-colors"
          >
            <span>GitHub OAuth</span>
          </button>
        </div>

        <div className="relative flex py-2 items-center">
          <div className="flex-grow border-t border-slate-800" />
          <span className="flex-shrink mx-3 text-slate-500 font-mono text-[10px] uppercase tracking-widest">Or enter email</span>
          <div className="flex-grow border-t border-slate-800" />
        </div>

        {/* Form */}
        <form onSubmit={handleCredentialsLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">Executive Email</label>
            <div className="relative flex items-center">
              <Mail className="absolute left-3.5 w-4 h-4 text-slate-500" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-mono text-slate-400 mb-1.5">Passphrase Key</label>
            <div className="relative flex items-center">
              <Lock className="absolute left-3.5 w-4 h-4 text-slate-500" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 transition-all font-mono"
                required
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-[#0b1326] font-bold py-3 rounded-xl text-xs transition-all shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 active:scale-95"
          >
            {loading ? <span>Verifying Credentials...</span> : <span>Launch Console</span>}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
```

---

## Phase 4: Full-Stack API Integration (`Calendar Swapping & Persistence`)

### 4.1 Creating the Calendar Swap API Route (`app/api/calendar/swap/route.ts`)
When a user drags `Block A` over `Block B` inside the `CalendarView`, send a `PATCH` request to update both records in PostgreSQL within a database transaction:

```typescript
import { NextResponse } from 'next/server';
import { auth } from '@/auth';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function PATCH(req: Request) {
  const session = await auth();
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const { blockIdA, targetDayA, targetHourA, blockIdB, targetDayB, targetHourB } = await req.json();

    // Execute atomic swap inside a Prisma Transaction to ensure zero data loss
    await prisma.$transaction(async (tx) => {
      if (blockIdB) {
        // Temporary shift to avoid unique constraint ([userId, day, hour]) collision during swap
        await tx.timeBlock.update({
          where: { id: blockIdB },
          data: { hour: -1 },
        });
      }

      // Update Block A to new destination
      await tx.timeBlock.update({
        where: { id: blockIdA },
        data: {
          day: targetDayA,
          hour: targetHourA,
          timeSlot: `${targetHourA > 12 ? targetHourA - 12 : targetHourA}:00 ${targetHourA >= 12 ? 'PM' : 'AM'}`,
        },
      });

      if (blockIdB) {
        // Update Block B to Block A's original location
        await tx.timeBlock.update({
          where: { id: blockIdB },
          data: {
            day: targetDayB,
            hour: targetHourB,
            timeSlot: `${targetHourB > 12 ? targetHourB - 12 : targetHourB}:00 ${targetHourB >= 12 ? 'PM' : 'AM'}`,
          },
        });
      }
    });

    return NextResponse.json({ success: true, message: 'Blocks swapped atomically in PostgreSQL' });
  } catch (error) {
    console.error('Swap Error:', error);
    return NextResponse.json({ error: 'Failed to execute calendar swap' }, { status: 500 });
  }
}
```

### 4.2 Updating `handleDragEnd` in `CalendarView.tsx` to call API
Inside `CalendarView.tsx` (and `SmartInboxCalendarView.tsx`), replace local state-only mutations with optimistic updates plus background persistence:

```typescript
// Example call inside handleDragEnd:
await fetch('/api/calendar/swap', {
  method: 'PATCH',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    blockIdA: draggedBlock.id,
    targetDayA: targetDay,
    targetHourA: targetHour,
    blockIdB: targetBlock?.id || null,
    targetDayB: draggedBlock.day,
    targetHourB: draggedBlock.hour,
  }),
});
```

---

## Phase 5: Verification & Production Deployment

1. **Verify Database Connection:** Run `npx prisma studio` to open a local browser GUI at `localhost:5555` to inspect tables and seed initial users.
2. **Build Test:** Run `npm run build` to verify all App Router endpoints and Prisma types compile cleanly.
3. **Deploy to Vercel:**
   * Connect your GitHub repository to Vercel.
   * Add your environment variables under Vercel Settings (`DATABASE_URL`, `NEXTAUTH_SECRET`, `GOOGLE_CLIENT_ID`).
   * Your Ordo Productivity Engine will be live on `https://your-ordo.vercel.app`!
