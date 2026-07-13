'use client';

import React, { useState } from 'react';
import { 
  Map, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  Rocket, 
  Cpu, 
  ShieldCheck, 
  Terminal, 
  Layers, 
  ThumbsUp, 
  ArrowUpRight,
  ChevronRight,
  Code
} from 'lucide-react';

export const RoadmapView: React.FC = () => {
  const [selectedPhase, setSelectedPhase] = useState<number | 'all'>('all');
  const [upvotes, setUpvotes] = useState<Record<string, number>>({
    'ai-agents': 142,
    'offline-sync': 98,
    'voice-commands': 84,
    'custom-plugins': 120,
    'biometric-2fa': 65,
  });

  const handleVote = (id: string) => {
    setUpvotes((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
  };

  const phases = [
    {
      phase: 1,
      title: 'Phase 1: Core Engine & Interactive Scheduling',
      status: 'Completed',
      statusColor: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
      timeline: 'Q1 - Q2 2026',
      icon: CheckCircle2,
      description: 'Laying the foundational high-performance React 19 / Next.js 16 architecture with rich glassmorphic aesthetics and real-time drag-and-swap mechanics.',
      milestones: [
        { title: 'Interactive Calendar Drag & Swap', desc: 'Full bidirectional swapping when dropping time blocks over occupied calendar slots.', done: true },
        { title: 'Smart Inbox AI Classification', desc: 'Automatic extraction of action items and 1-click time block carving.', done: true },
        { title: 'Multi-column Kanban Sprint Board', desc: 'Drag-and-drop task progression across TO DO, IN PROGRESS, and DONE with ORD codes.', done: true },
        { title: 'Responsive Mobile Slide-over Drawer', desc: 'Seamless adaptation across mobile, tablet, and widescreen executive monitors.', done: true },
      ],
    },
    {
      phase: 2,
      title: 'Phase 2: Autonomous AI Workflows & Multi-Agent Copilot',
      status: 'In Progress • Active Sprint',
      statusColor: 'bg-cyan-500/20 text-cyan-300 border-cyan-500/30 animate-pulse',
      timeline: 'Q3 2026 (Current)',
      icon: Cpu,
      description: 'Transforming Ordo from a passive productivity workspace into an autonomous agentic operating system where AI executes tasks on your behalf.',
      milestones: [
        { title: 'AI Copilot Smart Reply & Auto-Drafting', desc: 'Context-aware drafting of client responses and meeting confirmations.', done: true, voteId: 'ai-agents' },
        { title: 'Autonomous Webhook Event Routing', desc: 'Multi-cloud ingestion pipelines for Telegram and WhatsApp Cloud API.', done: true },
        { title: 'Voice Command Navigation (⌘K Audio)', desc: 'Speech-to-action routing to carve calendar slots hands-free.', done: false, voteId: 'voice-commands' },
        { title: 'Custom Agent Skill Builder', desc: 'Allow users to define custom LLM triggers and subagents for recurring tasks.', done: false, voteId: 'custom-plugins' },
      ],
    },
    {
      phase: 3,
      title: 'Phase 3: Native Desktop & Mobile Ecosystem',
      status: 'Scheduled Phase',
      statusColor: 'bg-purple-500/20 text-purple-300 border-purple-500/30',
      timeline: 'Q4 2026',
      icon: Rocket,
      description: 'Native cross-platform execution with offline-first synchronization and hardware acceleration across macOS, Windows, iOS, and Android.',
      milestones: [
        { title: 'Offline-First SQLite / CRDT Sync Engine', desc: 'Zero-latency local interaction that background syncs via WebSockets when online.', done: false, voteId: 'offline-sync' },
        { title: 'System Tray & Menu Bar Mini-Console', desc: 'Carve time slots and check upcoming meetings straight from the OS menu bar.', done: false },
        { title: 'Native iOS & Android Companion Apps', desc: 'Biometric unlock and lock-screen widgets for instant inbox triage.', done: false },
      ],
    },
    {
      phase: 4,
      title: 'Phase 4: Enterprise Security & Quantum Telemetry',
      status: 'Strategic Vision',
      statusColor: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
      timeline: '2027 & Beyond',
      icon: ShieldCheck,
      description: 'Scaling Ordo for Fortune 500 enterprise deployment with end-to-end zero-knowledge encryption and advanced role-based access controls.',
      milestones: [
        { title: 'End-to-End Zero-Knowledge Vault', desc: 'All time-blocks, tasks, and notes encrypted at rest with client-side keys.', done: false },
        { title: 'SAML 2.0 / Okta Enterprise SSO & Audit Logs', desc: 'Granular compliance reporting and multi-tenant team segregation.', done: false, voteId: 'biometric-2fa' },
        { title: 'AI Team Workload Leveling & Burnout Protection', desc: 'Automatic redistribution of sprint tasks based on real-time developer focus telemetry.', done: false },
      ],
    },
  ];

  const filteredPhases = selectedPhase === 'all' ? phases : phases.filter((p) => p.phase === selectedPhase);

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-8">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-3 border-b border-slate-800/80">
        <div>
          <div className="flex items-center gap-2 text-xs font-mono font-bold tracking-widest text-cyan-400 uppercase mb-1">
            <Map className="w-3.5 h-3.5" />
            <span>PLATFORM EVOLUTION & STRATEGY</span>
          </div>
          <h1 className="font-bold text-3xl text-white tracking-tight">
            Ordo Technical Roadmap
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Explore upcoming milestones, vote on feature requests, and inspect our architectural strategy.
          </p>
        </div>

        {/* Phase Filter Buttons */}
        <div className="flex items-center gap-1 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-800 self-start sm:self-auto flex-wrap">
          <button
            onClick={() => setSelectedPhase('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-medium transition-all ${
              selectedPhase === 'all' ? 'bg-slate-700 text-white font-bold shadow' : 'text-slate-400 hover:text-white'
            }`}
          >
            All Phases
          </button>
          {[1, 2, 3, 4].map((num) => (
            <button
              key={num}
              onClick={() => setSelectedPhase(num)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-medium transition-all ${
                selectedPhase === num ? 'bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40' : 'text-slate-400 hover:text-white'
              }`}
            >
              Phase {num}
            </button>
          ))}
        </div>
      </div>

      {/* Strategic Highlights Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-[#0b1326] via-indigo-950/60 to-cyan-950/40 border border-cyan-500/30 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2 max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 font-mono text-xs font-bold border border-cyan-500/30">
            <Sparkles className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: '4s' }} />
            <span>ACTIVE FOCUS: PHASE 2 AI AUTONOMOUS AGENTS</span>
          </div>
          <h2 className="font-bold text-xl sm:text-2xl text-white tracking-tight">
            Building the Next Generation of Unified Agentic Workspaces
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 font-sans leading-relaxed">
            Ordo is built on professional software engineering principles: modular TypeScript architectures, zero-latency drag-and-swap state synchronization, and enterprise-grade security.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 shrink-0">
          <a
            href="file:///g:/React/ordo/roadmap.md"
            target="_blank"
            rel="noreferrer"
            className="flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-[#0b1326] font-bold text-xs transition-all shadow-lg shadow-cyan-500/20"
          >
            <Code className="w-4 h-4" />
            <span>View Full roadmap.md</span>
          </a>
        </div>
      </div>

      {/* Timeline List */}
      <div className="space-y-6">
        {filteredPhases.map((phaseItem) => {
          const Icon = phaseItem.icon;
          return (
            <div
              key={phaseItem.phase}
              className="glass-panel rounded-3xl p-6 sm:p-8 border border-slate-700/50 shadow-2xl relative overflow-hidden transition-all hover:border-slate-600/80"
            >
              {/* Phase Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-800/80">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 border shadow-lg ${
                    phaseItem.phase === 1 ? 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30' :
                    phaseItem.phase === 2 ? 'bg-cyan-500/15 text-cyan-400 border-cyan-500/30' :
                    phaseItem.phase === 3 ? 'bg-purple-500/15 text-purple-400 border-purple-500/30' :
                    'bg-amber-500/15 text-amber-400 border-amber-500/30'
                  }`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-bold text-lg sm:text-xl text-white">{phaseItem.title}</h3>
                      <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded border ${phaseItem.statusColor}`}>
                        {phaseItem.status}
                      </span>
                    </div>
                    <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl leading-relaxed font-sans">
                      {phaseItem.description}
                    </p>
                  </div>
                </div>

                <div className="font-mono text-xs font-bold text-slate-400 bg-slate-900/80 px-3 py-1.5 rounded-xl border border-slate-800 self-start sm:self-auto shrink-0">
                  {phaseItem.timeline}
                </div>
              </div>

              {/* Milestones Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                {phaseItem.milestones.map((ms, mIdx) => (
                  <div
                    key={mIdx}
                    className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                      ms.done
                        ? 'bg-slate-900/80 border-slate-800 text-slate-200'
                        : 'bg-[#0f172a]/50 border-slate-800/60 hover:border-cyan-500/30'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5 text-xs font-bold ${
                        ms.done ? 'bg-emerald-500 text-[#0b1326]' : 'bg-slate-800 border border-slate-700 text-slate-400'
                      }`}>
                        {ms.done ? '✓' : mIdx + 1}
                      </div>
                      <div>
                        <h4 className={`font-bold text-xs sm:text-sm ${ms.done ? 'text-slate-200' : 'text-white'}`}>
                          {ms.title}
                        </h4>
                        <p className="text-xs text-slate-400 mt-1 leading-relaxed">{ms.desc}</p>
                      </div>
                    </div>

                    {/* Upvote feature button if available */}
                    {ms.voteId && (
                      <button
                        onClick={() => handleVote(ms.voteId!)}
                        className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-800/80 hover:bg-cyan-500/20 text-slate-300 hover:text-cyan-300 border border-slate-700 hover:border-cyan-500/40 text-xs font-mono transition-all shrink-0"
                        title="Vote for priority"
                      >
                        <ThumbsUp className="w-3 h-3 text-cyan-400" />
                        <span>{upvotes[ms.voteId] || 0}</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
