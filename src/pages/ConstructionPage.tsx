import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Calculator,
  CheckCircle2,
  HardHat,
  Package,
  Search,
  ShoppingBag,
  Tag,
  Truck,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderDraft, OrderModal } from '../components/OrderModal';

export const ConstructionPage: React.FC = () => {
  const { lang, constructionMaterials } = useApp();
  const [filter, setFilter] = useState<'all' | 'cement' | 'tmt_bar'>('all');
  const [query, setQuery] = useState('');
  const [calcId, setCalcId] = useState<string>(constructionMaterials[0]?.id ?? '');
  const [qty, setQty] = useState<number>(50);
  const [orderDraft, setOrderDraft] = useState<OrderDraft | null>(null);

  const filtered = useMemo(() => {
    return constructionMaterials.filter((m) => {
      const matchTab = filter === 'all' ? true : m.material_type === filter;
      const q = query.trim().toLowerCase();
      const matchQuery =
        !q ||
        m.brand.toLowerCase().includes(q) ||
        m.product_name.toLowerCase().includes(q) ||
        m.specification.toLowerCase().includes(q);
      return matchTab && matchQuery;
    });
  }, [constructionMaterials, filter, query]);

  const selectedMat = constructionMaterials.find((m) => m.id === calcId) ?? constructionMaterials[0];
  const estimatedCost = selectedMat ? selectedMat.price * Math.max(0, qty) : 0;

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Construction Hero Banner */}
      <div className="relative rounded-3xl overflow-hidden border border-orange-400/35 shadow-2xl">
        <img
          src="https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1400&q=80"
          alt="Construction Cement & Steel Sariya"
          className="w-full h-52 sm:h-60 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-950/95 via-slate-900/80 to-orange-950/40" />
        <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-between">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/75 backdrop-blur text-xs text-orange-300 border border-orange-500/30 hover:bg-slate-900"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> {lang === 'en' ? 'Back to Home' : 'होम पर वापस जाएं'}
            </Link>
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 backdrop-blur border border-orange-400/40 text-xs font-semibold text-orange-200">
              <Truck className="w-3.5 h-3.5 text-orange-400" />
              {lang === 'en' ? 'Same-Day Site Delivery Available' : 'सेम-डे साइट डिलीवरी उपलब्ध'}
            </span>
          </div>
          <div>
            <h1 className="text-2xl sm:text-4xl font-black text-white flex items-center gap-2.5">
              <HardHat className="w-7 h-7 sm:w-8 sm:h-8 text-orange-400" />
              {lang === 'en' ? 'Cement & TMT Bar (Sariya) Rates' : 'सीमेंट और TMT सरिया के भाव'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1">
              {lang === 'en'
                ? 'Direct dealer prices for top Cement & Fe 550D TMT Sariya brands'
                : 'टॉप सीमेंट और Fe 550D TMT सरिया ब्रांड्स के डायरेक्ट डीलर भाव'}
            </p>
          </div>
        </div>
      </div>

      {/* Quick Cost Estimator Bar */}
      <div className="p-4 sm:p-5 rounded-2xl bg-gradient-to-r from-orange-500/15 via-slate-900/95 to-slate-950 border border-orange-400/30 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-orange-300 font-bold text-sm shrink-0">
          <Calculator className="w-4 h-4" />
          {lang === 'en' ? 'Quick Bulk Estimator' : 'थोक खर्च कैलकुलेटर'}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 flex-1">
          <select
            value={selectedMat?.id ?? ''}
            onChange={(e) => setCalcId(e.target.value)}
            className="px-3 py-2 rounded-xl bg-slate-950 border border-orange-500/30 text-sm text-white outline-none"
          >
            {constructionMaterials.map((m) => (
              <option key={m.id} value={m.id}>
                {m.brand} — {m.product_name} (₹{m.price}/{m.unit})
              </option>
            ))}
          </select>
          <input
            type="number"
            min={1}
            value={qty}
            onChange={(e) => setQty(Number(e.target.value))}
            placeholder="Quantity"
            className="px-3 py-2 rounded-xl bg-slate-950 border border-orange-500/30 text-sm font-bold text-orange-200 outline-none"
          />
          <div className="px-4 py-2 rounded-xl bg-slate-950/90 border border-orange-500/25 flex items-center justify-between">
            <span className="text-xs text-slate-400">{lang === 'en' ? 'Est. Total' : 'कुल अनुमान'}</span>
            <span className="text-lg font-black text-orange-400">
              ₹{estimatedCost.toLocaleString('en-IN')}
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Row */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="relative flex-1 min-w-[220px] max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={lang === 'en' ? 'Search brand (UltraTech, Tata, JSW)...' : 'ब्रांड खोजें...'}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-white/10 text-sm text-white placeholder:text-slate-500 focus:border-orange-400 outline-none"
          />
        </div>

        <div className="inline-flex rounded-xl bg-slate-900 p-1 border border-white/10">
          {[
            { id: 'all', label: lang === 'en' ? 'All' : 'सभी' },
            { id: 'cement', label: lang === 'en' ? 'Cement' : 'सीमेंट' },
            { id: 'tmt_bar', label: lang === 'en' ? 'TMT / Sariya' : 'सरिया (TMT)' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setFilter(tab.id as 'all' | 'cement' | 'tmt_bar')}
              className={`px-4 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer ${
                filter === tab.id ? 'bg-orange-500 text-slate-950' : 'text-slate-300 hover:text-white'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Cards with Visuals */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((mat) => (
          <div
            key={mat.id}
            className="group rounded-2xl overflow-hidden bg-slate-900/90 border border-orange-500/25 hover:-translate-y-1 hover:border-orange-400/75 hover:shadow-[0_18px_45px_-15px_rgba(249,115,22,0.4)] transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              <div className="relative h-44 overflow-hidden bg-slate-950">
                <img
                  src={
                    mat.image_url ??
                    'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?auto=format&fit=crop&w=800&q=80'
                  }
                  alt={mat.product_name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-slate-950/85 text-orange-300 text-[11px] font-bold uppercase border border-orange-500/35">
                  <Package className="w-3 h-3" /> {mat.brand}
                </span>
                <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-orange-500 text-slate-950 text-[10px] font-black uppercase">
                  {mat.material_type === 'cement' ? 'Cement' : 'TMT Sariya'}
                </span>
              </div>

              <div className="p-5">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {lang === 'en' ? mat.product_name : mat.product_name_hi}
                    </h3>
                    <p className="text-xs text-slate-400 mt-0.5">{mat.specification}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-2xl font-black text-orange-400">
                      ₹{mat.price.toLocaleString('en-IN')}
                    </div>
                    <div className="text-[11px] text-slate-400">{mat.unit}</div>
                  </div>
                </div>

                {mat.bulk_offer && (
                  <div className="mt-4 p-3 rounded-xl bg-orange-500/10 border border-orange-500/20 flex items-center gap-2 text-xs text-orange-200">
                    <Tag className="w-4 h-4 text-orange-400 shrink-0" />
                    <span>{mat.bulk_offer}</span>
                  </div>
                )}

                <button
                  onClick={() =>
                    setOrderDraft({
                      category: 'construction',
                      product_name: `${mat.brand} — ${lang === 'en' ? mat.product_name : mat.product_name_hi}`,
                      product_price: mat.price,
                      default_quantity: mat.material_type === 'cement' ? '50 Bags' : '2 Tons',
                    })
                  }
                  className="w-full mt-4 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 font-extrabold text-xs transition cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  {lang === 'en' ? 'Order / Get Bulk Quote' : 'ऑर्डर / थोक रेट पूछें'}
                </button>
              </div>
            </div>

            <div className="px-5 py-3 border-t border-white/10 flex items-center justify-between text-xs text-slate-400">
              <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                {mat.in_stock ? (lang === 'en' ? 'In Stock' : 'उपलब्ध है') : 'Out of Stock'}
              </span>
              <span>Updated: {new Date(mat.updated_at).toLocaleDateString('en-IN')}</span>
            </div>
          </div>
        ))}
      </div>

      <OrderModal draft={orderDraft} onClose={() => setOrderDraft(null)} />
    </div>
  );
};
