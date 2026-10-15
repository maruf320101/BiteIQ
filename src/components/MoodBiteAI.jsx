import React, { useState } from 'react';
import { Bot, Sparkles, Send, Brain, HeartPulse, Plus } from 'lucide-react';
import { getAIMoodRecommendation } from '../services/aiAdvisor';

export default function MoodBiteAI({ onAddToCart, isOpen, onClose }) {
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [recommendation, setRecommendation] = useState(null);

  const quickPrompts = [
    { label: "মাথা খুব ব্যথা করছে", icon: "🤕", prompt: "আমার খুব মাথা ব্যথা করছে এবং টেনশন লাগছে। চা বা কফি কোনটা খেলে শান্ত হব?" },
    { label: "খুব ক্লান্ত ও ঘুম ঘুম ভাব", icon: "🥱", prompt: "অফিসের কাজের পর খুব ক্লান্ত, ঘুম ভাব কাটানোর জন্য হাই-এনার্জি কিছু চাই।" },
    { label: "মন খারাপ / স্ট্রেসড", icon: "😔", prompt: "আজ মনটা ভালো নেই, একটু মুড ভালো করার মতো কমফোর্ট খাবার চাই।" },
    { label: "তীব্র ক্ষুধা ও ঝাল কিছু", icon: "🔥", prompt: "প্রচণ্ড ক্ষুধা লেগেছে, স্পাইসি ও ভরপেট কিছু সাজেস্ট করো।" }
  ];

  const handleAskAI = async (text) => {
    const query = text || input;
    if (!query.trim()) return;

    setLoading(true);
    setRecommendation(null);
    try {
      const res = await getAIMoodRecommendation(query);
      setRecommendation(res);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl bg-white border border-slate-200 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between bg-slate-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-orange-500 to-amber-500 flex items-center justify-center shadow-md shadow-orange-500/20">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-slate-900 text-lg">MoodBite™ AI Sommelier</h3>
                <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-emerald-100 text-emerald-700">
                  সক্রিয়
                </span>
              </div>
              <p className="text-xs text-slate-500">আপনার শারীরিক অবস্থান ও মেজাজ অনুযায়ী নিখুঁত খাবারের পরামর্শ</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-200 hover:bg-slate-300 text-slate-700 flex items-center justify-center transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto space-y-5 flex-1">
          {/* Quick Prompts */}
          <div>
            <p className="text-xs font-bold text-slate-600 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Brain className="w-3.5 h-3.5 text-orange-600" />
              কুইক সিলেকশন (বা নিচে লিখে জানান):
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {quickPrompts.map((q, idx) => (
                <button
                  key={idx}
                  onClick={() => {
                    setInput(q.prompt);
                    handleAskAI(q.prompt);
                  }}
                  className="flex items-center gap-2.5 p-2.5 rounded-xl bg-slate-50 hover:bg-orange-50 border border-slate-200 hover:border-orange-300 text-left text-xs text-slate-700 transition-all group"
                >
                  <span className="text-base">{q.icon}</span>
                  <span className="group-hover:text-orange-600 transition-colors font-semibold">
                    {q.label}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* AI Response Area */}
          {loading && (
            <div className="p-8 rounded-2xl bg-orange-50 border border-orange-200 text-center space-y-3">
              <div className="w-12 h-12 rounded-full bg-orange-100 mx-auto flex items-center justify-center text-orange-600">
                <Brain className="w-6 h-6 animate-spin" />
              </div>
              <p className="text-sm font-bold text-orange-900">
                AI গ্যাস্ট্রোনমি নিউরাল ইঞ্জিন আপনার চাহিদা অ্যানালাইসিস করছে...
              </p>
              <p className="text-xs text-slate-500">নিখুঁত চা/কফি এবং খাবারের সমন্বয় প্রস্তুত হচ্ছে</p>
            </div>
          )}

          {recommendation && !loading && (
            <div className="rounded-2xl bg-slate-50 border border-orange-200 p-5 space-y-4">
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <HeartPulse className="w-4 h-4 text-orange-600" />
                    <span className="text-xs font-bold text-orange-600 uppercase tracking-wider">
                      AI Gastronomy Recommendation
                    </span>
                  </div>
                  <h4 className="text-base font-extrabold text-slate-900">{recommendation.title}</h4>
                </div>
              </div>

              {/* Analysis Explanation */}
              <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-xs text-slate-700 space-y-2 leading-relaxed">
                <p>
                  <span className="text-orange-700 font-bold">💡 সায়েন্টিফিক কারণ: </span>
                  {recommendation.analysis}
                </p>
                <p className="text-emerald-700 font-medium pt-1 border-t border-slate-100">
                  <span className="text-emerald-700 font-bold">🎯 পরামর্শ: </span>
                  {recommendation.advice}
                </p>
              </div>

              {/* Suggested Items (Text Focused) */}
              <div className="space-y-2">
                <p className="text-xs font-bold text-slate-600 uppercase tracking-wider">
                  মেনু থেকে সাজেস্টেড আইটেমস:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {recommendation.suggestedItems.map((item) => (
                    <div
                      key={item.id}
                      className="p-3.5 rounded-xl bg-white border border-slate-200 hover:border-orange-400 transition-all flex flex-col justify-between"
                    >
                      <div className="mb-2">
                        <h5 className="text-xs font-bold text-slate-900">{item.name}</h5>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">
                          {item.description}
                        </p>
                        <div className="flex items-center gap-2 mt-1.5">
                          <span className="text-xs font-black text-slate-900">৳{item.price}</span>
                          <span className="text-[10px] text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded font-semibold">
                            ⏱ {item.prepTime} মিনিট
                          </span>
                        </div>
                      </div>

                      <button
                        onClick={() => onAddToCart(item)}
                        className="w-full mt-2 py-1.5 px-3 rounded-lg bg-orange-500 hover:bg-orange-600 text-white text-xs font-bold flex items-center justify-center gap-1.5 transition-all shadow-xs"
                      >
                        <Plus className="w-3.5 h-3.5" /> কার্টে যুক্ত করুন
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 border-t border-slate-200 bg-slate-50">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleAskAI();
            }}
            className="flex items-center gap-2"
          >
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="যেমন: আমার প্রচণ্ড মাথা ব্যথা করছে, চা খাবো না কফি?..."
              className="flex-1 bg-white border border-slate-300 focus:border-orange-500 rounded-xl px-4 py-3 text-xs sm:text-sm text-slate-900 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              disabled={loading || !input.trim()}
              className="p-3 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white font-semibold transition-all shadow-md shadow-orange-500/20"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
