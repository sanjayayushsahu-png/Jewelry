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
      <div className="relative rounded-3xl overflow-hidden border border-indigo-300 shadow-lg">
        <img
          src="https://images.unsplash.com/photo-1598327105666-5b89351aff97?auto=format&fit=crop&w=1400&q=80"
          alt="Latest 5G Smartphone Deals"
          className="w-full h-52 sm:h-60 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-950/95 via-indigo-900/75 to-blue-900/35" />
        <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/95 text-xs font-bold text-indigo-800 shadow hover:bg-indigo-50"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> {lang === 'en' ? 'Back to Home' : 'होम पर वापस जाएं'}
            </Link>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-sky-400 text-slate-950 text-xs font-black shadow">
              <Zap className="w-3.5 h-3.5" />
              {lang === 'en' ? 'No-Cost EMI & Exchange Bonus' : 'नो-कॉस्ट EMI और एक्सचेंज बोनस'}
            </span>
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-white flex items-center gap-2.5">
              <Smartphone className="w-7 h-7 sm:w-8 sm:h-8 text-sky-300" />
              {lang === 'en' ? 'Latest Mobile & Smartphone Offers' : 'लेटेस्ट मोबाइल और स्मार्टफोन ऑफर'}
            </h1>
            <p className="text-xs sm:text-sm text-indigo-100 mt-1">
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
              className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-white border border-slate-200 text-sm text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 outline-none shadow-xs"
            />
          </div>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'discount' | 'price_asc' | 'price_desc')}
            className="px-3.5 py-2.5 rounded-xl bg-white border border-indigo-200 text-xs font-bold text-slate-800 outline-none shadow-xs"
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
              className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer ${
                selectedBrand === brand
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                  : 'bg-white text-slate-700 border-indigo-200 hover:border-indigo-400'
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
              className="group rounded-2xl overflow-hidden bg-white border border-indigo-200 shadow-sm hover:-translate-y-1 hover:border-indigo-400 hover:shadow-xl hover:shadow-indigo-900/10 transition-all duration-300 flex flex-col"
            >
              <div className="relative h-52 bg-slate-100 overflow-hidden">
                <img
                  src={m.image_url}
                  alt={m.model_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-indigo-600 text-white text-[10px] font-black shadow">
                  {m.highlight_badge}
                </span>
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-emerald-500 text-white text-xs font-black shadow">
                  -{pct}%
                </span>
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <div className="text-xs font-extrabold text-indigo-600 uppercase">{m.brand}</div>
                  <h3 className="text-lg font-extrabold text-slate-900">{m.model_name}</h3>

                  <div className="flex items-baseline gap-2.5 mt-2">
                    <span className="text-2xl font-black text-indigo-700">
                      ₹{m.discounted_price.toLocaleString('en-IN')}
                    </span>
                    <span className="text-sm text-slate-400 line-through">
                      ₹{m.original_price.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <ul className="mt-4 space-y-2 text-xs font-medium text-slate-600">
                    <li className="flex items-center gap-2">
                      <Cpu className="w-3.5 h-3.5 text-indigo-600 shrink-0" /> {m.specs_ram_storage}
                    </li>
                    <li className="flex items-center gap-2">
                      <Monitor className="w-3.5 h-3.5 text-indigo-600 shrink-0" /> {m.specs_display}
                    </li>
                    <li className="flex items-center gap-2">
                      <Camera className="w-3.5 h-3.5 text-indigo-600 shrink-0" /> {m.specs_camera}
                    </li>
                    <li className="flex items-center gap-2">
                      <Battery className="w-3.5 h-3.5 text-indigo-600 shrink-0" /> {m.specs_battery}
                    </li>
                  </ul>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100 space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="inline-flex items-center gap-1 text-indigo-700 font-semibold">
                      <Calendar className="w-3.5 h-3.5" /> Valid till {m.valid_until}
                    </span>
                    <span className="text-emerald-700 font-extrabold">
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
                    className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-indigo-600 to-blue-600 hover:opacity-95 text-white font-extrabold text-xs shadow-sm transition cursor-pointer"
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
