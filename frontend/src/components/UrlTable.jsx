import React, { useState } from 'react';
import { Search, Copy, Check, QrCode, BarChart3, Trash2, ExternalLink, ArrowUpDown, Globe, Link as LinkIcon } from 'lucide-react';
import { getShortUrlHref, deleteUrl } from '../api';

export default function UrlTable({ urls, onRefresh, onOpenQr, onOpenAnalytics, showToast }) {
  const [search, setSearch] = useState('');
  const [sortBy, setSortBy] = useState('newest'); // 'newest', 'clicks'
  const [copiedId, setCopiedId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const handleCopy = (shortId) => {
    const full = getShortUrlHref(shortId);
    navigator.clipboard.writeText(full);
    setCopiedId(shortId);
    showToast('Link copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleDelete = async (shortId) => {
    if (!window.confirm(`Are you sure you want to delete short URL "${shortId}"?`)) return;
    try {
      setDeletingId(shortId);
      await deleteUrl(shortId);
      showToast('URL deleted successfully');
      onRefresh();
    } catch (err) {
      showToast(err.message || 'Failed to delete URL');
    } finally {
      setDeletingId(null);
    }
  };

  const filteredUrls = urls
    .filter(u => 
      u.shortId?.toLowerCase().includes(search.toLowerCase()) ||
      u.redirectUrl?.toLowerCase().includes(search.toLowerCase())
    )
    .sort((a, b) => {
      if (sortBy === 'clicks') {
        const clicksA = a.visitHistory ? a.visitHistory.length : 0;
        const clicksB = b.visitHistory ? b.visitHistory.length : 0;
        return clicksB - clicksA;
      }
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    });

  return (
    <div className="glass-card p-5 sm:p-7 shadow-2xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Saved Short Links ({urls.length})
          </h2>
          <span className="text-xs sm:text-sm text-slate-400">
            Manage and monitor performance of all your shortened URLs
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-full sm:w-60">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={15} />
            <input
              type="text"
              className="w-full py-2 pl-9 pr-3 bg-slate-950/80 border border-white/10 rounded-xl text-slate-100 placeholder-slate-500 text-xs sm:text-sm focus:border-indigo-500/60 focus:bg-slate-900/90 focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
              placeholder="Search links..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <button
            onClick={() => setSortBy(sortBy === 'newest' ? 'clicks' : 'newest')}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 transition-all cursor-pointer"
          >
            <ArrowUpDown size={13} />
            <span>Sort: {sortBy === 'newest' ? 'Newest' : 'Most Clicked'}</span>
          </button>
        </div>
      </div>

      {filteredUrls.length === 0 ? (
        <div className="text-center py-14 px-4 text-slate-400">
          <LinkIcon size={40} className="mx-auto opacity-30 mb-3" />
          <p className="text-base font-semibold text-slate-300">No short links found</p>
          <p className="text-xs text-slate-500 mt-1">
            {search ? 'Try clearing your search query.' : 'Use the form above to create your first short URL.'}
          </p>
        </div>
      ) : (
        <div className="overflow-x-auto -mx-5 sm:mx-0">
          <table className="w-full text-left border-collapse min-w-[620px]">
            <thead>
              <tr className="border-b border-white/10 text-slate-400 text-xs uppercase tracking-wider">
                <th className="py-3 px-4">Short Code</th>
                <th className="py-3 px-4">Original Destination</th>
                <th className="py-3 px-4">Clicks</th>
                <th className="py-3 px-4">Created</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-sm">
              {filteredUrls.map((item) => {
                const fullShortUrl = getShortUrlHref(item.shortId);
                const clickCount = item.visitHistory ? item.visitHistory.length : 0;
                const isCopied = copiedId === item.shortId;

                return (
                  <tr key={item._id || item.shortId} className="hover:bg-white/[0.02] transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-bold text-cyan-300 text-sm">
                          {item.shortId}
                        </span>
                        <button
                          onClick={() => handleCopy(item.shortId)}
                          title="Copy Link"
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
                        >
                          {isCopied ? <Check size={13} className="text-emerald-400" /> : <Copy size={13} />}
                        </button>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 max-w-[280px]">
                      <div className="flex items-center gap-2">
                        <Globe size={14} className="shrink-0 text-slate-500" />
                        <a
                          href={item.redirectUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-slate-200 hover:text-indigo-300 truncate text-xs sm:text-sm transition-colors"
                          title={item.redirectUrl}
                        >
                          {item.redirectUrl}
                        </a>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <button
                        onClick={() => onOpenAnalytics(item.shortId)}
                        className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold cursor-pointer transition-all ${
                          clickCount > 0
                            ? 'bg-emerald-500/15 text-emerald-300 hover:bg-emerald-500/25 border border-emerald-500/30'
                            : 'bg-white/5 text-slate-400 hover:bg-white/10 border border-white/10'
                        }`}
                      >
                        <BarChart3 size={13} />
                        <span>{clickCount} clicks</span>
                      </button>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap text-xs text-slate-400">
                      {item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recent'}
                    </td>

                    <td className="py-3.5 px-4 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() => onOpenQr(fullShortUrl)}
                          title="Generate QR Code"
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-cyan-400 hover:text-cyan-300 transition-colors cursor-pointer"
                        >
                          <QrCode size={15} />
                        </button>

                        <a
                          href={fullShortUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          title="Test Redirection"
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                        >
                          <ExternalLink size={15} />
                        </a>

                        <button
                          onClick={() => onOpenAnalytics(item.shortId)}
                          title="View Click Analytics"
                          className="p-2 rounded-lg bg-white/5 hover:bg-white/10 text-emerald-400 hover:text-emerald-300 transition-colors cursor-pointer"
                        >
                          <BarChart3 size={15} />
                        </button>

                        <button
                          onClick={() => handleDelete(item.shortId)}
                          disabled={deletingId === item.shortId}
                          title="Delete Short URL"
                          className="p-2 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 hover:text-rose-300 transition-colors cursor-pointer disabled:opacity-50"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
