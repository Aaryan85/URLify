import React, { useState, useEffect } from 'react';
import { X, BarChart3, MousePointerClick, Calendar, Clock, Loader2 } from 'lucide-react';
import { getUrlAnalytics } from '../api';

export default function AnalyticsModal({ isOpen, onClose, shortId }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen && shortId) {
      const fetchAnalytics = async () => {
        try {
          setLoading(true);
          setError('');
          const res = await getUrlAnalytics(shortId);
          setData(res);
        } catch (err) {
          setError(err.message || 'Failed to load analytics');
        } finally {
          setLoading(false);
        }
      };
      fetchAnalytics();
    }
  }, [isOpen, shortId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="glass-card p-6 sm:p-8 max-w-xl w-full shadow-2xl bg-slate-900/95 border border-white/10 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center">
              <BarChart3 size={18} className="text-emerald-400" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white tracking-tight">
                Link Analytics
              </h3>
              <span className="text-xs text-slate-400">ID: {shortId}</span>
            </div>
          </div>

          <button
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12 text-slate-400">
            <Loader2 size={32} className="animate-spin mx-auto mb-2 text-indigo-400" />
            <p className="text-sm">Fetching click stats...</p>
          </div>
        ) : error ? (
          <div className="p-4 bg-rose-500/10 border border-rose-500/30 rounded-xl text-rose-400 text-sm">
            {error}
          </div>
        ) : data ? (
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="bg-slate-950/80 p-4 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <MousePointerClick size={15} className="text-indigo-400" />
                  <span>Total Clicks</span>
                </div>
                <div className="text-3xl font-extrabold text-cyan-300">
                  {data.totalClicks}
                </div>
              </div>

              <div className="bg-slate-950/80 p-4 rounded-xl border border-white/10">
                <div className="flex items-center gap-2 text-slate-400 text-xs mb-1">
                  <Calendar size={15} className="text-emerald-400" />
                  <span>Created At</span>
                </div>
                <div className="text-base font-semibold text-slate-200 mt-1">
                  {data.createdAt ? new Date(data.createdAt).toLocaleDateString() : 'N/A'}
                </div>
              </div>
            </div>

            <div className="bg-slate-950/80 p-3.5 rounded-xl border border-white/10 text-xs">
              <span className="text-slate-400">Redirect target: </span>
              <a
                href={data.redirectUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-indigo-400 hover:text-indigo-300 break-all font-medium"
              >
                {data.redirectUrl}
              </a>
            </div>

            <div>
              <h4 className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2 flex items-center gap-1.5">
                <Clock size={14} />
                <span>Click History Log ({data.analytics?.length || 0})</span>
              </h4>

              <div className="max-h-56 overflow-y-auto bg-slate-950/60 rounded-xl border border-white/10 p-2">
                {data.analytics && data.analytics.length > 0 ? (
                  <div className="space-y-1.5">
                    {data.analytics.map((click, index) => {
                      const ts = click.timestamp || click.timestamps;
                      return (
                        <div
                          key={index}
                          className="flex justify-between items-center py-2 px-3 rounded-lg bg-white/[0.03] text-xs"
                        >
                          <span className="text-slate-500 font-medium">Visit #{data.analytics.length - index}</span>
                          <span className="text-cyan-300 font-mono">
                            {ts ? new Date(Number(ts)).toLocaleString() : 'Just now'}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                ) : (
                  <div className="text-center py-6 text-slate-500 text-xs">
                    No clicks recorded yet. Share your short link to start tracking visits!
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
