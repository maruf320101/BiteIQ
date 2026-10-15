import React from 'react';
import { Clock, CheckCircle2, ChefHat } from 'lucide-react';
import confetti from 'canvas-confetti';

export default function LiveOrderStatusModal({
  order,
  isOpen,
  onClose,
  remainingSeconds = 0
}) {
  if (!isOpen || !order) return null;

  const minutes = Math.floor(remainingSeconds / 60);
  const seconds = remainingSeconds % 60;
  const isReady = remainingSeconds <= 0;

  const totalDuration = order.durationSeconds || order.totalPrepTime * 60;
  const progressPercent = Math.max(
    0,
    Math.min(100, ((totalDuration - remainingSeconds) / totalDuration) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <ChefHat className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">লাইভ কিচেন প্রিপারেশন কাউন্টডাউন</h3>
              <p className="text-xs text-emerald-600 font-bold">ম্যানেজার অনুমোদন দিয়েছেন • Table {order.tableNumber}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 text-xs bg-slate-100 px-3 py-1.5 rounded-lg font-semibold"
          >
            মিনিমাইজ
          </button>
        </div>

        {/* Live Timer Gauge (Countdown) */}
        <div className="text-center py-5 space-y-3 bg-slate-50 rounded-2xl border border-slate-200">
          {!isReady ? (
            <>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-800 border border-orange-200 text-xs font-bold">
                <ChefHat className="w-3.5 h-3.5 text-orange-600 animate-spin" /> কিচেনে খাবার রান্না হচ্ছে
              </div>
              <div className="text-6xl font-black text-slate-900 tracking-wider font-mono">
                {String(minutes).padStart(2, '0')}:{String(seconds).padStart(2, '0')}
              </div>
              <p className="text-xs text-slate-500 font-medium">
                বাকি সময় • নির্ধারিত সময়ের মধ্যে খাবার সরাসরি আপনার টেবিলে পৌঁছে যাবে
              </p>
            </>
          ) : (
            <div className="space-y-2 py-2">
              <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-600 mx-auto flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8" />
              </div>
              <h4 className="text-xl font-black text-slate-900">খাবার টেবিলে পরিবেশন করা হচ্ছে!</h4>
            </div>
          )}

          {/* Progress Bar */}
          <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden mt-4">
            <div
              className="bg-gradient-to-r from-orange-500 to-amber-500 h-3 rounded-full transition-all duration-1000 ease-linear shadow-xs"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        {/* Confirmed Food Items */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">চলমান আইটেমসমূহ:</p>
          <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
            {order.items.map((item) => (
              <div
                key={item.id}
                className="flex justify-between items-center text-xs p-2.5 rounded-xl bg-slate-50 border border-slate-200"
              >
                <span className="text-slate-800 font-bold">
                  {item.quantity}x {item.name}
                </span>
                <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-semibold">
                  ⏱ {item.prepTime} মিনিট
                </span>
              </div>
            ))}
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-all"
        >
          উইন্ডো বন্ধ করুন (ব্যাকগ্রাউন্ডে কাউন্টডাউন চলবে)
        </button>
      </div>
    </div>
  );
}
