import React from 'react';
import { Star, Sparkles, ChefHat, CheckCircle2, CheckCircle, Clock, Flame } from 'lucide-react';
import { RESTAURANT_INFO, CUSTOMER_REVIEWS } from '../data/restaurantData';

export default function HeroAndReviews({
  tableNumber,
  onOpenAI,
  onOpenTableSelect,
  currentRequest,
  currentLiveOrder,
  remainingSeconds,
  onOpenKitchenStatus,
  featuredReviews = []
}) {
  const safeSeconds = typeof remainingSeconds === 'number' && !isNaN(remainingSeconds) ? remainingSeconds : 0;
  const m = Math.floor(safeSeconds / 60);
  const s = safeSeconds % 60;
  const formattedCountdown = `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;

  const reviewsToDisplay = featuredReviews && featuredReviews.length > 0 
    ? featuredReviews 
    : CUSTOMER_REVIEWS;

  return (
    <div className="space-y-12">
      {/* Hero Section */}
      <section className="relative pt-8 pb-10 px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          
          <h1 className="text-4xl sm:text-6xl font-black text-slate-900 tracking-tight leading-tight">
            স্বাগতম <span className="bg-gradient-to-r from-orange-600 via-amber-600 to-yellow-600 bg-clip-text text-transparent">{RESTAURANT_INFO.name}</span> এ!
            <br />
            <span className="text-2xl sm:text-4xl font-extrabold text-slate-700">
              অটোনোমাস স্মার্ট ডাইনিং অভিজ্ঞতা
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-600 max-w-2xl mx-auto leading-relaxed">
            কোনো ওয়েটার ডাকার অপেক্ষা নয়। আপনি কিউআর স্ক্যান করে টেবিলে বসেছেন। নিচের মেনু থেকে খাবার পছন্দ করে সরাসরি কিচেনে পাঠিয়ে দিন। 
            শারীরিক অবস্থা বা মেজাজ অনুযায়ী খাবারের সঠিক পরামর্শের জন্য রয়েছে আমাদের স্পেশাল এআই অ্যাসিস্ট্যান্ট।
          </p>

          {/* Action Area */}
          <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
            {/* Seated Table Badge with Change Table option */}
            <button
              type="button"
              onClick={onOpenTableSelect}
              className="px-6 py-3.5 rounded-2xl bg-orange-500 hover:bg-orange-600 text-white font-extrabold text-base flex items-center gap-2.5 shadow-lg shadow-orange-500/25 transition-all hover:scale-102 active:scale-95 cursor-pointer group"
              title="টেবিল নম্বর পরিবর্তন করতে ক্লিক করুন"
            >
              <span className="w-3 h-3 rounded-full bg-emerald-300 animate-ping" />
              <span>আপনি বর্তমানে বসে আছেন Table {tableNumber}-এ</span>
              <span className="text-[11px] bg-black/25 px-2 py-0.5 rounded-md font-bold text-amber-200 group-hover:bg-black/35 transition-colors">
                পরিবর্তন 🔄
              </span>
            </button>

            {/* AI Mood Advisor Button */}
            <button
              onClick={onOpenAI}
              className="px-6 py-3.5 rounded-2xl bg-white hover:bg-orange-50 border-2 border-orange-300 text-orange-700 font-bold text-sm flex items-center gap-2 shadow-xs transition-all hover:scale-105 active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-orange-500" />
              <span>মুড অনুযায়ী এআই ফুড সাজেশন (MoodBite™ AI)</span>
            </button>
          </div>

          {/* SYNCHRONIZED REAL-TIME ORDER STATUS BANNER */}
          {(currentRequest || currentLiveOrder) && (
            <div
              onClick={onOpenKitchenStatus}
              className={`p-4 sm:p-5 rounded-3xl border-2 shadow-md cursor-pointer transition-all text-left flex flex-col sm:flex-row items-center justify-between gap-4 ${
                currentLiveOrder
                  ? 'bg-emerald-50 border-emerald-400'
                  : 'bg-amber-50 border-amber-400 ring-2 ring-amber-300 animate-pulse'
              }`}
            >
              <div className="flex items-center gap-3 w-full sm:w-auto">
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${
                  currentLiveOrder ? 'bg-emerald-600 text-white' : 'bg-amber-500 text-white'
                }`}>
                  {currentLiveOrder ? <Flame className="w-6 h-6 animate-bounce" /> : <Clock className="w-6 h-6" />}
                </div>

                <div>
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-black uppercase px-2.5 py-0.5 rounded-full ${
                      currentLiveOrder
                        ? remainingSeconds <= 0
                          ? 'bg-emerald-300 text-emerald-950 font-black'
                          : 'bg-emerald-200 text-emerald-900'
                        : 'bg-amber-200 text-amber-900'
                    }`}>
                      {currentLiveOrder
                        ? remainingSeconds <= 0
                          ? '✓ খাবার প্রস্তুত! টেবিলে পরিবেশন করা হচ্ছে'
                          : '● কিচেনে রান্না হচ্ছে (Cooking Confirmed)'
                        : '● ম্যানেজারের অনুমোদনের অপেক্ষায় (Pending)'}
                    </span>
                  </div>

                  <h4 className="text-sm sm:text-base font-extrabold text-slate-900 mt-1">
                    {currentLiveOrder
                      ? remainingSeconds <= 0
                        ? `Table ${tableNumber} এর রান্না সম্পন্ন হয়েছে! কিছুক্ষণের মধ্যে পরিবেশন করা হবে।`
                        : `Table ${tableNumber} এর খাবার প্রস্তুত হচ্ছে!`
                      : `Table ${tableNumber} এর অর্ডার রিকোয়েস্ট ম্যানেজার পোর্টালে পর্যালোচনায় রয়েছে`}
                  </h4>
                </div>
              </div>

              {/* SYNCHRONIZED COUNTDOWN TIME */}
              {currentLiveOrder ? (
                remainingSeconds <= 0 ? (
                  <div className="px-5 py-2.5 rounded-2xl bg-emerald-600 text-white font-mono font-black text-sm shadow-md flex items-center gap-2 shrink-0 border border-emerald-500">
                    <CheckCircle className="w-4 h-4 text-white" />
                    <span>প্রস্তুত (Ready!)</span>
                  </div>
                ) : (
                  <div className="px-5 py-2.5 rounded-2xl bg-slate-900 text-white font-mono font-black text-base shadow-md flex items-center gap-2 shrink-0 border border-slate-800">
                    <Clock className="w-4 h-4 text-amber-400 animate-spin" />
                    <span>বাকি সময়: {formattedCountdown}</span>
                  </div>
                )
              ) : (
                <div className="px-4 py-2 rounded-2xl bg-amber-200/80 text-amber-950 font-bold text-xs flex items-center gap-1.5 shrink-0">
                  <Clock className="w-3.5 h-3.5 text-amber-700 animate-pulse" />
                  <span>অনুমোদনের অপেক্ষায়</span>
                </div>
              )}
            </div>
          )}

          {/* Key Stats Bar */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-200 max-w-2xl mx-auto text-left">
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">গড় ডেলিভারি সময়</span>
              <span className="text-lg font-black text-slate-900">~১৫ মিনিট</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">কাস্টমার রেটিং</span>
              <span className="text-lg font-black text-amber-600 flex items-center gap-1">
                ★ 4.9 <span className="text-[10px] text-slate-500 font-normal">(১,২৪৮)</span>
              </span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">সার্ভিস গতি</span>
              <span className="text-lg font-black text-emerald-600">জিরো ওয়েট</span>
            </div>
            <div className="p-3.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              <span className="text-[10px] text-slate-500 block uppercase font-bold">স্মার্ট বিলিং</span>
              <span className="text-lg font-black text-slate-900">ডিজিটাল পে</span>
            </div>
          </div>
        </div>
      </section>

      {/* Culinary Art & Fresh Kitchen Dedication Banner */}
      <section className="px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 rounded-3xl p-6 sm:p-8 text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-6 overflow-hidden relative">
          <div className="space-y-3 max-w-lg z-10">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 backdrop-blur-xs text-xs font-bold text-white">
              <ChefHat className="w-4 h-4" /> ১০০% অর্গানিক ও যত্নসহকারে তৈরি
            </div>
            <h3 className="text-2xl sm:text-3xl font-black leading-tight">
              আমাদের কিচেনে প্রতিটি খাবার ভালোবাসা ও নিখুঁত যত্নে রান্না হয়
            </h3>
            <p className="text-xs sm:text-sm text-orange-100 leading-relaxed">
              স্বনামধন্য এক্সিকিউটিভ শেফদের নিবিড় তত্ত্বাবধানে স্বাস্থ্যসম্মত হাইজিন ও তাজা উপাদান দিয়ে প্রতিটি পদ প্রস্তুত করা হয়। আপনার অর্ডার টেবিলে পৌঁছানোর প্রতিটি সেকেন্ডের যত্ন আমরা নিই।
            </p>
          </div>

          <div className="flex gap-3 z-10">
            <img
              src="https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&w=350&q=80"
              alt="Master Chef Preparing Food"
              className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl object-cover shadow-lg border-2 border-white/30"
            />
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=350&q=80"
              alt="Artisanal Kitchen Plating"
              className="w-36 h-36 sm:w-44 sm:h-44 rounded-2xl object-cover shadow-lg border-2 border-white/30 hidden sm:block"
            />
          </div>
        </div>
      </section>

      {/* Customer Reviews & Featured Popular Dishes with Real Photos */}
      <section className="px-4 sm:px-6 max-w-6xl mx-auto">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-orange-600">
            Customer Impressions & Food Photos
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            মানুষ কী বলছে {RESTAURANT_INFO.name} সম্পর্কে?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600">
            কাস্টমারদের অত্যন্ত পছন্দের খাবারগুলোর ছবি এবং তাদের খাঁটি রিভিউ
          </p>
        </div>

        {/* Reviews Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {reviewsToDisplay.map((rev) => {
            const dishPhoto = rev.dishPhoto || rev.image || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=400&q=80';
            const orderedDish = rev.orderedDish || 'Chef Special Selection';
            const rating = rev.rating || rev.foodRating || 5;
            const tableLabel = rev.table || (rev.tableNumber ? `Table #${rev.tableNumber}` : 'Dine-in Guest');
            const comment = rev.comment || rev.feedbackText || 'খাবার এবং সার্ভিস অসাধারণ লেগেছে!';
            const avatar = rev.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=120&q=80';
            const name = rev.name || (rev.tableNumber ? `Table ${rev.tableNumber} Guest` : 'Happy Customer');
            const role = rev.role || (rev.invoiceNumber ? `Invoice #${rev.invoiceNumber}` : 'Verified Customer');

            return (
              <div
                key={rev.id}
                className="bg-white border border-slate-200 hover:border-orange-300 rounded-2xl shadow-xs hover:shadow-md transition-all flex flex-col justify-between overflow-hidden"
              >
                {dishPhoto && (
                  <div className="relative aspect-[16/10] overflow-hidden bg-slate-100">
                    <img
                      src={dishPhoto}
                      alt={orderedDish}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute bottom-2 left-2 bg-slate-900/85 backdrop-blur-xs text-white text-[11px] font-bold px-2.5 py-1 rounded-md">
                      ⭐ {orderedDish}
                    </div>
                  </div>
                )}

                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex text-amber-500 gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star 
                            key={i} 
                            className={`w-3.5 h-3.5 ${i < rating ? 'text-amber-500 fill-amber-500' : 'text-slate-200'}`} 
                          />
                        ))}
                      </div>
                      <span className="text-[11px] text-orange-700 bg-orange-100 px-2 py-0.5 rounded-full font-bold">
                        {tableLabel}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 leading-relaxed italic">
                      "{comment}"
                    </p>
                  </div>

                  <div className="flex items-center gap-3 pt-3 border-t border-slate-100">
                    <img
                      src={avatar}
                      alt={name}
                      className="w-9 h-9 rounded-full object-cover border border-slate-200"
                    />
                    <div>
                      <h4 className="text-xs font-bold text-slate-900">{name}</h4>
                      <p className="text-[10px] text-slate-500">{role}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
