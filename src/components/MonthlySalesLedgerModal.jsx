import React, { useState, useMemo } from 'react';
import { 
  X, 
  Printer, 
  Search, 
  TrendingUp, 
  Coins, 
  Calendar, 
  CheckCircle, 
  CreditCard, 
  Smartphone, 
  Sparkles,
  Table as TableIcon,
  FileSpreadsheet,
  Check,
  RotateCcw
} from 'lucide-react';

export default function MonthlySalesLedgerModal({
  isOpen,
  onClose,
  todayPaidRevenue = 0,
  todayPaidBillsCount = 0
}) {
  const [filterType, setFilterType] = useState('all'); // 'all' | 'weekends' | 'weekdays'
  const [activePreset, setActivePreset] = useState('all'); // 'all' | 'today' | '7days' | '15days' | 'weekends' | 'weekdays' | 'custom'
  const [searchQuery, setSearchQuery] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [excelSuccess, setExcelSuccess] = useState(false);

  // Helper to format Date into YYYY-MM-DD
  const formatDateISO = (d) => {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  // Generate realistic 30-day sales ledger data with table booking counts and raw ISO dates
  const ledgerData = useMemo(() => {
    const days = [];
    const banglaDays = ['রবিবার', 'সোমবার', 'মঙ্গলবার', 'বুধবার', 'বৃহস্পতিবার', 'শুক্রবার', 'শনিবার'];
    const baseDate = new Date();

    // Today (Day 0 - Live dynamic)
    const todayRevenue = todayPaidRevenue > 0 ? todayPaidRevenue : 3850;
    const todayBookings = todayPaidBillsCount > 0 ? todayPaidBillsCount : 27;

    days.push({
      id: 'day-0',
      date: baseDate.toLocaleDateString('en-GB'),
      rawDate: formatDateISO(baseDate),
      dayName: banglaDays[baseDate.getDay()],
      isToday: true,
      dayOfWeek: baseDate.getDay(),
      totalBookings: todayBookings,
      tablesCount: 5,
      cashSales: Math.round(todayRevenue * 0.45),
      cardSales: Math.round(todayRevenue * 0.25),
      mfsSales: Math.round(todayRevenue * 0.30),
      discountGiven: Math.round(todayRevenue * 0.08),
      netCollected: todayRevenue,
      status: 'চলমান লাইভ (Active)'
    });

    // Previous 29 days
    for (let i = 1; i <= 29; i++) {
      const d = new Date(baseDate);
      d.setDate(d.getDate() - i);
      const dayOfWeek = d.getDay();
      const isWeekend = dayOfWeek === 5 || dayOfWeek === 6; // Friday / Saturday in Bangladesh

      // Weekend sales: 34,000 - 52,000 Tk, Weekday sales: 18,000 - 29,000 Tk
      const baseAmount = isWeekend ? 39500 : 22500;
      const variation = Math.round(Math.sin(i * 1.7) * 6500 + ((i * 7) % 11) * 600);
      const netCollected = Math.max(17200, baseAmount + variation);
      
      const totalBookings = isWeekend 
        ? Math.round(31 + ((i * 3) % 6)) 
        : Math.round(23 + ((i * 2) % 5));

      const discountGiven = Math.floor(netCollected * 0.06);
      const cashSales = Math.round(netCollected * 0.42);
      const cardSales = Math.round(netCollected * 0.28);
      const mfsSales = netCollected - cashSales - cardSales;

      days.push({
        id: `day-${i}`,
        date: d.toLocaleDateString('en-GB'),
        rawDate: formatDateISO(d),
        dayName: banglaDays[dayOfWeek],
        isToday: false,
        dayOfWeek,
        totalBookings,
        tablesCount: 5,
        cashSales,
        cardSales,
        mfsSales,
        discountGiven,
        netCollected,
        status: 'ক্লোজড ও অডিটকৃত ✓'
      });
    }

    return days;
  }, [todayPaidRevenue, todayPaidBillsCount]);

  // Filtered days based on Date Range (startDate & endDate), filter tabs, & search
  const filteredDays = useMemo(() => {
    return ledgerData.filter((item) => {
      // Date range filtering (Start Date to End Date)
      if (startDate && item.rawDate < startDate) return false;
      if (endDate && item.rawDate > endDate) return false;

      // Filter type (Weekends vs Weekdays)
      if (filterType === 'weekends' && item.dayOfWeek !== 5 && item.dayOfWeek !== 6) return false;
      if (filterType === 'weekdays' && (item.dayOfWeek === 5 || item.dayOfWeek === 6)) return false;

      // Search query
      if (!searchQuery.trim()) return true;
      const q = searchQuery.toLowerCase();
      return (
        item.date.includes(q) ||
        item.dayName.toLowerCase().includes(q) ||
        item.status.toLowerCase().includes(q)
      );
    });
  }, [ledgerData, filterType, searchQuery, startDate, endDate]);

  // Dynamic Aggregate statistics reflecting the exact filtered date range
  const stats = useMemo(() => {
    const list = filteredDays;
    const totalCollected = list.reduce((acc, d) => acc + d.netCollected, 0);
    const totalBookings = list.reduce((acc, d) => acc + d.totalBookings, 0);
    const totalCash = list.reduce((acc, d) => acc + d.cashSales, 0);
    const totalMfs = list.reduce((acc, d) => acc + d.mfsSales, 0);
    const totalCard = list.reduce((acc, d) => acc + d.cardSales, 0);
    const totalDiscounts = list.reduce((acc, d) => acc + d.discountGiven, 0);
    const avgDaily = list.length > 0 ? Math.round(totalCollected / list.length) : 0;
    const peakDay = list.length > 0 
      ? [...list].sort((a, b) => b.netCollected - a.netCollected)[0]
      : { netCollected: 0, dayName: '-', date: '-' };

    return {
      totalCollected,
      totalBookings,
      totalCash,
      totalMfs,
      totalCard,
      totalDiscounts,
      avgDaily,
      peakDay,
      daysCount: list.length
    };
  }, [filteredDays]);

  // Quick Preset Handlers
  const handleQuickPreset = (preset) => {
    setActivePreset(preset);
    const today = new Date();
    if (preset === 'all') {
      setStartDate('');
      setEndDate('');
      setFilterType('all');
    } else if (preset === 'today') {
      const todayISO = formatDateISO(today);
      setStartDate(todayISO);
      setEndDate(todayISO);
      setFilterType('all');
    } else if (preset === '7days') {
      const past7 = new Date();
      past7.setDate(today.getDate() - 6);
      setStartDate(formatDateISO(past7));
      setEndDate(formatDateISO(today));
      setFilterType('all');
    } else if (preset === '15days') {
      const past15 = new Date();
      past15.setDate(today.getDate() - 14);
      setStartDate(formatDateISO(past15));
      setEndDate(formatDateISO(today));
      setFilterType('all');
    } else if (preset === 'weekends') {
      setFilterType('weekends');
      setStartDate('');
      setEndDate('');
    } else if (preset === 'weekdays') {
      setFilterType('weekdays');
      setStartDate('');
      setEndDate('');
    }
  };

  // EXCEL EXPORT HANDLER (.xls file with UTF-8 BOM for Microsoft Excel)
  const handleExportExcel = () => {
    const formattedDate = new Date().toISOString().slice(0, 10);
    const dateRangeInfo = (startDate || endDate) 
      ? `তারিখ পরিসীমা: ${startDate || 'প্রথম থেকে'} হতে ${endDate || 'বর্তমান'} (${filteredDays.length} দিন)`
      : `সর্বমোট ৩০ দিনের পূর্ণাঙ্গ রিপোর্ট`;

    const tableHTML = `
      <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
      <head>
        <meta http-equiv="content-type" content="application/vnd.ms-excel; charset=UTF-8">
        <style>
          body { font-family: 'Segoe UI', Arial, sans-serif; }
          .title { font-size: 16pt; font-weight: bold; color: #881337; margin-bottom: 6px; }
          .subtitle { font-size: 10pt; color: #475569; margin-bottom: 14px; }
          th { background-color: #0f172a; color: #ffffff; font-weight: bold; border: 1px solid #94a3b8; text-align: center; padding: 7px; font-size: 10pt; }
          td { border: 1px solid #cbd5e1; text-align: center; padding: 6px; font-size: 10pt; }
          .num { text-align: right; }
          .txt { text-align: left; }
          .today { background-color: #ecfdf5; font-weight: bold; }
          .weekend { background-color: #fefce8; }
          .tfoot { background-color: #0f172a; color: #ffffff; font-weight: bold; }
        </style>
      </head>
      <body>
        <div class="title">BiteIQ রেস্টুরেন্ট - বিক্রয় ও টেবিল রেজিস্টার (${dateRangeInfo})</div>
        <div class="subtitle">রিপোর্ট তৈরির সময়: ${new Date().toLocaleString('bn-BD')} | মোট বিক্রি: ৳${stats.totalCollected.toLocaleString()} | মোট টেবিল বুকিং: ${stats.totalBookings} বার</div>
        <table border="1">
          <thead>
            <tr>
              <th>নং</th>
              <th>তারিখ</th>
              <th>বার</th>
              <th>টেবিল বুকিং</th>
              <th>ক্যাশ (Cash ৳)</th>
              <th>মোবাইল ব্যাংকিং (৳)</th>
              <th>কার্ড (POS ৳)</th>
              <th>ছাড় (Discount ৳)</th>
              <th>মোট বিক্রি (Net ৳)</th>
              <th>স্ট্যাটাস</th>
            </tr>
          </thead>
          <tbody>
            ${filteredDays.map((row, idx) => `
              <tr class="${row.isToday ? 'today' : (row.dayOfWeek === 5 || row.dayOfWeek === 6 ? 'weekend' : '')}">
                <td>${idx + 1}</td>
                <td class="txt">${row.date}</td>
                <td class="txt">${row.isToday ? 'আজকের লাইভ' : row.dayName}</td>
                <td>${row.totalBookings} বার (৫টি টেবিলে)</td>
                <td class="num">${row.cashSales}</td>
                <td class="num">${row.mfsSales}</td>
                <td class="num">${row.cardSales}</td>
                <td class="num">-${row.discountGiven}</td>
                <td class="num"><strong>${row.netCollected}</strong></td>
                <td>${row.status}</td>
              </tr>
            `).join('')}
          </tbody>
          <tfoot>
            <tr class="tfoot">
              <td colspan="3" style="text-align: right;">মোট যোগফল:</td>
              <td>${filteredDays.reduce((a, b) => a + b.totalBookings, 0)} বার</td>
              <td class="num">${filteredDays.reduce((a, b) => a + b.cashSales, 0)}</td>
              <td class="num">${filteredDays.reduce((a, b) => a + b.mfsSales, 0)}</td>
              <td class="num">${filteredDays.reduce((a, b) => a + b.cardSales, 0)}</td>
              <td class="num">-${filteredDays.reduce((a, b) => a + b.discountGiven, 0)}</td>
              <td class="num" style="color: #4ade80;"><strong>${filteredDays.reduce((a, b) => a + b.netCollected, 0)}</strong></td>
              <td>${filteredDays.length} দিন</td>
            </tr>
          </tfoot>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob(['\ufeff', tableHTML], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `BiteIQ_Sales_Ledger_${formattedDate}.xls`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExcelSuccess(true);
    setTimeout(() => setExcelSuccess(false), 3500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/70 backdrop-blur-xs animate-fadeIn overflow-y-auto print:p-0 print:bg-white print:overflow-visible">
      {/* Printable CSS Rules for Clean A4 Output */}
      <style>{`
        @media print {
          body * {
            visibility: hidden;
          }
          #printable-sales-ledger, #printable-sales-ledger * {
            visibility: visible;
          }
          #printable-sales-ledger {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 0 !important;
            max-height: none !important;
            overflow: visible !important;
            border: none !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            background: white !important;
            color: #0f172a !important;
          }
          .no-print {
            display: none !important;
          }
          .print-header-banner {
            background: #881337 !important;
            color: #ffffff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-table {
            width: 100% !important;
            border-collapse: collapse !important;
          }
          .print-table th, .print-table td {
            border: 1px solid #94a3b8 !important;
            color: #0f172a !important;
            padding: 6px 8px !important;
            font-size: 11px !important;
          }
          .print-table thead tr {
            background-color: #0f172a !important;
            color: #ffffff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
          .print-table tfoot tr {
            background-color: #1e293b !important;
            color: #ffffff !important;
            -webkit-print-color-adjust: exact;
            print-color-adjust: exact;
          }
        }
      `}</style>

      <div 
        id="printable-sales-ledger"
        className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-6xl xl:max-w-7xl w-full h-[90vh] max-h-[92vh] flex flex-col overflow-hidden my-auto print:h-auto print:max-h-none print:shadow-none print:border-none print:rounded-none"
      >
        
        {/* EXCEL SUCCESS TOAST */}
        {excelSuccess && (
          <div className="no-print bg-emerald-800 text-white px-5 py-2 flex items-center justify-between text-xs animate-fadeIn border-b border-emerald-700">
            <div className="flex items-center gap-2">
              <Check className="w-4 h-4 text-emerald-200 shrink-0" />
              <span>
                <strong>সফলভাবে ডাউনলোড হয়েছে!</strong> আপনার ডিভাইসে <strong>BiteIQ_Sales_Ledger.xls</strong> ফাইলটি সেভ হয়েছে (Microsoft Excel / Google Sheets এ ওপেন করুন)।
              </span>
            </div>
            <button 
              onClick={() => setExcelSuccess(false)} 
              className="p-1 hover:bg-white/20 rounded-md text-white/80 hover:text-white cursor-pointer"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )}

        {/* TRADITIONAL BENGALI LEDGER BANNER (হিসাব খাতা হেডার) */}
        <div className="print-header-banner bg-gradient-to-r from-red-800 via-rose-900 to-red-950 text-white p-5 sm:p-6 shrink-0 relative overflow-hidden border-b-4 border-amber-500 shadow-md">
          {/* Subtle decorative glow */}
          <div className="absolute -top-10 -right-10 w-48 h-48 bg-amber-500/20 rounded-full blur-2xl pointer-events-none no-print" />
          <div className="absolute -bottom-10 -left-10 w-48 h-48 bg-red-600/30 rounded-full blur-2xl pointer-events-none no-print" />

          <div className="relative flex items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-black text-emerald-300 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-400/30">
                  {stats.daysCount} দিনের বিক্রয় ও টেবিল রেজিস্টার
                </span>
                {(startDate || endDate) && (
                  <span className="text-[11px] font-bold text-amber-300 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-400/30">
                    ফিল্টারকৃত রেঞ্জ সক্রিয়
                  </span>
                )}
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight flex items-center gap-2.5">
                <span>📖 BiteIQ (Monthly Sales Ledger)</span>
              </h2>
            </div>

            {/* Header Actions - Close Button */}
            <div className="flex items-center gap-2 shrink-0 no-print">
              <button
                type="button"
                onClick={onClose}
                className="p-2.5 rounded-xl bg-white/15 hover:bg-white/25 text-white transition-all cursor-pointer"
                title="বন্ধ করুন"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* 4 SUMMARY METRICS CARDS (Dynamic based on filtered date range) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 p-4 sm:p-6 bg-slate-50 border-b border-slate-200 shrink-0">
          {/* 1. Total Revenue in Date Range */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
              <Coins className="w-3.5 h-3.5 text-emerald-600" /> মোট {stats.daysCount} দিনের বিক্রি
            </span>
            <div className="text-lg sm:text-xl font-black text-emerald-700 font-mono">
              ৳{stats.totalCollected.toLocaleString()}
            </div>
            <p className="text-[10px] text-slate-400">ফিল্টারকৃত মোট আদায়কৃত রাজস্ব</p>
          </div>

          {/* 2. Daily Average */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5 text-indigo-600" /> গড় দৈনিক বিক্রি
            </span>
            <div className="text-lg sm:text-xl font-black text-indigo-700 font-mono">
              ৳{stats.avgDaily.toLocaleString()}
            </div>
            <p className="text-[10px] text-slate-400">প্রতিদিনের গড় কালেকশন</p>
          </div>

          {/* 3. Total Table Bookings on 5 Tables */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
              <TableIcon className="w-3.5 h-3.5 text-amber-600" /> মোট টেবিল বুকিং
            </span>
            <div className="text-lg sm:text-xl font-black text-slate-900 font-mono">
              {stats.totalBookings.toLocaleString()} বার
            </div>
            <p className="text-[10px] text-slate-400">৫টি টেবিলে সর্বমোট সিটিং</p>
          </div>

          {/* 4. Peak Day */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-xs space-y-1">
            <span className="text-[11px] font-bold text-slate-500 flex items-center gap-1">
              <Sparkles className="w-3.5 h-3.5 text-rose-600" /> সর্বোচ্চ বিক্রির দিন
            </span>
            <div className="text-sm sm:text-base font-black text-rose-600 font-mono truncate">
              ৳{stats.peakDay.netCollected.toLocaleString()}
            </div>
            <p className="text-[10px] text-slate-500 truncate">
              {stats.peakDay.dayName} ({stats.peakDay.date})
            </p>
          </div>
        </div>

        {/* PAYMENT METHOD BREAKDOWN STRIP */}
        <div className="px-6 py-2.5 bg-white border-b border-slate-200 flex flex-wrap items-center justify-between text-xs gap-3 shrink-0">
          <div className="flex items-center gap-4 flex-wrap">
            <span className="font-extrabold text-slate-700 flex items-center gap-1.5">
              <span>💳 পেমেন্ট বণ্টন:</span>
            </span>
            <span className="flex items-center gap-1 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              ক্যাশ: <strong className="text-slate-900 font-mono">৳{stats.totalCash.toLocaleString()}</strong>
            </span>
            <span className="flex items-center gap-1 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-pink-500" />
              মোবাইল ব্যাংকিং: <strong className="text-pink-700 font-mono font-bold">৳{stats.totalMfs.toLocaleString()}</strong>
            </span>
            <span className="flex items-center gap-1 text-slate-600 font-medium">
              <span className="w-2.5 h-2.5 rounded-full bg-indigo-500" />
              কার্ড (POS): <strong className="text-slate-900 font-mono">৳{stats.totalCard.toLocaleString()}</strong>
            </span>
          </div>

          <div className="text-slate-500 text-[11px]">
            মোট ছাড় দেওয়া হয়েছে: <strong className="text-rose-600 font-mono">৳{stats.totalDiscounts.toLocaleString()}</strong>
          </div>
        </div>

        {/* CONTROLS: DATE RANGE FILTER, SEARCH & EXPORT ACTIONS */}
        <div className="p-4 bg-white border-b border-slate-200 space-y-3 shrink-0 no-print">
          
          {/* Top Row: Filter Presets, Date Picker & Export Buttons */}
          <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-3">
            
            {/* Quick Preset Buttons */}
            <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl border border-slate-200 overflow-x-auto">
              <button
                type="button"
                onClick={() => handleQuickPreset('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activePreset === 'all'
                    ? 'bg-rose-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                সকল ৩০ দিন
              </button>

              <button
                type="button"
                onClick={() => handleQuickPreset('today')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activePreset === 'today'
                    ? 'bg-rose-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                আজকে (Today)
              </button>

              <button
                type="button"
                onClick={() => handleQuickPreset('7days')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activePreset === '7days'
                    ? 'bg-rose-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                বিগত ৭ দিন
              </button>

              <button
                type="button"
                onClick={() => handleQuickPreset('15days')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activePreset === '15days'
                    ? 'bg-rose-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                বিগত ১৫ দিন
              </button>

              <button
                type="button"
                onClick={() => handleQuickPreset('weekends')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activePreset === 'weekends'
                    ? 'bg-rose-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                উইকেন্ড (শুক্র-শনি)
              </button>

              <button
                type="button"
                onClick={() => handleQuickPreset('weekdays')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activePreset === 'weekdays'
                    ? 'bg-rose-800 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                কর্মদিবস (রবি-বৃহঃ)
              </button>
            </div>

            {/* Right: Excel & Print Action Buttons (PDF button cleanly removed) */}
            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={handleExportExcel}
                className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                title="মাইক্রোসফট এক্সেল (.xls) ফরম্যাটে ডাউনলোড করুন"
              >
                <FileSpreadsheet className="w-4 h-4 text-emerald-100" />
                <span>Excel ডাউনলোড</span>
              </button>

              <button
                type="button"
                onClick={() => window.print()}
                className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs shadow-xs active:scale-95 transition-all flex items-center gap-1.5 cursor-pointer"
                title="হিসাব খাতা সরাসরি প্রিন্ট করুন"
              >
                <Printer className="w-4 h-4 text-slate-200 stroke-[2]" />
                <span>প্রিন্ট করুন</span>
              </button>
            </div>
          </div>

          {/* Bottom Row: Date Range Filter (শুরু হতে শেষ) & Search Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2.5 border-t border-slate-100">
            {/* Custom Date Range Picker (হতে - পর্যন্ত) */}
            <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
              <div className="flex items-center gap-1.5 text-xs font-black text-slate-800 bg-slate-100 px-3 py-2 rounded-xl border border-slate-200">
                <Calendar className="w-4 h-4 text-rose-700" />
                <span>তারিখ ফিল্টারিং:</span>
              </div>

              {/* Start Date */}
              <div className="flex items-center gap-1.5 bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-1.5 shadow-2xs focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-200 transition-all">
                <span className="text-[11px] font-bold text-slate-500">শুরু:</span>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => {
                    setStartDate(e.target.value);
                    setActivePreset('custom');
                  }}
                  className="text-xs font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                  title="শুরুর তারিখ নির্বাচন করুন"
                />
              </div>

              <span className="text-xs font-black text-slate-400">হতে</span>

              {/* End Date */}
              <div className="flex items-center gap-1.5 bg-white border border-slate-300 hover:border-slate-400 rounded-xl px-3 py-1.5 shadow-2xs focus-within:border-rose-600 focus-within:ring-2 focus-within:ring-rose-200 transition-all">
                <span className="text-[11px] font-bold text-slate-500">শেষ:</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => {
                    setEndDate(e.target.value);
                    setActivePreset('custom');
                  }}
                  className="text-xs font-semibold text-slate-800 bg-transparent focus:outline-none cursor-pointer"
                  title="শেষ তারিখ নির্বাচন করুন"
                />
              </div>

              {/* Reset Date Range Button */}
              {(startDate || endDate) && (
                <button
                  type="button"
                  onClick={() => {
                    setStartDate('');
                    setEndDate('');
                    setFilterType('all');
                    setActivePreset('all');
                  }}
                  className="px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-bold text-xs flex items-center gap-1.5 border border-rose-200 cursor-pointer transition-all active:scale-95 shadow-2xs"
                  title="তারিখ ফিল্টার মুছুন ও সকল দিন দেখুন"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>রিসেট (সকল দিন)</span>
                </button>
              )}
            </div>

            {/* Search Box */}
            <div className="relative w-full sm:w-64">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="তারিখ বা বার লিখে খুঁজুন..."
                className="w-full text-xs pl-8 pr-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:border-rose-700 font-medium"
              />
            </div>
          </div>

          {/* Active Date Range Indicator Badge */}
          {(startDate || endDate) && (
            <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-xl px-3.5 py-2 text-xs text-amber-950 font-medium animate-fadeIn">
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-amber-700 shrink-0" />
                <span>
                  <strong>নির্বাচিত সময়কাল:</strong> {startDate ? new Date(startDate).toLocaleDateString('en-GB') : 'প্রথম থেকে'} হতে {endDate ? new Date(endDate).toLocaleDateString('en-GB') : 'বর্তমান'} পর্যন্ত <strong>(মোট {filteredDays.length} দিনের সেলস রেকর্ড প্রদর্শিত)</strong>
                </span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setStartDate('');
                  setEndDate('');
                  setFilterType('all');
                  setActivePreset('all');
                }}
                className="text-[11px] text-amber-800 underline hover:text-amber-950 font-bold cursor-pointer shrink-0 ml-2"
              >
                ফিল্টার মুছুন ✕
              </button>
            </div>
          )}

        </div>

        {/* LEDGER TABLE (হিসাব খাতার ছক) */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 bg-slate-50/50 print:p-0 print:bg-white print:overflow-visible">
          <div className="bg-white rounded-2xl border-2 border-slate-200 overflow-hidden shadow-xs print:border-none print:shadow-none print:rounded-none">
            <div className="overflow-x-auto print:overflow-visible">
              <table className="w-full text-left text-xs border-collapse print-table">
                <thead>
                  <tr className="bg-slate-900 text-white font-extrabold border-b border-slate-800 text-xs">
                    <th className="py-3.5 px-3 text-center w-12 whitespace-nowrap">নং</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">তারিখ ও বার</th>
                    <th className="py-3.5 px-4 text-center whitespace-nowrap">টেবিল বুকিং</th>
                    <th className="py-3.5 px-4 text-right whitespace-nowrap">ক্যাশ (Cash)</th>
                    <th className="py-3.5 px-4 text-right whitespace-nowrap text-pink-300">মোবাইল ব্যাংকিং</th>
                    <th className="py-3.5 px-4 text-right whitespace-nowrap">কার্ড (POS)</th>
                    <th className="py-3.5 px-4 text-right whitespace-nowrap">ছাড় (Discount)</th>
                    <th className="py-3.5 px-4 text-right whitespace-nowrap">মোট বিক্রি (Net)</th>
                    <th className="py-3.5 px-4 text-center whitespace-nowrap">স্ট্যাটাস</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 font-medium">
                  {filteredDays.length === 0 ? (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        <Calendar className="w-8 h-8 mx-auto text-slate-300 mb-2" />
                        <p className="font-bold text-sm text-slate-600">এই তারিখের মধ্যে কোনো বিক্রয় রেকর্ড পাওয়া যায়নি!</p>
                        <p className="text-xs text-slate-400 mt-0.5">অনুগ্রহ করে তারিখ পরিবর্তন করুন অথবা রিসেট বাটনে ক্লিক করুন।</p>
                      </td>
                    </tr>
                  ) : (
                    filteredDays.map((row, index) => {
                      const isWeekend = row.dayOfWeek === 5 || row.dayOfWeek === 6;
                      return (
                        <tr
                          key={row.id}
                          className={`transition-colors hover:bg-orange-50/60 ${
                            row.isToday
                              ? 'bg-emerald-50/90 font-bold border-l-4 border-emerald-600 print:bg-slate-50'
                              : isWeekend
                              ? 'bg-amber-50/30'
                              : index % 2 === 0
                              ? 'bg-white'
                              : 'bg-slate-50/40'
                          }`}
                        >
                          {/* Serial */}
                          <td className="py-3.5 px-3 text-center text-slate-400 font-mono text-[11px] whitespace-nowrap">
                            {index + 1}
                          </td>

                          {/* Date & Day */}
                          <td className="py-3.5 px-4 whitespace-nowrap">
                            <div className="flex items-center gap-2">
                              <span className="font-mono font-bold text-slate-900">{row.date}</span>
                              <span className={`text-[10px] px-2 py-0.5 rounded-md font-bold ${
                                row.isToday
                                  ? 'bg-emerald-600 text-white animate-pulse'
                                  : isWeekend
                                  ? 'bg-amber-100 text-amber-800'
                                  : 'bg-slate-100 text-slate-600'
                              }`}>
                                {row.isToday ? 'আজকের লাইভ' : row.dayName}
                              </span>
                            </div>
                          </td>

                          {/* Table bookings on 5 tables */}
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <span className="font-mono font-bold text-slate-900 text-xs block">
                              {row.totalBookings} বার বুকিং
                            </span>
                            <span className="text-[10px] text-slate-500 font-medium">
                              (৫টি টেবিলে)
                            </span>
                          </td>

                          {/* Cash Sales */}
                          <td className="py-3.5 px-4 text-right font-mono text-slate-700 whitespace-nowrap">
                            ৳{row.cashSales.toLocaleString()}
                          </td>

                          {/* Mobile Banking Sales */}
                          <td className="py-3.5 px-4 text-right font-mono text-pink-700 font-semibold whitespace-nowrap">
                            ৳{row.mfsSales.toLocaleString()}
                          </td>

                          {/* Card Sales */}
                          <td className="py-3.5 px-4 text-right font-mono text-indigo-700 whitespace-nowrap">
                            ৳{row.cardSales.toLocaleString()}
                          </td>

                          {/* Discount */}
                          <td className="py-3.5 px-4 text-right font-mono text-rose-500 whitespace-nowrap">
                            -৳{row.discountGiven.toLocaleString()}
                          </td>

                          {/* Total Net Collected */}
                          <td className="py-3.5 px-4 text-right font-mono font-black text-slate-900 text-sm whitespace-nowrap">
                            ৳{row.netCollected.toLocaleString()}
                          </td>

                          {/* Status */}
                          <td className="py-3.5 px-4 text-center whitespace-nowrap">
                            <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold inline-flex items-center gap-1 ${
                              row.isToday
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : 'bg-slate-100 text-slate-600'
                            }`}>
                              {row.isToday && <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />}
                              {row.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
                <tfoot>
                  <tr className="bg-slate-900 text-white font-black text-xs border-t-2 border-slate-800">
                    <td colSpan={3} className="py-3.5 px-4 text-right uppercase tracking-wider whitespace-nowrap">
                      ফিল্টারকৃত মোট যোগফল:
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono whitespace-nowrap">
                      ৳{filteredDays.reduce((a, b) => a + b.cashSales, 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-pink-300 font-bold whitespace-nowrap">
                      ৳{filteredDays.reduce((a, b) => a + b.mfsSales, 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-indigo-300 whitespace-nowrap">
                      ৳{filteredDays.reduce((a, b) => a + b.cardSales, 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-rose-300 whitespace-nowrap">
                      -৳{filteredDays.reduce((a, b) => a + b.discountGiven, 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-right font-mono text-emerald-400 text-sm font-black whitespace-nowrap">
                      ৳{filteredDays.reduce((a, b) => a + b.netCollected, 0).toLocaleString()}
                    </td>
                    <td className="py-3.5 px-4 text-center text-slate-400 font-mono text-[10px] whitespace-nowrap">
                      {filteredDays.length} দিন
                    </td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* Printable Signature Row (Only visible on Print / PDF export) */}
          <div className="hidden print:flex items-center justify-between pt-12 pb-6 px-4 text-xs text-slate-700 font-bold">
            <div>
              <p>___________________________________</p>
              <p className="mt-1">ক্যাশিয়ার / ফ্লোর ম্যানেজার স্বাক্ষর</p>
            </div>
            <div>
              <p>___________________________________</p>
              <p className="mt-1">রেস্তোরাঁ স্বত্বাধিকারী / অডিটর স্বাক্ষর</p>
            </div>
          </div>
        </div>

        {/* MODAL FOOTER */}
        <div className="p-4 bg-white border-t border-slate-200 flex items-center justify-end text-xs text-slate-500 gap-3 shrink-0 no-print">
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-extrabold text-xs transition-all active:scale-95 cursor-pointer shadow-xs"
          >
            বন্ধ করুন (Close)
          </button>
        </div>

      </div>
    </div>
  );
}
