import React from 'react';

export default function Loading() {
  return (
    <div className="min-h-screen flex bg-[#0b1326] text-slate-100 font-sans overflow-hidden">
      {/* Sidebar Skeleton */}
      <div className="w-64 border-r border-slate-800/80 bg-slate-900/40 backdrop-blur-xl p-4 flex flex-col justify-between hidden md:flex animate-pulse">
        <div className="space-y-6">
          <div className="h-8 w-32 bg-slate-800/80 rounded-lg"></div>
          <div className="space-y-3 pt-4">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-10 w-full bg-slate-800/50 rounded-xl"></div>
            ))}
          </div>
        </div>
        <div className="h-16 w-full bg-slate-800/60 rounded-xl"></div>
      </div>

      {/* Main Content Skeleton */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top bar Skeleton */}
        <div className="h-16 border-b border-slate-800/80 bg-slate-900/30 backdrop-blur-xl px-6 flex items-center justify-between animate-pulse">
          <div className="h-8 w-48 bg-slate-800/60 rounded-lg"></div>
          <div className="flex items-center gap-4">
            <div className="h-9 w-64 bg-slate-800/50 rounded-xl hidden sm:block"></div>
            <div className="h-9 w-9 bg-slate-800/60 rounded-full"></div>
          </div>
        </div>

        {/* Workspace Body Skeleton */}
        <div className="flex-1 p-6 overflow-auto space-y-6 animate-pulse">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="h-32 rounded-2xl bg-slate-900/50 border border-slate-800/80 p-5 space-y-3"
              >
                <div className="h-5 w-1/2 bg-slate-800/80 rounded"></div>
                <div className="h-8 w-1/3 bg-cyan-500/20 rounded"></div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 pt-2">
            <div className="h-96 rounded-2xl bg-slate-900/50 border border-slate-800/80 p-6 space-y-4">
              <div className="h-6 w-1/3 bg-slate-800/80 rounded"></div>
              <div className="space-y-3 pt-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-16 rounded-xl bg-slate-800/40 w-full"></div>
                ))}
              </div>
            </div>

            <div className="h-96 rounded-2xl bg-slate-900/50 border border-slate-800/80 p-6 space-y-4">
              <div className="h-6 w-1/3 bg-slate-800/80 rounded"></div>
              <div className="space-y-3 pt-2">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="h-16 rounded-xl bg-slate-800/40 w-full"></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
