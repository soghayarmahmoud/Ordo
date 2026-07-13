'use client';

import React, { useState } from 'react';
import { 
  Mail, 
  Sparkles, 
  Trash2, 
  CheckCircle2, 
  Search, 
  Filter, 
  Archive, 
  Clock, 
  Send, 
  Copy, 
  Check, 
  Plus, 
  ArrowUpRight,
  User,
  MoreVertical,
  Reply,
  RefreshCw
} from 'lucide-react';
import { EmailItem, TimeBlock } from '@/src/types/ordo';

interface InboxViewProps {
  initialEmails: EmailItem[];
  onQuickSchedule?: (email: EmailItem) => void;
}

export const InboxView: React.FC<InboxViewProps> = ({
  initialEmails,
  onQuickSchedule,
}) => {
  const [emails, setEmails] = useState<EmailItem[]>(initialEmails);
  const [selectedEmail, setSelectedEmail] = useState<EmailItem | null>(initialEmails[0] || null);
  const [activeTab, setActiveTab] = useState<'all' | 'action' | 'summarized' | 'scheduled'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Batch selection
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  
  // AI draft state
  const [isAiDrafting, setIsAiDrafting] = useState(false);
  const [aiDraftText, setAiDraftText] = useState('');
  const [copiedDraft, setCopiedDraft] = useState(false);

  // Add Item modal
  const [isAdding, setIsAdding] = useState(false);
  const [newSender, setNewSender] = useState('');
  const [newSubject, setNewSubject] = useState('');
  const [newBody, setNewBody] = useState('');
  const [newSummary, setNewSummary] = useState('');

  const filteredEmails = emails.filter((e) => {
    const matchesSearch = 
      e.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.sender.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (e.body && e.body.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    if (activeTab === 'action') return e.summaryBadge?.variant === 'action';
    if (activeTab === 'summarized') return e.summaryBadge?.variant === 'summarized';
    if (activeTab === 'scheduled') return e.isScheduled;
    return true;
  });

  const handleToggleSelect = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleSelectAll = () => {
    if (selectedIds.length === filteredEmails.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredEmails.map((e) => e.id));
    }
  };

  const handleDeleteSelected = () => {
    setEmails((prev) => prev.filter((e) => !selectedIds.includes(e.id)));
    if (selectedEmail && selectedIds.includes(selectedEmail.id)) {
      setSelectedEmail(null);
    }
    setSelectedIds([]);
  };

  const handleScheduleSelected = () => {
    setEmails((prev) =>
      prev.map((e) => (selectedIds.includes(e.id) ? { ...e, isScheduled: true } : e))
    );
    setSelectedIds([]);
  };

  const handleGenerateAiDraft = (email: EmailItem) => {
    setIsAiDrafting(true);
    setAiDraftText('Analyzing intent and retrieving relevant workspace context...');
    setTimeout(() => {
      if (email.subject.includes('Roadmap')) {
        setAiDraftText(
          `Hi ${email.sender.split(' ')[0]},\n\nThanks for reaching out regarding the Q3 Roadmap Review! I've checked my Ordo time-blocks and carved out Thursday at 11:00 AM for our alignment session.\n\nLooking forward to reviewing priorities together.\n\nBest regards,\nSarah Jenkins`
        );
      } else if (email.subject.includes('Sprint')) {
        setAiDraftText(
          `Hi Engineering Team,\n\nReceived the sprint planning outcomes. I will review pull request #442 right away during my focus block this afternoon and provide detailed feedback.\n\nCheers,\nSarah Jenkins`
        );
      } else {
        setAiDraftText(
          `Hi ${email.sender.split(' ')[0]},\n\nThank you for the update on "${email.subject}". I have reviewed your notes and scheduled a dedicated follow-up slot in my Ordo calendar.\n\nLet's connect shortly to finalize next steps.\n\nBest,\nSarah Jenkins`
        );
      }
      setIsAiDrafting(false);
    }, 600);
  };

  const handleCopyDraft = () => {
    navigator.clipboard?.writeText(aiDraftText);
    setCopiedDraft(true);
    setTimeout(() => setCopiedDraft(false), 2000);
  };

  const handleAddNewEmail = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSender || !newSubject) return;

    const newEmail: EmailItem = {
      id: `email-${Date.now()}`,
      sender: newSender,
      time: 'Just now',
      subject: newSubject,
      body: newBody || 'Simulated incoming message content via Ordo Console.',
      summaryBadge: newSummary
        ? { text: `✨ Summarized: ${newSummary}`, variant: 'summarized' }
        : undefined,
      isScheduled: false,
    };

    setEmails((prev) => [newEmail, ...prev]);
    setSelectedEmail(newEmail);
    setNewSender('');
    setNewSubject('');
    setNewBody('');
    setNewSummary('');
    setIsAdding(false);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-6rem)] space-y-4">
      {/* Inbox Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase mb-1">
            <Mail className="w-3.5 h-3.5" />
            <span>ORDO SMART INBOX ENGINE</span>
          </div>
          <h1 className="font-bold text-2xl sm:text-3xl text-white tracking-tight flex items-center gap-3">
            Unified Action Inbox
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            AI-filtered priority communication and fast time-block scheduling.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsAdding(!isAdding)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-[#0b1326] font-bold text-xs transition-all shadow-lg shadow-cyan-500/20"
          >
            <Plus className="w-4 h-4" />
            <span>Simulate Message</span>
          </button>

          {/* Search Input */}
          <div className="relative flex items-center">
            <Search className="absolute left-3 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search sender or subject..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-slate-900/90 border border-slate-700/80 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 w-44 sm:w-64 transition-all"
            />
          </div>
        </div>
      </div>

      {/* Simulate Message Form Modal */}
      {isAdding && (
        <form onSubmit={handleAddNewEmail} className="p-5 glass-panel rounded-2xl border border-cyan-500/40 space-y-3 animate-in fade-in duration-200">
          <div className="flex justify-between items-center text-xs font-bold text-cyan-400">
            <span>Simulate Incoming Email into Smart Inbox</span>
            <button type="button" onClick={() => setIsAdding(false)} className="text-slate-400 hover:text-white">✕</button>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="Sender Name (e.g., Alex Chen)"
              value={newSender}
              onChange={(e) => setNewSender(e.target.value)}
              className="bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
            <input
              type="text"
              placeholder="Subject (e.g., Design System Sync)"
              value={newSubject}
              onChange={(e) => setNewSubject(e.target.value)}
              className="bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500"
            />
            <input
              type="text"
              placeholder="AI Summary Badge (e.g., Action Required)"
              value={newSummary}
              onChange={(e) => setNewSummary(e.target.value)}
              className="bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 font-mono"
            />
          </div>
          <textarea
            placeholder="Message Body content..."
            value={newBody}
            onChange={(e) => setNewBody(e.target.value)}
            className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2 text-xs text-white focus:outline-none focus:border-cyan-500 h-16"
          />
          <button
            type="submit"
            className="w-full bg-cyan-500 hover:bg-cyan-400 text-[#0b1326] font-bold py-2 rounded-xl text-xs transition-all shadow-md shadow-cyan-500/20"
          >
            Insert into Smart Inbox
          </button>
        </form>
      )}

      {/* Tabs & Batch Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-[#0f172a]/80 p-2.5 rounded-2xl border border-slate-800">
        <div className="flex items-center gap-1 overflow-x-auto">
          {[
            { id: 'all', label: 'All Items', count: emails.length },
            { id: 'action', label: 'Action Required', count: emails.filter((e) => e.summaryBadge?.variant === 'action').length },
            { id: 'summarized', label: 'AI Summarized', count: emails.filter((e) => e.summaryBadge?.variant === 'summarized').length },
            { id: 'scheduled', label: 'Scheduled', count: emails.filter((e) => e.isScheduled).length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                activeTab === tab.id
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-bold shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full font-mono text-[10px] ${
                activeTab === tab.id ? 'bg-cyan-400 text-[#0b1326] font-bold' : 'bg-slate-800 text-slate-500'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Batch Actions */}
        {selectedIds.length > 0 ? (
          <div className="flex items-center gap-2 bg-cyan-950/80 border border-cyan-500/40 px-3 py-1.5 rounded-xl text-xs text-cyan-300 animate-in fade-in duration-200">
            <span className="font-mono font-bold">{selectedIds.length} selected</span>
            <button
              onClick={handleScheduleSelected}
              className="flex items-center gap-1 bg-cyan-500 text-[#0b1326] font-bold px-2.5 py-1 rounded-lg hover:bg-cyan-400 transition-colors"
            >
              <Clock className="w-3 h-3" />
              <span>Mark Scheduled</span>
            </button>
            <button
              onClick={handleDeleteSelected}
              className="p-1 text-slate-300 hover:text-red-400 transition-colors rounded hover:bg-red-500/20"
              title="Delete selected"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ) : (
          <button
            onClick={handleSelectAll}
            className="text-xs font-mono text-slate-400 hover:text-white px-3 py-1 rounded-xl hover:bg-slate-800/50 transition-colors self-start sm:self-auto"
          >
            Select All ({filteredEmails.length})
          </button>
        )}
      </div>

      {/* Split Pane: Email List (left) + Detailed Email Reader (right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 min-h-0 overflow-hidden">
        
        {/* Left List */}
        <div className="lg:col-span-5 glass-panel rounded-3xl p-4 sm:p-5 border border-slate-700/50 shadow-xl overflow-y-auto space-y-3">
          {filteredEmails.map((email) => {
            const isSelected = selectedEmail?.id === email.id;
            const isChecked = selectedIds.includes(email.id);

            return (
              <div
                key={email.id}
                onClick={() => setSelectedEmail(email)}
                className={`group rounded-2xl p-4 border transition-all duration-200 cursor-pointer relative ${
                  isSelected
                    ? 'bg-slate-800/90 border-cyan-500/60 shadow-lg shadow-cyan-500/10 translate-x-1'
                    : 'bg-[#0f172a]/60 border-slate-800/80 hover:border-slate-700/80 hover:bg-[#0f172a]/90'
                } ${email.isScheduled ? 'opacity-60 bg-slate-900/40' : ''}`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={isChecked}
                      onChange={(e) => handleToggleSelect(email.id, e as any)}
                      onClick={(e) => e.stopPropagation()}
                      className="w-4 h-4 rounded border-slate-700 text-cyan-500 focus:ring-0 bg-slate-900 cursor-pointer"
                    />
                    <span className="font-bold text-xs text-slate-200 truncate max-w-[150px]">
                      {email.sender}
                    </span>
                    {email.isScheduled && (
                      <span className="text-[10px] bg-cyan-500/20 text-cyan-300 px-1.5 py-0.2 rounded font-mono">
                        Scheduled
                      </span>
                    )}
                  </div>
                  <span className="text-[11px] font-mono text-slate-500">{email.time}</span>
                </div>

                <h4 className="font-bold text-sm text-white mb-2 leading-snug truncate">
                  {email.subject}
                </h4>

                {email.summaryBadge && (
                  <div className="mb-2">
                    <span className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md font-mono text-[10px] font-medium border ${
                      email.summaryBadge.variant === 'action'
                        ? 'bg-teal-500/15 text-teal-300 border-teal-500/30'
                        : 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30'
                    }`}>
                      <Sparkles className="w-3 h-3 animate-pulse" />
                      {email.summaryBadge.text}
                    </span>
                  </div>
                )}

                <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">
                  {email.body}
                </p>
              </div>
            );
          })}

          {filteredEmails.length === 0 && (
            <div className="h-48 flex flex-col items-center justify-center text-slate-500 text-sm">
              <CheckCircle2 className="w-8 h-8 text-cyan-400/50 mb-2" />
              <span>No action items match current filters.</span>
            </div>
          )}
        </div>

        {/* Right Reader Pane */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 border border-slate-700/50 shadow-2xl flex flex-col overflow-y-auto">
          {selectedEmail ? (
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div>
                {/* Email Header */}
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 pb-5 border-b border-slate-800/80">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-[11px] font-bold border border-cyan-500/30">
                        {selectedEmail.isScheduled ? 'SCHEDULED IN CALENDAR' : 'ACTION REQUIRED'}
                      </span>
                      <span className="text-xs font-mono text-slate-500">• {selectedEmail.time}</span>
                    </div>
                    <h2 className="font-bold text-xl sm:text-2xl text-white tracking-tight">
                      {selectedEmail.subject}
                    </h2>
                    <div className="flex items-center gap-2 text-sm text-slate-300">
                      <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center font-bold text-xs text-white">
                        {selectedEmail.sender.charAt(0)}
                      </div>
                      <span className="font-semibold">{selectedEmail.sender}</span>
                      <span className="text-slate-500 text-xs">&lt;{selectedEmail.sender.toLowerCase().replace(/\s+/g, '.')}@client.ordo.io&gt;</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start">
                    <button
                      onClick={() => {
                        if (onQuickSchedule) onQuickSchedule(selectedEmail);
                        setEmails((prev) => prev.map((e) => e.id === selectedEmail.id ? { ...e, isScheduled: true } : e));
                      }}
                      className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-xs font-bold transition-all"
                    >
                      <Clock className="w-3.5 h-3.5" />
                      <span>{selectedEmail.isScheduled ? 'Reschedule Block' : 'Carve Time Block'}</span>
                    </button>
                    <button
                      onClick={() => {
                        setEmails((prev) => prev.filter((e) => e.id !== selectedEmail.id));
                        setSelectedEmail(null);
                      }}
                      className="p-2 rounded-xl bg-slate-800/80 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 transition-colors border border-slate-700/50"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* AI Summary Highlight Box */}
                {selectedEmail.summaryBadge && (
                  <div className="mt-5 p-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 to-cyan-950/60 border border-cyan-500/30 space-y-2">
                    <div className="flex items-center gap-2 font-mono text-xs font-bold text-cyan-300 uppercase">
                      <Sparkles className="w-4 h-4 animate-pulse" />
                      <span>ORDO AI EXECUTIVE SUMMARY</span>
                    </div>
                    <p className="text-sm text-slate-200 font-sans leading-relaxed">
                      {selectedEmail.summaryBadge.text}. The sender is requesting immediate attention and timeline coordination for this quarter's targets.
                    </p>
                  </div>
                )}

                {/* Main Body */}
                <div className="mt-6 p-5 rounded-2xl bg-[#0f172a]/60 border border-slate-800 text-slate-200 text-sm leading-relaxed font-sans min-h-[140px] whitespace-pre-wrap">
                  {selectedEmail.body}
                </div>
              </div>

              {/* AI Auto-Response Generator */}
              <div className="mt-6 pt-5 border-t border-slate-800/80 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-300 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-cyan-400" />
                    <span>AI Copilot Smart Reply</span>
                  </span>
                  <button
                    onClick={() => handleGenerateAiDraft(selectedEmail)}
                    disabled={isAiDrafting}
                    className="text-xs font-mono bg-cyan-500 hover:bg-cyan-400 text-[#0b1326] font-bold px-3 py-1 rounded-lg transition-all flex items-center gap-1.5 shadow-sm"
                  >
                    {isAiDrafting ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Reply className="w-3 h-3" />}
                    <span>{aiDraftText ? 'Regenerate Draft' : 'Generate Response Draft'}</span>
                  </button>
                </div>

                {aiDraftText && (
                  <div className="p-4 rounded-2xl bg-slate-900/90 border border-cyan-500/40 space-y-3 animate-in fade-in duration-200">
                    <div className="text-xs font-mono text-cyan-300 whitespace-pre-wrap leading-relaxed">
                      {aiDraftText}
                    </div>
                    <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
                      <button
                        onClick={handleCopyDraft}
                        className="flex items-center gap-1 text-xs font-mono px-3 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors border border-slate-700"
                      >
                        {copiedDraft ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedDraft ? 'Copied to Clipboard' : 'Copy Draft'}</span>
                      </button>
                      <button
                        onClick={() => {
                          alert(`✨ AI Response Sent to ${selectedEmail.sender}!`);
                          setAiDraftText('');
                        }}
                        className="flex items-center gap-1 text-xs font-bold px-3.5 py-1 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-[#0b1326] hover:from-cyan-400 hover:to-blue-500 transition-all shadow-md"
                      >
                        <Send className="w-3 h-3" />
                        <span>Send via Ordo API</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 space-y-3">
              <Mail className="w-12 h-12 text-slate-600 animate-pulse" />
              <p className="text-sm font-medium">Select an action item to review details and AI summaries</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
