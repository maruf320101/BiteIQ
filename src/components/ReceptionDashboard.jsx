import React from 'react';
import { ChefHat, Clock, CheckCircle, Utensils, Bell, Flame, ShieldCheck, Check, AlertCircle } from 'lucide-react';

export default function ReceptionDashboard({
  pendingRequests,
  activeOrders,
  onConfirmRequest,
  onCompleteOrder,
  isOpen,
  onClose
}) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-900/60 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white border border-slate-200 rounded-3xl p-6 shadow-2xl space-y-6 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 text-white flex items-center justify-center shadow-md shadow-orange-500/20">
              <ChefHat className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-lg">
                  ম্যানেজার ও কিচেন কন্ট্রোল ড্যাশবোর্ড
                </h3>
                {pendingRequests.length > 0 && (
                  <span className="px-2.5 py-0.5 rounded-full bg-red-100 text-red-700 text-xs font-bold animate-pulse">
                    ● {pendingRequests.length}টি নতুন রিকোয়েস্ট
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                গ্রাহকের পাঠানো অর্ডার রিকোয়েস্ট অনুমোদন করুন এবং কিচেন প্রিপারেশন তদারকি করুন
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-500 hover:text-slate-800 text-xs font-bold bg-slate-100 hover:bg-slate-200 px-3.5 py-2 rounded-xl transition-all"
          >
            বন্ধ করুন ✕
          </button>
        </div>

        {/* SECTION 1: Pending Order Requests from Tables */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
              <Bell className="w-4 h-4 text-orange-600" />
              টেবিল থেকে আসা নতুন অর্ডার রিকোয়েস্ট ({pendingRequests.length})
            </h4>
            <span className="text-xs text-slate-400">অনুমোদন দিলে ইউজারের কাউন্টডাউন শুরু হবে</span>
          </div>

          {pendingRequests.length === 0 ? (
            <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200 text-center text-xs text-slate-500">
              এই মুহূর্তে কোনো নতুন রিকোয়েস্ট পেন্ডিং নেই।
            </div>
          ) : (
            <div className="space-y-3">
              {pendingRequests.map((req) => (
                <div
                  key={req.requestId}
                  className="bg-amber-50/50 border-2 border-amber-300 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-xl bg-orange-600 text-white font-black text-xs shadow-xs">
                        Table #{req.tableNumber}
                      </span>
                      <span className="text-xs font-bold text-amber-900">
                        নতুন রিকোয়েস্ট #{req.requestId} ({req.createdAt})
                      </span>
                      <span className="text-[11px] font-semibold text-slate-600 bg-white px-2 py-0.5 rounded border border-slate-200">
                        ⏱ সময়: ~{req.totalPrepTime} মিনিট
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {req.items.map((item, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-white border border-slate-200 px-2.5 py-1 rounded-lg text-slate-800 font-medium"
                        >
                          <strong className="text-orange-600 font-bold">{item.quantity}x</strong> {item.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onConfirmRequest(req)}
                    className="py-2.5 px-5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 transition-all whitespace-nowrap active:scale-95"
                  >
                    <Check className="w-4 h-4" />
                    <span>অনুমোদন দিন ও কিচেনে পাঠান</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* SECTION 2: Active Kitchen Preparations (Running Timers) */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 pt-2 border-t border-slate-200">
          <h4 className="text-sm font-extrabold text-slate-900 flex items-center gap-2">
            <Flame className="w-4 h-4 text-orange-600" />
            চলমান কিচেন প্রিপারেশন ({activeOrders.length})
          </h4>

          {activeOrders.length === 0 ? (
            <div className="py-8 text-center text-slate-400 space-y-1 bg-slate-50 rounded-2xl border border-slate-200 text-xs">
              <Utensils className="w-8 h-8 stroke-[1.5] mx-auto text-slate-300" />
              <p className="font-semibold text-slate-600">বর্তমানে কোনো সক্রিয় কিচেন অর্ডার নেই।</p>
            </div>
          ) : (
            <div className="space-y-3">
              {activeOrders.map((order) => (
                <div
                  key={order.orderId}
                  className="bg-white border border-slate-200 rounded-2xl p-4 flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-xl bg-slate-900 text-white font-black text-xs">
                        Table #{order.tableNumber}
                      </span>
                      <span className="text-xs font-mono text-slate-500">
                        Order #{order.orderId}
                      </span>
                      <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                        ● রান্নার সময় চালু রয়েছে (~{order.totalPrepTime} মি.)
                      </span>
                    </div>

                    <div className="flex flex-wrap gap-2 pt-1">
                      {order.items.map((item, idx) => (
                        <span
                          key={idx}
                          className="text-xs bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-lg text-slate-700"
                        >
                          <strong className="text-orange-600 font-bold">{item.quantity}x</strong> {item.name}
                        </span>
                      ))}
                    </div>
                  </div>

                  <button
                    onClick={() => onCompleteOrder(order.orderId)}
                    className="py-2.5 px-4 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold text-xs flex items-center gap-1.5 transition-all whitespace-nowrap"
                  >
                    <CheckCircle className="w-4 h-4 text-emerald-400" /> টেবিলে পরিবেশিত হয়েছে
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
