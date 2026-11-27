import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Mail, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { isSupabaseConfigured } from '../lib/supabase';

export const AdminLoginPage: React.FC = () => {
  const { login } = useApp();
  const navigate = useNavigate();
  const [email, setEmail] = useState(isSupabaseConfigured ? '' : 'super@bazaar.com');
  const [password, setPassword] = useState(isSupabaseConfigured ? '' : 'password123');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    const res = await login(email, password);
    if (res.ok) navigate('/admin');
    else setError(res.error ?? 'Login failed');
  };

  return (
    <div className="max-w-md mx-auto px-4 py-12">
      <div className="p-6 sm:p-8 rounded-3xl bg-white border border-amber-200 shadow-xl">
        <div className="w-12 h-12 rounded-2xl bg-[#5C0E1C]/10 border border-[#5C0E1C]/20 flex items-center justify-center mb-4">
          <ShieldCheck className="w-6 h-6 text-[#5C0E1C]" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">Admin Portal Login</h1>
        <p className="text-xs text-slate-500 mt-1 mb-6">
          Role-Based Access for Super Admin &amp; Category Sub-Admins
        </p>

        {error && (
          <div className="mb-4 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs font-semibold">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="Enter your admin email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#7A1C24] focus:bg-white outline-none"
              />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-slate-700 block mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:border-[#7A1C24] focus:bg-white outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-[#5C0E1C] to-indigo-700 hover:opacity-95 text-white font-bold text-sm shadow-md transition cursor-pointer"
          >
            Sign In
          </button>
        </form>

        {!isSupabaseConfigured && (
          <div className="mt-6 pt-5 border-t border-slate-100 space-y-2">
            <div className="text-[11px] font-bold text-slate-500 uppercase">
              Quick Demo Accounts (password: password123)
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { label: 'Super Admin', mail: 'super@bazaar.com' },
                { label: 'Jewellery Sub-Admin', mail: 'jewellery@bazaar.com' },
                { label: 'Construction Sub-Admin', mail: 'construction@bazaar.com' },
                { label: 'Mobile Sub-Admin', mail: 'mobile@bazaar.com' },
              ].map((acc) => (
                <button
                  key={acc.mail}
                  type="button"
                  onClick={() => {
                    setEmail(acc.mail);
                    setPassword('password123');
                  }}
                  className="p-2 rounded-lg bg-slate-50 hover:bg-amber-50 border border-slate-200 text-slate-700 font-medium text-left transition cursor-pointer"
                >
                  {acc.label}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
