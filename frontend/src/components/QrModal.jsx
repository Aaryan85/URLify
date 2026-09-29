import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { X, Download, QrCode } from 'lucide-react';

export default function QrModal({ isOpen, onClose, shortUrl }) {
  if (!isOpen || !shortUrl) return null;

  const downloadQr = () => {
    const svg = document.getElementById('qr-svg-element');
    if (!svg) return;
    const svgData = new XMLSerializer().serializeToString(svg);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.onload = () => {
      canvas.width = img.width + 40;
      canvas.height = img.height + 40;
      ctx.fillStyle = '#ffffff';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(img, 20, 20);
      const pngFile = canvas.toDataURL('image/png');
      const downloadLink = document.createElement('a');
      downloadLink.download = 'short-url-qr.png';
      downloadLink.href = pngFile;
      downloadLink.click();
    };
    img.src = 'data:image/svg+xml;base64,' + btoa(svgData);
  };

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={onClose}>
      <div className="glass-card p-6 sm:p-8 max-w-md w-full text-center shadow-2xl bg-slate-900/95 border border-white/10" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center gap-2">
            <QrCode size={20} className="text-indigo-400" />
            <h3 className="text-xl font-bold text-white tracking-tight">QR Code</h3>
          </div>
          <button
            className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white transition-colors cursor-pointer"
            onClick={onClose}
          >
            <X size={18} />
          </button>
        </div>

        <div className="bg-white p-5 rounded-2xl inline-block shadow-xl shadow-black/20 mb-4">
          <QRCodeSVG
            id="qr-svg-element"
            value={shortUrl}
            size={200}
            bgColor="#ffffff"
            fgColor="#090d16"
            level="H"
            includeMargin={true}
          />
        </div>

        <p className="text-xs sm:text-sm text-slate-400 mb-6 break-all">
          Scan to visit: <strong className="text-cyan-300">{shortUrl}</strong>
        </p>

        <div className="flex gap-3 justify-center">
          <button
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-semibold text-white bg-gradient-to-r from-indigo-500 to-indigo-600 hover:from-indigo-400 hover:to-indigo-500 shadow-md shadow-indigo-500/30 transition-all cursor-pointer text-sm"
            onClick={downloadQr}
          >
            <Download size={16} />
            <span>Download PNG</span>
          </button>
          <button
            className="px-5 py-2.5 rounded-xl font-semibold text-slate-200 bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer text-sm"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
