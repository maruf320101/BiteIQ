import React, { useState } from 'react';
import { Lock, Mail, ShieldAlert, ArrowRight, X, ChefHat, CheckCircle2 } from 'lucide-react';

export default function AdminLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Credentials provided by the user
    const targetEmail = 'biteiq@gmail.com';
    const targetPass = '123';

    if (email.trim().toLowerCase() === targetEmail && password === targetPass) {
      onLoginSuccess();
      onClose();
    } else {
      setError('ভুল ইমেইল অথবা পাসওয়ার্ড! অনুগ্রহ করে সঠিক তথ্য দিন।');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-xs animate-fadeIn">
      <div className="relative w-full max-w-md bg-white border border-slate-200 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-700 bg-slate-100 p-2 rounded-full transition-colors"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Icon & Heading */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 mx-auto flex items-center justify-center shadow-md shadow-orange-500/15">
            <Lock className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">অ্যাডমিন / ম্যানেজার লগইন</h3>
          <p className="text-xs text-slate-500">
            শুধুমাত্র রেস্টুরেন্ট কর্তৃপক্ষের ব্যবহারের জন্য।
          </p>
        </div>

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">ইমেইল অ্যাড্রেস</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="biteiq@gmail.com"
                className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">পাসওয়ার্ড</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••"
                className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              className="w-full py-3.5 px-4 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs shadow-lg shadow-orange-500/25 transition-all flex items-center justify-center gap-2 active:scale-98"
            >
              <span>ড্যাশবোর্ডে প্রবেশ করুন</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="p-3 rounded-xl bg-slate-50 border border-slate-200 text-center">
          <p className="text-[11px] text-slate-500">
            ডেমো অ্যাক্সেস ক্রেডেনশিয়াল: <br />
            ইমেইল: <strong className="text-slate-800">biteiq@gmail.com</strong> | পাসওয়ার্ড: <strong className="text-slate-800">123</strong>
          </p>
        </div>
      </div>
    </div>
  );
}
