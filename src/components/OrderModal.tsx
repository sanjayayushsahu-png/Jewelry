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
          ring: 'border-amber-300',
          badge: 'bg-amber-50 text-[#5C0E1C] border-amber-200',
          btn: 'bg-gradient-to-r from-[#5C0E1C] to-[#7A1C24] hover:opacity-95 text-amber-200',
          price: 'text-[#7A1C24]',
        }
      : draft.category === 'construction'
        ? {
            ring: 'border-orange-300',
            badge: 'bg-orange-50 text-orange-900 border-orange-200',
            btn: 'bg-gradient-to-r from-orange-600 to-amber-600 hover:opacity-95 text-white',
            price: 'text-orange-600',
          }
        : {
            ring: 'border-indigo-300',
            badge: 'bg-indigo-50 text-indigo-900 border-indigo-200',
            btn: 'bg-gradient-to-r from-indigo-600 to-blue-600 hover:opacity-95 text-white',
            price: 'text-indigo-700',
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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm">
      <div
        className={`relative w-full max-w-lg rounded-3xl bg-white border-2 ${accent.ring} shadow-2xl overflow-hidden`}
      >
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-[#FAF7F2]">
          <div className="flex items-center gap-2.5">
            <ShoppingBag className="w-5 h-5 text-[#7A1C24]" />
            <div>
              <h3 className="font-extrabold text-slate-900 text-base">
                {lang === 'en' ? 'Order / Interest Form' : 'ऑर्डर / पूछताछ फॉर्म'}
              </h3>
              <p className="text-[11px] text-slate-500">
                {lang === 'en'
                  ? 'Fill your details — our team will call you shortly'
                  : 'अपनी जानकारी भरें — हमारी टीम जल्द आपसे संपर्क करेगी'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {submitted ? (
            <div className="text-center py-4 space-y-4">
              <div className="w-14 h-14 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-600" />
              </div>
              <div>
                <div className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">
                  {lang === 'en' ? 'Order Request Received!' : 'आपका ऑर्डर अनुरोध प्राप्त हो गया है!'}
                </div>
                <h4 className="text-xl font-black text-slate-900 mt-1">{submitted.id}</h4>
                <p className="text-xs font-semibold text-slate-700 mt-1">
                  {submitted.product_name} • ₹{submitted.product_price.toLocaleString('en-IN')}
                </p>
                <p className="text-xs text-slate-500 mt-2">
                  {lang === 'en'
                    ? `Thank you ${submitted.customer_name}! We will contact you on ${submitted.customer_phone}.`
                    : `धन्यवाद ${submitted.customer_name}! हम आपसे ${submitted.customer_phone} पर जल्द संपर्क करेंगे।`}
                </p>
              </div>
              <div className="flex flex-wrap justify-center gap-2.5 pt-2">
                <button
                  onClick={handleWhatsApp}
                  className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs cursor-pointer"
                >
                  <MessageCircle className="w-4 h-4" />
                  {lang === 'en' ? 'Also Send on WhatsApp' : 'WhatsApp पर भी भेजें'}
                </button>
                <button
                  onClick={onClose}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-bold text-xs cursor-pointer"
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
                  <div className="text-[10px] font-extrabold uppercase opacity-75">{draft.category}</div>
                  <div className="font-extrabold text-sm text-slate-900 truncate">{draft.product_name}</div>
                </div>
                <div className={`text-lg font-black shrink-0 ${accent.price}`}>
                  ₹{draft.product_price.toLocaleString('en-IN')}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {lang === 'en' ? 'Your Full Name *' : 'आपका पूरा नाम *'}
                  </label>
                  <div className="relative">
                    <User className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      required
                      type="text"
                      value={customerName}
                      onChange={(e) => setCustomerName(e.target.value)}
                      placeholder={lang === 'en' ? 'e.g. Sanjay Sahu' : 'जैसे: संजय साहू'}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {lang === 'en' ? 'Mobile / WhatsApp No. *' : 'मोबाइल / WhatsApp नंबर *'}
                  </label>
                  <div className="relative">
                    <Phone className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      required
                      type="tel"
                      value={customerPhone}
                      onChange={(e) => setCustomerPhone(e.target.value)}
                      placeholder="+91 96302 73317"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {lang === 'en' ? 'Quantity / Weight' : 'मात्रा / वज़न'}
                  </label>
                  <div className="relative">
                    <Package className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      type="text"
                      value={quantity}
                      onChange={(e) => setQuantity(e.target.value)}
                      placeholder="1 Piece / 50 Bags"
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-semibold text-slate-700 block mb-1">
                    {lang === 'en' ? 'City / Address *' : 'शहर / पता *'}
                  </label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                    <input
                      required
                      type="text"
                      value={cityAddress}
                      onChange={(e) => setCityAddress(e.target.value)}
                      placeholder={lang === 'en' ? 'Deokar / Saja / Bemetara' : 'देवकर / साजा / बेमेतरा'}
                      className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:border-amber-500 focus:bg-white"
                    />
                  </div>
                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    {['देवकर (Deokar)', 'साजा (Saja)', 'बेमेतरा (Bemetara)'].map((town) => (
                      <button
                        key={town}
                        type="button"
                        onClick={() => setCityAddress(town)}
                        className="px-2 py-0.5 rounded-md bg-amber-50 hover:bg-amber-100 text-[#5C0E1C] border border-amber-300 text-[10px] font-bold cursor-pointer"
                      >
                        {town}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-700 block mb-1">
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
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 border border-slate-200 text-sm text-slate-900 outline-none focus:border-amber-500 focus:bg-white resize-none"
                />
              </div>

              <div className="flex flex-wrap items-center gap-2.5 pt-1">
                <button
                  type="submit"
                  className={`flex-1 inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl font-extrabold text-sm cursor-pointer shadow-sm transition ${accent.btn}`}
                >
                  <Send className="w-4 h-4" />
                  {lang === 'en' ? 'Submit Order Request' : 'ऑर्डर अनुरोध भेजें'}
                </button>
                <button
                  type="button"
                  onClick={handleWhatsApp}
                  className="inline-flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 border border-emerald-300 text-emerald-800 font-extrabold text-xs cursor-pointer transition"
                >
                  <MessageCircle className="w-4 h-4 text-emerald-600" /> WhatsApp
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
