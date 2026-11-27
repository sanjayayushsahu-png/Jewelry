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
          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white text-xs font-bold text-[#5C0E1C] border border-amber-300 shadow-xs hover:bg-amber-50 transition"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> {lang === 'en' ? 'Back to Home' : 'होम पर वापस जाएं'}
        </Link>
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-amber-50 border border-amber-300 text-xs font-semibold text-amber-900">
          <Clock className="w-3.5 h-3.5 text-amber-600" />
          {lang === 'en' ? 'Updated:' : 'अपडेट:'} {lastUpdated}
        </div>
      </div>

      {/* Luxury SK Jewellery Online Showcase Banner (Full uncropped portrait + brand) */}
      <div className="relative rounded-3xl overflow-hidden border-2 border-amber-300 bg-[#3a0913] shadow-xl shadow-amber-900/15">
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
        <div className="px-6 py-4 bg-gradient-to-r from-[#3A0913] via-[#5C0E1C] to-[#3A0913] border-t border-amber-400/30 flex flex-wrap items-center justify-between gap-3">
          <div>
            <span className="inline-flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-amber-300">
              <Award className="w-3.5 h-3.5" /> BIS 916 Hallmarked Gold • Kangan &amp; Bridal Collection
            </span>
            <h1 className="text-xl sm:text-2xl font-black text-amber-50 flex items-center gap-2 mt-0.5">
              <Gem className="w-6 h-6 text-amber-300" />
              {lang === 'en' ? 'SK Jewellery Online — Live Rates & Collection' : 'SK ज्वेलरी ऑनलाइन — लाइव भाव व कलेक्शन'}
            </h1>
          </div>
          <span className="px-3.5 py-1.5 rounded-full bg-amber-400 text-slate-950 text-xs font-black shadow">
            {jewelleryItems.length} {lang === 'en' ? 'Exclusive Designs' : 'एक्सक्लूसिव डिज़ाइन'}
          </span>
        </div>
      </div>

      {/* Rate Table + Live Gold Calculator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 rounded-2xl overflow-hidden border border-amber-200 bg-white shadow-md">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="bg-amber-50 text-[#5C0E1C] text-xs font-extrabold uppercase border-b border-amber-200">
                <tr>
                  <th className="px-5 py-3.5">{lang === 'en' ? 'Metal / Item' : 'धातु / आइटम'}</th>
                  <th className="px-5 py-3.5">{lang === 'en' ? 'Purity' : 'शुद्धता'}</th>
                  <th className="px-5 py-3.5">{lang === 'en' ? 'Unit' : 'इकाई'}</th>
                  <th className="px-5 py-3.5 text-right">{lang === 'en' ? 'Today’s Rate' : 'आज का भाव'}</th>
                  <th className="px-5 py-3.5 text-right">{lang === 'en' ? 'Change' : 'बदलाव'}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-amber-100">
                {jewelleryRates.map((r) => {
                  const diff = r.rate - r.previous_rate;
                  return (
                    <tr key={r.id} className="hover:bg-amber-50/60 transition">
                      <td className="px-5 py-4 font-extrabold text-slate-900">
                        {lang === 'en' ? r.metal_name : r.metal_name_hi}
                      </td>
                      <td className="px-5 py-4 text-slate-600 font-medium">{r.purity}</td>
                      <td className="px-5 py-4 text-slate-500">{r.unit}</td>
                      <td className="px-5 py-4 text-right font-black text-[#7A1C24] text-base">
                        ₹{r.rate.toLocaleString('en-IN')}
                      </td>
                      <td className="px-5 py-4 text-right">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                            diff >= 0
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-rose-50 text-rose-700 border border-rose-200'
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
        <div className="p-5 rounded-2xl bg-gradient-to-b from-amber-50 via-white to-amber-50/40 border border-amber-300 shadow-md space-y-4">
          <div className="flex items-center gap-2 text-[#5C0E1C] font-extrabold text-sm">
            <Calculator className="w-4 h-4 text-amber-600" />
            {lang === 'en' ? 'Live Gold / Silver Calculator' : 'लाइव सोना-चाँदी कैलकुलेटर'}
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                {lang === 'en' ? 'Select Metal' : 'धातु चुनें'}
              </label>
              <select
                value={selectedMetal?.id ?? ''}
                onChange={(e) => setCalcMetalId(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300 text-sm font-semibold text-slate-900 outline-none focus:border-[#7A1C24]"
              >
                {jewelleryRates.map((r) => (
                  <option key={r.id} value={r.id}>
                    {lang === 'en' ? r.metal_name : r.metal_name_hi} ({r.purity})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-semibold text-slate-600 block mb-1">
                {lang === 'en' ? 'Weight (Grams)' : 'वज़न (ग्राम में)'}
              </label>
              <input
                type="number"
                min={1}
                step={0.5}
                value={grams}
                onChange={(e) => setGrams(Number(e.target.value))}
                className="w-full px-3 py-2 rounded-xl bg-white border border-amber-300 text-sm font-black text-[#7A1C24] outline-none focus:border-[#7A1C24]"
              />
            </div>

            <div className="p-3.5 rounded-xl bg-white border border-amber-200 space-y-1.5 shadow-inner">
              <div className="flex justify-between text-xs text-slate-600">
                <span>{lang === 'en' ? 'Metal Value' : 'धातु मूल्य'}</span>
                <span className="text-slate-900 font-bold">₹{baseEstimate.toLocaleString('en-IN')}</span>
              </div>
              <div className="flex justify-between text-xs text-slate-600">
                <span>GST (3%)</span>
                <span className="text-slate-900 font-bold">₹{gstEstimate.toLocaleString('en-IN')}</span>
              </div>
              <div className="pt-2 border-t border-amber-100 flex justify-between items-baseline">
                <span className="text-xs font-extrabold text-[#5C0E1C]">
                  {lang === 'en' ? 'Est. Total' : 'अनुमानित कुल'}
                </span>
                <span className="text-xl font-black text-[#7A1C24]">
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
          <h2 className="text-xl font-black text-slate-900 flex items-center gap-2">
            <Gem className="w-5 h-5 text-amber-600" />
            {lang === 'en' ? 'Featured Jewellery Showcase' : 'विशेष ज्वेलरी कलेक्शन'}
          </h2>
          <div className="flex flex-wrap gap-1.5">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold border transition cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-[#5C0E1C] text-amber-200 border-[#5C0E1C] shadow-sm'
                    : 'bg-white text-slate-700 border-amber-200 hover:border-amber-400'
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
              className="group rounded-2xl overflow-hidden bg-white border border-amber-200 shadow-sm hover:-translate-y-1 hover:border-amber-400 hover:shadow-xl hover:shadow-amber-900/10 transition-all duration-300"
            >
              <div className="relative h-56 overflow-hidden bg-amber-50">
                <img
                  src={jewel.image_url}
                  alt={jewel.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black shadow">
                  {jewel.badge}
                </span>
                <span className="absolute bottom-3 right-3 px-2.5 py-1 rounded-lg bg-white/95 backdrop-blur text-[#5C0E1C] text-xs font-extrabold shadow">
                  {jewel.weight}
                </span>
              </div>

              <div className="p-4 space-y-2">
                <div className="text-[11px] font-bold text-amber-700 uppercase tracking-wider">
                  {jewel.purity}
                </div>
                <h3 className="text-base font-extrabold text-slate-900">
                  {lang === 'en' ? jewel.name : jewel.name_hi}
                </h3>
                <div className="pt-2 border-t border-amber-100 flex items-center justify-between">
                  <div className="text-xl font-black text-[#7A1C24]">
                    ₹{jewel.price.toLocaleString('en-IN')}
                  </div>
                  <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-amber-50 text-amber-900 font-bold border border-amber-200">
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
                  className="w-full mt-2 inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-gradient-to-r from-[#5C0E1C] to-[#7A1C24] hover:opacity-95 text-amber-200 font-extrabold text-xs shadow-sm transition cursor-pointer"
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
        <h2 className="text-lg font-extrabold text-slate-900 flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-amber-600" />
          {lang === 'en' ? 'Special Jewellery Offers' : 'विशेष ज्वेलरी ऑफर'}
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {jewelleryOffers
            .filter((o) => o.is_active)
            .map((offer) => (
              <div
                key={offer.id}
                className="p-5 rounded-2xl bg-gradient-to-br from-amber-50 via-white to-orange-50/70 border border-amber-300 shadow-sm"
              >
                <span className="inline-block px-2.5 py-0.5 rounded-full bg-[#5C0E1C] text-amber-200 text-[11px] font-extrabold mb-2">
                  {offer.badge_text}
                </span>
                <h3 className="text-lg font-extrabold text-slate-900">
                  {lang === 'en' ? offer.title : offer.title_hi}
                </h3>
                <p className="text-sm text-slate-600 mt-1">{offer.subtitle}</p>
                <div className="text-xs font-bold text-amber-800 mt-3">
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
