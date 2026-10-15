import React from 'react';
import { ChefHat, CheckCircle2, Utensils, Flame, Clock } from 'lucide-react';

export default function CustomerKitchenModal({
  isOpen,
  onClose,
  currentRequest,
  currentLiveOrder,
  tableNumber
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-orange-100 text-orange-600 flex items-center justify-center">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-extrabold text-slate-900 text-base sm:text-lg">
                কিচেন লাইভ স্ট্যাটাস ও ট্র্যাকিং
              </h3>
              <p className="text-xs text-orange-600 font-bold">
                Table {tableNumber} Dining Dispatch
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full transition-colors text-xs font-bold"
          >
            ✕
          </button>
        </div>

        {/* STATUS CHECK: 1. Confirmed & Cooking, 2. Pending Approval, 3. No order yet */}
        {currentLiveOrder ? (
          <div className="p-5 rounded-2xl bg-emerald-50 border-2 border-emerald-300 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-emerald-600 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-xs">
                <CheckCircle2 className="w-4 h-4" /> ম্যানেজার অনুমোদন দিয়েছেন
              </span>
              <span className="text-xs font-bold text-emerald-800">
                Order #{currentLiveOrder.orderId}
              </span>
            </div>

            <p className="text-sm font-bold text-slate-800 flex items-center gap-2">
              <Flame className="w-4 h-4 text-orange-600" />
              আপনার খাবার কিচেনে রান্না হচ্ছে!
            </p>

            <div className="space-y-1.5 pt-2 border-t border-emerald-200/60">
              <span className="text-[11px] font-bold text-slate-500 uppercase">অর্ডারের আইটেমসমূহ:</span>
              {currentLiveOrder.items.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs font-semibold text-slate-800 bg-white p-2.5 rounded-xl border border-emerald-100 shadow-xs">
                  <span><strong className="text-orange-600 font-bold">{item.quantity}x</strong> {item.name}</span>
                  {/* Clean Cooking status tag - Time count removed */}
                  <span className="text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg text-xs font-bold border border-emerald-200 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-orange-600" />
                    <span>রান্না হচ্ছে</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : currentRequest ? (
          <div className="p-5 rounded-2xl bg-amber-50 border-2 border-amber-300 space-y-3">
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-amber-500 text-white font-extrabold text-xs flex items-center gap-1.5 shadow-xs animate-pulse">
                <Clock className="w-4 h-4" /> ম্যানেজারের অনুমোদনের অপেক্ষায়
              </span>
              <span className="text-xs font-bold text-amber-900">
                Request #{currentRequest.requestId}
              </span>
            </div>

            <p className="text-sm font-bold text-slate-800">
              ⏳ আপনার অর্ডার রিকোয়েস্ট ম্যানেজার পোর্টালে পাঠানো হয়েছে। ম্যানেজার অনুমোদন দিলেই কিচেনে রান্না শুরু হবে।
            </p>

            <div className="space-y-1.5 pt-2 border-t border-amber-200/60">
              <span className="text-[11px] font-bold text-slate-500 uppercase">রিকোয়েস্ট করা আইটেমসমূহ:</span>
              {currentRequest.items.map((item, idx) => (
                <div key={idx} className="flex justify-between text-xs font-semibold text-slate-800 bg-white p-2 rounded-xl border border-amber-100">
                  <span><strong className="text-orange-600 font-bold">{item.quantity}x</strong> {item.name}</span>
                  <span className="text-amber-700 bg-amber-50 px-2 py-0.5 rounded text-[11px] font-bold">
                    অপেক্ষমান
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="py-12 text-center text-slate-400 space-y-2 bg-slate-50 rounded-2xl border border-slate-200">
            <Utensils className="w-10 h-10 stroke-[1.5] mx-auto text-slate-300" />
            <p className="text-sm font-bold text-slate-700">এই মুহূর্তে আপনার কোনো সক্রিয় অর্ডার নেই।</p>
            <p className="text-xs text-slate-400 max-w-sm mx-auto">
              মেনু থেকে পছন্দের খাবার সিলেক্ট করে "ম্যানেজারের কাছে অর্ডারের রিকোয়েস্ট পাঠান" বাটনে ক্লিক করুন।
            </p>
          </div>
        )}

        {/* Quality assurance banner */}
        <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200 flex items-center gap-3">
          <img
            src="https://images.unsplash.com/photo-1556910103-1c02745aae4d?auto=format&fit=crop&w=120&q=80"
            alt="Chef Master"
            className="w-12 h-12 rounded-xl object-cover"
          />
          <div className="text-xs">
            <span className="font-bold text-slate-900 block">১০০% তাজা ও স্বাস্থ্যসম্মত রান্না</span>
            <span className="text-slate-500 text-[11px]">কোনো ফ্রোজেন ফুড নয়, প্রতিটি পদ অর্ডারের পর সাথে সাথে যত্নসহকারে তৈরি হয়।</span>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-full py-3 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-all shadow-md shadow-orange-500/20"
        >
          উইন্ডো বন্ধ করুন
        </button>
      </div>
    </div>
  );
}
