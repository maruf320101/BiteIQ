import React, { useState, useEffect, useMemo } from 'react';
import { 
  X, 
  Printer, 
  ExternalLink, 
  Copy, 
  Check, 
  QrCode, 
  Table as TableIcon,
  Wifi,
  Sparkles,
  Info,
  Smartphone,
  Plus,
  Trash2,
  CheckCircle2,
  AlertCircle,
  Scissors
} from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';

export default function TableQRCodeModal({
  isOpen,
  onClose,
  totalTables = [1, 2, 3, 4, 5],
  onAddTable,
  onRemoveTable
}) {
  const [baseUrl, setBaseUrl] = useState('');
  const [copiedTable, setCopiedTable] = useState(null);
  const [selectedTable, setSelectedTable] = useState('all'); // 'all' or specific table number
  
  // Create QR state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [newTableNum, setNewTableNum] = useState('');
  const [createFeedback, setCreateFeedback] = useState({ type: '', message: '' });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const origin = window.location.origin;
      const path = window.location.pathname;
      setBaseUrl(`${origin}${path}`);
    }
  }, []);

  // Calculate next recommended table number
  const nextRecommendedTable = useMemo(() => {
    if (!totalTables || totalTables.length === 0) return 1;
    const maxNum = Math.max(...totalTables.map(Number));
    return maxNum + 1;
  }, [totalTables]);

  useEffect(() => {
    if (isCreateOpen && !newTableNum) {
      setNewTableNum(String(nextRecommendedTable));
    }
  }, [isCreateOpen, nextRecommendedTable]);

  if (!isOpen) return null;

  const getTableUrl = (tableNum) => {
    const cleanBase = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    return `${cleanBase}/?table=${tableNum}`;
  };

  const handleCopyUrl = (tableNum) => {
    const url = getTableUrl(tableNum);
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedTable(tableNum);
      setTimeout(() => setCopiedTable(null), 2000);
    }
  };

  const handleCreateSubmit = (e) => {
    e?.preventDefault();
    const num = parseInt(newTableNum, 10);
    if (isNaN(num) || num <= 0) {
      setCreateFeedback({ type: 'error', message: 'অনুগ্রহ করে একটি সঠিক টেবিল নম্বর দিন (যেমন: ১, ২, ৩...)' });
      return;
    }
    if (totalTables.includes(num)) {
      setCreateFeedback({ type: 'error', message: `টেবিল ${num} এর কিউআর ইতিমধ্যে তৈরি করা রয়েছে!` });
      return;
    }

    if (onAddTable) {
      const ok = onAddTable(num);
      if (ok !== false) {
        setCreateFeedback({ type: 'success', message: `🎉 টেবিল ${num} এর কিউআর সফলভাবে তৈরি করা হয়েছে!` });
        setSelectedTable(String(num));
        setTimeout(() => {
          setIsCreateOpen(false);
          setCreateFeedback({ type: '', message: '' });
        }, 1200);
      }
    }
  };

  const handleDeleteTable = (tableNum) => {
    if (totalTables.length <= 1) {
      alert('কমপক্ষে একটি টেবিল থাকতে হবে!');
      return;
    }
    if (window.confirm(`আপনি কি নিশ্চিত যে টেবিল ${tableNum} এর কিউআর ডিলিট করতে চান?`)) {
      if (onRemoveTable) {
        onRemoveTable(tableNum);
      }
      if (selectedTable === String(tableNum)) {
        setSelectedTable('all');
      }
    }
  };

  const tablesToRender = selectedTable === 'all' 
    ? totalTables 
    : totalTables.filter((t) => t === Number(selectedTable));

  // Chunk tables in pairs of 2 so that each printed A4 sheet has EXACTLY 2 tables side-by-side
  const tablePairs = [];
  for (let i = 0; i < tablesToRender.length; i += 2) {
    tablePairs.push(tablesToRender.slice(i, i + 2));
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn overflow-y-auto print:p-0 print:bg-white print:overflow-visible">
      {/* Print stylesheet for A4 printable table stands (EXACTLY 2 tables per A4 sheet) */}
      <style>{`
        @media print {
          @page {
            size: A4 portrait;
            margin: 8mm 8mm 8mm 8mm;
          }
          html, body {
            margin: 0 !important;
            padding: 0 !important;
            background: #ffffff !important;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          body * {
            visibility: hidden !important;
          }
          #printable-qr-stands, #printable-qr-stands * {
            visibility: visible !important;
          }
          #printable-qr-stands {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            background: white !important;
            box-shadow: none !important;
            border: none !important;
          }
          .no-print {
            display: none !important;
          }
          .print-page-pair {
            page-break-after: always !important;
            break-after: page !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            display: flex !important;
            flex-direction: row !important;
            justify-content: center !important;
            align-items: center !important;
            gap: 12mm !important;
            width: 100% !important;
            height: 275mm !important;
            max-height: 275mm !important;
            box-sizing: border-box !important;
            padding: 2mm 0 !important;
          }
          .print-page-pair:last-child {
            page-break-after: auto !important;
            break-after: auto !important;
          }
          .qr-stand-card {
            width: 90mm !important;
            max-width: 90mm !important;
            height: 258mm !important;
            max-height: 258mm !important;
            display: flex !important;
            flex-direction: column !important;
            justify-content: space-between !important;
            border: 2px dashed #94a3b8 !important;
            border-radius: 16px !important;
            box-shadow: none !important;
            background: white !important;
            page-break-inside: avoid !important;
            break-inside: avoid !important;
            overflow: hidden !important;
            box-sizing: border-box !important;
          }
          .qr-cut-guide {
            display: block !important;
          }
        }
      `}</style>

      <div 
        id="printable-qr-stands"
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden my-auto print:max-h-none print:shadow-none print:border-none print:rounded-none"
      >
        
        {/* Header (Hidden in Print) */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-5 sm:p-6 shrink-0 relative overflow-hidden border-b border-orange-500 shadow-md no-print">
          <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
                <QrCode className="w-6 h-6 text-amber-200" />
                <span>টেবিল কিউআর কোড জেনারেটর (Table QR Stands)</span>
              </h2>
              <p className="text-xs text-orange-100/90 max-w-2xl leading-relaxed">
                প্রতিটি টেবিলের জন্য আলাদা কিউআর কোড। কাস্টমার ক্যামেরা দিয়ে স্ক্যান করলেই স্বয়ংক্রিয়ভাবে সেই টেবিল সিলেক্ট হবে।
              </p>
            </div>

            {/* Header Action Buttons */}
            <div className="flex items-center gap-2.5 shrink-0">
              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-black text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer"
                title="নতুন কোনো টেবিল কিনলে নতুন কিউআর তৈরি করুন"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Create QR (নতুন কিউআর)</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-white text-orange-800 hover:bg-orange-50 font-black text-xs shadow-md transition-all active:scale-95 flex items-center gap-2 cursor-pointer"
                title="সকল কিউআর কোড প্রিন্ট করুন"
              >
                <Printer className="w-4 h-4 text-orange-600 stroke-[2.5]" />
                <span>প্রিন্ট করুন</span>
              </button>

              <button
                type="button"
                onClick={onClose}
                className="p-2 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all cursor-pointer"
                title="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* CREATE NEW QR MODAL / FORM PANEL (Hidden in Print) */}
        {isCreateOpen && (
          <div className="p-4 bg-gradient-to-r from-amber-50 to-orange-50 border-b border-amber-200 animate-fadeIn no-print">
            <div className="max-w-2xl mx-auto bg-white p-4 sm:p-5 rounded-2xl border border-amber-300 shadow-md space-y-3">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-orange-100 text-orange-700 flex items-center justify-center">
                    <Plus className="w-5 h-5 stroke-[2.5]" />
                  </div>
                  <div>
                    <h3 className="text-sm font-black text-slate-900">
                      নতুন টেবিল কিউআর কোড তৈরি করুন (Create Table QR)
                    </h3>
                    <p className="text-[11px] text-slate-500">
                      নতুন টেবিল কিনলে এখানে টেবিল নম্বর দিয়ে মুহূর্তের মধ্যে কিউআর তৈরি ও প্রিন্ট করুন।
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreateOpen(false);
                    setCreateFeedback({ type: '', message: '' });
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {createFeedback.message && (
                <div className={`p-2.5 rounded-xl text-xs flex items-center gap-2 ${
                  createFeedback.type === 'error'
                    ? 'bg-red-50 text-red-700 border border-red-200'
                    : 'bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold'
                }`}>
                  {createFeedback.type === 'error' ? (
                    <AlertCircle className="w-4 h-4 shrink-0" />
                  ) : (
                    <CheckCircle2 className="w-4 h-4 shrink-0" />
                  )}
                  <span>{createFeedback.message}</span>
                </div>
              )}

              <form onSubmit={handleCreateSubmit} className="space-y-3">
                <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                  <div className="flex-1 space-y-1">
                    <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                      <TableIcon className="w-3.5 h-3.5 text-orange-600" />
                      <span>টেবিল নম্বর (Table Number):</span>
                    </label>
                    <input
                      type="number"
                      min="1"
                      max="99"
                      value={newTableNum}
                      onChange={(e) => setNewTableNum(e.target.value)}
                      placeholder={`যেমন: ${nextRecommendedTable}`}
                      className="w-full text-sm font-extrabold px-3.5 py-2 rounded-xl border border-slate-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200"
                      required
                    />
                  </div>

                  <div className="sm:self-end flex items-center gap-2">
                    <button
                      type="submit"
                      className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black text-xs shadow-md transition-all active:scale-95 flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                    >
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>কিউআর তৈরি ও যোগ করুন</span>
                    </button>
                  </div>
                </div>

                {/* Quick Suggestion Chips */}
                <div className="flex items-center gap-2 flex-wrap pt-1 text-[11px] text-slate-500">
                  <span className="font-bold">দ্রুত যোগ করুন:</span>
                  {[nextRecommendedTable, nextRecommendedTable + 1, nextRecommendedTable + 2].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setNewTableNum(String(num))}
                      className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-orange-100 hover:text-orange-800 text-slate-700 font-bold transition-all cursor-pointer border border-slate-200"
                    >
                      + Table {num}
                    </button>
                  ))}
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Toolbar: Live Base URL & Filter Option (Hidden in Print) */}
        <div className="p-4 bg-slate-50 border-b border-slate-200 space-y-3 shrink-0 no-print text-xs">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
            
            {/* Filter by Table */}
            <div className="flex items-center gap-1.5 bg-white p-1 rounded-xl border border-slate-200 shadow-2xs overflow-x-auto max-w-full">
              <button
                type="button"
                onClick={() => setSelectedTable('all')}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                  selectedTable === 'all'
                    ? 'bg-orange-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                সকল টেবিল ({totalTables.length})
              </button>
              {totalTables.map((tbl) => (
                <button
                  key={tbl}
                  type="button"
                  onClick={() => setSelectedTable(String(tbl))}
                  className={`px-2.5 py-1.5 rounded-lg font-bold transition-all whitespace-nowrap cursor-pointer ${
                    selectedTable === String(tbl)
                      ? 'bg-orange-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  Table {tbl}
                </button>
              ))}

              <button
                type="button"
                onClick={() => setIsCreateOpen(true)}
                className="px-2.5 py-1.5 rounded-lg font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 transition-all whitespace-nowrap cursor-pointer flex items-center gap-1"
                title="নতুন টেবিল কিউআর তৈরি করুন"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create QR</span>
              </button>
            </div>

            {/* Base URL Settings for Real Phone Scanning */}
            <div className="flex items-center gap-2 flex-1 max-w-md">
              <span className="text-slate-500 font-bold whitespace-nowrap flex items-center gap-1">
                <Smartphone className="w-3.5 h-3.5 text-orange-600" />
                <span>ওয়েব এড্রেস:</span>
              </span>
              <input
                type="text"
                value={baseUrl}
                onChange={(e) => setBaseUrl(e.target.value)}
                placeholder="http://localhost:5173"
                className="w-full text-xs font-mono px-3 py-1.5 rounded-xl border border-slate-300 bg-white focus:outline-none focus:border-orange-500"
                title="রিয়েল ফোনে টেস্ট করতে আপনার ওয়াইফাই আইপি (যেমন: http://192.168.0.105:5173) দিতে পারেন"
              />
            </div>
          </div>
        </div>

        {/* Printable QR Stand Cards Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-100/70 print:p-0 print:bg-white print:overflow-visible">
          
          {/* Pairs container for exact 2 tables per printed sheet */}
          <div className="space-y-6 print:space-y-0">
            {tablePairs.map((pair, pIdx) => (
              <div 
                key={pIdx}
                className="print-page-pair grid grid-cols-1 md:grid-cols-2 gap-6 print:grid-cols-2"
              >
                {pair.map((tableNum) => {
                  const tableUrl = getTableUrl(tableNum);
                  const isCopied = copiedTable === tableNum;
                  const isCustomTable = tableNum > 5;

                  return (
                    <div
                      key={tableNum}
                      className="qr-stand-card bg-white rounded-3xl border-2 border-slate-200 overflow-hidden shadow-md hover:shadow-xl transition-all flex flex-col justify-between"
                    >
                      {/* Card Top Banner */}
                      <div className="bg-gradient-to-r from-orange-500 to-amber-500 p-4 text-white text-center relative overflow-hidden shrink-0">
                        <div className="flex items-center justify-between text-[11px] font-black uppercase tracking-wider mb-1">
                          <span>BiteIQ Smart Dining</span>
                          <span className="bg-black/20 px-2 py-0.5 rounded-full border border-white/20">
                            Scan & Order
                          </span>
                        </div>

                        <div className="text-2xl font-black tracking-tight mt-1 flex items-center justify-center gap-2">
                          <TableIcon className="w-6 h-6 text-white" />
                          <span>TABLE {tableNum < 10 ? `0${tableNum}` : tableNum}</span>
                        </div>
                        <p className="text-[11px] text-orange-100 font-medium">ডাইনিং টেবিল {tableNum}</p>
                      </div>

                      {/* QR Code Graphic Area */}
                      <div className="p-5 sm:p-6 flex-1 flex flex-col items-center justify-center text-center space-y-3 bg-white">
                        <div className="p-3 bg-white rounded-2xl border-2 border-orange-200 shadow-sm relative group shrink-0">
                          <QRCodeSVG
                            value={tableUrl}
                            size={165}
                            level="H"
                            includeMargin={true}
                          />
                          <div className="absolute inset-0 bg-white/90 backdrop-blur-2xs opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-1 rounded-2xl no-print">
                            <span className="text-[11px] font-black text-slate-800">টেবিল {tableNum} এর লিঙ্ক</span>
                            <a
                              href={tableUrl}
                              target="_blank"
                              rel="noreferrer"
                              className="px-3 py-1 rounded-lg bg-orange-600 text-white font-bold text-[10px] flex items-center gap-1 hover:bg-orange-700"
                            >
                              <ExternalLink className="w-3 h-3" />
                              <span>ওপেন করুন</span>
                            </a>
                          </div>
                        </div>

                        <div className="space-y-1">
                          <h4 className="text-xs font-black text-slate-900 flex items-center justify-center gap-1">
                            <span>📱 ক্যামেরা দিয়ে স্ক্যান করুন</span>
                          </h4>
                          <p className="text-[10px] text-slate-500 max-w-[210px] leading-tight">
                            কোনো অ্যাপ লাগবে না। সাধারণ ক্যামেরা দিয়ে স্ক্যান করলেই স্বয়ংক্রিয়ভাবে টেবিল {tableNum}-এর মেনু ওপেন হবে।
                          </p>
                        </div>

                        {/* Restaurant WiFi & Help Info Strip */}
                        <div className="w-full pt-2.5 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-400 font-medium shrink-0">
                          <span className="flex items-center gap-1">
                            <Wifi className="w-3 h-3 text-orange-500" />
                            <span>BiteIQ-Guest</span>
                          </span>
                          <span>Zero Waiter Hassle</span>
                        </div>
                      </div>

                      {/* Cutting Guide for Acrylic Stand (Visible in print) */}
                      <div className="qr-cut-guide hidden bg-slate-50 py-1.5 px-3 text-center border-t border-dashed border-slate-300 text-[9px] text-slate-400 font-medium">
                        ✂️ বর্ডার ধরে কেটে এক্রিলিক টেবিল স্ট্যান্ডে রাখুন
                      </div>

                      {/* Actions for Manager (Hidden in Print) */}
                      <div className="p-3 bg-slate-50 border-t border-slate-100 flex items-center justify-between gap-2 text-xs no-print shrink-0">
                        <button
                          type="button"
                          onClick={() => handleCopyUrl(tableNum)}
                          className="flex-1 py-1.5 px-2 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 font-bold flex items-center justify-center gap-1 transition-all cursor-pointer text-[11px]"
                          title="লিঙ্ক কপি করুন"
                        >
                          {isCopied ? (
                            <>
                              <Check className="w-3.5 h-3.5 text-emerald-600" />
                              <span className="text-emerald-700">কপি হয়েছে!</span>
                            </>
                          ) : (
                            <>
                              <Copy className="w-3.5 h-3.5 text-slate-500" />
                              <span>লিঙ্ক কপি</span>
                            </>
                          )}
                        </button>

                        <a
                          href={tableUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="flex-1 py-1.5 px-2 rounded-xl bg-orange-50 hover:bg-orange-100 border border-orange-200 text-orange-700 font-bold flex items-center justify-center gap-1 transition-all text-[11px]"
                          title="এই টেবিলটি সরাসরি ব্রাউজারে টেস্ট করুন"
                        >
                          <ExternalLink className="w-3.5 h-3.5 text-orange-600" />
                          <span>টেস্ট করুন ↗</span>
                        </a>

                        {isCustomTable && (
                          <button
                            type="button"
                            onClick={() => handleDeleteTable(tableNum)}
                            className="p-1.5 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-all cursor-pointer"
                            title="এই টেবিল কিউআর মুছে ফেলুন"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>

        {/* Modal Footer (Hidden in Print) */}
        <div className="p-4 bg-white border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3 shrink-0 no-print">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span>প্রতিটি কিউআর কোডে নির্দিষ্ট টেবিলের লিঙ্ক স্বয়ংক্রিয়ভাবে সেট করা আছে।</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setIsCreateOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-300 font-extrabold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Plus className="w-4 h-4 text-amber-700" />
              <span>Create QR</span>
            </button>

            <button
              type="button"
              onClick={() => window.print()}
              className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-orange-600 hover:bg-orange-700 text-white font-extrabold text-xs transition-all active:scale-95 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
            >
              <Printer className="w-4 h-4" />
              <span>প্রিন্ট করুন</span>
            </button>

            <button
              type="button"
              onClick={onClose}
              className="flex-1 sm:flex-initial px-5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-extrabold text-xs transition-all active:scale-95 cursor-pointer"
            >
              বন্ধ করুন
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
