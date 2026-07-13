'use client';

import React, { useState } from 'react';
import { 
  Send, 
  MessageCircle, 
  Copy, 
  Check, 
  Filter, 
  Plus, 
  RefreshCw, 
  AlertCircle, 
  CheckCircle2, 
  UserPlus, 
  Cpu, 
  Activity,
  Trash2
} from 'lucide-react';
import { AutomationWebhook, EventLogItem } from '@/src/types/ordo';

interface AutomationsViewProps {
  initialWebhooks: AutomationWebhook[];
  initialLogs: EventLogItem[];
}

export const AutomationsView: React.FC<AutomationsViewProps> = ({
  initialWebhooks,
  initialLogs,
}) => {
  const [webhooks, setWebhooks] = useState<AutomationWebhook[]>(initialWebhooks);
  const [eventLogs, setEventLogs] = useState<EventLogItem[]>(initialLogs);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [newWebhookName, setNewWebhookName] = useState('');

  /* Toggle Webhook state */
  const handleToggleWebhook = (id: string) => {
    setWebhooks((prev) =>
      prev.map((wh) => {
        if (wh.id === id) {
          const nextState = !wh.enabled;
          const updated: AutomationWebhook = {
            ...wh,
            enabled: nextState,
            statusText: nextState ? 'Routing active' : 'Disconnected • User disabled',
            statusVariant: nextState ? 'active' : 'disconnected',
            stats: nextState ? '12 msg/hr' : undefined,
          };

          // Add a log entry dynamically
          const newLog: EventLogItem = {
            id: `log-${Date.now()}`,
            title: nextState ? `${wh.name} Routing Enabled` : `${wh.name} Routing Paused`,
            subtitle: `User toggled webhook state via Lumina Console`,
            timeAgo: 'Just now',
            iconVariant: nextState ? 'success' : 'error',
          };
          setEventLogs((logs) => [newLog, ...logs]);

          return updated;
        }
        return wh;
      })
    );
  };

  /* Copy Endpoint URL */
  const handleCopy = (url: string, id: string) => {
    navigator.clipboard?.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  /* Re-authenticate simulation */
  const handleReauthenticate = (id: string) => {
    setWebhooks((prev) =>
      prev.map((wh) => {
        if (wh.id === id) {
          const updated: AutomationWebhook = {
            ...wh,
            enabled: true,
            statusText: 'Connected • Routing active',
            statusVariant: 'active',
            stats: '45 msg/hr',
            endpointUrl: 'https://api.nexus-os.io/v1/webhooks/wa_9104c8f',
          };

          const newLog: EventLogItem = {
            id: `log-${Date.now()}`,
            title: `${wh.name} Re-authenticated`,
            subtitle: `OAuth Cloud API handshake successful`,
            timeAgo: 'Just now',
            iconVariant: 'sync',
          };
          setEventLogs((logs) => [newLog, ...logs]);

          return updated;
        }
        return wh;
      })
    );
  };

  /* Add Webhook */
  const handleCreateWebhook = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWebhookName.trim()) return;

    const newWh: AutomationWebhook = {
      id: `webhook-${Date.now()}`,
      name: newWebhookName,
      version: 'v1.0',
      statusText: 'Routing active',
      stats: '0 msg/hr',
      statusVariant: 'active',
      endpointUrl: `https://api.nexus-os.io/v1/webhooks/${newWebhookName.toLowerCase().replace(/\s+/g, '_')}_${Math.random().toString(36).substring(7)}`,
      enabled: true,
      iconType: newWebhookName.toLowerCase().includes('what') ? 'whatsapp' : 'telegram',
    };

    setWebhooks((prev) => [newWh, ...prev]);
    setNewWebhookName('');
    setIsAdding(false);

    const newLog: EventLogItem = {
      id: `log-${Date.now()}`,
      title: `Webhook Registered: ${newWh.name}`,
      subtitle: `Endpoint generated • System active`,
      timeAgo: 'Just now',
      iconVariant: 'success',
    };
    setEventLogs((logs) => [newLog, ...logs]);
  };

  /* Delete Webhook */
  const handleDeleteWebhook = (id: string) => {
    setWebhooks((prev) => prev.filter((wh) => wh.id !== id));
  };

  /* Render Icon for Event Logs */
  const renderLogIcon = (variant: EventLogItem['iconVariant']) => {
    switch (variant) {
      case 'success':
        return (
          <div className="w-8 h-8 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center shrink-0 shadow-sm">
            <UserPlus className="w-4 h-4" />
          </div>
        );
      case 'message':
        return (
          <div className="w-8 h-8 rounded-full bg-cyan-500/15 text-cyan-400 border border-cyan-500/30 flex items-center justify-center shrink-0 shadow-sm">
            <MessageCircle className="w-4 h-4" />
          </div>
        );
      case 'error':
        return (
          <div className="w-8 h-8 rounded-full bg-rose-500/15 text-rose-400 border border-rose-500/30 flex items-center justify-center shrink-0 shadow-sm">
            <AlertCircle className="w-4 h-4" />
          </div>
        );
      case 'sync':
      default:
        return (
          <div className="w-8 h-8 rounded-full bg-purple-500/15 text-purple-400 border border-purple-500/30 flex items-center justify-center shrink-0 shadow-sm">
            <RefreshCw className="w-4 h-4" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Title Section exact to os_automations.png */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase mb-1">
            <Cpu className="w-3.5 h-3.5" />
            <span>INTEGRATION CENTER</span>
          </div>
          <h1 className="font-bold text-3xl text-white tracking-tight">
            Active Webhooks
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Manage external routing and real-time event listeners.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 text-cyan-400 border border-slate-700/60 text-xs font-medium transition-all"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Webhook</span>
          </button>

          {/* Status Optimal Badge exact to design */}
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-medium shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>System Optimal</span>
          </div>
        </div>
      </div>

      {/* Add Webhook Form */}
      {isAdding && (
        <form onSubmit={handleCreateWebhook} className="p-5 glass-panel rounded-2xl border border-cyan-500/40 space-y-3 animate-in fade-in duration-200">
          <div className="flex justify-between items-center text-xs font-bold text-cyan-400">
            <span>Register New Webhook Endpoint</span>
            <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          <div className="flex gap-3">
            <input
              type="text"
              placeholder="Integration Name (e.g., Slack Alerts Bot or Custom API)"
              value={newWebhookName}
              onChange={(e) => setNewWebhookName(e.target.value)}
              className="flex-1 bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-sans"
            />
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-400 text-[#0b1326] font-bold px-5 py-2 rounded-xl text-xs font-mono transition-all"
            >
              Generate Hook
            </button>
          </div>
        </form>
      )}

      {/* Main Grid: Webhooks List + Event Logs */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Panel: Webhooks List */}
        <div className="lg:col-span-7 space-y-4">
          {webhooks.map((wh) => (
            <div
              key={wh.id}
              className={`glass-card rounded-3xl p-6 border transition-all duration-200 group relative ${
                wh.enabled
                  ? 'border-slate-700/60 hover:border-cyan-500/40 shadow-xl'
                  : 'border-slate-800/80 bg-[#0f172a]/40 opacity-90'
              }`}
            >
              {/* Card Header exact to os_automations.png */}
              <div className="flex items-start justify-between mb-5">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg border ${
                      wh.iconType === 'telegram'
                        ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30 shadow-cyan-500/10'
                        : 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30 shadow-emerald-500/10'
                    }`}
                  >
                    {wh.iconType === 'telegram' ? (
                      <Send className="w-6 h-6 -rotate-12" />
                    ) : (
                      <MessageCircle className="w-6 h-6" />
                    )}
                  </div>

                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg text-white tracking-tight">{wh.name}</h3>
                      {wh.version && (
                        <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 font-mono text-[11px] text-slate-400 font-medium">
                          {wh.version}
                        </span>
                      )}
                      {wh.cloudApiBadge && (
                        <span className="px-2 py-0.5 rounded bg-slate-800/80 border border-slate-700 font-mono text-[11px] text-slate-400 font-medium">
                          {wh.cloudApiBadge}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 mt-1 font-mono text-xs">
                      <span
                        className={`w-2 h-2 rounded-full ${
                          wh.enabled ? 'bg-emerald-400 shadow-[0_0_8px_#34d399]' : 'bg-slate-500'
                        }`}
                      />
                      <span className={wh.enabled ? 'text-emerald-400' : 'text-slate-400'}>
                        {wh.statusText}
                      </span>
                      {wh.stats && (
                        <>
                          <span className="text-slate-600">•</span>
                          <span className="text-slate-400">{wh.stats}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Toggle & Status Icon */}
                <div className="flex items-center gap-3">
                  <button
                    onClick={() => handleDeleteWebhook(wh.id)}
                    className="opacity-0 group-hover:opacity-100 p-1.5 text-slate-500 hover:text-red-400 transition-opacity"
                    title="Delete Webhook"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleWebhook(wh.id)}
                      className={`w-12 h-6 flex items-center rounded-full p-1 transition-all duration-300 cursor-pointer ${
                        wh.enabled
                          ? 'bg-gradient-to-r from-indigo-500 to-cyan-400 justify-end shadow-md shadow-cyan-500/20'
                          : 'bg-slate-800 border border-slate-700 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 rounded-full bg-white shadow-sm transition-transform" />
                    </button>

                    {wh.enabled && (
                      <div className="w-6 h-6 rounded-full bg-blue-500 text-white flex items-center justify-center text-xs shadow-sm">
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Endpoint URL or Re-authenticate Button */}
              {wh.endpointUrl ? (
                <div className="bg-[#0b1326]/80 rounded-2xl p-4 border border-slate-800/80">
                  <div className="flex items-center justify-between font-mono text-[10px] tracking-wider text-slate-400 uppercase mb-2">
                    <span>ENDPOINT URL</span>
                    <button
                      onClick={() => handleCopy(wh.endpointUrl!, wh.id)}
                      className="flex items-center gap-1.5 text-cyan-400 hover:text-cyan-300 font-bold transition-colors cursor-pointer py-0.5 px-2 rounded hover:bg-slate-800/60"
                    >
                      {copiedId === wh.id ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <div className="font-mono text-xs text-slate-300 truncate select-all">
                    {wh.endpointUrl}
                  </div>
                </div>
              ) : (
                <div className="pt-2">
                  <button
                    onClick={() => handleReauthenticate(wh.id)}
                    className="px-4 py-2 rounded-xl bg-slate-800/90 hover:bg-slate-700/90 text-slate-200 border border-slate-700 font-mono text-xs font-medium transition-all hover:border-cyan-500/40 hover:shadow-lg"
                  >
                    Re-authenticate
                  </button>
                </div>
              )}
            </div>
          ))}

          {webhooks.length === 0 && (
            <div className="h-48 glass-panel rounded-3xl flex flex-col items-center justify-center text-slate-500 text-sm">
              <Cpu className="w-8 h-8 text-cyan-400/40 mb-2" />
              <span>No active webhooks configured.</span>
            </div>
          )}
        </div>

        {/* Right Panel: Event Logs exact to os_automations.png */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-6 border border-slate-700/50 shadow-2xl flex flex-col h-full">
          <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-800/80">
            <h3 className="font-bold text-lg text-white flex items-center gap-2">
              <Activity className="w-4 h-4 text-cyan-400" />
              <span>Event Logs</span>
            </h3>
            <div className="flex items-center gap-2">
              <button
                onClick={() => setEventLogs(initialLogs)}
                className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 hover:text-white transition-colors"
                title="Reset Logs"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
              <button className="p-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 hover:text-white transition-colors">
                <Filter className="w-4 h-4" />
              </button>
            </div>
          </div>

          <div className="flex-1 space-y-4 overflow-y-auto pr-1">
            {eventLogs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-3.5 p-3.5 rounded-2xl bg-[#0f172a]/50 hover:bg-[#0f172a]/80 border border-slate-800/60 hover:border-slate-700/80 transition-all group"
              >
                {renderLogIcon(log.iconVariant)}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between mb-0.5">
                    <h4 className="font-bold text-sm text-slate-200 truncate group-hover:text-cyan-300 transition-colors">
                      {log.title}
                    </h4>
                    <span className="text-[11px] font-mono text-slate-500 whitespace-nowrap ml-2">
                      {log.timeAgo}
                    </span>
                  </div>
                  <p className="text-xs font-mono text-slate-400 truncate">
                    {log.subtitle}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 pt-4 border-t border-slate-800/80 text-center">
            <button
              onClick={() => setEventLogs([])}
              className="text-xs font-mono text-slate-400 hover:text-cyan-400 font-medium transition-colors uppercase tracking-wider py-1.5 px-4 rounded-xl hover:bg-slate-800/50"
            >
              View All Logs
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
