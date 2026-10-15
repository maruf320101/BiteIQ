import React from 'react';
import { ShoppingBag, X, Trash2, Plus, Minus, Send, Clock, ShieldCheck } from 'lucide-react';

export default function CartDrawer({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onRequestOrder,
  tableNumber
}) {
  if (!isOpen) return null;

  const subtotal = cartItems.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const vat = Math.round(subtotal * 0.05); // 5% VAT
  const total = subtotal + vat;

  const totalItemsCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);

  // Realistic Smart Kitchen Timing Formula:
  // Base time = maximum single dish prep time
  // Multiple dishes/quantities cook simultaneously with slight chef staggering (+2 to +3 mins per additional dish)
  // Hard cap at 30 mins to avoid unrealistic dining delays
  const calculatedPrepTime = React.useMemo(() => {
    if (cartItems.length === 0) return 0;
    const baseMax = Math.max(...cartItems.map((i) => i.prepTime));
    const extraCount = totalItemsCount - 1;
    if (extraCount <= 0) return baseMax;
    // Add staggered kitchen buffer: +2 mins per additional item, maximum 30 mins
    const totalEst = baseMax + extraCount * 2;
    return Math.min(30, totalEst);
  }, [cartItems, totalItemsCount]);

  return (
    <div className="fixed inset-0 z-50 flex justify-end bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="w-full max-w-md bg-white border-l border-slate-200 h-full flex flex-col justify-between shadow-2xl">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl bg-orange-100 text-orange-600">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">টেবিল অর্ডার কার্ট</h3>
              <p className="text-xs text-orange-600 font-bold">Table {tableNumber} Dispatch</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Cart Item List */}
        <div className="flex-1 overflow-y-auto p-5 space-y-3">
          {cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-center text-slate-400 space-y-3">
              <ShoppingBag className="w-12 h-12 stroke-[1.5]" />
              <p className="text-sm font-bold text-slate-600">আপনার কার্ট এই মুহূর্তে খালি।</p>
              <p className="text-xs text-slate-400 max-w-xs">
                মেনু থেকে পছন্দের খাবার সিলেক্ট করুন অথবা আমাদের এআই অ্যাসিস্ট্যান্টের সাহায্য নিন।
              </p>
            </div>
          ) : (
            <>
              {/* Prep time banner */}
              <div className="p-3 rounded-xl bg-orange-50 border border-orange-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2 text-orange-800 font-bold">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <span>প্রস্তুত হতে আনুমানিক সময়:</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="font-extrabold text-orange-700 bg-orange-100 px-2 py-0.5 rounded">
                    ~{calculatedPrepTime} মিনিট
                  </span>
                </div>
              </div>

              {cartItems.map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-50 border border-slate-200"
                >
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-slate-900 truncate">{item.name}</h4>
                    <p className="text-[11px] text-slate-500">⏱ {item.prepTime} মিনিট প্রস্তুতি সময়</p>
                    <p className="text-xs font-black text-slate-900 mt-0.5">
                      ৳{item.price * item.quantity}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg p-1">
                    <button
                      onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                      className="p-1 hover:text-orange-600 text-slate-500"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="text-xs font-bold text-slate-900 px-1">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => {
                        if (item.quantity < 3) {
                          onUpdateQuantity(item.id, item.quantity + 1);
                        }
                      }}
                      disabled={item.quantity >= 3}
                      title={item.quantity >= 3 ? "একটি আইটেম সর্বোচ্চ ৩টি নেওয়া যাবে" : "পরিমাণ বাড়ান"}
                      className="p-1 hover:text-orange-600 text-slate-500 disabled:opacity-30 disabled:cursor-not-allowed"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    onClick={() => onRemoveItem(item.id)}
                    className="p-1.5 text-slate-400 hover:text-red-500 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </>
          )}
        </div>

        {/* Footer with Full Bill Breakdown & Manager Request Button */}
        {cartItems.length > 0 && (
          <div className="p-5 border-t border-slate-200 bg-slate-50 space-y-3">
            <div className="space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-500 font-medium">
                <span>সাবটোটাল</span>
                <span className="text-slate-900 font-bold">৳{subtotal}</span>
              </div>
              <div className="flex justify-between text-slate-500 font-medium">
                <span>ভ্যাট ও সার্ভিস চার্জ (৫%)</span>
                <span className="text-slate-900 font-bold">৳{vat}</span>
              </div>
              <div className="flex justify-between text-sm font-bold pt-2 border-t border-slate-200 text-slate-900">
                <span>সর্বমোট বিল (Total Bill)</span>
                <span className="text-orange-600 text-lg font-black">৳{total}</span>
              </div>
            </div>

            <button
              onClick={() => onRequestOrder(calculatedPrepTime)}
              className="w-full py-3.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-orange-500/25 active:scale-98 transition-all"
            >
              <Send className="w-4 h-4" />
              <span>ম্যানেজারের কাছে অর্ডারের রিকোয়েস্ট পাঠান</span>
            </button>

            <p className="text-[11px] text-slate-500 text-center flex items-center justify-center gap-1 font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-orange-600" /> ম্যানেজার রিকোয়েস্ট নিশ্চিত করার পর কিচেনে প্রিপারেশন শুরু হবে
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
