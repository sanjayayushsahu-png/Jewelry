import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  Gem,
  HardHat,
  MapPin,
  Smartphone,
  Sparkles,
  Tag,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { useApp } from '../context/AppContext';

const formatINR = (n: number) => `₹${n.toLocaleString('en-IN')}`;

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const {
    lang,
    jewelleryRates,
    jewelleryOffers,
    jewelleryItems,
    constructionMaterials,
    mobileOffers,
  } = useApp();

  const gold24 = jewelleryRates.find((r) => r.metal_name.includes('24K')) ?? jewelleryRates[0];
  const gold22 = jewelleryRates.find((r) => r.metal_name.includes('22K')) ?? jewelleryRates[1];
  const silver = jewelleryRates.find((r) => r.metal_name.toLowerCase().includes('silver'));
  const featuredJewelOffer = jewelleryOffers.find((o) => o.is_active);
  const previewJewels = jewelleryItems.slice(0, 3);

  const cementSample = constructionMaterials.filter((m) => m.material_type === 'cement').slice(0, 2);
  const tmtSample = constructionMaterials.filter((m) => m.material_type === 'tmt_bar').slice(0, 2);
  const previewMaterials = [...cementSample, ...tmtSample];

  const topMobiles = mobileOffers.filter((m) => m.is_active).slice(0, 3);

  const todayLabel = new Date().toLocaleDateString(lang === 'en' ? 'en-IN' : 'hi-IN', {
    weekday: 'short',
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });

  return (
    <section className="max-w-7xl mx-auto px-4 py-5 space-y-5">
      {/* Subtle Live Market Context Bar + Local Area Highlight */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3 rounded-2xl bg-gradient-to-r from-amber-500/12 via-white/[0.03] to-indigo-500/12 border border-amber-400/30 backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/15 text-emerald-300 text-[11px] font-bold border border-emerald-500/30 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            LIVE
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-amber-400 via-amber-300 to-orange-400 text-slate-950 text-sm sm:text-base font-black tracking-wide shadow-[0_0_22px_rgba(245,158,11,0.4)]">
            <MapPin className="w-4 h-4 shrink-0" />
            {lang === 'en' ? 'Deokar • Saja • Bemetara (C.G.)' : 'देवकर • साजा • बेमेतरा (छ.ग.)'}
          </span>
          <span className="hidden xl:inline text-xs font-medium text-slate-300">
            {lang === 'en'
              ? 'Local Verified Market Rates & Fast Delivery'
              : 'स्थानीय सत्यापित बाज़ार भाव व तेज़ डिलीवरी'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-400">
          <span className="inline-flex items-center gap-1 text-amber-300/90 font-medium">
            <BadgeCheck className="w-3.5 h-3.5" /> BIS 916 Gold
          </span>
          <span className="inline-flex items-center gap-1 text-orange-300/90 font-medium">
            <BadgeCheck className="w-3.5 h-3.5" /> Direct Dealer Rates
          </span>
          <span className="inline-flex items-center gap-1 text-slate-300 font-medium">
            <CalendarDays className="w-3.5 h-3.5 text-indigo-400" /> {todayLabel}
          </span>
        </div>
      </div>

      {/* Vertical 3-Section Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 min-h-[calc(100vh-14.5rem)]">
        {/* 1. JEWELLERY SECTION — Luxury Gold / Amber Theme */}
        <article
          onClick={() => navigate('/jewellery')}
          className="group relative flex flex-col justify-between rounded-3xl cursor-pointer overflow-hidden border border-amber-400/25 ring-1 ring-inset ring-white/5 bg-gradient-to-b from-amber-950/60 via-slate-900/95 to-slate-950 hover:-translate-y-1 hover:border-amber-400/75 hover:shadow-[0_20px_60px_-15px_rgba(245,158,11,0.45)] transition-all duration-300"
        >
          <div>
            {/* Hero Visual — SK Jewellery Online Banner (4:3 ratio, full face visible) */}
            <div className="relative aspect-[4/3] overflow-hidden bg-[#3a0913]">
              <img
                src="/images/sk-jewellery-banner.jpg"
                onError={(e) => {
                  e.currentTarget.src =
                    'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=900&q=80';
                }}
                alt="SK Jewellery Online — Gold & Bridal Collection"
                className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950 via-slate-950/65 to-transparent" />
              <div className="absolute top-3 left-3.5 right-3.5 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/75 backdrop-blur-md text-amber-300 text-[11px] font-bold border border-amber-400/35">
                  <Gem className="w-3.5 h-3.5" />
                  {lang === 'en' ? 'SK JEWELLERY ONLINE' : 'SK ज्वेलरी ऑनलाइन'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-400 text-slate-950 text-[10px] font-black shadow">
                  24K • 22K
                </span>
              </div>
              <div className="absolute bottom-3 left-5 right-5 flex items-end justify-between gap-2">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight drop-shadow">
                    {lang === 'en' ? 'Jewellery & Gold' : 'ज्वेलरी और सोना'}
                  </h2>
                  <p className="text-xs text-amber-200/90">
                    {lang === 'en' ? 'Kangan, Bridal Gold & Diamonds' : 'कंगन, ब्राइडल सोना और डायमंड'}
                  </p>
                </div>
                {gold24 && (
                  <div className="text-right shrink-0">
                    <div className="text-[10px] uppercase font-bold text-amber-300">24K / 10g</div>
                    <div className="text-lg font-black bg-gradient-to-r from-amber-200 to-yellow-400 bg-clip-text text-transparent">
                      {formatINR(gold24.rate)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 space-y-4">
              {/* 3-Tile Jewel Showcase Strip */}
              <div className="grid grid-cols-3 gap-2.5">
                {previewJewels.map((jewel) => (
                  <div
                    key={jewel.id}
                    className="relative rounded-2xl overflow-hidden border border-amber-400/25 bg-slate-950 aspect-square shadow-md"
                  >
                    <img
                      src={jewel.image_url}
                      alt={jewel.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent p-2">
                      <div className="text-[10px] font-bold text-amber-200 truncate">
                        {jewel.category}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Glassmorphic Live Rate Rows */}
              <div className="space-y-2">
                {[gold24, gold22, silver].filter(Boolean).map((item) => {
                  if (!item) return null;
                  const diff = item.rate - item.previous_rate;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-amber-400/35 transition"
                    >
                      <div>
                        <div className="font-bold text-sm text-amber-50">
                          {lang === 'en' ? item.metal_name : item.metal_name_hi}
                        </div>
                        <div className="text-[11px] text-slate-400">
                          {item.purity} • {item.unit}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-extrabold text-amber-300">
                          {formatINR(item.rate)}
                        </div>
                        <div
                          className={`inline-flex items-center gap-0.5 text-[11px] font-semibold ${
                            diff >= 0 ? 'text-emerald-400' : 'text-rose-400'
                          }`}
                        >
                          {diff >= 0 ? (
                            <TrendingUp className="w-3 h-3" />
                          ) : (
                            <TrendingDown className="w-3 h-3" />
                          )}
                          {diff >= 0 ? `+${formatINR(diff)}` : formatINR(diff)}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Highlight Offer Banner */}
              {featuredJewelOffer && (
                <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-500/20 via-yellow-500/10 to-transparent border border-amber-400/30">
                  <div className="flex items-center gap-1.5 text-[10px] font-extrabold text-amber-300 uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5" /> {featuredJewelOffer.badge_text}
                  </div>
                  <div className="text-xs font-semibold text-amber-50 mt-0.5">
                    {lang === 'en' ? featuredJewelOffer.title : featuredJewelOffer.title_hi}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="px-5 py-3.5 border-t border-amber-500/20 bg-amber-500/[0.07] flex items-center justify-between text-amber-300 font-bold text-sm">
            <span>{lang === 'en' ? 'Open Jewellery & Calculator' : 'ज्वेलरी व रेट कैलकुलेटर खोलें'}</span>
            <span className="w-8 h-8 rounded-full bg-amber-400/15 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-slate-950 transition">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
        </article>

        {/* 2. CONSTRUCTION MATERIALS SECTION — Industrial Slate / Orange Theme */}
        <article
          onClick={() => navigate('/construction')}
          className="group relative flex flex-col justify-between rounded-3xl cursor-pointer overflow-hidden border border-orange-400/25 ring-1 ring-inset ring-white/5 bg-gradient-to-b from-slate-800/80 via-slate-900/95 to-slate-950 hover:-translate-y-1 hover:border-orange-400/75 hover:shadow-[0_20px_60px_-15px_rgba(249,115,22,0.42)] transition-all duration-300"
        >
          <div>
            {/* Hero Visual */}
            <div className="relative h-48 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80"
                alt="Cement & TMT Steel Bars"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-orange-950/20" />
              <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/75 backdrop-blur-md text-orange-300 text-[11px] font-bold border border-orange-400/35">
                  <HardHat className="w-3.5 h-3.5" />
                  {lang === 'en' ? 'BUILDING MATERIALS' : 'निर्माण सामग्री'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-orange-500 text-slate-950 text-[10px] font-black shadow">
                  {lang === 'en' ? 'BULK RATES' : 'थोक भाव'}
                </span>
              </div>
              <div className="absolute bottom-3 left-5 right-5 flex items-end justify-between gap-2">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight drop-shadow">
                    {lang === 'en' ? 'Cement & Sariya' : 'सीमेंट और सरिया'}
                  </h2>
                  <p className="text-xs text-orange-100/85">
                    {lang === 'en' ? 'UltraTech, ACC, Tata Tiscon & JSW' : 'अल्ट्राटेक, एसीसी, टाटा टिस्कॉन व JSW'}
                  </p>
                </div>
                {cementSample[0] && (
                  <div className="text-right shrink-0">
                    <div className="text-[10px] uppercase font-bold text-orange-300">Cement From</div>
                    <div className="text-lg font-black text-orange-400">
                      {formatINR(cementSample[0].price)}
                    </div>
                  </div>
                )}
              </div>
            </div>

            <div className="p-5 space-y-2.5">
              {previewMaterials.map((mat) => (
                <div
                  key={mat.id}
                  className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-orange-400/35 transition"
                >
                  <img
                    src={
                      mat.image_url ??
                      'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?auto=format&fit=crop&w=300&q=80'
                    }
                    alt={mat.product_name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 border border-orange-500/25"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-sm text-white truncate">{mat.brand}</div>
                    <div className="text-[11px] text-slate-400 truncate">{mat.specification}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-base font-extrabold text-orange-400">
                      {formatINR(mat.price)}
                    </div>
                    <div className="text-[10px] text-slate-400">{mat.unit}</div>
                  </div>
                </div>
              ))}

              <div className="p-3 rounded-2xl bg-gradient-to-r from-orange-500/20 via-amber-500/10 to-transparent border border-orange-400/30 flex items-center gap-2 text-xs text-orange-100">
                <Tag className="w-4 h-4 text-orange-400 shrink-0" />
                <span>
                  {lang === 'en'
                    ? 'Fast site delivery in Deokar, Saja & Bemetara (Free on 100+ bags)'
                    : 'देवकर, साजा और बेमेतरा में तेज़ साइट डिलीवरी (100+ बोरी पर फ्री)'}
                </span>
              </div>
            </div>
          </div>

          <div className="px-5 py-3.5 border-t border-orange-500/20 bg-orange-500/[0.07] flex items-center justify-between text-orange-400 font-bold text-sm">
            <span>{lang === 'en' ? 'Compare Brands & Cost Estimator' : 'ब्रांड तुलना व खर्च कैलकुलेटर'}</span>
            <span className="w-8 h-8 rounded-full bg-orange-400/15 flex items-center justify-center group-hover:bg-orange-400 group-hover:text-slate-950 transition">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
        </article>

        {/* 3. MOBILE & OFFERS SECTION — Electric Blue / Indigo Theme */}
        <article
          onClick={() => navigate('/mobile')}
          className="group relative flex flex-col justify-between rounded-3xl cursor-pointer overflow-hidden border border-indigo-400/25 ring-1 ring-inset ring-white/5 bg-gradient-to-b from-indigo-950/75 via-slate-900/95 to-slate-950 hover:-translate-y-1 hover:border-indigo-400/75 hover:shadow-[0_20px_60px_-15px_rgba(99,102,241,0.48)] transition-all duration-300"
        >
          <div>
            {/* Hero Visual */}
            <div className="relative h-48 overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80"
                alt="Latest Smartphones & Offers"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/55 to-indigo-950/20" />
              <div className="absolute top-3.5 left-4 right-4 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/75 backdrop-blur-md text-indigo-300 text-[11px] font-bold border border-indigo-400/35">
                  <Smartphone className="w-3.5 h-3.5" />
                  {lang === 'en' ? 'SMARTPHONE DEALS' : 'मोबाइल ऑफर'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-sky-400 text-slate-950 text-[10px] font-black shadow">
                  {mobileOffers.filter((m) => m.is_active).length}{' '}
                  {lang === 'en' ? 'LIVE' : 'लाइव'}
                </span>
              </div>
              <div className="absolute bottom-3 left-5 right-5 flex items-end justify-between gap-2">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight drop-shadow">
                    {lang === 'en' ? 'Mobile & Offers' : 'मोबाइल और छूट'}
                  </h2>
                  <p className="text-xs text-indigo-200/85">
                    {lang === 'en' ? '5G Flagships, Cashbacks & No-Cost EMI' : '5G फ्लैगशिप, कैशबैक व नो-कॉस्ट EMI'}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] uppercase font-bold text-sky-300">Save Up To</div>
                  <div className="text-lg font-black text-sky-400">₹11,000</div>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-2.5">
              {topMobiles.map((m) => {
                const pct = Math.round(((m.original_price - m.discounted_price) / m.original_price) * 100);
                return (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 p-2.5 rounded-2xl bg-white/[0.04] border border-white/10 hover:border-indigo-400/35 transition"
                  >
                    <img
                      src={m.image_url}
                      alt={m.model_name}
                      className="w-14 h-14 rounded-xl object-cover bg-slate-800 shrink-0 border border-indigo-400/25"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 text-[10px] font-extrabold">
                          -{pct}%
                        </span>
                        <span className="text-[10px] font-bold text-indigo-300 truncate">
                          {m.highlight_badge}
                        </span>
                      </div>
                      <div className="font-bold text-sm text-white truncate">
                        {m.brand} {m.model_name}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-extrabold text-sm text-sky-400">
                          {formatINR(m.discounted_price)}
                        </span>
                        <span className="text-[11px] text-slate-500 line-through">
                          {formatINR(m.original_price)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="px-5 py-3.5 border-t border-indigo-500/20 bg-indigo-500/[0.07] flex items-center justify-between text-indigo-300 font-bold text-sm">
            <span>{lang === 'en' ? 'Explore All Smartphone Deals' : 'सभी मोबाइल ऑफर देखें'}</span>
            <span className="w-8 h-8 rounded-full bg-indigo-400/15 flex items-center justify-center group-hover:bg-indigo-400 group-hover:text-slate-950 transition">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
        </article>
      </div>
    </section>
  );
};
