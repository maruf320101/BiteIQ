import React, { useState } from 'react';
import { Clock, Plus, Check, Flame, Star, Trash2 } from 'lucide-react';

export default function MenuSection({ items, onAddToCart, onRemoveFromCart, cartItems }) {
  const [selectedCategory, setSelectedCategory] = useState('All');
  const categories = ['All', 'Mains', 'Starters', 'Beverages', 'Desserts'];

  const filteredItems = selectedCategory === 'All'
    ? items
    : items.filter(item => item.category === selectedCategory);

  const getItemCartQuantity = (id) => {
    const found = cartItems.find(item => item.id === id);
    return found ? found.quantity : 0;
  };

  return (
    <section id="menu-section" className="py-10 px-4 sm:px-6 max-w-6xl mx-auto">
      {/* Header & Category Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4 border-b border-slate-200 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-orange-100 text-orange-700 text-xs font-bold mb-2">
            <Flame className="w-3.5 h-3.5 text-orange-600" /> Direct Kitchen Telemetry
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            রেস্টুরেন্ট মেনু ও সরাসরি অর্ডার
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            প্রতিটি পদের ছবি, দাম ও প্রিপারেশন টাইম দেখে পছন্দের খাবার সিলেক্ট করে সরাসরি কিচেনে পাঠান।
          </p>
        </div>

        {/* Clean, Uniform Category Pills */}
        <div className="flex items-center gap-1.5 bg-slate-100 p-1.5 rounded-2xl border border-slate-200 shrink-0">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all text-center ${
                selectedCategory === cat
                  ? 'bg-orange-500 text-white shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Menu Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredItems.map((item) => {
          const qty = getItemCartQuantity(item.id);
          return (
            <div
              key={item.id}
              className="bg-white border border-slate-200 hover:border-orange-300 rounded-3xl p-4 shadow-xs hover:shadow-md transition-all flex flex-col sm:flex-row gap-4 h-auto sm:h-56 justify-between group overflow-hidden"
            >
              {/* Image Section */}
              <div className="relative w-full sm:w-44 h-44 sm:h-full rounded-2xl overflow-hidden bg-slate-100 shrink-0">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  loading="lazy"
                />
                {item.tag && (
                  <span className="absolute top-2 left-2 px-2 py-0.5 rounded-md text-[10px] font-bold uppercase tracking-wider bg-slate-900/80 text-white backdrop-blur-xs">
                    {item.tag}
                  </span>
                )}
                <div className="absolute bottom-2 left-2 inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/95 text-slate-800 text-[10px] font-bold shadow-xs">
                  <Clock className="w-3.5 h-3.5 text-orange-600" />
                  <span>{item.prepTime} মিনিট</span>
                </div>
              </div>

              {/* Item Content Section */}
              <div className="flex-1 min-w-0 flex flex-col justify-between py-1">
                <div className="space-y-1.5">
                  <h3 className="font-extrabold text-slate-900 text-base group-hover:text-orange-600 transition-colors truncate">
                    {item.name}
                  </h3>

                  {/* Rating & Calories */}
                  <div className="flex items-center gap-2 text-xs text-slate-500">
                    <span className="flex items-center gap-1 font-bold text-amber-500">
                      <Star className="w-3.5 h-3.5 fill-amber-500" />
                      {item.rating}
                    </span>
                    <span className="text-slate-300">•</span>
                    <span className="text-slate-500 font-medium">{item.calories}</span>
                  </div>

                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {item.description}
                  </p>
                </div>

                {/* Price and Cart Action Buttons */}
                <div className="pt-2 border-t border-slate-100 flex items-center justify-between mt-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-slate-400 block leading-tight">মূল্য</span>
                    <span className="text-lg font-black text-slate-900">৳{item.price}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Delete Icon Button (Active only when item is added to cart) */}
                    {qty > 0 && (
                      <button
                        onClick={() => onRemoveFromCart(item.id)}
                        title="কার্ট থেকে খাবারটি বাদ দিন"
                        className="p-2 rounded-xl bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 transition-all active:scale-90 flex items-center justify-center shadow-xs"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    )}

                    {/* Add to Cart / Added Button */}
                    <button
                      onClick={() => {
                        if (qty < 3) {
                          onAddToCart(item);
                        }
                      }}
                      disabled={qty >= 3}
                      title={qty >= 3 ? "সর্বোচ্চ ৩টি অর্ডার করা সম্ভব" : "কার্টে যোগ করুন"}
                      className={`px-3.5 py-2 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all active:scale-95 shadow-xs whitespace-nowrap ${
                        qty >= 3
                          ? 'bg-slate-400 text-white cursor-not-allowed opacity-90'
                          : qty > 0
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/20'
                          : 'bg-orange-500 hover:bg-orange-600 text-white shadow-orange-500/20'
                      }`}
                    >
                      {qty >= 3 ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> (3 Max) লিমিট পূর্ণ
                        </>
                      ) : qty > 0 ? (
                        <>
                          <Check className="w-3.5 h-3.5" /> ({qty}) যুক্ত হয়েছে
                        </>
                      ) : (
                        <>
                          <Plus className="w-3.5 h-3.5" /> কার্টে যুক্ত করুন
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
