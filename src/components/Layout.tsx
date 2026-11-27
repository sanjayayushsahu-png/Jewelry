import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  Gem,
  HardHat,
  Home,
  Languages,
  MapPin,
  Phone,
  ShieldCheck,
  Smartphone,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const {
    lang,
    toggleLang,
    settings,
    currentUser,
    jewelleryRates,
    constructionMaterials,
    mobileOffers,
  } = useApp();
  const { pathname } = useLocation();

  const navItems = [
    { to: '/', label: lang === 'en' ? 'Home' : 'होम', icon: Home, activeCls: 'bg-amber-100 text-amber-900 ring-amber-300' },
    { to: '/jewellery', label: lang === 'en' ? 'Jewellery' : 'ज्वेलरी', icon: Gem, activeCls: 'bg-[#5C0E1C]/10 text-[#5C0E1C] ring-[#5C0E1C]/30' },
    { to: '/construction', label: lang === 'en' ? 'Construction' : 'निर्माण', icon: HardHat, activeCls: 'bg-orange-100 text-orange-800 ring-orange-300' },
    { to: '/mobile', label: lang === 'en' ? 'Mobiles' : 'मोबाइल', icon: Smartphone, activeCls: 'bg-indigo-100 text-indigo-800 ring-indigo-300' },
    {
      to: currentUser ? '/admin' : '/admin/login',
      label: currentUser ? (lang === 'en' ? 'Admin' : 'डैशबोर्ड') : 'Admin',
      icon: ShieldCheck,
      activeCls: 'bg-slate-900 text-amber-300 ring-slate-700',
    },
  ];

  const tickerItems = [
    ...jewelleryRates.slice(0, 3).map((r) => ({
      to: '/jewellery',
      dot: 'bg-amber-300',
      text: `${lang === 'en' ? r.metal_name : r.metal_name_hi}: ₹${r.rate.toLocaleString('en-IN')}/${r.unit}`,
    })),
    ...constructionMaterials.slice(0, 2).map((c) => ({
      to: '/construction',
      dot: 'bg-orange-400',
      text: `${c.brand}: ₹${c.price.toLocaleString('en-IN')} ${c.unit}`,
    })),
    ...mobileOffers.slice(0, 2).map((m) => ({
      to: '/mobile',
      dot: 'bg-sky-300',
      text: `${m.brand} ${m.model_name}: ₹${m.discounted_price.toLocaleString('en-IN')}`,
    })),
  ];

  return (
    <div className="min-h-screen flex flex-col text-slate-900 pb-24 md:pb-20">
      {/* Royal Ivory Frosted Header */}
      <header className="sticky top-0 z-30 border-b border-amber-200/80 bg-white/90 backdrop-blur-xl shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-[#5C0E1C] via-[#8C1D2C] to-amber-500 flex items-center justify-center font-black text-amber-100 text-sm shadow-md shadow-amber-900/20 group-hover:scale-105 transition-transform">
              {settings.logo_text}
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white animate-pulse" />
            </div>
            <div>
              <div className="font-black text-base sm:text-lg tracking-tight text-slate-900 leading-tight">
                {lang === 'en' ? settings.brand_name : settings.brand_name_hi}
              </div>
              <div className="text-[11px] text-slate-500 hidden sm:flex items-center gap-1.5 font-medium">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-500" />
                {lang === 'en' ? settings.tagline : settings.tagline_hi}
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <span className="hidden xl:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-50 text-sm font-extrabold tracking-wide text-[#5C0E1C] border border-amber-300 shadow-xs">
              <MapPin className="w-4 h-4 text-amber-600" />
              {lang === 'en' ? 'Deokar • Saja • Bemetara' : 'देवकर • साजा • बेमेतरा'}
            </span>

            <a
              href={`tel:${settings.support_phone.replace(/\s+/g, '')}`}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-xs font-bold text-emerald-800 border border-emerald-200 transition"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-600" />
              {settings.support_phone}
            </a>

            <button
              onClick={toggleLang}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-amber-100/80 text-xs font-bold text-slate-800 border border-slate-200 transition cursor-pointer"
              title="Switch Language"
            >
              <Languages className="w-3.5 h-3.5 text-amber-600" />
              {lang === 'en' ? 'हिंदी' : 'English'}
            </button>

            <Link
              to={currentUser ? '/admin' : '/admin/login'}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-[#5C0E1C] to-indigo-700 hover:opacity-95 text-xs font-bold text-white shadow-md transition"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-amber-300" />
              {currentUser
                ? currentUser.role === 'super_admin'
                  ? 'Super Admin'
                  : 'Sub-Admin'
                : lang === 'en'
                  ? 'Admin'
                  : 'एडमिन'}
            </Link>
          </div>
        </div>

        {/* Royal Maroon Live Market Ticker Ribbon */}
        <div className="bg-gradient-to-r from-[#3A0913] via-[#5C0E1C] to-[#1E1B4B] overflow-hidden py-1.5 border-t border-amber-400/30">
          <div className="animate-ticker flex items-center gap-8 text-[11px] font-semibold text-amber-50">
            {[...tickerItems, ...tickerItems].map((item, idx) => (
              <Link
                key={idx}
                to={item.to}
                className="inline-flex items-center gap-2 whitespace-nowrap hover:text-amber-300 transition"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
                <span>{item.text}</span>
                <TrendingUp className="w-3 h-3 text-emerald-300" />
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Fixed Clean Light Bottom Bar */}
      <footer className="fixed bottom-0 inset-x-0 z-40 border-t border-slate-200 bg-white/95 backdrop-blur-xl shadow-[0_-8px_30px_rgba(15,23,42,0.08)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex flex-col md:flex-row items-center justify-between gap-2">
          {/* Brand & Support Info (Desktop) */}
          <div className="hidden md:flex items-center gap-4 text-xs text-slate-600">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-[#5C0E1C] to-amber-500 flex items-center justify-center font-black text-amber-100 text-[10px]">
                {settings.logo_text}
              </span>
              <span className="font-extrabold text-slate-900">
                {lang === 'en' ? settings.brand_name : settings.brand_name_hi}
              </span>
            </div>
            <a
              href={`tel:${settings.support_phone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-1 text-emerald-700 hover:text-emerald-800 font-bold"
            >
              <Phone className="w-3.5 h-3.5" /> {settings.support_phone}
            </a>
            <span className="hidden xl:inline-flex items-center gap-1 text-slate-500 font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-600" /> {settings.address}
            </span>
          </div>

          {/* Quick Navigation Dock */}
          <nav className="w-full md:w-auto flex items-center justify-around md:gap-1.5">
            {navItems.map(({ to, label, icon: Icon, activeCls }) => {
              const active = pathname === to || (to !== '/' && pathname.startsWith(to));
              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative flex flex-col md:flex-row items-center gap-0.5 md:gap-1.5 px-3 py-1.5 rounded-xl text-[11px] md:text-xs font-bold transition-all ${
                    active
                      ? `${activeCls} ring-1 shadow-xs`
                      : 'text-slate-600 hover:text-slate-950 hover:bg-slate-100'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{label}</span>
                </Link>
              );
            })}
          </nav>
        </div>
      </footer>
    </div>
  );
};
