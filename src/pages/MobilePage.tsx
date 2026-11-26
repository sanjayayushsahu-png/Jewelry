import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Battery,
  Calendar,
  Camera,
  Cpu,
  Monitor,
  Search,
  ShoppingBag,
  Smartphone,
  Zap,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderDraft, OrderModal } from '../components/OrderModal';

export const MobilePage: React.FC = () => {
  const { lang, mobileOffers } = useApp();
  const [selectedBrand, setSelectedBrand] = useState<string>('All');
  const [query, setQuery] = useState('');
  const [sortBy, setSortBy] = useState<'discount' | 'price_asc' | 'price_desc'>('discount');
  const [orderDraft, setOrderDraft] = useState<OrderDraft | null>(null);

  const activeMobiles = useMemo(() => mobileOffers.filter((m) => m.is_active), [mobileOffers]);
  const brands = useMemo(
    () => ['All', ...Array.from(new Set(activeMobiles.map((m) => m.brand)))],
    [activeMobiles],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const list = activeMobiles.filter((m) => {
      const matchBrand = selectedBrand === 'All' || m.brand === selectedBrand;
      const matchQuery =
        !q ||
        m.brand.toLowerCase().includes(q) ||
        m.model_name.toLowerCase().includes(q) ||
        m.specs_ram_storage.toLowerCase().includes(q);
      return matchBrand && matchQuery;
    });

    return [...list].sort((a, b) => {
      if (sortBy === 'price_asc') return a.discounted_price - b.discounted_price;
      if (sortBy === 'price_desc') return b.discounted_price - a.discounted_price;
      const discA = (a.original_price - a.discounted_price) / a.original_price;
      const discB = (b.original_price - b.discounted_price) / b.original_price;
      return discB - discA;
    });
  }, [activeMobiles, selectedBrand, query, sortBy]);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Smartphone Deals Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-indigo-400/35 shadow-2xl">
        <img
          src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1400&q=80"
          alt="Latest 5G Smartphone Deals"
          className="w-full h-52 sm:h-60 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-indigo-950/75 to-sky-950/35" />
        <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/75 backdrop-blur text-xs text-indigo-300 border border-indigo-500/30 hover:bg-slate-900"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> {lang === 'en' ? 'Back to Home' : 'होम पर वापस जाएं'}
            </Link>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/25 backdrop-blur border border-indigo-400/40 text-xs font-semibold text-sky-200">
              <Zap className="w-3.5 h-3.5 text-sky-400" />
              {lang === 'en' ? 'No-Cost EMI & Exchange Bonus' : 'नो-कॉस्ट EMI और एक्सचेंज बोनस'}
            </span>
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-indigo-50 flex items-center gap-2.5">
              <Smartphone className="w-7 h-7 sm:w-8 sm:h-8 text-indigo-400" />
              {lang === 'en' ? 'Latest Mobile & Smartphone Offers' : 'लेटेस्ट मोबाइल और स्मार्टफोन ऑफर'}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-200/85 mt-1">
              {lang === 'en'
                ? 'Unbeatable store prices on Apple, Samsung, OnePlus, Vivo, Xiaomi & Realme'
                : 'Apple, Samsung, OnePlus, Vivo, Xiaomi और Realme पर शानदार ऑफर'}
            </p>
          </div>
        </div>
      </div>

      {/* Search, Sort & Brand Filter Bar */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="relative flex-1 min-w-[220px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={lang === 'en' ? 'Search phone model or specs...' : 'मोबाइल मॉडल खोजें...'}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:border-indigo-400 outline-none"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'discount' | 'price_asc' | 'price_desc')}
            className="px-3.5 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-xs font-semibold text-slate-200 outline-none"
          >
            <option value="discount">{lang === 'en' ? 'Sort: Best Discount' : 'सबसे ज़्यादा छूट'}</option>
            <option value="price_asc">{lang === 'en' ? 'Price: Low to High' : 'कम से ज़्यादा कीमत'}</option>
            <option value="price_desc">{lang === 'en' ? 'Price: High to Low' : 'ज़्यादा से कम कीमत'}</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-1.5">
          {brands.map((brand) => (
            <button
              key={brand}
              onClick={() => setSelectedBrand(brand)}
              className={`px-3.5 py-1 rounded-full text-xs font-semibold border transition cursor-pointer ${
                selectedBrand === brand
                  ? 'bg-indigo-500 text-white border-indigo-400'
                  : 'bg-white/[0.04] text-slate-300 border-white/10 hover:border-indigo-400/40'
              }`}
            >
              {brand}
            </button>
          ))}
        </div>
      </div>

      {/* Smartphone Offer Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((m) => {
          const savings = m.original_price - m.discounted_price;
          const pct = Math.round((savings / m.original_price) * 100);
          return (
            <div
              key={m.id}
              className="group rounded-2xl overflow-hidden bg-slate-900/90 border border-indigo-500/25 hover:-translate-y-1 hover:border-indigo-400/80 hover:shadow-[0_18px_45px_-15px_rgba(99,102,241,0.48)] transition-all duration-300 flex flex-col"
            >
              <div className="relative h-52 bg-slate-800 overflow-hidden">
                <img
                  src={m.image_url}
                  alt={m.model_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-black shadow">
                  {m.highlight_badge}
                </span>
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500 text-slate-950 text-xs font-black">
                  -{pct}%
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-semibold text-indigo-400 uppercase">{m.brand}</div>
                  <h3 className="text-lg font-bold text-white">{m.model_name}</h3>

                  <div className="flex items-baseline gap-2.5 mt-2">
                    <span className="text-2xl font-black text-sky-400">
                      ₹{m.discounted_price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm text-slate-500 line-through">
                      ₹{m.original_price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <ul className="mt-4 space-y-2 text-xs text-slate-300">
                    <li className="flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> {m.specs_ram_storage}
                    </li>
                    <li className="flex items-center gap-2">
                      <Monitor className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> {m.specs_display}
                    </li>
                    <li className="flex items-center gap-2">
                      <Camera className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> {m.specs_camera}
                    </li>
                    <li className="flex items-center gap-2">
                      <Battery className="w-3.5 h-3.5 text-indigo-400 shrink-0" /> {m.specs_battery}
                    </li>
                  </ul>
                </div>

                <div className="mt-5 pt-3 border-t border-white/10 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-400">
                    <span className="inline-flex items-center gap-1 text-indigo-300">
                      <Calendar className="w-3.5 h-3.5" /> Valid till {m.valid_until}
                    </span>
                    <span className="text-emerald-400 font-bold">
                      Save ₹{savings.toLocaleString('en-IN')}
                    </span>
                  </div>
                  <button
                    onClick={() =>
                      setOrderDraft({
                        category: 'mobile',
                        product_name: `${m.brand} ${m.model_name}`,
                        product_price: m.discounted_price,
                        default_quantity: '1 Unit',
                      })
                    }
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-extrabold text-xs transition cursor-pointer"
                  >
                    <ShoppingBag className="w-3.5 h-3.5" />
                    {lang === 'en' ? 'Order / Book Deal' : 'ऑर्डर / बुक करें'}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <OrderModal draft={orderDraft} onClose={() => setOrderDraft(null)} />
    </div>
  );
};
