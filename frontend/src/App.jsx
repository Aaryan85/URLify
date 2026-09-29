import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import ShortenerForm from './components/ShortenerForm';
import ShortResultCard from './components/ShortResultCard';
import UrlTable from './components/UrlTable';
import QrModal from './components/QrModal';
import AnalyticsModal from './components/AnalyticsModal';
import { getAllUrls } from './api';
import { CheckCircle } from 'lucide-react';

export default function App() {
  const [urls, setUrls] = useState([]);
  const [latestCreated, setLatestCreated] = useState(null);
  
  // Modals state
  const [qrModalUrl, setQrModalUrl] = useState(null);
  const [analyticsModalId, setAnalyticsModalId] = useState(null);

  // Toast state
  const [toastMessage, setToastMessage] = useState(null);

  const fetchAll = async () => {
    try {
      const data = await getAllUrls();
      if (Array.isArray(data)) {
        setUrls(data);
      }
    } catch (err) {
      console.error('Error fetching URLs:', err);
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleUrlCreated = (newResult) => {
    setLatestCreated(newResult.entry || newResult);
    fetchAll();
  };

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-20">
      <Navbar totalCount={urls.length} />

      <main className="space-y-8">
        <ShortenerForm
          onUrlCreated={handleUrlCreated}
          showToast={showToast}
        />

        {latestCreated && (
          <ShortResultCard
            item={latestCreated}
            onOpenQr={(url) => setQrModalUrl(url)}
            onOpenAnalytics={(id) => setAnalyticsModalId(id)}
            showToast={showToast}
          />
        )}

        <UrlTable
          urls={urls}
          onRefresh={fetchAll}
          onOpenQr={(url) => setQrModalUrl(url)}
          onOpenAnalytics={(id) => setAnalyticsModalId(id)}
          showToast={showToast}
        />
      </main>

      {/* Modals */}
      <QrModal
        isOpen={!!qrModalUrl}
        onClose={() => setQrModalUrl(null)}
        shortUrl={qrModalUrl}
      />

      <AnalyticsModal
        isOpen={!!analyticsModalId}
        onClose={() => setAnalyticsModalId(null)}
        shortId={analyticsModalId}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-900/95 text-slate-100 px-5 py-3 rounded-xl border border-white/15 shadow-2xl flex items-center gap-2.5 z-50 backdrop-blur-md">
          <CheckCircle size={18} className="text-emerald-400 shrink-0" />
          <span className="text-sm font-medium">{toastMessage}</span>
        </div>
      )}
    </div>
  );
}
