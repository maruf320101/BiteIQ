import React, { useState } from 'react';
import { 
  Star, 
  Heart, 
  MessageSquare, 
  X, 
  CheckCircle2, 
  Coins, 
  Sparkles, 
  ThumbsUp, 
  Award 
} from 'lucide-react';
import confetti from 'canvas-confetti';

export default function CustomerReviewModal({
  isOpen,
  onClose,
  tableNumber = 4,
  invoiceNumber = '',
  totalAmount = 0,
  onSubmitReview
}) {
  if (!isOpen) return null;

  const [foodRating, setFoodRating] = useState(5);
  const [serviceRating, setServiceRating] = useState(5);
  const [feedbackText, setFeedbackText] = useState('');
  const [tipAmount, setTipAmount] = useState(0); // 0, 50, 100, 200
  const [isSubmitted, setIsSubmitted] = useState(false);

  // 5% Loyalty coins earned from this dining
  const coinsEarned = Math.round(totalAmount * 0.05);

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitted(true);

    try {
      confetti({
        particleCount: 70,
        spread: 60,
        origin: { y: 0.55 }
      });
    } catch {}

    if (onSubmitReview) {
      onSubmitReview({
        tableNumber,
        invoiceNumber,
        foodRating,
        serviceRating,
        feedbackText,
        tipAmount,
        coinsEarned
      });
    }

    setTimeout(() => {
      onClose();
    }, 2400);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-white rounded-3xl p-6 shadow-2xl border border-slate-100 overflow-hidden text-slate-900 animate-scaleUp">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 flex items-center justify-center transition-all cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {isSubmitted ? (
          <div className="py-8 text-center space-y-3 animate-fadeIn">
            <div className="w-16 h-16 mx-auto rounded-3xl bg-emerald-50 text-emerald-600 flex items-center justify-center shadow-inner">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <h3 className="text-xl font-black text-slate-900">
              ধন্যবাদ আপনার মতামতের জন্য!
            </h3>
            <p className="text-xs text-slate-500 max-w-xs mx-auto">
              আপনার মতামত আমাদের শেফ ও সার্ভিস টিমের কাজে অনুপ্রেরণা জোগাবে।
            </p>

            {/* Loyalty coins badge */}
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-amber-800 text-xs font-bold mt-2">
              <Coins className="w-4 h-4 text-amber-600 animate-spin" />
              <span>+{coinsEarned} BiteIQ লয়্যালটি কয়েন যুক্ত হয়েছে!</span>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Header */}
            <div className="text-center space-y-1">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-50 text-orange-600 text-[11px] font-black uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5" />
                <span>আপনার অভিজ্ঞতা কেমন ছিল?</span>
              </div>
              <h3 className="text-lg font-black text-slate-900">
                খাবার ও সেবার রেটিং দিন
              </h3>
              <p className="text-xs text-slate-500">
                Table {tableNumber} • ইনভয়েস: {invoiceNumber}
              </p>
            </div>

            {/* Food Rating Stars */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>🍽️ খাবারের মান ও স্বাদ (Food Quality)</span>
                <span className="text-amber-600 font-extrabold">{foodRating} / 5</span>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setFoodRating(star)}
                    className="p-1 hover:scale-125 transition-transform cursor-pointer"
                  >
                    <Star 
                      className={`w-7 h-7 ${
                        star <= foodRating 
                          ? 'text-amber-400 fill-amber-400' 
                          : 'text-slate-200'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>

            {/* Service Rating Stars */}
            <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-100 space-y-1.5">
              <div className="flex justify-between items-center text-xs font-bold text-slate-700">
                <span>🛎️ ওয়েটার ও সার্ভিস স্পিড (Service Speed)</span>
                <span className="text-amber-600 font-extrabold">{serviceRating} / 5</span>
              </div>
              <div className="flex items-center justify-center gap-2 pt-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setServiceRating(star)}
                    className="p-1 hover:scale-125 transition-transform cursor-pointer"
                  >
                    <Star 
                      className={`w-7 h-7 ${
                        star <= serviceRating 
                          ? 'text-amber-400 fill-amber-400' 
                          : 'text-slate-200'
                      }`} 
                    />
                  </button>
                ))}
              </div>
            </div>



            {/* Comments Input */}
            <div>
              <label className="block text-[11px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                শেফ বা ম্যানেজারের জন্য কোনো বার্তা?
              </label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                rows={2}
                placeholder="খাবারের স্বাদ চমৎকার ছিল বা কোনো পরামর্শ থাকলে লিখুন..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-2.5 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            {/* Loyalty bonus promo note */}
            <div className="flex items-center gap-2 p-2.5 bg-amber-50/80 rounded-xl border border-amber-200/60 text-[11px] text-amber-900 font-medium">
              <Award className="w-4 h-4 text-amber-600 shrink-0" />
              <span>রিভিউ সাবমিট করলেই পাবেন <strong className="font-bold">+{coinsEarned} BiteIQ কয়েন</strong> যা পরবর্তী অর্ডারে ডিসকাউন্টে ব্যবহারযোগ্য!</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-600 hover:to-amber-600 text-white font-black text-xs uppercase tracking-wider transition-all shadow-md shadow-orange-500/30 active:scale-98 cursor-pointer"
            >
              রেটিং সাবমিট করুন ও কয়েন নিন
            </button>
          </form>
        )}

      </div>
    </div>
  );
}
