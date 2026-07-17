'use client';

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('[Ordo Application Error]:', error);
  }, [error]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#0b1326] p-6 text-slate-100 font-sans">
      <div className="max-w-md w-full rounded-2xl bg-slate-900/60 backdrop-blur-xl border border-slate-800/80 p-8 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-full bg-red-500/10 border border-red-500/20 flex items-center justify-center mx-auto text-red-400">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-bold text-slate-100 tracking-tight">
            System Fault Detected
          </h2>
          <p className="text-sm text-slate-400 leading-relaxed">
            {error?.message ||
              'An unexpected error occurred while processing your request within the Ordo console.'}
          </p>
          {error?.digest && (
            <p className="text-xs font-mono text-slate-500 pt-1">
              Error Digest: {error.digest}
            </p>
          )}
        </div>

        <div className="flex flex-col sm:flex-row gap-3 pt-4">
          <button
            onClick={() => reset()}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 text-slate-950 font-semibold text-sm shadow-lg shadow-cyan-500/20 hover:brightness-110 transition active:scale-95 cursor-pointer"
          >
            <RefreshCw className="w-4 h-4" />
            Retry Operation
          </button>
          <a
            href="/"
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800/60 border border-slate-700/60 text-slate-200 font-medium text-sm hover:bg-slate-800 transition active:scale-95"
          >
            <Home className="w-4 h-4" />
            Console Home
          </a>
        </div>
      </div>
    </div>
  );
}
