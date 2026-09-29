import React, { useState } from 'react';
import { Copy, Check, QrCode, ExternalLink, BarChart3, Globe } from 'lucide-react';
import { getShortUrlHref } from '../api';

export default function ShortResultCard({ item, onOpenQr, onOpenAnalytics, showToast }) {
  const [copied, setCopied] = useState(false);
  const shortUrl = getShortUrlHref(item.shortId || item.id);

  const handleCopy = () => {
    navigator.clipboard.writeText(shortUrl);
    setCopied(true);
    showToast('Short URL copied to clipboard!');
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="glass-card p-5 sm:p-6 mb-10 max-w-3xl mx-auto bg-gradient-to-br from-indigo-950/40 via-slate-900/90 to-slate-900/95 border border-indigo-500/30 shadow-[0_0_30px_rgba(99,102,241,0.2)]">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase tracking-wider bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
            Latest Created Link
          </span>
          <span className="text-xs text-slate-400">ID: {item.shortId || item.id}</span>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-950/85 p-4 rounded-xl border border-white/10 mb-4">
        <div className="overflow-hidden">
          <div className="text-lg sm:text-xl font-bold text-cyan-300 break-all">
            {shortUrl}
          </div>
          <div className="flex items-center gap-1.5 text-xs sm:text-sm text-slate-400 mt-1">
            <Globe size={14} className="shrink-0 text-slate-500" />
            <span className="truncate max-w-[320px] sm:max-w-md">
              Redirects to: {item.redirectUrl || item.url}
            </span>
          </div>
        </div>

        <button
          onClick={handleCopy}
          className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 shadow-md shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-200 active:scale-95 cursor-pointer text-sm shrink-0"
        >
          {copied ? <Check size={16} className="text-emerald-300" /> : <Copy size={16} />}
          <span>{copied ? 'Copied!' : 'Copy Short Link'}</span>
        </button>
      </div>

      <div className="flex flex-wrap gap-2.5">
        <button
          onClick={() => onOpenQr(shortUrl)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-150 cursor-pointer"
        >
          <QrCode size={15} className="text-cyan-400" />
          <span>Generate QR</span>
        </button>

        <a
          href={shortUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-150 cursor-pointer"
        >
          <ExternalLink size={15} className="text-indigo-400" />
          <span>Test Short Link</span>
        </a>

        <button
          onClick={() => onOpenAnalytics(item.shortId || item.id)}
          className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-medium text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all duration-150 cursor-pointer"
        >
          <BarChart3 size={15} className="text-emerald-400" />
          <span>View Analytics</span>
        </button>
      </div>
    </div>
  );
}
