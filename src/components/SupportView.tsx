'use client';

import React, { useState, useEffect } from 'react';
import { 
  HelpCircle, 
  Sparkles, 
  MessageSquare, 
  Search, 
  CheckCircle2, 
  Send, 
  BookOpen, 
  Terminal, 
  LifeBuoy, 
  AlertCircle, 
  ChevronRight,
  ChevronDown,
  RefreshCw,
  Cpu
} from 'lucide-react';
import { useSession } from 'next-auth/react';

export const SupportView: React.FC = () => {
  const { data: session } = useSession();
  const firstName = session?.user?.name ? session.user.name.split(' ')[0] : 'Sarah';

  const [messages, setMessages] = useState<Array<{ sender: 'user' | 'ai'; text: string; time: string }>>([
    {
      sender: 'ai',
      text: `Hello ${firstName}! I'm your Ordo AI Copilot. Ask me anything about time-blocking, drag-and-swap mechanics, API webhooks, or workspace configuration.`,
      time: 'Just now',
    },
  ]);
  const [inputQuery, setInputQuery] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Toast state
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3500);
  };

  // FAQ Accordions
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);

  // Ticket Form Modal
  const [isTicketOpen, setIsTicketOpen] = useState(false);
  const [ticketSubject, setTicketSubject] = useState('');
  const [ticketDesc, setTicketDesc] = useState('');
  const [ticketPriority, setTicketPriority] = useState('High');

  useEffect(() => {
    if (session?.user?.name) {
      const name = session.user.name.split(' ')[0];
      setMessages((prev) =>
        prev.map((m, idx) =>
          idx === 0
            ? {
                ...m,
                text: `Hello ${name}! I'm your Ordo AI Copilot. Ask me anything about time-blocking, drag-and-swap mechanics, API webhooks, or workspace configuration.`,
              }
            : m
        )
      );
    }
  }, [session?.user?.name]);

  const faqs = [
    {
      question: 'How does drag-and-swap work in the Ordo Calendar?',
      answer: 'You can drag any item from the Smart Inbox on the left onto any time slot in the Calendar to instantly schedule a block. Furthermore, you can drag ANY EXISTING scheduled time block inside the calendar and drop it onto another occupied or empty slot. If the target slot has another time block, Ordo automatically SWAPS their days and hours smoothly without losing metadata!',
    },
    {
      question: 'How do I authenticate and route WhatsApp/Telegram webhooks?',
      answer: 'Navigate to the Automations tab, enter your integration name, and click "Generate Hook". Ordo generates a dedicated endpoint URL (https://api.ordo.io/v1/webhooks/...). Pass payloads using standard JSON over HTTPS. Use the toggle switch to instantly pause or resume incoming event routing.',
    },
    {
      question: 'How do I invite teammates to collaborate on Sprint Kanban boards?',
      answer: 'Go to Settings -> Team Collaboration and click "Invite Teammate". Enter their email and select their role (Owner, Admin, Lead Engineer, Member). Once invited, they will appear on Sprint boards and can be assigned directly to tasks.',
    },
    {
      question: 'Can I customize the glassmorphism backdrop blur intensity and theme colors?',
      answer: 'Yes! Go to Settings -> Appearance & Glass UI. You can choose from Lumina Obsidian, Cyber Cyan Matrix, and Deep Amethyst Studio palettes, as well as adjust the exact backdrop blur percentage using the interactive slider.',
    },
  ];

  const handleSendMessage = (e?: React.FormEvent, customText?: string) => {
    if (e) e.preventDefault();
    const query = customText || inputQuery;
    if (!query.trim()) return;

    const userMsg = { sender: 'user' as const, text: query, time: 'Just now' };
    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputQuery('');
    setIsAiThinking(true);

    setTimeout(() => {
      let aiResponse = "I'm reviewing your Ordo workspace configuration right now.\n\n";
      const qLower = query.toLowerCase();

      if (qLower.includes('swap') || qLower.includes('drag') || qLower.includes('time')) {
        aiResponse = "📅 **Time Block Swapping:**\nWhen you drag a time block inside the Calendar over another block, watch for the amber `⚡ SWAP time` border indicator! Dropping it immediately exchanges their schedules (`day` and `hour` slots updated seamlessly). You can also drag action items straight from the inbox into any open slot.";
      } else if (qLower.includes('webhook') || qLower.includes('api') || qLower.includes('automation')) {
        aiResponse = "⚡ **API & Webhook Integration:**\nAll endpoints route to `https://api.ordo.io/v1/webhooks/...`. You can check live throughput stats in the **Automations** tab and inspect real-time Event Logs at the bottom right. Use your production API key (`ordo_live_...` in Settings) for REST Authorization.";
      } else if (qLower.includes('team') || qLower.includes('invite') || qLower.includes('member')) {
        aiResponse = "👥 **Team Management:**\nSarah Jenkins (Owner), Marcus Klein, and Alex Chen currently have active access. You can add more teammates or assign task avatars (`/avatars/01.png`, `/avatars/02.png`) directly inside the Kanban board modal.";
      } else {
        aiResponse = `Regarding "${query}": Ordo is fully modular and responsive across all devices. If you need specific architectural adjustments or enterprise SLA support, you can open a direct support ticket using the button on the right!`;
      }

      setMessages((prev) => [...prev, { sender: 'ai', text: aiResponse, time: 'Just now' }]);
      setIsAiThinking(false);
    }, 700);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ticketSubject) return;
    showToast(`🎫 High-Priority Support Ticket "${ticketSubject}" dispatched to Ordo Engineering team!`);
    setTicketSubject('');
    setTicketDesc('');
    setIsTicketOpen(false);
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      {/* Top Title */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase mb-1">
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>ORDO SUPPORT & KNOWLEDGE BASE</span>
          </div>
          <h1 className="font-bold text-3xl text-white tracking-tight">
            Support Center & AI Copilot
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Get instant answers from our AI assistant, browse interactive tutorials, or contact engineering.
          </p>
        </div>

        <div className="flex items-center gap-3 self-start sm:self-auto">
          <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-medium shadow-[0_0_15px_rgba(16,185,129,0.15)]">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
            <span>All Services Operational • 99.99%</span>
          </div>
          <button
            onClick={() => setIsTicketOpen(true)}
            className="bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-[#0b1326] font-bold text-xs px-4 py-2 rounded-xl transition-all shadow-lg shadow-cyan-500/20"
          >
            Open Ticket
          </button>
        </div>
      </div>

      {/* Ticket Modal */}
      {isTicketOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#0b1326]/80 backdrop-blur-md p-4 animate-in fade-in duration-200">
          <div className="w-full max-w-md glass-panel rounded-3xl p-6 border border-cyan-500/40 shadow-2xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <LifeBuoy className="w-4 h-4 text-cyan-400" />
                Open High-Priority Ticket
              </h3>
              <button onClick={() => setIsTicketOpen(false)} className="text-slate-400 hover:text-white text-sm">✕</button>
            </div>
            <form onSubmit={handleCreateTicket} className="space-y-4">
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Issue Subject</label>
                <input
                  type="text"
                  placeholder="e.g., Webhook latency spike in Frankfurt cluster"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500"
                  autoFocus
                  required
                />
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Priority SLA</label>
                <select
                  value={ticketPriority}
                  onChange={(e) => setTicketPriority(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl px-3.5 py-2 text-sm text-white focus:outline-none focus:border-cyan-500 font-mono"
                >
                  <option value="High">🔴 High Priority (1h SLA)</option>
                  <option value="Medium">🟡 Medium Priority (4h SLA)</option>
                  <option value="Low">🟢 Standard Inquiry</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-mono text-slate-400 mb-1">Detailed Description</label>
                <textarea
                  placeholder="Provide logs or context steps..."
                  value={ticketDesc}
                  onChange={(e) => setTicketDesc(e.target.value)}
                  className="w-full bg-slate-900/90 border border-slate-700 rounded-xl p-3 text-sm text-white focus:outline-none focus:border-cyan-500 h-24 font-sans"
                />
              </div>
              <div className="flex items-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsTicketOpen(false)}
                  className="flex-1 bg-slate-800 hover:bg-slate-700 text-slate-300 font-medium text-xs py-2.5 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-[#0b1326] font-bold text-xs py-2.5 rounded-xl shadow-md shadow-cyan-500/20"
                >
                  Dispatch Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {toastMsg && (
        <div className="fixed bottom-6 right-6 z-50 glass-card bg-[#0f172a]/95 border-2 border-cyan-400 text-white px-5 py-3 rounded-2xl shadow-2xl flex items-center gap-3 animate-in fade-in duration-200">
          <CheckCircle2 className="w-5 h-5 text-cyan-400" />
          <span className="text-xs font-mono font-bold">{toastMsg}</span>
        </div>
      )}

      {/* Main Support Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left: AI Copilot Assistant Chat */}
        <div className="lg:col-span-7 glass-panel rounded-3xl p-6 border border-slate-700/50 shadow-2xl flex flex-col h-[600px]">
          <div className="flex items-center justify-between pb-4 border-b border-slate-800">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center shadow-lg shadow-cyan-500/20">
                <Sparkles className="w-5 h-5 text-white animate-pulse" />
              </div>
              <div>
                <h3 className="font-bold text-base text-white">Ordo AI Copilot Assistant</h3>
                <p className="text-[11px] font-mono text-cyan-400">Trained on Ordo v2.0 Architecture</p>
              </div>
            </div>
            <button
              onClick={() => setMessages([{ sender: 'ai', text: `Hello ${firstName}! Ask me anything about Ordo tools, time swapping, or automations.`, time: 'Just now' }])}
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-400 hover:text-white transition-colors"
              title="Reset Chat"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>

          {/* Quick Prompt Chips */}
          <div className="py-3 flex items-center gap-2 overflow-x-auto border-b border-slate-800/60">
            {[
              'How to drag & swap time blocks?',
              'Explain Ordo Webhook routing',
              'How to invite a team member?',
              'What is new in Ordo v2.0?',
            ].map((chip, i) => (
              <button
                key={i}
                onClick={() => handleSendMessage(undefined, chip)}
                className="px-3 py-1.5 rounded-xl bg-slate-900/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-800 hover:border-cyan-500/40 text-xs font-mono whitespace-nowrap transition-all"
              >
                + {chip}
              </button>
            ))}
          </div>

          {/* Chat Messages */}
          <div className="flex-1 overflow-y-auto py-4 space-y-4 pr-2">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex gap-3 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.sender === 'ai' && (
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm mt-1">
                    <Sparkles className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[80%] rounded-2xl p-4 text-sm leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-cyan-600 to-blue-600 text-white rounded-br-none shadow-md font-sans'
                      : 'bg-[#0f172a]/90 border border-slate-800 text-slate-200 rounded-bl-none shadow-lg font-sans'
                  }`}
                >
                  <div className="whitespace-pre-wrap">{msg.text}</div>
                  <span className={`block text-[10px] font-mono mt-2 ${msg.sender === 'user' ? 'text-cyan-100 text-right' : 'text-slate-500'}`}>
                    {msg.time}
                  </span>
                </div>
              </div>
            ))}

            {isAiThinking && (
              <div className="flex gap-3 justify-start">
                <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-cyan-500 to-indigo-600 flex items-center justify-center text-white shrink-0 shadow-sm animate-bounce">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="bg-[#0f172a]/90 border border-slate-800 rounded-2xl p-3.5 text-xs font-mono text-cyan-400 flex items-center gap-2">
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Analyzing Ordo telemetry and documentation...</span>
                </div>
              </div>
            )}
          </div>

          {/* Chat Input */}
          <form onSubmit={handleSendMessage} className="pt-3 border-t border-slate-800 flex gap-2">
            <input
              type="text"
              placeholder="Type your question for Ordo AI Copilot..."
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              className="flex-1 bg-slate-900/90 border border-slate-700 rounded-xl px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
            />
            <button
              type="submit"
              className="bg-cyan-500 hover:bg-cyan-400 text-[#0b1326] font-bold px-5 py-2.5 rounded-xl transition-all shadow-md shadow-cyan-500/20 flex items-center gap-1.5 shrink-0"
            >
              <Send className="w-4 h-4" />
              <span className="hidden sm:inline">Ask AI</span>
            </button>
          </form>
        </div>

        {/* Right: Knowledge Base FAQ & Status */}
        <div className="lg:col-span-5 space-y-6">
          <div className="glass-panel rounded-3xl p-6 border border-slate-700/50 space-y-4">
            <h3 className="font-bold text-lg text-white flex items-center gap-2 pb-2 border-b border-slate-800">
              <BookOpen className="w-5 h-5 text-cyan-400" />
              <span>Interactive Knowledge Base</span>
            </h3>

            <div className="space-y-3">
              {faqs.map((faq, idx) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="rounded-2xl border border-slate-800/80 bg-slate-900/50 overflow-hidden transition-all"
                  >
                    <button
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full p-4 text-left flex items-center justify-between font-bold text-xs sm:text-sm text-slate-200 hover:text-cyan-300 transition-colors"
                    >
                      <span>{faq.question}</span>
                      <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform ${isOpen ? 'rotate-180 text-cyan-400' : ''}`} />
                    </button>
                    {isOpen && (
                      <div className="p-4 pt-0 text-xs text-slate-300 leading-relaxed font-sans border-t border-slate-800/40 bg-[#0b1326]/60">
                        {faq.answer}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* System Health Telemetry Card */}
          <div className="glass-panel rounded-3xl p-6 border border-slate-700/50 space-y-3">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="font-bold text-base text-white flex items-center gap-2">
                <Cpu className="w-4 h-4 text-emerald-400" />
                <span>Ordo Node Telemetry</span>
              </h3>
              <span className="text-[10px] font-mono bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded border border-emerald-500/30 font-bold">
                Healthy
              </span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              {[
                { node: 'API Gateway (US-East)', latency: '18ms', status: 'Optimal' },
                { node: 'Drag-and-Swap Engine', latency: '2ms', status: 'Optimal' },
                { node: 'AI Copilot Inference', latency: '120ms', status: 'Optimal' },
                { node: 'Webhook Dispatcher', latency: '24ms', status: 'Optimal' },
              ].map((n, i) => (
                <div key={i} className="flex items-center justify-between py-1.5 border-b border-slate-800/50 last:border-0">
                  <span className="text-slate-300">{n.node}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-slate-500">{n.latency}</span>
                    <span className="text-emerald-400 font-bold">● {n.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
