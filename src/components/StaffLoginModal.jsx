import React, { useState } from 'react';
import { Lock, Mail, ShieldAlert, ArrowRight, X, UserCheck, Shield } from 'lucide-react';

export default function StaffLoginModal({ isOpen, onClose, onLoginSuccess }) {
  const [role, setRole] = useState('manager'); // 'admin' | 'manager'
  const [email, setEmail] = useState('manager@biteiq.com');
  const [password, setPassword] = useState('123');
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleRoleSwitch = (selectedRole) => {
    setRole(selectedRole);
    setError('');
    if (selectedRole === 'admin') {
      setEmail('admin@biteiq.com');
      setPassword('admin123');
    } else {
      setEmail('manager@biteiq.com');
      setPassword('123');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (role === 'admin') {
      if (
        (email.trim().toLowerCase() === 'admin@biteiq.com' || email.trim().toLowerCase() === 'biteiq@gmail.com') &&
        (password === 'admin123' || password === '123')
      ) {
        onLoginSuccess('admin');
        onClose();
      } else {
        setError('Invalid Admin credentials! Use admin@biteiq.com / admin123');
      }
    } else {
      if (
        (email.trim().toLowerCase() === 'manager@biteiq.com' || email.trim().toLowerCase() === 'biteiq@gmail.com') &&
        password === '123'
      ) {
        onLoginSuccess('manager');
        onClose();
      } else {
        setError('Invalid Manager credentials! Use manager@biteiq.com / 123');
      }
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

        {/* Heading */}
        <div className="text-center space-y-2">
          <div className="w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 mx-auto flex items-center justify-center shadow-md shadow-orange-500/15">
            <Shield className="w-7 h-7" />
          </div>
          <h3 className="text-2xl font-black text-slate-900">Staff & Management Portal</h3>
          <p className="text-xs text-slate-500">
            Secure enterprise access for BiteIQ administration.
          </p>
        </div>

        {/* Role Selector Tabs */}
        <div className="grid grid-cols-2 gap-2 p-1.5 bg-slate-100 rounded-2xl border border-slate-200">
          <button
            type="button"
            onClick={() => handleRoleSwitch('manager')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              role === 'manager'
                ? 'bg-orange-500 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <UserCheck className="w-4 h-4" />
            <span>Floor Manager</span>
          </button>

          <button
            type="button"
            onClick={() => handleRoleSwitch('admin')}
            className={`py-2 px-3 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-1.5 ${
              role === 'admin'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Shield className="w-4 h-4" />
            <span>Super Admin</span>
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs font-semibold flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 shrink-0 text-red-600" />
              <span>{error}</span>
            </div>
          )}

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Work Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@biteiq.com"
                className="w-full bg-slate-50 border border-slate-200 focus:border-orange-500 rounded-xl pl-10 pr-4 py-2.5 text-xs text-slate-900 focus:outline-none"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-700">Security Password</label>
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
              className={`w-full py-3.5 px-4 rounded-xl text-white font-bold text-xs shadow-lg transition-all flex items-center justify-center gap-2 active:scale-98 ${
                role === 'admin'
                  ? 'bg-slate-900 hover:bg-slate-800 shadow-slate-900/20'
                  : 'bg-orange-500 hover:bg-orange-600 shadow-orange-500/25'
              }`}
            >
              <span>Access {role === 'admin' ? 'Admin Executive Suite' : 'Manager Operations'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        <div className="p-3 rounded-2xl bg-slate-50 border border-slate-200 text-center">
          <p className="text-[11px] text-slate-500 leading-relaxed font-mono">
            {role === 'admin' ? (
              <>Demo Admin: <strong>admin@biteiq.com</strong> / <strong>admin123</strong></>
            ) : (
              <>Demo Manager: <strong>manager@biteiq.com</strong> / <strong>123</strong></>
            )}
          </p>
        </div>
      </div>
    </div>
  );
}
