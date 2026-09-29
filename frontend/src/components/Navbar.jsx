import React, { useState, useEffect } from 'react';
import { Link2, Sparkles, Server } from 'lucide-react';
import { getAllUrls } from '../api';

export default function Navbar({ totalCount }) {
  const [serverOnline, setServerOnline] = useState(true);

  useEffect(() => {
    const checkServer = async () => {
      try {
        await getAllUrls();
        setServerOnline(true);
      } catch {
        setServerOnline(false);
      }
    };
    checkServer();
    const interval = setInterval(checkServer, 10000);
    return () => clearInterval(interval);
  }, []);

  return (
    <nav className="flex items-center justify-between py-4 mb-10 border-b border-white/10">
      <div className="flex items-center gap-3">
        <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-500 via-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/30">
          <Link2 size={24} className="text-white" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white leading-none">
            URL<span className="gradient-text">ify</span>
          </h1>
          <span className="text-xs text-slate-400">
            Lightning-Fast Link Shortener
          </span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:gap-4">
        <div className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider bg-indigo-500/15 text-indigo-300 border border-indigo-500/30">
          <Sparkles size={13} />
          <span>{totalCount} Links Created</span>
        </div>

        <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-wide border ${
          serverOnline
            ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
            : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
        }`}>
          <span className={`w-2 h-2 rounded-full ${
            serverOnline ? 'bg-emerald-400 shadow-[0_0_8px_#10b981]' : 'bg-rose-400'
          }`} />
          <Server size={12} />
          <span>{serverOnline ? 'Backend Online' : 'Connecting...'}</span>
        </div>
      </div>
    </nav>
  );
}
