import React, { useState } from 'react';
import { 
  Table as TableIcon, 
  Utensils, 
  Sparkles, 
  Check, 
  QrCode, 
  ShieldCheck, 
  ChevronRight, 
  User, 
  ArrowRight,
  ArrowLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function TableSelectModal({
  isOpen,
  onClose,
  tablesList = [1, 2, 3, 4, 5],
  initialTable = null,
  initialName = '',
  onConfirmSelection,
  onOpenStaffLogin
}) {
  const [step, setStep] = useState('table'); // 'table' | 'name'
  const [selectedTable, setSelectedTable] = useState(initialTable); // null by default so no table is pre-selected
  const [customerNameInput, setCustomerNameInput] = useState(initialName || '');

  if (!isOpen) return null;

  const safeTables = Array.isArray(tablesList) && tablesList.length > 0 ? tablesList : [1, 2, 3, 4, 5];

  const handleTableConfirm = () => {
    if (!selectedTable) return;
    setStep('name');
  };

  const handleFinalSubmit = (e) => {
    e?.preventDefault();
    const finalName = customerNameInput.trim() || 'সম্মানিত অতিথি';

    try {
      if (typeof window !== 'undefined' && typeof confetti === 'function') {
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 }
        });
      }
    } catch {}

    if (onConfirmSelection) {
      onConfirmSelection(selectedTable, finalName);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="w-full max-w-md mx-auto bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-scaleUp">
        
        {/* Top Header Banner */}
        <div className="bg-gradient-to-r from-orange-600 via-amber-600 to-orange-700 text-white p-5 sm:p-6 text-center relative overflow-hidden">
          {/* Logo Badge */}
          <div className="w-12 h-12 mx-auto rounded-2xl bg-white text-orange-600 flex items-center justify-center shadow-md mb-2.5">
            <Utensils className="w-6 h-6 stroke-[2.5]" />
          </div>

          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-[10px] font-extrabold uppercase tracking-wider text-amber-200 border border-white/20 mb-1.5">
            <Sparkles className="w-3 h-3 text-amber-300" />
            <span>BiteIQ Smart Dining</span>
          </div>

          {step === 'table' ? (
            <>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                স্বাগতম! আপনি কোন টেবিলে বসেছেন?
              </h2>
              <p className="text-xs text-orange-100/90 max-w-xs mx-auto mt-1 leading-relaxed">
                আপনার টেবিলে খাবার পৌঁছে দেওয়ার জন্য নিচের তালিকা থেকে আপনার টেবিলটি নির্বাচন করুন।
              </p>
            </>
          ) : (
            <>
              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
                আপনার শুভ নাম কি?
              </h2>
              <p className="text-xs text-orange-100/90 max-w-xs mx-auto mt-1 leading-relaxed">
                টেবিল ০{selectedTable}-এ স্বাগতম! আপনার অর্ডারের বিল ও রসিদের জন্য নামটি লিখুন।
              </p>
            </>
          )}
        </div>

        {/* ========================================================= */}
        {/* STEP 1: SELECT TABLE                                      */}
        {/* ========================================================= */}
        {step === 'table' && (
          <div className="p-4 sm:p-5 space-y-4 bg-slate-50/70">
            <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-1">
              <span>উপলব্ধ ডাইনিং টেবিলসমূহ:</span>
              <span>মোট {safeTables.length}টি টেবিল</span>
            </div>

            {/* Grid of Tables - None selected by default */}
            <div className="grid grid-cols-2 gap-2.5 sm:gap-3">
              {safeTables.map((tbl) => {
                const isSelected = selectedTable === tbl;
                const formattedNum = tbl < 10 ? `0${tbl}` : tbl;

                return (
                  <button
                    key={tbl}
                    type="button"
                    onClick={() => setSelectedTable(tbl)}
                    className={`relative p-3.5 rounded-2xl border-2 transition-all flex flex-col items-center justify-center text-center gap-1.5 cursor-pointer active:scale-95 ${
                      isSelected
                        ? 'border-orange-500 bg-orange-50/90 shadow-md ring-2 ring-orange-200'
                        : 'border-slate-200 hover:border-orange-300 bg-white hover:bg-orange-50/30'
                    }`}
                  >
                    {/* Selected Checkmark Badge */}
                    {isSelected && (
                      <div className="absolute top-2 right-2 w-5 h-5 bg-orange-600 text-white rounded-full flex items-center justify-center shadow-xs">
                        <Check className="w-3 h-3 stroke-[3]" />
                      </div>
                    )}

                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                      isSelected 
                        ? 'bg-orange-500 text-white shadow-xs' 
                        : 'bg-orange-100 text-orange-700'
                    }`}>
                      <TableIcon className="w-5 h-5 stroke-[2.2]" />
                    </div>

                    <div>
                      <h4 className="text-sm font-black text-slate-900">
                        TABLE {formattedNum}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-medium">
                        ডাইনিং টেবিল {tbl}
                      </p>
                    </div>

                    <span className={`text-[10px] font-black px-2.5 py-0.5 rounded-full transition-colors ${
                      isSelected
                        ? 'bg-orange-600 text-white shadow-2xs'
                        : 'bg-slate-100 text-slate-600'
                    }`}>
                      {isSelected ? 'নির্বাচিত' : 'সিলেক্ট করুন'}
                    </span>
                  </button>
                );
              })}
            </div>

            {/* Confirm Table Selection Button */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleTableConfirm}
                disabled={!selectedTable}
                className="w-full py-3 px-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 disabled:opacity-40 disabled:cursor-not-allowed text-white font-black text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>{selectedTable ? `টেবিল ০${selectedTable} নিশ্চিত করুন` : 'একটি টেবিল সিলেক্ট করুন'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Quick Tip */}
            <div className="flex items-center gap-2 p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-slate-700 text-[11px]">
              <QrCode className="w-4 h-4 text-orange-600 shrink-0" />
              <span>টেবিল স্ট্যান্ডের QR কোড স্ক্যান করলেও স্বয়ংক্রিয়ভাবে টেবিল সিলেক্ট হয়।</span>
            </div>
          </div>
        )}

        {/* ========================================================= */}
        {/* STEP 2: ENTER CUSTOMER NAME                               */}
        {/* ========================================================= */}
        {step === 'name' && (
          <form onSubmit={handleFinalSubmit} className="p-5 sm:p-6 space-y-4 bg-slate-50/70">
            <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 text-xs">
                <span className="text-slate-500 font-bold">নির্বাচিত টেবিল:</span>
                <span className="font-black text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-lg border border-orange-200">
                  Table 0{selectedTable}
                </span>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-orange-600" />
                  <span>আপনার নাম (কাস্টমারের নাম):</span>
                </label>
                <input
                  type="text"
                  value={customerNameInput}
                  onChange={(e) => setCustomerNameInput(e.target.value)}
                  placeholder="যেমন: মারুফ, তানভীর, হাসান..."
                  autoFocus
                  className="w-full text-sm font-bold px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:border-orange-500 focus:ring-2 focus:ring-orange-200 bg-slate-50/50"
                  required
                />
                <p className="text-[11px] text-slate-500">
                  এই নামটি খাবার ডেলিভারি ও আপনার ক্যাশ মেমো / বিল রসিদে মুদ্রিত হবে।
                </p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2 pt-1">
              <button
                type="button"
                onClick={() => setStep('table')}
                className="px-3.5 py-3 rounded-2xl bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs border border-slate-200 transition-all flex items-center gap-1 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>পেছনে</span>
              </button>

              <button
                type="submit"
                className="flex-1 py-3 px-4 rounded-2xl bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-700 hover:to-amber-700 text-white font-black text-sm shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>মেনুতে প্রবেশ করুন</span>
                <Check className="w-4 h-4 stroke-[3]" />
              </button>
            </div>
          </form>
        )}

        {/* Footer Actions & Staff Login Link */}
        <div className="p-3.5 bg-white border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
          <button
            type="button"
            onClick={() => {
              if (onOpenStaffLogin) onOpenStaffLogin();
            }}
            className="text-slate-500 hover:text-orange-600 font-bold flex items-center gap-1 transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
            <span>ম্যানেজার / স্টাফ লগইন</span>
            <ChevronRight className="w-3 h-3" />
          </button>

          {initialTable && (
            <button
              type="button"
              onClick={onClose}
              className="text-xs font-bold text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              বন্ধ করুন
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
