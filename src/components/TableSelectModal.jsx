import React from 'react';
import { 
  Table as TableIcon, 
  Utensils, 
  Sparkles, 
  Check, 
  QrCode, 
  ShieldCheck, 
  ChevronRight,
  X
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TableSelectModal({
  isOpen,
  onClose,
  tablesList = [1, 2, 3, 4, 5],
  currentTable = 1,
  onSelectTable,
  onOpenStaffLogin
}) {
  if (!isOpen) return null;

  const safeTables = Array.isArray(tablesList) && tablesList.length > 0 ? tablesList : [1, 2, 3, 4, 5];

  const handleChoose = (tblNum) => {
    try {
      if (typeof window !== 'undefined' && typeof confetti === 'function') {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.7 }
        });
      }
    } catch {}

    if (onSelectTable) {
      onSelectTable(tblNum);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 max-w-lg w-full overflow-hidden my-auto animate-scaleUp">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-6 sm:p-7 relative overflow-hidden text-center">
          <div className="absolute top-0 right-0 w-40 h-40 bg-white/10 rounded-full blur-2xl -mr-16 -mt-16 pointer-events-none" />
          
          {/* Logo Badge */}
          <div className="w-14 h-14 mx-auto rounded-2xl bg-white text-orange-600 flex items-center justify-center shadow-lg shadow-black/10 mb-3">
            <Utensils className="w-7 h-7 stroke-[2.5]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-[11px] font-extrabold uppercase tracking-wider text-amber-200 border border-white/20 mb-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" />
            <span>BiteIQ Smart Dining Experience</span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
            স্বাগতম! আপনি কোন টেবিলে বসেছেন?
          </h2>
          <p className="text-xs sm:text-sm text-orange-100/90 max-w-md mx-auto mt-2 leading-relaxed font-medium">
            আপনার টেবিলে খাবার পৌঁছে দেওয়া ও লাইভ সার্ভিস পেতে নিচের তালিকা থেকে আপনার টেবিল নম্বরটি নির্বাচন করুন।
          </p>
        </div>

        {/* Table Selection Cards Grid */}
        <div className="p-5 sm:p-6 space-y-4 bg-slate-50/70">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
            <span>উপলব্ধ ডাইনিং টেবিলসমূহ:</span>
            <span>মোট {safeTables.length}টি টেবিল</span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {safeTables.map((tbl) => {
              const isSelected = currentTable === tbl;
              const formattedNum = tbl < 10 ? `0${tbl}` : tbl;

              return (
                <button
                  key={tbl}
                  type="button"
                  onClick={() => handleChoose(tbl)}
                  className={`relative p-4 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center gap-2 cursor-pointer group active:scale-95 ${
                    isSelected
                      ? 'border-orange-500 bg-orange-50/80 shadow-md ring-2 ring-orange-200'
                      : 'border-slate-200 hover:border-orange-400 bg-white hover:bg-orange-50/30 hover:shadow-md'
                  }`}
                >
                  {/* Selected Tick Badge */}
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-5 h-5 bg-orange-600 text-white rounded-full flex items-center justify-center shadow-xs">
                      <Check className="w-3 h-3 stroke-[3]" />
                    </div>
                  )}

                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center transition-colors ${
                    isSelected 
                      ? 'bg-orange-500 text-white shadow-sm' 
                      : 'bg-orange-100 text-orange-700 group-hover:bg-orange-500 group-hover:text-white'
                  }`}>
                    <TableIcon className="w-5 h-5 stroke-[2.2]" />
                  </div>

                  <div>
                    <h4 className="text-base font-black text-slate-900 group-hover:text-orange-600 transition-colors">
                      TABLE {formattedNum}
                    </h4>
                    <p className="text-[11px] text-slate-500 font-medium">
                      ডাইনিং টেবিল {tbl}
                    </p>
                  </div>

                  <span className={`text-[10px] font-black px-2 py-0.5 rounded-full transition-colors ${
                    isSelected
                      ? 'bg-orange-600 text-white'
                      : 'bg-slate-100 text-slate-600 group-hover:bg-orange-100 group-hover:text-orange-800'
                  }`}>
                    {isSelected ? 'বর্তমান টেবিল' : 'সিলেক্ট করুন'}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Tip for Seated Customers with QR stands */}
          <div className="flex items-start gap-2.5 p-3 rounded-2xl bg-amber-50/80 border border-amber-200 text-slate-700 text-xs">
            <QrCode className="w-4 h-4 text-orange-600 shrink-0 mt-0.5" />
            <p className="leading-snug text-[11px]">
              <strong>টিপস:</strong> আপনি যদি সরাসরি রেস্তোরাঁর টেবিলে বসা থাকেন, তবে টেবিল স্ট্যান্ডের কিউআর কোড ফোনের ক্যামেরা দিয়ে স্ক্যান করলেও স্বয়ংক্রিয়ভাবে সেই টেবিল সিলেক্ট হবে।
            </p>
          </div>
        </div>

        {/* Footer Actions & Staff Login Link */}
        <div className="p-4 bg-white border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          {/* Staff Login link for manager / admin */}
          <button
            type="button"
            onClick={() => {
              if (onOpenStaffLogin) onOpenStaffLogin();
            }}
            className="text-slate-500 hover:text-orange-600 font-bold flex items-center gap-1 transition-colors cursor-pointer py-1"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400 group-hover:text-orange-600" />
            <span>ম্যানেজার বা স্টাফ? এখানে লগইন করুন</span>
            <ChevronRight className="w-3 h-3" />
          </button>

          {/* If customer already has a table selected, allow closing */}
          {currentTable && (
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-all cursor-pointer"
            >
              চালিয়ে যান (Table {currentTable})
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
