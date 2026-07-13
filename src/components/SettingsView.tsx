'use client';

import React, { useState } from 'react';
import { 
  Settings, 
  Sliders, 
  Key, 
  Users, 
  ShieldCheck, 
  Copy, 
  Check, 
  RefreshCw, 
  Sparkles, 
  Plus, 
  Trash2,
  Terminal,
  Palette,
  Bell
} from 'lucide-react';

export const SettingsView: React.FC = () => {
  const [activeSubTab, setActiveSubTab] = useState<'general' | 'appearance' | 'api' | 'team'>('general');
  const [workspaceName, setWorkspaceName] = useState('Ordo Productivity Studio');
  const [workspaceUrl, setWorkspaceUrl] = useState('ordo.workspace/sarah-jenkins');
  const [timezone, setTimezone] = useState('GMT+03:00 Eastern European / Riyadh Time');
  
  // Appearance
  const [themeVariant, setThemeVariant] = useState<'obsidian' | 'cyber' | 'amethyst'>('obsidian');
  const [glassIntensity, setGlassIntensity] = useState(85);
  const [animationsEnabled, setAnimationsEnabled] = useState(true);

  // API Key
  const [apiKey, setApiKey] = useState('ordo_live_9a8c7b6e5d4f3a2b1c0e9d8f');
  const [copiedKey, setCopiedKey] = useState(false);
  const [isRegenerating, setIsRegenerating] = useState(false);

  // Team
  const [teamMembers, setTeamMembers] = useState([
    { id: '1', name: 'Sarah Jenkins', email: 's.jenkins@ordo.io', role: 'Owner', avatar: 'SJ' },
    { id: '2', name: 'Marcus Klein', email: 'm.klein@ordo.io', role: 'Lead Engineer', avatar: 'MK' },
    { id: '3', name: 'Alex Chen', email: 'a.chen@ordo.io', role: 'UI/UX Designer', avatar: 'AC' },
  ]);
  const [isInviting, setIsInviting] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [inviteRole, setInviteRole] = useState('Member');

  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  const handleCopyKey = () => {
    navigator.clipboard?.writeText(apiKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleRegenerateKey = () => {
    setIsRegenerating(true);
    setTimeout(() => {
      const newKey = `ordo_live_${Math.random().toString(36).substring(2, 14)}${Math.random().toString(36).substring(2, 14)}`;
      setApiKey(newKey);
      setIsRegenerating(false);
      showToast('🔑 Ordo Live API Key regenerated and synced with cloud routers!');
    }, 600);
  };

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inviteEmail) return;
    const namePart = inviteEmail.split('@')[0].replace(/\./g, ' ');
    const formattedName = namePart.charAt(0).toUpperCase() + namePart.slice(1);
    const newMember = {
      id: `member-${Date.now()}`,
      name: formattedName,
      email: inviteEmail,
      role: inviteRole,
      avatar: formattedName.substring(0, 2).toUpperCase(),
    };
    setTeamMembers((prev) => [...prev, newMember]);
    setInviteEmail('');
    setIsInviting(false);
    showToast(`👥 Invited ${inviteEmail} to Ordo Workspace!`);
  };

  const handleRemoveMember = (id: string, name: string) => {
    setTeamMembers((prev) => prev.filter((m) => m.id !== id));
    showToast(`Removed ${name} from workspace access.`);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      {/* Settings Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase mb-1">
            <Settings className="w-3.5 h-3.5" />
            <span>WORKSPACE CONFIGURATION</span>
          </div>
          <h1 className="font-bold text-3xl text-white tracking-tight">
            Ordo Settings & Preferences
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Customize system behavior, visual glassmorphism, API credentials, and collaboration access.
          </p>
        </div>

        <button
          onClick={() => showToast('✨ Workspace configuration saved and broadcasted to all Ordo nodes!')}
          className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-[#0b1326] font-bold text-xs px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-cyan-500/20 active:scale-95 self-start sm:self-auto"
        >
          <Sparkles className="w-4 h-4" />
          <span>Save Changes</span>
        </button>
      </div>

      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 glass-card bg-[#0f172a]/95 border-2 border-cyan-400 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in duration-200">
          <Sparkles className="w-5 h-5 text-cyan-400" />
          <span className="text-xs font-mono font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Sub navigation tabs */}
      <div className="flex items-center gap-1 bg-[#0f172a]/80 p-1.5 rounded-2xl border border-slate-800 overflow-x-auto">
        {[
          { id: 'general', label: 'General & Workspace', icon: Sliders },
          { id: 'appearance', label: 'Appearance & Glass UI', icon: Palette },
          { id: 'api', label: 'API & Developer Keys', icon: Key },
          { id: 'team', label: 'Team Collaboration', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                activeSubTab === tab.id
                  ? 'bg-slate-700/90 text-cyan-300 font-bold shadow border border-slate-600/60'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Tab 1: General */}
      {activeSubTab === 'general' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in duration-200">
          <div className="glass-panel rounded-3xl p-6 border border-slate-700/50 space-y-5">
            <h3 className="font-bold text-lg text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Terminal className="w-4 h-4 text-cyan-400" />
              <span>Workspace Identity</span>
            </h3>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">Workspace Name</label>
              <input
                type="text"
                value={workspaceName}
                onChange={(e) => setWorkspaceName(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-sans"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">Custom Ordo URL</label>
              <div className="flex rounded-xl overflow-hidden border border-slate-700 bg-slate-900/90">
                <span className="bg-slate-800 px-3 py-2.5 text-xs font-mono text-slate-500 flex items-center">
                  https://
                </span>
                <input
                  type="text"
                  value={workspaceUrl}
                  onChange={(e) => setWorkspaceUrl(e.target.value)}
                  className="w-full bg-transparent px-3 py-2.5 text-sm text-cyan-300 font-mono focus:outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-slate-400 mb-1.5">Primary Timezone</label>
              <select
                value={timezone}
                onChange={(e) => setTimezone(e.target.value)}
                className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
              >
                <option value="GMT+03:00 Eastern European / Riyadh Time">GMT+03:00 Eastern European / Riyadh Time</option>
                <option value="GMT+00:00 London / UTC Standard">GMT+00:00 London / UTC Standard</option>
                <option value="GMT-08:00 Pacific Standard Time (San Francisco)">GMT-08:00 Pacific Standard Time (San Francisco)</option>
                <option value="GMT-05:00 Eastern Standard Time (New York)">GMT-05:00 Eastern Standard Time (New York)</option>
              </select>
            </div>
          </div>

          <div className="glass-panel rounded-3xl p-6 border border-slate-700/50 space-y-5">
            <h3 className="font-bold text-lg text-white border-b border-slate-800 pb-3 flex items-center gap-2">
              <Bell className="w-4 h-4 text-cyan-400" />
              <span>Smart Notification Rules</span>
            </h3>

            <div className="space-y-4">
              {[
                { title: 'AI Action Summary Alerts', desc: 'Receive instant push when AI detects high-priority client requests.' },
                { title: 'Time-block Collision Warning', desc: 'Warn when dragging tasks over existing schedule slots.' },
                { title: 'Automations Webhook Failure Sync', desc: 'Alert immediately if cloud API routing disconnects.' },
                { title: 'Daily Morning Executive Brief', desc: 'Automated 8:00 AM summary of pending sprint tickets and meetings.' },
              ].map((rule, idx) => (
                <div key={idx} className="flex items-start justify-between gap-4 p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80">
                  <div>
                    <h4 className="font-bold text-xs sm:text-sm text-slate-200">{rule.title}</h4>
                    <p className="text-xs text-slate-400 mt-0.5">{rule.desc}</p>
                  </div>
                  <input type="checkbox" defaultChecked className="w-4 h-4 rounded border-slate-700 text-cyan-500 focus:ring-0 bg-slate-800 cursor-pointer mt-1" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Appearance */}
      {activeSubTab === 'appearance' && (
        <div className="glass-panel rounded-3xl p-6 border border-slate-700/50 space-y-6 animate-in fade-in duration-200">
          <h3 className="font-bold text-lg text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Palette className="w-5 h-5 text-cyan-400" />
            <span>Visual Theme & Glassmorphism Tokens</span>
          </h3>

          <div className="space-y-3">
            <label className="block text-xs font-mono text-slate-400">Ordo Color Palette Variant</label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                { id: 'obsidian', name: 'Lumina Obsidian (Default)', desc: 'Deep navy #0b1326 with vibrant cyan #38bdf8 accents and glassmorphism.' },
                { id: 'cyber', name: 'Cyber Cyan Matrix', desc: 'High-contrast midnight #020617 with electric cyan #06b6d4 headers.' },
                { id: 'amethyst', name: 'Deep Amethyst Studio', desc: 'Slate dark #0f172a with neon violet #a855f7 and indigo borders.' },
              ].map((theme) => (
                <div
                  key={theme.id}
                  onClick={() => setThemeVariant(theme.id as any)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all ${
                    themeVariant === theme.id
                      ? 'bg-slate-800/90 border-cyan-400 ring-2 ring-cyan-500/20 shadow-xl'
                      : 'bg-slate-900/50 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-sm text-white">{theme.name}</span>
                    <div className="flex gap-1">
                      <span className="w-3 h-3 rounded-full bg-cyan-400" />
                      <span className="w-3 h-3 rounded-full bg-blue-500" />
                    </div>
                  </div>
                  <p className="text-xs text-slate-400 leading-relaxed">{theme.desc}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-800/80">
            <div>
              <div className="flex justify-between text-xs font-mono text-slate-300 mb-2">
                <span>Glassmorphism Backdrop Blur Intensity</span>
                <span className="text-cyan-400 font-bold">{glassIntensity}%</span>
              </div>
              <input
                type="range"
                min={20}
                max={100}
                value={glassIntensity}
                onChange={(e) => setGlassIntensity(Number(e.target.value))}
                className="w-full accent-cyan-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
              />
              <p className="text-[11px] font-mono text-slate-500 mt-1">
                Controls the backdrop-blur radius across top bars, sidebars, and cards.
              </p>
            </div>

            <div className="flex items-center justify-between p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
              <div>
                <h4 className="font-bold text-sm text-white">Dynamic Micro-Animations</h4>
                <p className="text-xs text-slate-400">Enable smooth pulse badges and glowing hover transitions.</p>
              </div>
              <input
                type="checkbox"
                checked={animationsEnabled}
                onChange={(e) => setAnimationsEnabled(e.target.checked)}
                className="w-5 h-5 rounded border-slate-700 text-cyan-500 focus:ring-0 bg-slate-800 cursor-pointer"
              />
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: API */}
      {activeSubTab === 'api' && (
        <div className="glass-panel rounded-3xl p-6 border border-slate-700/50 space-y-6 animate-in fade-in duration-200">
          <h3 className="font-bold text-lg text-white border-b border-slate-800 pb-3 flex items-center gap-2">
            <Key className="w-5 h-5 text-cyan-400" />
            <span>Developer API Keys & Webhook Access</span>
          </h3>

          <div className="p-5 rounded-2xl bg-[#0b1326]/90 border border-cyan-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider">
                ORDO LIVE REST API KEY (PRODUCTION)
              </span>
              <div className="flex items-center gap-2">
                <button
                  onClick={handleCopyKey}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 hover:bg-cyan-500/30 font-mono text-xs font-bold transition-colors"
                >
                  {copiedKey ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedKey ? 'Copied' : 'Copy Key'}</span>
                </button>
                <button
                  onClick={handleRegenerateKey}
                  disabled={isRegenerating}
                  className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-slate-800 text-slate-300 hover:text-white hover:bg-slate-700 font-mono text-xs transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isRegenerating ? 'animate-spin' : ''}`} />
                  <span>Regenerate</span>
                </button>
              </div>
            </div>

            <div className="font-mono text-sm text-slate-200 bg-slate-900/90 p-3 rounded-xl border border-slate-800 select-all tracking-wider">
              {apiKey}
            </div>
            <p className="text-xs font-mono text-slate-500">
              Pass this key in the Authorization header (`Bearer {apiKey}`) when triggering background scheduled tasks or webhooks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { name: 'Ordo SDK (Node.js/TS)', status: 'Connected', ver: 'v2.4.1' },
              { name: 'Ordo Python Client', status: 'Ready to Auth', ver: 'v1.9.0' },
              { name: 'GraphQL Gateway', status: 'Optimal', ver: 'v3.0.0-rc' },
            ].map((sdk, i) => (
              <div key={i} className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-[11px] text-cyan-400 font-bold block">{sdk.ver}</span>
                  <h4 className="font-bold text-sm text-white mt-1">{sdk.name}</h4>
                </div>
                <div className="mt-4 pt-2 border-t border-slate-800/80 flex items-center justify-between text-xs font-mono">
                  <span className="text-emerald-400 flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    {sdk.status}
                  </span>
                  <a href="#" className="text-slate-400 hover:text-cyan-300 underline">Docs →</a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Team */}
      {activeSubTab === 'team' && (
        <div className="glass-panel rounded-3xl p-6 border border-slate-700/50 space-y-6 animate-in fade-in duration-200">
          <div className="flex items-center justify-between pb-3 border-b border-slate-800">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              <span>Workspace Team Members ({teamMembers.length})</span>
            </h3>
            <button
              onClick={() => setIsInviting(!isInviting)}
              className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Invite Teammate</span>
            </button>
          </div>

          {isInviting && (
            <form onSubmit={handleInvite} className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/40 space-y-3 animate-in fade-in duration-200">
              <div className="flex justify-between items-center text-xs font-bold text-cyan-400">
                <span>Invite New Workspace Member</span>
                <button type="button" onClick={() => setIsInviting(false)} className="text-slate-400">✕</button>
              </div>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="email"
                  placeholder="Colleague email (e.g., d.ross@ordo.io)"
                  value={inviteEmail}
                  onChange={(e) => setInviteEmail(e.target.value)}
                  className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
                  required
                />
                <select
                  value={inviteRole}
                  onChange={(e) => setInviteRole(e.target.value)}
                  className="bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="Admin">Admin</option>
                  <option value="Lead Engineer">Lead Engineer</option>
                  <option value="Member">Member</option>
                  <option value="Viewer">Viewer</option>
                </select>
                <button type="submit" className="bg-cyan-500 hover:bg-cyan-400 text-[#0b1326] font-bold px-4 py-2 rounded-xl text-xs">
                  Send Invite
                </button>
              </div>
            </form>
          )}

          <div className="divide-y divide-slate-800/80">
            {teamMembers.map((member) => (
              <div key={member.id} className="py-4 flex items-center justify-between group">
                <div className="flex items-center gap-3.5">
                  <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-cyan-500 to-blue-600 p-[1.5px] shadow-md">
                    <div className="w-full h-full rounded-2xl bg-[#0b1326] flex items-center justify-center font-bold text-xs text-white font-mono">
                      {member.avatar}
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-sm text-white flex items-center gap-2">
                      {member.name}
                      <span className={`text-[10px] font-mono px-2 py-0.2 rounded border ${
                        member.role === 'Owner' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}>
                        {member.role}
                      </span>
                    </h4>
                    <p className="text-xs font-mono text-slate-400">{member.email}</p>
                  </div>
                </div>

                {member.role !== 'Owner' && (
                  <button
                    onClick={() => handleRemoveMember(member.id, member.name)}
                    className="opacity-0 group-hover:opacity-100 p-2 text-slate-400 hover:text-red-400 transition-all rounded-xl hover:bg-rose-500/10"
                    title="Remove access"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
