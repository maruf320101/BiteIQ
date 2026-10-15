import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { QrCode, X, ExternalLink, CheckCircle, Utensils } from 'lucide-react';

export default function QRModal({ currentTable, setTable, isOpen, onClose, onGoToMenu }) {
  if (!isOpen) return null;

  const currentUrl = typeof window !== 'undefined' ? window.location.origin : 'http://localhost:5173';
  const tableUrl = `${currentUrl}?table=${currentTable}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        <div className="inline-flex items-center justify-center p-3 mb-3 rounded-2xl bg-orange-100 text-orange-600">
          <QrCode className="w-7 h-7" />
        </div>

        <h3 className="text-xl font-bold text-slate-900 mb-1">Table #{currentTable} QR কোড</h3>
        <p className="text-xs text-slate-500 mb-5">
          রেস্টুরেন্টের টেবিলে এই কিউআর কোড থাকবে। গ্রাহক ফোন দিয়ে স্ক্যান করলেই সরাসরি এই টেবিলে মেনু সক্রিয় হবে।
        </p>

        {/* QR Code Container */}
        <div className="bg-slate-50 p-5 rounded-2xl inline-block shadow-inner mx-auto mb-4 border-2 border-slate-200">
          <QRCodeSVG
            value={tableUrl}
            size={180}
            level="H"
            includeMargin={false}
          />
        </div>

        <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 mb-5 text-left">
          <div className="flex items-center justify-between text-xs text-slate-500 mb-1">
            <span className="font-medium">Direct Table URL</span>
            <span className="text-emerald-600 flex items-center gap-1 font-bold text-[11px]">
              <CheckCircle className="w-3.5 h-3.5" /> স্ক্যান উপযোগী
            </span>
          </div>
          <code className="text-xs text-orange-700 font-mono break-all select-all font-semibold">
            {tableUrl}
          </code>
        </div>

        {/* Switch Table Selector */}
        <div className="text-left mb-6">
          <label className="text-xs text-slate-600 mb-2 block font-bold">
            অন্য টেবিল সিলেক্ট করুন:
          </label>
          <div className="grid grid-cols-6 gap-1.5">
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((num) => (
              <button
                key={num}
                onClick={() => setTable(num)}
                className={`py-1.5 text-xs font-bold rounded-lg border transition-all ${
                  currentTable === num
                    ? 'bg-orange-500 border-orange-500 text-white shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:border-orange-400'
                }`}
              >
                #{num}
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => {
              onClose();
              if (onGoToMenu) onGoToMenu();
            }}
            className="flex-1 py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-all shadow-md shadow-orange-500/25 flex items-center justify-center gap-1.5"
          >
            <Utensils className="w-4 h-4" /> সরাসরি মেনু দেখুন
          </button>
          <button
            onClick={onClose}
            className="py-3 px-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all"
          >
            বন্ধ করুন
          </button>
        </div>
      </div>
    </div>
  );
}
