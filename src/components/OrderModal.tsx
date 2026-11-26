import React, { useState } from 'react';
import {
  CheckCircle2,
  MapPin,
  MessageCircle,
  Package,
  Phone,
  Send,
  ShoppingBag,
  User,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { CategoryType, CustomerOrder } from '../types';

export interface OrderDraft {
  category: CategoryType;
  product_name: string;
  product_price: number;
  default_quantity?: string;
}

interface OrderModalProps {
  draft: OrderDraft | null;
  onClose: () => void;
}

export const OrderModal: React.FC<OrderModalProps> = ({ draft, onClose }) => {
  const { lang, settings, submitOrder } = useApp();
  const [customerName, setCustomerName] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [cityAddress, setCityAddress] = useState('');
  const [quantity, setQuantity] = useState(draft?.default_quantity ?? '1');
  const [notes, setNotes] = useState('');
  const [submitted, setSubmitted] = useState<CustomerOrder | null>(null);

  if (!draft) return null;

  const accent =
    draft.category === 'jewellery'
      ? {
          ring: 'border-amber-400/40',
          badge: 'bg-amber-400/15 text-amber-300 border-amber-400/30',
          btn: 'bg-amber-400 hover:bg-amber-300 text-slate-950',
          price: 'text-amber-300',
        }
      : draft.category === 'construction'
        ? {
            ring: 'border-orange-400/40',
            badge: 'bg-orange-500/15 text-orange-300 border-orange-400/30',
            btn: 'bg-orange-500 hover:bg-orange-400 text-slate-950',
            price: 'text-orange-400',
          }
        : {
            ring: 'border-indigo-400/40',
            badge: 'bg-indigo-500/15 text-indigo-300 border-indigo-400/30',
            btn: 'bg-indigo-600 hover:bg-indigo-500 text-white',
            price: 'text-sky-400',
          };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const created = submitOrder({
      category: draft.category,
      product_name: draft.product_name,
      product_price: draft.product_price,
      customer_name: customerName.trim(),
      customer_phone: customerPhone.trim(),
      city_address: cityAddress.trim(),
      quantity: quantity.trim() || '1',
      notes: notes.trim(),
    });
    setSubmitted(created);
  };

  const handleWhatsApp = () => {
    const cleanPhone = settings.support_phone.replace(/[^\d]/g, '');
    const msg = encodeURIComponent(
      `Hello ${settings.brand_name},\nI am interested in ordering:\n• Product: ${draft.product_name}\n• Price: ₹${draft.product_price.toLocaleString('en-IN')}\n• Qty: ${quantity}\n• Name: ${customerName || 'Customer'}\n• Phone: ${customerPhone || '-'}\n• City/Address: ${cityAddress || '-'}\n${notes ? `• Note: ${notes}` : ''}`,
    );
    window.open(`https://wa.me/${cleanPhone}?text=${msg}`, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md">
      <div
        className={`relative w-full max-w-lg rounded-3xl bg-slate-900 border ${accent.ring} shadow-2xl overflow-hidden`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-white/10 flex items-center justify-between bg-slate-950/60">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-amber-400" />
            <div>
              <h3 className="font-extrabold text-white text-base">
                {lang === 'en' ? 'Order / Interest Form' : 'ऑर्डर / पूछताछ फॉर्म'}
              </h3>
              <p className="text-[11px] text-slate-400">
                {lang === 'en'
                  ? 'Fill your details — our team will call you shortly'
                  : 'अपनी जानकारी भरें — हमारी टीम जल्द आपसे संपर्क करेगी'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/20 border border-emerald-400/40 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-400" />
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-emerald-400">
                  {lang === 'en' ? 'Order Request Received!' : 'आपका ऑर्डर अनुरोध प्राप्त हो गया है!'}
                </div>
                <h4 className="text-xl font-black text-white mt-1">{submitted.id}</h4>
                <p className="text-xs text-slate-300 mt-1">
                  {submitted.product_name} • ₹{submitted.product_price.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-slate-400 mt-2">
                  {lang === 'en'
                    ? `Thank you ${submitted.customer_name}! We will contact you on ${submitted.customer_phone}.`
                    : `धन्यवाद ${submitted.customer_name}! हम आपसे ${submitted.customer_phone} पर जल्द संपर्क करेंगे।`}
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2.5 pt-2">
                <button
                  onClick={handleWhatsApp}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  {lang === 'en' ? 'Also Send on WhatsApp' : 'WhatsApp पर भी भेजें'}
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold text-xs cursor-pointer"
                >
                  {lang === 'en' ? 'Done' : 'बंद करें'}
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Selected Product Summary */}
              <div className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 ${accent.badge}`}>
                <div className="min-w-0">
                  <div className="text-[10px] font-bold uppercase opacity-80">{draft.category}</div>
                  <div className="font-bold text-sm text-white truncate">{draft.product_name}</div>
                </div>
                <div className={`text-lg font-black shrink-0 ${accent.price}`}>
                  ₹{draft.product_price.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs text-slate-300 block mb-1">
                    {lang === 'en' ? 'Your Full Name *' : 'आपका पूरा नाम *'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      required
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={lang === 'en' ? 'e.g. Sanjay Sahu' : 'जैसे: संजय साहू'}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">
                    {lang === 'en' ? 'Mobile / WhatsApp No. *' : 'मोबाइल / WhatsApp नंबर *'}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      required
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+91 96302 73317"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">
                    {lang === 'en' ? 'Quantity / Weight' : 'मात्रा / वज़न'}
                  </label>
                  <div className="relative">
                    <Package className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="1 Piece / 50 Bags"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white outline-none focus:border-amber-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs text-slate-300 block mb-1">
                    {lang === 'en' ? 'City / Address *' : 'शहर / पता *'}
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
                    <input
                      required
                      type="text"
                      value={cityAddress}
                      onChange={(e) => setCityAddress(e.target.value)}
                      placeholder={lang === 'en' ? 'Deokar / Saja / Bemetara' : 'देवकर / साजा / बेमेतरा'}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white outline-none focus:border-amber-400"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {['देवकर (Deokar)', 'साजा (Saja)', 'बेमेतरा (Bemetara)'].map((town) => (
                      <button
                        key={town}
                        type="button"
                        onClick={() => setCityAddress(town)}
                        className="px-2 py-0.5 rounded-md bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 text-[10px] font-semibold cursor-pointer"
                      >
                        {town}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-300 block mb-1">
                  {lang === 'en' ? 'Message / Special Request (Optional)' : 'संदेश / विशेष अनुरोध (वैकल्पिक)'}
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder={
                    lang === 'en'
                      ? 'Preferred size, delivery date, or callback time...'
                      : 'साइज, डिलीवरी की तारीख या कॉल करने का समय...'
                  }
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white outline-none focus:border-amber-400 resize-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  type="submit"
                  className={`flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-extrabold text-sm cursor-pointer transition ${accent.btn}`}
                >
                  <Send className="w-4 h-4" />
                  {lang === 'en' ? 'Submit Order Request' : 'ऑर्डर अनुरोध भेजें'}
                </button>
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600/20 hover:bg-emerald-600/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs cursor-pointer transition"
                >
                  <MessageCircle className="w-4 h-4" /> WhatsApp
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
