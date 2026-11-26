import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  ArrowLeft,
  Award,
  Calculator,
  Clock,
  Gem,
  ShoppingBag,
  Sparkles,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { OrderDraft, OrderModal } from '../components/OrderModal';

export const JewelleryPage: React.FC = () => {
  const { lang, jewelleryRates, jewelleryOffers, jewelleryItems } = useApp();
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [calcMetalId, setCalcMetalId] = useState<string>(jewelleryRates[0]?.id ?? '');
  const [grams, setGrams] = useState<number>(10);
  const [orderDraft, setOrderDraft] = useState<OrderDraft | null>(null);

  const lastUpdated = jewelleryRates[0]?.updated_at
    ? new Date(jewelleryRates[0].updated_at).toLocaleString('en-IN')
    : 'Just now';

  const categories = useMemo(
    () => ['All', ...Array.from(new Set(jewelleryItems.map((i) => i.category)))],
    [jewelleryItems],
  );

  const filteredJewels = useMemo(
    () =>
      selectedCategory === 'All'
        ? jewelleryItems
        : jewelleryItems.filter((j) => j.category === selectedCategory),
    [jewelleryItems, selectedCategory],
  );

  const selectedMetal = jewelleryRates.find((r) => r.id === calcMetalId) ?? jewelleryRates[0];
  const perGramRate = selectedMetal
    ? selectedMetal.unit.toLowerCase().includes('kg')
      ? selectedMetal.rate / 1000
      : selectedMetal.rate / 10
    : 0;
  const baseEstimate = Math.round(perGramRate * Math.max(0, grams));
  const gstEstimate = Math.round(baseEstimate * 0.03);

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-8">
      {/* Top Navigation & Live Status Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-slate-900/90 text-xs font-semibold text-amber-300 border border-amber-500/30 hover:bg-slate-800 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> {lang === 'en' ? 'Back to Home' : 'होम पर वापस जाएं'}
        </Link>
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-xs text-amber-200">
          <Clock className="w-3.5 h-3.5 text-amber-400" />
          {lang === 'en' ? 'Updated:' : 'अपडेट:'} {lastUpdated}
        </div>
      </div>

      {/* Luxury SK Jewellery Online Showcase Banner (Full uncropped portrait + brand) */}
      <div className="relative rounded-3xl overflow-hidden border border-amber-400/40 bg-[#3a0913] shadow-[0_20px_60px_-15px_rgba(245,158,11,0.35)]">
        <div className="w-full bg-gradient-to-r from-[#3a0913] via-[#3a0913] to-black flex justify-center">
          <img
            src="/images/sk-jewellery-banner.jpg"
            onError={(e) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1400&q=80';
            }}
            alt="SK Jewellery Online — Official Bridal & Gold Collection"
            className="w-full max-h-[520px] object-contain object-top"
          />
        </div>
        <div className="px-6 py-4 bg-gradient-to-r from-[#2c060e] via-slate-950/95 to-slate-950 border-t border-amber-400/25 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-400">
              <Award className="w-3.5 h-3.5" /> BIS 916 Hallmarked Gold • Kangan &amp; Bridal Collection
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-amber-50 flex items-center gap-2 mt-0.5">
              <Gem className="w-6 h-6 text-amber-400" />
              {lang === 'en' ? 'SK Jewellery Online — Live Rates & Collection' : 'SK ज्वेलरी ऑनलाइन — लाइव भाव व कलेक्शन'}
            </h1>
          </div>
          <span className="px-3.5 py-1.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black">
            {jewelleryItems.length} {lang === 'en' ? 'Exclusive Designs' : 'एक्सक्लूसिव डिज़ाइन'}
          </span>
        </div>
      </div>

      {/* Rate Table + Live Gold Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-amber-500/30 bg-slate-900/80 backdrop-blur-md shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-amber-500/15 text-amber-200 text-xs uppercase">
                <tr>
                  <th className="px-5 py-3.5">{lang === 'en' ? 'Metal / Item' : 'धातु / आइटम'}</th>
                  <th className="px-5 py-3.5">{lang === 'en' ? 'Purity' : 'शुद्धता'}</th>
                  <th className="px-5 py-3.5">{lang === 'en' ? 'Unit' : 'इकाई'}</th>
                  <th className="px-5 py-3.5 text-right">{lang === 'en' ? 'Today’s Rate' : 'आज का भाव'}</th>
                  <th className="px-5 py-3.5 text-right">{lang === 'en' ? 'Change' : 'बदलाव'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5">
                {jewelleryRates.map((r) => {
                  const diff = r.rate - r.previous_rate;
                  return (
                    <tr key={r.id} className="hover:bg-amber-500/[0.06] transition">
                      <td className="px-5 py-4 font-bold text-white">
                        {lang === 'en' ? r.metal_name : r.metal_name_hi}
                      </td>
                      <td className="px-5 py-4 text-slate-300">{r.purity}</td>
                      <td className="px-5 py-4 text-slate-400">{r.unit}</td>
                      <td className="px-5 py-4 text-right font-extrabold text-amber-300 text-base">
                        ₹{r.rate.toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold ${
                            diff >= 0
                              ? 'bg-emerald-500/15 text-emerald-300'
                              : 'bg-rose-500/15 text-rose-300'
                          }`}
                        >
                          {diff >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                          {diff >= 0 ? `+₹${diff}` : `-₹${Math.abs(diff)}`}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Interactive Gold / Silver Price Calculator */}
        <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-500/15 via-slate-900/95 to-slate-950 border border-amber-400/35 space-y-4">
          <div className="flex items-center gap-2 text-amber-300 font-bold text-sm">
            <Calculator className="w-4 h-4" />
            {lang === 'en' ? 'Live Gold / Silver Calculator' : 'लाइव सोना-चाँदी कैलकुलेटर'}
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs text-slate-400 block mb-1">
                {lang === 'en' ? 'Select Metal' : 'धातु चुनें'}
              </label>
              <select
                value={selectedMetal?.id ?? ''}
                onChange={(e) => setCalcMetalId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-amber-500/30 text-sm text-white outline-none focus:border-amber-400"
              >
                {jewelleryRates.map((r) => (
                  <option key={r.id} value={r.id}>
                    {lang === 'en' ? r.metal_name : r.metal_name_hi} ({r.purity})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-slate-400 block mb-1">
                {lang === 'en' ? 'Weight (Grams)' : 'वज़न (ग्राम में)'}
              </label>
              <input
                type="number"
                min={1}
                step={0.5}
                value={grams}
                onChange={(e) => setGrams(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-amber-500/30 text-sm font-bold text-amber-200 outline-none focus:border-amber-400"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-slate-950/90 border border-amber-500/25 space-y-1.5">
              <div className="flex justify-between text-xs text-slate-400">
                <span>{lang === 'en' ? 'Metal Value' : 'धातु मूल्य'}</span>
                <span className="text-slate-200 font-semibold">₹{baseEstimate.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-400">
                <span>GST (3%)</span>
                <span className="text-slate-200 font-semibold">₹{gstEstimate.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-white/10 flex justify-between items-baseline">
                <span className="text-xs font-bold text-amber-300">
                  {lang === 'en' ? 'Est. Total' : 'अनुमानित कुल'}
                </span>
                <span className="text-xl font-black text-amber-300">
                  ₹{(baseEstimate + gstEstimate).toLocaleString('en-IN')}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Featured Jewels Gallery with Category Filter */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-xl font-extrabold text-amber-100 flex items-center gap-2">
            <Gem className="w-5 h-5 text-amber-400" />
            {lang === 'en' ? 'Featured Jewellery Showcase' : 'विशेष ज्वेलरी कलेक्शन'}
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-amber-400 text-slate-950 border-amber-300'
                    : 'bg-white/[0.04] text-slate-300 border-white/10 hover:border-amber-400/40'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredJewels.map((jewel) => (
            <div
              key={jewel.id}
              className="group rounded-2xl overflow-hidden bg-slate-900/90 border border-amber-500/25 hover:-translate-y-1 hover:border-amber-400/80 hover:shadow-[0_18px_45px_-15px_rgba(245,158,11,0.45)] transition-all duration-300"
            >
              <div className="relative h-56 overflow-hidden bg-slate-950">
                <img
                  src={jewel.image_url}
                  alt={jewel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/90 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black shadow">
                  {jewel.badge}
                </span>
                <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-slate-950/85 backdrop-blur text-amber-200 text-xs font-semibold border border-amber-500/30">
                  {jewel.weight}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <div className="text-[11px] font-semibold text-amber-400 uppercase tracking-wider">
                  {jewel.purity}
                </div>
                <h3 className="text-base font-bold text-white">
                  {lang === 'en' ? jewel.name : jewel.name_hi}
                </h3>
                <div className="pt-2 border-t border-white/10 flex items-center justify-between">
                  <div className="text-xl font-black text-amber-300">
                    ₹{jewel.price.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-500/15 text-amber-200 border border-amber-500/25">
                    {jewel.making_charge}
                  </span>
                </div>
                <button
                  onClick={() =>
                    setOrderDraft({
                      category: 'jewellery',
                      product_name: lang === 'en' ? jewel.name : jewel.name_hi,
                      product_price: jewel.price,
                      default_quantity: jewel.weight,
                    })
                  }
                  className="w-full mt-2 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 font-extrabold text-xs transition cursor-pointer"
                >
                  <ShoppingBag className="w-3.5 h-3.5" />
                  {lang === 'en' ? 'Order / Book Now' : 'ऑर्डर / पूछताछ करें'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Special Jewellery Offers */}
      <div className="space-y-3">
        <h2 className="text-lg font-bold text-amber-200 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-400" />
          {lang === 'en' ? 'Special Jewellery Offers' : 'विशेष ज्वेलरी ऑफर'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jewelleryOffers
            .filter((o) => o.is_active)
            .map((offer) => (
              <div
                key={offer.id}
                className="p-5 rounded-2xl bg-gradient-to-br from-amber-500/15 via-slate-900 to-slate-950 border border-amber-500/30"
              >
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[11px] font-extrabold mb-2">
                  {offer.badge_text}
                </span>
                <h3 className="text-lg font-bold text-white">
                  {lang === 'en' ? offer.title : offer.title_hi}
                </h3>
                <p className="text-sm text-slate-300 mt-1">{offer.subtitle}</p>
                <div className="text-xs text-amber-300/80 mt-3">
                  {lang === 'en' ? 'Valid until:' : 'वैधता:'} {offer.valid_until}
                </div>
              </div>
            ))}
        </div>
      </div>

      <OrderModal draft={orderDraft} onClose={() => setOrderDraft(null)} />
    </div>
  );
};
