'use client';

import React, { useState } from 'react';
import { 
  User, 
  Mail, 
  MapPin, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  Laptop, 
  Smartphone, 
  Terminal, 
  CheckCircle2, 
  Award, 
  Zap, 
  Activity, 
  Edit3,
  Check
} from 'lucide-react';
import { useSession } from 'next-auth/react';

interface ProfileViewProps {
  initialTasksCount?: number;
  initialTimeBlocksCount?: number;
  initialEmailsCount?: number;
  initialWebhooksCount?: number;
}

export const ProfileView: React.FC<ProfileViewProps> = ({
  initialTasksCount = 42,
  initialTimeBlocksCount = 32,
  initialEmailsCount = 14,
  initialWebhooksCount = 14,
}) => {
  const { data: session } = useSession();
  const [isEditing, setIsEditing] = useState(false);
  const [bio, setBio] = useState(
    'Passionate architect of high-performance agentic workflows, distributed time-blocking pipelines, and modern glassmorphic interfaces.'
  );
  const [status, setStatus] = useState<'focus' | 'deep' | 'meeting' | 'offline'>('focus');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleSaveBio = () => {
    setIsEditing(false);
    showToast('✨ Profile bio updated and synced across Ordo nodes!');
  };

  const statusMap = {
    focus: { label: 'Focus Mode Active • DND', color: 'bg-emerald-400 text-emerald-300 border-emerald-500/30' },
    deep: { label: 'Deep Work • Code Refactor', color: 'bg-cyan-400 text-cyan-300 border-cyan-500/30' },
    meeting: { label: 'In Client Alignment Sync', color: 'bg-amber-400 text-amber-300 border-amber-500/30' },
    offline: { label: 'Offline / Away', color: 'bg-slate-400 text-slate-400 border-slate-700' },
  };

  const getFormattedWeekRange = () => {
    const now = new Date();
    const startOfWeek = new Date(now);
    const day = now.getDay() || 7;
    if (day !== 1) startOfWeek.setHours(-24 * (day - 1));
    const endOfWeek = new Date(startOfWeek);
    endOfWeek.setDate(startOfWeek.getDate() + 6);

    const options: Intl.DateTimeFormatOptions = { month: 'short', day: 'numeric' };
    const startStr = startOfWeek.toLocaleDateString('en-US', options);
    const endStr = endOfWeek.toLocaleDateString('en-US', { day: 'numeric' });
    return `${startStr} - ${endStr}`;
  };

  const displayName = session?.user?.name || 'Sarah Jenkins';
  const displayEmail = session?.user?.email || 's.jenkins@ordo.io';
  const displayImage = session?.user?.image;
  const initials = displayName
    .split(' ')
    .filter(Boolean)
    .map((p) => p[0])
    .slice(0, 2)
    .join('')
    .toUpperCase() || 'SJ';

  const tasksCompletedValue = initialTasksCount || 0;
  const timeCarvedValue = `${initialTimeBlocksCount || 0}h`;
  const inboxStreakValue = initialEmailsCount === 0 ? 1 : 0; // simplistic streak
  const apiEventsValue = `${initialWebhooksCount || 0}`;

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase mb-1">
            <User className="w-3.5 h-3.5" />
            <span>PERSONAL PROFILE & IDENTITY</span>
          </div>
          <h1 className="font-bold text-3xl text-white tracking-tight">
            {displayName}
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            System Architect & Lead Developer @ Ordo Productivity Engine
          </p>
        </div>

        {/* Status Dropdown / Selector */}
        <div className="flex items-center gap-2 self-start sm:self-auto">
          <span className="text-xs font-mono text-slate-400">Current Status:</span>
          <select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value as any);
              showToast(`Changed profile status to ${statusMap[e.target.value as keyof typeof statusMap].label}`);
            }}
            className="bg-slate-900/90 border border-slate-700 rounded-xl px-3 py-1.5 text-xs font-mono text-white focus:outline-none focus:border-cyan-500"
          >
            <option value="focus">🟢 Focus Mode</option>
            <option value="deep">🔵 Deep Work</option>
            <option value="meeting">🟡 In Meeting</option>
            <option value="offline">⚪ Offline</option>
          </select>
        </div>
      </div>

      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 glass-card bg-[#0f172a]/95 border-2 border-cyan-400 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in duration-200">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span className="text-xs font-mono font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Main Profile Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Identity & Bio */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-slate-700/50 shadow-2xl relative overflow-hidden">
            <div className="flex flex-col items-center text-center pb-6 border-b border-slate-800">
              <div className="w-24 h-24 rounded-3xl bg-gradient-to-tr from-cyan-400 via-blue-500 to-indigo-600 p-1 shadow-2xl mb-4 relative overflow-hidden">
                {displayImage ? (
                  <img
                    src={displayImage}
                    alt={displayName}
                    className="w-full h-full rounded-2xl object-cover bg-[#0b1326]"
                  />
                ) : (
                  <div className="w-full h-full rounded-2xl bg-[#0b1326] flex items-center justify-center text-3xl font-extrabold text-white font-mono">
                    {initials}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-emerald-500 border-2 border-[#0b1326] flex items-center justify-center text-[10px] text-white font-bold" title="Online">
                  ✓
                </span>
              </div>

              <h2 className="font-bold text-xl text-white">{displayName}</h2>
              <span className="text-xs font-mono text-cyan-400 uppercase mt-0.5">System Architect</span>

              <div className="flex items-center gap-2 mt-3 text-xs font-mono text-slate-400">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>San Francisco, CA / Remote</span>
              </div>
            </div>

            {/* Bio Section */}
            <div className="pt-5 space-y-3">
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider">
                  ABOUT & BIO
                </span>
                <button
                  onClick={() => (isEditing ? handleSaveBio() : setIsEditing(true))}
                  className="text-xs font-mono text-cyan-400 hover:text-cyan-300 flex items-center gap-1 bg-slate-800/80 px-2.5 py-1 rounded-lg border border-slate-700"
                >
                  {isEditing ? <Check className="w-3 h-3 text-emerald-400" /> : <Edit3 className="w-3 h-3" />}
                  <span>{isEditing ? 'Save Bio' : 'Edit Bio'}</span>
                </button>
              </div>

              {isEditing ? (
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  className="w-full bg-slate-900/90 border border-cyan-500 rounded-xl p-3 text-xs text-white focus:outline-none h-24 font-sans"
                  autoFocus
                />
              ) : (
                <p className="text-xs text-slate-300 leading-relaxed font-sans">
                  {bio}
                </p>
              )}

              <div className="pt-3 space-y-2 font-mono text-xs text-slate-400 border-t border-slate-800/80">
                <div className="flex items-center justify-between py-1">
                  <span className="flex items-center gap-2"><Mail className="w-3.5 h-3.5 text-slate-500" /> Primary Email</span>
                  <span className="text-slate-200">{displayEmail}</span>
                </div>
                <div className="flex items-center justify-between py-1">
                  <span className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-slate-500" /> Timezone</span>
                  <span className="text-cyan-300">GMT+03:00</span>
                </div>
              </div>
            </div>
          </div>

          {/* Connected Devices Card */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-700/50 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Active Sessions & Devices</span>
              </h3>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30">
                Secure 2FA
              </span>
            </div>

            <div className="space-y-3.5">
              {[
                { name: 'MacBook Pro M3 Max', loc: 'San Francisco, CA', time: 'Active now • Current Session', icon: Laptop, badge: 'Current' },
                { name: 'iPhone 16 Pro Max', loc: 'San Francisco, CA', time: 'Last active 2h ago • iOS App', icon: Smartphone, badge: 'Mobile' },
                { name: 'Ordo CLI Terminal', loc: 'AWS us-east-1 Node', time: 'Active background process', icon: Terminal, badge: 'Daemon' },
              ].map((dev, i) => {
                const Icon = dev.icon;
                return (
                  <div key={i} className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-xl bg-slate-800 text-cyan-400 flex items-center justify-center border border-slate-700 shrink-0">
                        <Icon className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="font-bold text-xs text-white flex items-center gap-1.5">
                          {dev.name}
                          <span className="text-[9px] font-mono bg-slate-800 text-slate-400 px-1.5 py-0.2 rounded border border-slate-700">
                            {dev.badge}
                          </span>
                        </h4>
                        <p className="text-[11px] font-mono text-slate-400">{dev.time}</p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Right Column: Productivity Analytics & Achievements */}
        <div className="lg:col-span-7 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-slate-700/50 space-y-6">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-lg text-white flex items-center gap-2">
                <Activity className="w-5 h-5 text-cyan-400" />
                <span>Productivity Telemetry & Velocity Metrics</span>
              </h3>
              <span className="text-xs font-mono text-cyan-300 bg-cyan-950/80 px-2.5 py-1 rounded-xl border border-cyan-500/40">
                This Week ({getFormattedWeekRange()})
              </span>
            </div>

            {/* 4 Stats Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-[#0b1326]/80 border border-slate-800/80 hover:border-cyan-500/40 transition-colors">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  TASKS COMPLETED
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">{tasksCompletedValue}</span>
                  <span className="text-xs font-mono text-emerald-400">+15% velocity</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-cyan-400 to-blue-500 h-full w-[85%]" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0b1326]/80 border border-slate-800/80 hover:border-teal-500/40 transition-colors">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  TIME CARVED
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">{timeCarvedValue}</span>
                  <span className="text-xs font-mono text-teal-400">100% schedule</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-teal-400 to-emerald-500 h-full w-[95%]" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0b1326]/80 border border-slate-800/80 hover:border-purple-500/40 transition-colors">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  INBOX ZERO STREAK
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">{inboxStreakValue}</span>
                  <span className="text-xs font-mono text-purple-400">Consecutive days</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-purple-400 to-pink-500 h-full w-[100%]" />
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-[#0b1326]/80 border border-slate-800/80 hover:border-amber-500/40 transition-colors">
                <span className="text-xs font-mono text-slate-400 uppercase tracking-wider block mb-1">
                  API ROUTING EVENTS
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-bold text-white">{apiEventsValue}</span>
                  <span className="text-xs font-mono text-amber-400">0% error rate</span>
                </div>
                <div className="w-full bg-slate-800 h-1.5 rounded-full mt-3 overflow-hidden">
                  <div className="bg-gradient-to-r from-amber-400 to-orange-500 h-full w-[98%]" />
                </div>
              </div>
            </div>

            {/* Achievements & Badges exact to rich design aesthetic */}
            <div className="pt-4 border-t border-slate-800/80 space-y-3">
              <span className="font-mono text-xs font-bold text-slate-400 uppercase tracking-wider block">
                ORDO ARCHITECT ACHIEVEMENTS
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {[
                  { title: 'Time-block Grandmaster', desc: 'Carved over 500 hours of uninterrupted deep work.', icon: Award, color: 'text-amber-400 bg-amber-500/15 border-amber-500/30' },
                  { title: 'Zero Inbox Maestro', desc: 'Maintained zero unread items for 14 straight days.', icon: CheckCircle2, color: 'text-cyan-400 bg-cyan-500/15 border-cyan-500/30' },
                  { title: 'Automation Pioneer', desc: 'Configured 10+ multi-cloud webhook pipelines.', icon: Zap, color: 'text-purple-400 bg-purple-500/15 border-purple-500/30' },
                ].map((ach, i) => {
                  const Icon = ach.icon;
                  return (
                    <div key={i} className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between group hover:border-slate-700 transition-all">
                      <div className="flex items-center gap-2.5 mb-2">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center border shrink-0 ${ach.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>
                        <h4 className="font-bold text-xs text-white truncate">{ach.title}</h4>
                      </div>
                      <p className="text-[11px] text-slate-400 leading-relaxed">{ach.desc}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
