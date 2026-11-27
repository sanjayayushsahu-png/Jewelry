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
      {/* Clean Royal Light Local Area Highlight Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 sm:px-5 py-3 rounded-2xl bg-white/90 border border-amber-200/90 shadow-sm backdrop-blur-md">
        <div className="flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-extrabold border border-emerald-200 shrink-0">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-ping" />
            LIVE
          </span>
          <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-gradient-to-r from-[#5C0E1C] via-[#7A1C24] to-[#5C0E1C] text-amber-200 text-sm sm:text-base font-black tracking-wide shadow-md shadow-amber-900/15 border border-amber-400/40">
            <MapPin className="w-4 h-4 text-amber-300 shrink-0" />
            {lang === 'en' ? 'Deokar • Saja • Bemetara (C.G.)' : 'देवकर • साजा • बेमेतरा (छ.ग.)'}
          </span>
          <span className="hidden xl:inline text-xs font-semibold text-slate-600">
            {lang === 'en'
              ? 'Local Verified Market Rates & Fast Delivery'
              : 'स्थानीय सत्यापित बाज़ार भाव व तेज़ डिलीवरी'}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-3 text-[11px] font-semibold text-slate-600">
          <span className="inline-flex items-center gap-1 text-amber-800">
            <BadgeCheck className="w-3.5 h-3.5 text-amber-600" /> BIS 916 Gold
          </span>
          <span className="inline-flex items-center gap-1 text-orange-700">
            <BadgeCheck className="w-3.5 h-3.5 text-orange-600" /> Direct Dealer Rates
          </span>
          <span className="inline-flex items-center gap-1 text-indigo-700">
            <CalendarDays className="w-3.5 h-3.5 text-indigo-600" /> {todayLabel}
          </span>
        </div>
      </div>

      {/* Vertical 3-Section Split */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-[calc(100vh-14.5rem)]">
        {/* 1. JEWELLERY SECTION — Royal Ivory + Maroon & Gold Theme */}
        <article
          onClick={() => navigate('/jewellery')}
          className="group relative flex flex-col justify-between rounded-3xl cursor-pointer overflow-hidden border border-amber-300/80 bg-gradient-to-b from-[#FFFDF7] via-white to-[#FDF6E7] shadow-md hover:-translate-y-1.5 hover:border-amber-500 hover:shadow-[0_22px_50px_-15px_rgba(146,64,14,0.28)] transition-all duration-300"
        >
          <div>
            {/* Hero Visual — SK Jewellery Online Banner (4:3, full face visible) */}
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
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#2A060D] via-[#2A060D]/70 to-transparent" />
              <div className="absolute top-3 left-3.5 right-3.5 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#3A0913]/85 backdrop-blur-md text-amber-200 text-[11px] font-bold border border-amber-400/40">
                  <Gem className="w-3.5 h-3.5 text-amber-300" />
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
                  <p className="text-xs text-amber-200/95">
                    {lang === 'en' ? 'Kangan, Bridal Gold & Diamonds' : 'कंगन, ब्राइडल सोना और डायमंड'}
                  </p>
                </div>
                {gold24 && (
                  <div className="text-right shrink-0">
                    <div className="text-[10px] uppercase font-bold text-amber-300">24K / 10g</div>
                    <div className="text-lg font-black text-amber-300">
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
                    className="relative rounded-2xl overflow-hidden border border-amber-200 bg-amber-50 aspect-square shadow-xs"
                  >
                    <img
                      src={jewel.image_url}
                      alt={jewel.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950/90 via-slate-950/45 to-transparent p-2">
                      <div className="text-[10px] font-bold text-amber-200 truncate">
                        {jewel.category}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Clean Cream Rate Cards */}
              <div className="space-y-2">
                {[gold24, gold22, silver].filter(Boolean).map((item) => {
                  if (!item) return null;
                  const diff = item.rate - item.previous_rate;
                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between px-3.5 py-2.5 rounded-2xl bg-amber-50/75 border border-amber-200/80 hover:border-amber-400 transition"
                    >
                      <div>
                        <div className="font-extrabold text-sm text-slate-900">
                          {lang === 'en' ? item.metal_name : item.metal_name_hi}
                        </div>
                        <div className="text-[11px] text-slate-500 font-medium">
                          {item.purity} • {item.unit}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-base font-black text-[#7A1C24]">
                          {formatINR(item.rate)}
                        </div>
                        <div
                          className={`inline-flex items-center gap-0.5 text-[11px] font-bold ${
                            diff >= 0 ? 'text-emerald-600' : 'text-rose-600'
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
                <div className="p-3 rounded-2xl bg-gradient-to-r from-amber-100 via-amber-50 to-orange-50 border border-amber-300/80">
                  <div className="flex items-center gap-1.5 text-[10px] font-black text-[#7A1C24] uppercase tracking-wider">
                    <Sparkles className="w-3.5 h-3.5 text-amber-600" /> {featuredJewelOffer.badge_text}
                  </div>
                  <div className="text-xs font-bold text-slate-900 mt-0.5">
                    {lang === 'en' ? featuredJewelOffer.title : featuredJewelOffer.title_hi}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="px-5 py-3.5 bg-gradient-to-r from-[#5C0E1C] to-[#7A1C24] flex items-center justify-between text-amber-200 font-bold text-sm">
            <span>{lang === 'en' ? 'Open Jewellery & Calculator' : 'ज्वेलरी व रेट कैलकुलेटर खोलें'}</span>
            <span className="w-8 h-8 rounded-full bg-amber-400/20 flex items-center justify-center group-hover:bg-amber-400 group-hover:text-slate-950 transition">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
        </article>

        {/* 2. CONSTRUCTION MATERIALS SECTION — Clean Stone + Terracotta Orange Theme */}
        <article
          onClick={() => navigate('/construction')}
          className="group relative flex flex-col justify-between rounded-3xl cursor-pointer overflow-hidden border border-orange-200 bg-gradient-to-b from-white via-white to-orange-50/70 shadow-md hover:-translate-y-1.5 hover:border-orange-400 hover:shadow-[0_22px_50px_-15px_rgba(234,88,12,0.25)] transition-all duration-300"
        >
          <div>
            {/* Hero Visual */}
            <div className="relative aspect-[4/3] overflow-hidden bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=900&q=80"
                alt="Cement & TMT Steel Bars"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950 via-slate-950/70 to-transparent" />
              <div className="absolute top-3 left-3.5 right-3.5 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-orange-300 text-[11px] font-bold border border-orange-400/40">
                  <HardHat className="w-3.5 h-3.5" />
                  {lang === 'en' ? 'BUILDING MATERIALS' : 'निर्माण सामग्री'}
                </span>
                <span className="px-2.5 py-0.5 rounded-full bg-orange-500 text-white text-[10px] font-black shadow">
                  {lang === 'en' ? 'BULK RATES' : 'थोक भाव'}
                </span>
              </div>
              <div className="absolute bottom-3 left-5 right-5 flex items-end justify-between gap-2">
                <div>
                  <h2 className="text-2xl font-black text-white tracking-tight drop-shadow">
                    {lang === 'en' ? 'Cement & Sariya' : 'सीमेंट और सरिया'}
                  </h2>
                  <p className="text-xs text-orange-100/95">
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
                  className="flex items-center gap-3 p-2.5 rounded-2xl bg-slate-50/90 border border-orange-200/70 hover:border-orange-400 transition"
                >
                  <img
                    src={
                      mat.image_url ??
                      'https://images.unsplash.com/photo-1518709766631-a6a7f45921c3?auto=format&fit=crop&w=300&q=80'
                    }
                    alt={mat.product_name}
                    className="w-12 h-12 rounded-xl object-cover shrink-0 border border-orange-200"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-extrabold text-sm text-slate-900 truncate">{mat.brand}</div>
                    <div className="text-[11px] text-slate-500 font-medium truncate">{mat.specification}</div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-base font-black text-orange-600">
                      {formatINR(mat.price)}
                    </div>
                    <div className="text-[10px] text-slate-500 font-semibold">{mat.unit}</div>
                  </div>
                </div>
              ))}

              <div className="p-3 rounded-2xl bg-orange-100/70 border border-orange-200 flex items-center gap-2 text-xs font-semibold text-orange-950">
                <Tag className="w-4 h-4 text-orange-600 shrink-0" />
                <span>
                  {lang === 'en'
                    ? 'Fast site delivery in Deokar, Saja & Bemetara (Free on 100+ bags)'
                    : 'देवकर, साजा और बेमेतरा में तेज़ साइट डिलीवरी (100+ बोरी पर फ्री)'}
                </span>
              </div>
            </div>
          </div>

          <div className="px-5 py-3.5 bg-gradient-to-r from-orange-600 to-amber-600 flex items-center justify-between text-white font-bold text-sm">
            <span>{lang === 'en' ? 'Compare Brands & Cost Estimator' : 'ब्रांड तुलना व खर्च कैलकुलेटर'}</span>
            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-orange-700 transition">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
        </article>

        {/* 3. MOBILE & OFFERS SECTION — Crisp White + Royal Indigo & Blue Theme */}
        <article
          onClick={() => navigate('/mobile')}
          className="group relative flex flex-col justify-between rounded-3xl cursor-pointer overflow-hidden border border-indigo-200 bg-gradient-to-b from-white via-white to-indigo-50/70 shadow-md hover:-translate-y-1.5 hover:border-indigo-400 hover:shadow-[0_22px_50px_-15px_rgba(79,70,229,0.25)] transition-all duration-300"
        >
          <div>
            {/* Hero Visual */}
            <div className="relative aspect-[4/3] overflow-hidden bg-indigo-950">
              <img
                src="https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=900&q=80"
                alt="Latest Smartphones & Offers"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-slate-950 via-indigo-950/75 to-transparent" />
              <div className="absolute top-3 left-3.5 right-3.5 flex items-center justify-between">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-950/80 backdrop-blur-md text-sky-300 text-[11px] font-bold border border-indigo-400/40">
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
                  <p className="text-xs text-indigo-100/95">
                    {lang === 'en' ? '5G Flagships, Cashbacks & No-Cost EMI' : '5G फ्लैगशिप, कैशबैक व नो-कॉस्ट EMI'}
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <div className="text-[10px] uppercase font-bold text-sky-300">Save Up To</div>
                  <div className="text-lg font-black text-sky-300">₹11,000</div>
                </div>
              </div>
            </div>

            <div className="p-5 space-y-2.5">
              {topMobiles.map((m) => {
                const pct = Math.round(((m.original_price - m.discounted_price) / m.original_price) * 100);
                return (
                  <div
                    key={m.id}
                    className="flex items-center gap-3 p-2.5 rounded-2xl bg-indigo-50/55 border border-indigo-100 hover:border-indigo-300 transition"
                  >
                    <img
                      src={m.image_url}
                      alt={m.model_name}
                      className="w-14 h-14 rounded-xl object-cover bg-slate-100 shrink-0 border border-indigo-200"
                    />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-1.5 mb-0.5">
                        <span className="px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800 text-[10px] font-extrabold">
                          -{pct}%
                        </span>
                        <span className="text-[10px] font-bold text-indigo-700 truncate">
                          {m.highlight_badge}
                        </span>
                      </div>
                      <div className="font-extrabold text-sm text-slate-900 truncate">
                        {m.brand} {m.model_name}
                      </div>
                      <div className="flex items-baseline gap-2">
                        <span className="font-black text-sm text-indigo-700">
                          {formatINR(m.discounted_price)}
                        </span>
                        <span className="text-[11px] text-slate-400 line-through">
                          {formatINR(m.original_price)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="px-5 py-3.5 bg-gradient-to-r from-indigo-600 to-blue-600 flex items-center justify-between text-white font-bold text-sm">
            <span>{lang === 'en' ? 'Explore All Smartphone Deals' : 'सभी मोबाइल ऑफर देखें'}</span>
            <span className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center group-hover:bg-white group-hover:text-indigo-700 transition">
              <ArrowUpRight className="w-4 h-4" />
            </span>
          </div>
        </article>
      </div>
    </section>
  );
};
