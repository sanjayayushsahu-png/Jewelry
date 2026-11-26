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
    { to: '/', label: lang === 'en' ? 'Home' : 'होम', icon: Home, accent: 'text-amber-400' },
    { to: '/jewellery', label: lang === 'en' ? 'Jewellery' : 'ज्वेलरी', icon: Gem, accent: 'text-amber-400' },
    { to: '/construction', label: lang === 'en' ? 'Construction' : 'निर्माण', icon: HardHat, accent: 'text-orange-400' },
    { to: '/mobile', label: lang === 'en' ? 'Mobiles' : 'मोबाइल', icon: Smartphone, accent: 'text-indigo-400' },
    {
      to: currentUser ? '/admin' : '/admin/login',
      label: currentUser ? (lang === 'en' ? 'Admin' : 'डैशबोर्ड') : 'Admin',
      icon: ShieldCheck,
      accent: 'text-sky-400',
    },
  ];

  // Build live market ticker items
  const tickerItems = [
    ...jewelleryRates.slice(0, 3).map((r) => ({
      to: '/jewellery',
      dot: 'bg-amber-400',
      text: `${lang === 'en' ? r.metal_name : r.metal_name_hi}: ₹${r.rate.toLocaleString('en-IN')}/${r.unit}`,
    })),
    ...constructionMaterials.slice(0, 2).map((c) => ({
      to: '/construction',
      dot: 'bg-orange-400',
      text: `${c.brand}: ₹${c.price.toLocaleString('en-IN')} ${c.unit}`,
    })),
    ...mobileOffers.slice(0, 2).map((m) => ({
      to: '/mobile',
      dot: 'bg-indigo-400',
      text: `${m.brand} ${m.model_name}: ₹${m.discounted_price.toLocaleString('en-IN')}`,
    })),
  ];

  return (
    <div className="min-h-screen flex flex-col text-slate-100 pb-24 md:pb-20">
      {/* Premium Glass Header */}
      <header className="sticky top-0 z-30 border-b border-white/10 bg-slate-950/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between gap-3">
          <Link to="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-400 via-orange-500 to-indigo-600 flex items-center justify-center font-black text-slate-950 text-sm shadow-[0_0_20px_rgba(245,158,11,0.35)] group-hover:scale-105 transition-transform">
              {settings.logo_text}
              <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-950 animate-pulse" />
            </div>
            <div>
              <div className="font-extrabold text-base sm:text-lg tracking-tight bg-gradient-to-r from-white via-amber-100 to-slate-200 bg-clip-text text-transparent leading-tight">
                {lang === 'en' ? settings.brand_name : settings.brand_name_hi}
              </div>
              <div className="text-[11px] text-slate-400 hidden sm:flex items-center gap-1.5">
                <span className="inline-block w-1.5 h-1.5 rounded-full bg-emerald-400" />
                {lang === 'en' ? settings.tagline : settings.tagline_hi}
              </div>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <span className="hidden xl:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-amber-500/15 text-sm font-extrabold tracking-wide text-amber-300 border border-amber-400/40 shadow-[0_0_15px_rgba(245,158,11,0.18)]">
              <MapPin className="w-4 h-4 text-amber-400" />
              {lang === 'en' ? 'Deokar • Saja • Bemetara' : 'देवकर • साजा • बेमेतरा'}
            </span>

            <a
              href={`tel:${settings.support_phone.replace(/\s+/g, '')}`}
              className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-xs font-semibold text-emerald-300 border border-emerald-500/25 transition"
            >
              <Phone className="w-3.5 h-3.5" />
              {settings.support_phone}
            </a>

            <button
              onClick={toggleLang}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/[0.06] hover:bg-white/[0.12] text-xs font-semibold text-slate-100 border border-white/10 transition cursor-pointer"
              title="Switch Language"
            >
              <Languages className="w-3.5 h-3.5 text-amber-400" />
              {lang === 'en' ? 'हिंदी' : 'English'}
            </button>

            <Link
              to={currentUser ? '/admin' : '/admin/login'}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-xs font-bold text-white shadow-lg shadow-indigo-600/25 transition"
            >
              <ShieldCheck className="w-3.5 h-3.5" />
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

        {/* Live Scrolling Market Rates Ticker */}
        <div className="border-t border-white/5 bg-slate-950/90 overflow-hidden py-1.5">
          <div className="animate-ticker flex items-center gap-8 text-[11px] font-medium text-slate-300">
            {[...tickerItems, ...tickerItems].map((item, idx) => (
              <Link
                key={idx}
                to={item.to}
                className="inline-flex items-center gap-2 whitespace-nowrap hover:text-white transition"
              >
                <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
                <span>{item.text}</span>
                <TrendingUp className="w-3 h-3 text-emerald-400/80" />
              </Link>
            ))}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">{children}</main>

      {/* Fixed Glass Footer / Bottom Dock */}
      <footer className="fixed bottom-0 inset-x-0 z-40 border-t border-white/10 bg-slate-950/90 backdrop-blur-xl shadow-[0_-10px_30px_rgba(0,0,0,0.45)]">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex flex-col md:flex-row items-center justify-between gap-2">
          {/* Brand & Support Info (Desktop) */}
          <div className="hidden md:flex items-center gap-4 text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <span className="w-6 h-6 rounded-lg bg-gradient-to-br from-amber-400 via-orange-500 to-indigo-600 flex items-center justify-center font-black text-slate-950 text-[10px]">
                {settings.logo_text}
              </span>
              <span className="font-bold text-slate-100">
                {lang === 'en' ? settings.brand_name : settings.brand_name_hi}
              </span>
            </div>
            <a
              href={`tel:${settings.support_phone.replace(/\s+/g, '')}`}
              className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-medium"
            >
              <Phone className="w-3.5 h-3.5" /> {settings.support_phone}
            </a>
            <span className="hidden xl:inline-flex items-center gap-1 text-slate-400">
              <MapPin className="w-3.5 h-3.5 text-slate-500" /> {settings.address}
            </span>
          </div>

          {/* Quick Navigation Dock */}
          <nav className="w-full md:w-auto flex items-center justify-around md:gap-1.5">
            {navItems.map(({ to, label, icon: Icon, accent }) => {
              const active = pathname === to || (to !== '/' && pathname.startsWith(to));
              return (
                <Link
                  key={to}
                  to={to}
                  className={`relative flex flex-col md:flex-row items-center gap-0.5 md:gap-1.5 px-3 py-1.5 rounded-xl text-[11px] md:text-xs font-semibold transition-all ${
                    active
                      ? `bg-white/10 ${accent} ring-1 ring-white/15 shadow-inner`
                      : 'text-slate-400 hover:text-slate-100 hover:bg-white/[0.05]'
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
