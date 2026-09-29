import React, { useState } from 'react';
import { Link2, ArrowRight, Loader2, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';
import { createShortUrl } from '../api';

export default function ShortenerForm({ onUrlCreated, showToast }) {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    let trimmed = url.trim();
    if (!trimmed) {
      setError('Please enter a valid URL');
      return;
    }

    if (!/^https?:\/\//i.test(trimmed)) {
      trimmed = 'https://' + trimmed;
    }

    try {
      setLoading(true);
      const res = await createShortUrl(trimmed);
      setLoading(false);
      setUrl('');
      
      confetti({
        particleCount: 60,
        spread: 70,
        origin: { y: 0.6 }
      });

      showToast('Short URL generated successfully!');
      if (onUrlCreated) {
        onUrlCreated(res);
      }
    } catch (err) {
      setLoading(false);
      setError(err.message || 'Failed to shorten URL. Make sure MongoDB & backend server are running.');
    }
  };

  return (
    <div className="text-center mb-12">
      <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/25 text-xs text-indigo-300 mb-4 font-medium">
        <Sparkles size={14} className="text-indigo-400" />
        <span>Simple, Powerful & Analytics-Driven URL Shortener</span>
      </div>

      <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight mb-4">
        Shorten Your Long URLs into <br />
        <span className="gradient-text">Memorable, Shareable Links</span>
      </h1>

      <p className="text-slate-400 text-base sm:text-lg max-w-xl mx-auto mb-8 font-normal">
        Transform cumbersome web links into concise short URLs. Track every visit with real-time click analytics & instant QR code generation.
      </p>

      <div className="glass-card p-3 sm:p-4 max-w-3xl mx-auto shadow-2xl">
        <form onSubmit={handleSubmit} className="flex flex-col gap-2">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1 min-w-[260px]">
              <Link2 className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={20} />
              <input
                type="text"
                className="w-full py-3.5 pl-11 pr-4 bg-slate-950/80 border border-white/10 rounded-xl text-slate-100 placeholder-slate-500 outline-none transition-all duration-200 focus:border-indigo-500/60 focus:bg-slate-900/90 focus:ring-4 focus:ring-indigo-500/20 text-sm sm:text-base"
                placeholder="Paste your long link here (e.g. https://mywebsite.com/long-page-path)..."
                value={url}
                onChange={(e) => {
                  setUrl(e.target.value);
                  if (error) setError('');
                }}
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 shadow-lg shadow-indigo-500/30 hover:shadow-indigo-500/50 transition-all duration-200 hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 cursor-pointer text-sm sm:text-base shrink-0"
            >
              {loading ? (
                <>
                  <Loader2 size={18} className="animate-spin" />
                  <span>Shortening...</span>
                </>
              ) : (
                <>
                  <span>Shorten URL</span>
                  <ArrowRight size={18} />
                </>
              )}
            </button>
          </div>

          {error && (
            <div className="flex items-center gap-2 text-rose-400 text-sm mt-2 px-2 text-left">
              <AlertCircle size={16} className="shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </form>
      </div>
    </div>
  );
}
