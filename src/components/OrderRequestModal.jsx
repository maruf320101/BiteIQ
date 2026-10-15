import React from 'react';
import { Clock, CheckCircle2, X } from 'lucide-react';

export default function OrderRequestModal({
  isOpen,
  onClose,
  orderRequest
}) {
  if (!isOpen || !orderRequest) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white border border-slate-200 rounded-3xl p-6 sm:p-7 shadow-2xl space-y-6 text-center">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon & Status */}
        <div className="w-16 h-16 rounded-3xl bg-amber-100 text-amber-600 mx-auto flex items-center justify-center shadow-md shadow-amber-500/15">
          <Clock className="w-8 h-8 animate-pulse" />
        </div>

        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping" />
            ম্যানেজারের অনুমোদনের অপেক্ষায়
          </div>

          <h3 className="text-2xl font-black text-slate-900">
            অর্ডার রিকোয়েস্ট পাঠানো হয়েছে!
          </h3>

          <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-md mx-auto">
            আপনার টেবিল <strong className="text-orange-600 font-bold">Table {orderRequest.tableNumber}</strong> থেকে পছন্দের খাবারগুলোর তালিকা সরাসরি ম্যানেজার ড্যাশবোর্ডে চলে গেছে। ম্যানেজার অনুমোদন দেওয়ার সাথে সাথেই কিচেনে রান্না ও সময় গণনা শুরু হবে।
          </p>
        </div>

        {/* Selected Items Summary */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-left space-y-2.5">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 border-b border-slate-200 pb-2">
            <span>রিকোয়েস্ট করা আইটেমসমূহ:</span>
            <span>প্রস্তুতির সময়</span>
          </div>

          <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
            {orderRequest.items.map((item) => (
              <div key={item.id} className="flex justify-between items-center text-xs">
                <span className="font-semibold text-slate-800">
                  <strong className="text-orange-600 font-bold">{item.quantity}x</strong> {item.name}
                </span>
                <span className="text-slate-500 font-medium">⏱ ~{item.prepTime} মিনিট</span>
              </div>
            ))}
          </div>
        </div>

        {/* Single Confirm Button: 'ঠিক আছে' */}
        <div className="pt-2">
          <button
            onClick={onClose}
            className="w-full py-3.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 active:scale-98"
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>ঠিক আছে</span>
          </button>
        </div>
      </div>
    </div>
  );
}
