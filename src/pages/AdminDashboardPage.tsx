import React, { useEffect, useMemo, useState } from 'react';
import { Navigate } from 'react-router-dom';
import {
  Ban,
  CheckCircle,
  Edit3,
  Gem,
  HardHat,
  Image as ImageIcon,
  LogOut,
  Phone,
  Plus,
  Save,
  Settings,
  Shield,
  ShoppingBag,
  Smartphone,
  Sparkles,
  Trash2,
  Upload,
  Users,
  X,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  CategoryType,
  ConstructionMaterial,
  JewelleryItem,
  JewelleryOffer,
  JewelleryRate,
  MobileOffer,
} from '../types';
import { readAndCompressImage } from '../utils/imageUpload';

type TabId = 'orders' | 'jewellery' | 'construction' | 'mobile' | 'sub_admins' | 'branding';

/** Reusable Image Upload + URL Picker with Live Preview */
const ImageField: React.FC<{
  value: string;
  onChange: (url: string) => void;
  label?: string;
}> = ({ value, onChange, label = 'Product Image (Upload or URL)' }) => {
  const [uploading, setUploading] = useState(false);

  const handleFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    try {
      const dataUrl = await readAndCompressImage(file);
      onChange(dataUrl);
    } catch {
      alert('Could not read image file. Please choose a valid JPG/PNG/WebP image.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-xs text-slate-300 font-medium block">{label}</label>
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
        <div className="w-20 h-20 rounded-xl bg-slate-950 border border-slate-700 overflow-hidden flex items-center justify-center shrink-0">
          {value ? (
            <img src={value} alt="Preview" className="w-full h-full object-cover" />
          ) : (
            <ImageIcon className="w-6 h-6 text-slate-600" />
          )}
        </div>
        <div className="flex-1 w-full space-y-2">
          <div className="flex flex-wrap items-center gap-2">
            <label className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold cursor-pointer transition">
              <Upload className="w-3.5 h-3.5" />
              {uploading ? 'Processing...' : 'Upload Photo'}
              <input type="file" accept="image/*" onChange={handleFile} className="hidden" />
            </label>
            {value && (
              <button
                type="button"
                onClick={() => onChange('')}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-rose-500/15 hover:bg-rose-500/25 text-rose-300 text-xs font-semibold cursor-pointer"
              >
                <X className="w-3.5 h-3.5" /> Clear
              </button>
            )}
          </div>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            placeholder="Or paste image URL (https://...)"
            className="w-full px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-700 text-xs text-slate-200 outline-none focus:border-indigo-400"
          />
        </div>
      </div>
    </div>
  );
};

export const AdminDashboardPage: React.FC = () => {
  const {
    currentUser,
    logout,
    canManage,
    settings,
    updateSettings,
    admins,
    upsertSubAdmin,
    toggleSubAdminStatus,
    deleteSubAdmin,
    jewelleryRates,
    upsertJewelleryRate,
    deleteJewelleryRate,
    jewelleryOffers,
    upsertJewelleryOffer,
    deleteJewelleryOffer,
    jewelleryItems,
    upsertJewelleryItem,
    deleteJewelleryItem,
    constructionMaterials,
    upsertConstruction,
    deleteConstruction,
    mobileOffers,
    upsertMobile,
    deleteMobile,
    orders,
    updateOrderStatus,
    deleteOrder,
  } = useApp();

  const isSuper = currentUser?.role === 'super_admin';

  const visibleOrders = useMemo(
    () => orders.filter((o) => canManage(o.category)),
    [orders, canManage],
  );
  const newOrderCount = visibleOrders.filter((o) => o.status === 'new').length;

  const allowedTabs = useMemo(() => {
    const tabs: { id: TabId; label: string; icon: React.ElementType; badge?: number }[] = [
      { id: 'orders', label: 'Customer Orders', icon: ShoppingBag, badge: newOrderCount },
    ];
    if (canManage('jewellery')) tabs.push({ id: 'jewellery', label: 'Jewellery', icon: Gem });
    if (canManage('construction')) tabs.push({ id: 'construction', label: 'Construction', icon: HardHat });
    if (canManage('mobile')) tabs.push({ id: 'mobile', label: 'Mobiles', icon: Smartphone });
    if (isSuper) {
      tabs.push({ id: 'sub_admins', label: 'Sub-Admins', icon: Users });
      tabs.push({ id: 'branding', label: 'App Branding', icon: Settings });
    }
    return tabs;
  }, [currentUser, isSuper, canManage, newOrderCount]);

  const [activeTab, setActiveTab] = useState<TabId>(allowedTabs[0]?.id ?? 'jewellery');

  // Jewellery Product Form State
  const [editingJewel, setEditingJewel] = useState<JewelleryItem | null>(null);
  const [editingRate, setEditingRate] = useState<JewelleryRate | null>(null);
  const [editingJewelOffer, setEditingJewelOffer] = useState<JewelleryOffer | null>(null);

  // Construction Form State
  const [editingMaterial, setEditingMaterial] = useState<ConstructionMaterial | null>(null);

  // Mobile Form State
  const [editingMobile, setEditingMobile] = useState<MobileOffer | null>(null);

  // Sub-Admin & Branding Form State
  const [newSubName, setNewSubName] = useState('');
  const [newSubEmail, setNewSubEmail] = useState('');
  const [newSubCat, setNewSubCat] = useState<CategoryType>('jewellery');
  const [brandForm, setBrandForm] = useState(settings);
  const [toast, setToast] = useState('');

  useEffect(() => {
    if (allowedTabs.length > 0 && !allowedTabs.some((t) => t.id === activeTab)) {
      setActiveTab(allowedTabs[0].id);
    }
  }, [allowedTabs, activeTab]);

  if (!currentUser) return <Navigate to="/admin/login" replace />;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  const handleSaveJewel = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJewel) return;
    await upsertJewelleryItem(editingJewel);
    setEditingJewel(null);
    showToast('Jewellery product saved!');
  };

  const handleSaveRate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingRate) return;
    await upsertJewelleryRate(editingRate);
    setEditingRate(null);
    showToast('Bullion rate saved!');
  };

  const handleSaveJewelOffer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJewelOffer) return;
    await upsertJewelleryOffer(editingJewelOffer);
    setEditingJewelOffer(null);
    showToast('Jewellery offer saved!');
  };

  const handleSaveMaterial = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMaterial) return;
    await upsertConstruction(editingMaterial);
    setEditingMaterial(null);
    showToast('Construction material saved!');
  };

  const handleSaveMobile = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingMobile) return;
    await upsertMobile(editingMobile);
    setEditingMobile(null);
    showToast('Mobile deal saved!');
  };

  const handleCreateSubAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubName || !newSubEmail) return;
    await upsertSubAdmin({
      id: `sub-${Date.now()}`,
      full_name: newSubName,
      email: newSubEmail,
      password: 'password123',
      role: 'sub_admin',
      assigned_category: newSubCat,
      status: 'active',
    });
    setNewSubName('');
    setNewSubEmail('');
    showToast('Sub-Admin created!');
  };

  const handleSaveBranding = async () => {
    await updateSettings(brandForm);
    showToast('Branding updated!');
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-6 space-y-6">
      {/* Toast Feedback */}
      {toast && (
        <div className="fixed top-20 right-4 z-50 px-4 py-2.5 rounded-xl bg-emerald-500 text-slate-950 font-bold text-xs shadow-2xl">
          ✓ {toast}
        </div>
      )}

      {/* Admin Header */}
      <div className="p-5 rounded-2xl bg-slate-900/90 border border-white/10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-xl bg-indigo-500/20 border border-indigo-500/40 flex items-center justify-center">
            <Shield className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="font-bold text-white flex items-center gap-2">
              {currentUser.full_name}
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase bg-indigo-500/25 text-indigo-200">
                {isSuper ? 'Super Admin' : `Sub-Admin • ${currentUser.assigned_category}`}
              </span>
            </div>
            <div className="text-xs text-slate-400">{currentUser.email}</div>
          </div>
        </div>

        <button
          onClick={logout}
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-rose-600/20 hover:text-rose-300 text-xs font-semibold text-slate-200 border border-slate-700 transition cursor-pointer"
        >
          <LogOut className="w-4 h-4" /> Sign Out
        </button>
      </div>

      {/* RBAC Tabs */}
      <div className="flex flex-wrap gap-2">
        {allowedTabs.map(({ id, label, icon: Icon, badge }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-semibold border transition cursor-pointer ${
              activeTab === id
                ? 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-600/20'
                : 'bg-slate-900 border-white/10 text-slate-300 hover:bg-slate-800'
            }`}
          >
            <Icon className="w-4 h-4" /> {label}
            {badge !== undefined && badge > 0 && (
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-400 text-slate-950 text-[10px] font-black">
                {badge}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* ===================================================================== */}
      {/* TAB 0: CUSTOMER ORDERS (RBAC-Filtered by Category)                    */}
      {/* ===================================================================== */}
      {activeTab === 'orders' && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-emerald-500/30 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-emerald-300 flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-400" /> Customer Orders &amp; Inquiries (
              {visibleOrders.length})
            </h2>
          </div>

          {visibleOrders.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-slate-950 border border-slate-800 text-sm text-slate-400">
              No customer orders yet. Orders submitted from the Jewellery, Construction, or Mobile pages will appear here automatically.
            </div>
          ) : (
            <div className="space-y-3">
              {visibleOrders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 rounded-xl bg-slate-950 border border-slate-800 flex flex-wrap items-start justify-between gap-4"
                >
                  <div className="space-y-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="font-black text-xs text-emerald-400">{ord.id}</span>
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-[10px] font-bold uppercase text-indigo-300">
                        {ord.category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          ord.status === 'new'
                            ? 'bg-amber-500/20 text-amber-300'
                            : ord.status === 'contacted'
                              ? 'bg-sky-500/20 text-sky-300'
                              : 'bg-emerald-500/20 text-emerald-300'
                        }`}
                      >
                        {ord.status}
                      </span>
                    </div>
                    <div className="font-bold text-white text-sm">
                      {ord.product_name} — ₹{ord.product_price.toLocaleString('en-IN')} ({ord.quantity})
                    </div>
                    <div className="text-xs text-slate-300">
                      Customer: <span className="font-semibold text-white">{ord.customer_name}</span> •{' '}
                      <a
                        href={`tel:${ord.customer_phone}`}
                        className="inline-flex items-center gap-1 text-emerald-400 hover:underline"
                      >
                        <Phone className="w-3 h-3" /> {ord.customer_phone}
                      </a>{' '}
                      • {ord.city_address}
                    </div>
                    {ord.notes && <div className="text-xs text-slate-400 italic">Note: {ord.notes}</div>}
                    <div className="text-[11px] text-slate-500">
                      {new Date(ord.created_at).toLocaleString('en-IN')}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <select
                      value={ord.status}
                      onChange={(e) => {
                        updateOrderStatus(ord.id, e.target.value as 'new' | 'contacted' | 'completed');
                        showToast('Order status updated');
                      }}
                      className="px-2.5 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-xs text-slate-200"
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="completed">Completed</option>
                    </select>
                    <button
                      onClick={() => {
                        deleteOrder(ord.id);
                        showToast('Order deleted');
                      }}
                      className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/15 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 1: JEWELLERY (Products + Images, Bullion Rates, Special Offers)   */}
      {/* ===================================================================== */}
      {activeTab === 'jewellery' && canManage('jewellery') && (
        <div className="space-y-6">
          {/* 1A. Jewellery Products & Images */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/30 space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <h2 className="text-lg font-bold text-amber-200 flex items-center gap-2">
                <Gem className="w-5 h-5 text-amber-400" /> Jewellery Products &amp; Photos
              </h2>
              <button
                onClick={() =>
                  setEditingJewel({
                    id: `ji-${Date.now()}`,
                    name: '',
                    name_hi: '',
                    category: 'Necklace',
                    purity: '22K BIS Hallmarked',
                    weight: '15.0g',
                    price: 115000,
                    making_charge: 'Flat 8% Making',
                    image_url: '',
                    badge: 'NEW ARRIVAL',
                  })
                }
                className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-400 hover:bg-amber-300 text-slate-950 text-xs font-extrabold cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Jewellery Product
              </button>
            </div>

            {editingJewel && (
              <form
                onSubmit={handleSaveJewel}
                className="p-4 rounded-2xl bg-slate-950 border border-amber-400/40 space-y-4"
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-amber-300">
                    {jewelleryItems.some((j) => j.id === editingJewel.id)
                      ? 'Edit Jewellery Product'
                      : 'Add New Jewellery Product'}
                  </span>
                  <button
                    type="button"
                    onClick={() => setEditingJewel(null)}
                    className="text-slate-400 hover:text-white cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <ImageField
                  value={editingJewel.image_url}
                  onChange={(url) => setEditingJewel({ ...editingJewel, image_url: url })}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                  <input
                    required
                    placeholder="Product Name (English)"
                    value={editingJewel.name}
                    onChange={(e) => setEditingJewel({ ...editingJewel, name: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                  />
                  <input
                    required
                    placeholder="Product Name (Hindi)"
                    value={editingJewel.name_hi}
                    onChange={(e) => setEditingJewel({ ...editingJewel, name_hi: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                  />
                  <select
                    value={editingJewel.category}
                    onChange={(e) => setEditingJewel({ ...editingJewel, category: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                  >
                    {['Kangan', 'Necklace', 'Ring', 'Bangles', 'Earrings', 'Pendant', 'Coins', 'Mangalsutra'].map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                  <input
                    required
                    placeholder="Purity (e.g. 22K BIS)"
                    value={editingJewel.purity}
                    onChange={(e) => setEditingJewel({ ...editingJewel, purity: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                  />
                  <input
                    required
                    placeholder="Weight (e.g. 18.5g)"
                    value={editingJewel.weight}
                    onChange={(e) => setEditingJewel({ ...editingJewel, weight: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                  />
                  <input
                    required
                    type="number"
                    placeholder="Price (₹)"
                    value={editingJewel.price}
                    onChange={(e) => setEditingJewel({ ...editingJewel, price: Number(e.target.value) })}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-amber-300 font-bold"
                  />
                  <input
                    placeholder="Making Charge (e.g. 0% Making)"
                    value={editingJewel.making_charge}
                    onChange={(e) => setEditingJewel({ ...editingJewel, making_charge: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                  />
                  <input
                    placeholder="Badge (e.g. BRIDAL EDITION)"
                    value={editingJewel.badge}
                    onChange={(e) => setEditingJewel({ ...editingJewel, badge: e.target.value })}
                    className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                  />
                </div>

                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
                  >
                    <Save className="w-3.5 h-3.5" /> Save Product
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingJewel(null)}
                    className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {jewelleryItems.map((jewel) => (
                <div
                  key={jewel.id}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800"
                >
                  <img
                    src={jewel.image_url || 'https://placehold.co/120x120/0f172a/fbbf24?text=Jewel'}
                    alt={jewel.name}
                    className="w-16 h-16 rounded-xl object-cover bg-slate-900 border border-amber-500/25 shrink-0"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="font-bold text-sm text-white truncate">{jewel.name}</div>
                    <div className="text-[11px] text-slate-400">
                      {jewel.category} • {jewel.purity} • {jewel.weight}
                    </div>
                    <div className="text-sm font-extrabold text-amber-300 mt-0.5">
                      ₹{jewel.price.toLocaleString('en-IN')}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingJewel(jewel)}
                      className="p-2 rounded-lg text-amber-300 hover:bg-amber-500/15 cursor-pointer"
                      title="Edit"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => {
                        deleteJewelleryItem(jewel.id);
                        showToast('Jewellery product deleted');
                      }}
                      className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/15 cursor-pointer"
                      title="Delete"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 1B. Daily Bullion Rates */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/25 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-amber-200">Daily Gold &amp; Silver Rates</h2>
              <button
                onClick={() =>
                  setEditingRate({
                    id: `jr-${Date.now()}`,
                    metal_name: '',
                    metal_name_hi: '',
                    purity: '99.9% Pure',
                    unit: '10g',
                    rate: 75000,
                    previous_rate: 75000,
                    is_highlighted: false,
                    updated_at: new Date().toISOString(),
                  })
                }
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-200 text-xs font-bold border border-amber-500/30 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Metal Rate
              </button>
            </div>

            {editingRate && (
              <form
                onSubmit={handleSaveRate}
                className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 grid grid-cols-1 sm:grid-cols-3 gap-3"
              >
                <input
                  required
                  placeholder="Metal Name (English)"
                  value={editingRate.metal_name}
                  onChange={(e) => setEditingRate({ ...editingRate, metal_name: e.target.value })}
                  className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white"
                />
                <input
                  required
                  placeholder="Metal Name (Hindi)"
                  value={editingRate.metal_name_hi}
                  onChange={(e) => setEditingRate({ ...editingRate, metal_name_hi: e.target.value })}
                  className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white"
                />
                <input
                  required
                  placeholder="Purity (e.g. 24K)"
                  value={editingRate.purity}
                  onChange={(e) => setEditingRate({ ...editingRate, purity: e.target.value })}
                  className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white"
                />
                <input
                  required
                  placeholder="Unit (e.g. 10g / 1kg)"
                  value={editingRate.unit}
                  onChange={(e) => setEditingRate({ ...editingRate, unit: e.target.value })}
                  className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white"
                />
                <input
                  required
                  type="number"
                  placeholder="Today’s Rate (₹)"
                  value={editingRate.rate}
                  onChange={(e) => setEditingRate({ ...editingRate, rate: Number(e.target.value) })}
                  className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-amber-300 font-bold"
                />
                <div className="flex gap-2">
                  <button
                    type="submit"
                    className="flex-1 px-3 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer"
                  >
                    Save Rate
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingRate(null)}
                    className="px-3 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {jewelleryRates.map((item) => (
                <div
                  key={item.id}
                  className="flex flex-wrap items-center justify-between gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800"
                >
                  <div>
                    <div className="font-bold text-sm text-white">{item.metal_name}</div>
                    <div className="text-xs text-slate-400">
                      {item.purity} • {item.unit}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-amber-300 text-sm mr-2">
                      ₹{item.rate.toLocaleString('en-IN')}
                    </span>
                    <button
                      onClick={() => setEditingRate(item)}
                      className="p-1.5 rounded-lg text-amber-300 hover:bg-amber-500/15 cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteJewelleryRate(item.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/15 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 1C. Jewellery Offer Banners */}
          <div className="p-5 rounded-2xl bg-slate-900/90 border border-amber-500/25 space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-amber-200 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-400" /> Jewellery Offers
              </h2>
              <button
                onClick={() =>
                  setEditingJewelOffer({
                    id: `jo-${Date.now()}`,
                    title: '',
                    title_hi: '',
                    subtitle: '',
                    badge_text: 'FESTIVE OFFER',
                    valid_until: '2026-12-31',
                    is_active: true,
                  })
                }
                className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-amber-500/20 text-amber-200 text-xs font-bold border border-amber-500/30 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> Add Offer
              </button>
            </div>

            {editingJewelOffer && (
              <form
                onSubmit={handleSaveJewelOffer}
                className="p-4 rounded-xl bg-slate-950 border border-amber-500/30 grid grid-cols-1 sm:grid-cols-2 gap-3"
              >
                <input
                  required
                  placeholder="Offer Title (English)"
                  value={editingJewelOffer.title}
                  onChange={(e) => setEditingJewelOffer({ ...editingJewelOffer, title: e.target.value })}
                  className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white"
                />
                <input
                  required
                  placeholder="Offer Title (Hindi)"
                  value={editingJewelOffer.title_hi}
                  onChange={(e) => setEditingJewelOffer({ ...editingJewelOffer, title_hi: e.target.value })}
                  className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white"
                />
                <input
                  required
                  placeholder="Subtitle / Terms"
                  value={editingJewelOffer.subtitle}
                  onChange={(e) => setEditingJewelOffer({ ...editingJewelOffer, subtitle: e.target.value })}
                  className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white sm:col-span-2"
                />
                <input
                  placeholder="Badge Text"
                  value={editingJewelOffer.badge_text}
                  onChange={(e) => setEditingJewelOffer({ ...editingJewelOffer, badge_text: e.target.value })}
                  className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white"
                />
                <input
                  type="date"
                  value={editingJewelOffer.valid_until}
                  onChange={(e) => setEditingJewelOffer({ ...editingJewelOffer, valid_until: e.target.value })}
                  className="px-3 py-2 rounded-lg bg-slate-900 border border-slate-700 text-sm text-white"
                />
                <div className="flex gap-2 sm:col-span-2">
                  <button
                    type="submit"
                    className="px-4 py-2 rounded-lg bg-emerald-500 text-slate-950 font-bold text-xs cursor-pointer"
                  >
                    Save Offer
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingJewelOffer(null)}
                    className="px-4 py-2 rounded-lg bg-slate-800 text-slate-300 text-xs cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}

            <div className="space-y-2">
              {jewelleryOffers.map((o) => (
                <div
                  key={o.id}
                  className="flex items-center justify-between gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800"
                >
                  <div>
                    <div className="font-bold text-sm text-white">{o.title}</div>
                    <div className="text-xs text-slate-400">
                      {o.badge_text} • Valid till {o.valid_until}
                    </div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => setEditingJewelOffer(o)}
                      className="p-1.5 rounded-lg text-amber-300 hover:bg-amber-500/15 cursor-pointer"
                    >
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => deleteJewelleryOffer(o.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:bg-rose-500/15 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 2: CONSTRUCTION MATERIALS (Add / Edit / Delete + Image)           */}
      {/* ===================================================================== */}
      {activeTab === 'construction' && canManage('construction') && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-orange-500/30 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-orange-300 flex items-center gap-2">
              <HardHat className="w-5 h-5 text-orange-400" /> Cement &amp; TMT Sariya Products
            </h2>
            <button
              onClick={() =>
                setEditingMaterial({
                  id: `cm-${Date.now()}`,
                  material_type: 'cement',
                  brand: '',
                  product_name: '',
                  product_name_hi: '',
                  specification: '50kg Bag • OPC 53 Grade',
                  unit: 'per bag',
                  price: 390,
                  previous_price: 390,
                  bulk_offer: '',
                  image_url: '',
                  in_stock: true,
                  updated_at: new Date().toISOString(),
                })
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-orange-500 hover:bg-orange-400 text-slate-950 text-xs font-extrabold cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Construction Product
            </button>
          </div>

          {editingMaterial && (
            <form
              onSubmit={handleSaveMaterial}
              className="p-4 rounded-2xl bg-slate-950 border border-orange-400/40 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-orange-300">
                  {constructionMaterials.some((m) => m.id === editingMaterial.id)
                    ? 'Edit Material'
                    : 'Add New Material'}
                </span>
                <button
                  type="button"
                  onClick={() => setEditingMaterial(null)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <ImageField
                value={editingMaterial.image_url ?? ''}
                onChange={(url) => setEditingMaterial({ ...editingMaterial, image_url: url })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <select
                  value={editingMaterial.material_type}
                  onChange={(e) =>
                    setEditingMaterial({
                      ...editingMaterial,
                      material_type: e.target.value as 'cement' | 'tmt_bar' | 'other',
                    })
                  }
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                >
                  <option value="cement">Cement</option>
                  <option value="tmt_bar">TMT Bar / Sariya</option>
                  <option value="other">Other Material</option>
                </select>
                <input
                  required
                  placeholder="Brand (e.g. UltraTech, Tata)"
                  value={editingMaterial.brand}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, brand: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                />
                <input
                  required
                  placeholder="Product Name (English)"
                  value={editingMaterial.product_name}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, product_name: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                />
                <input
                  required
                  placeholder="Product Name (Hindi)"
                  value={editingMaterial.product_name_hi}
                  onChange={(e) =>
                    setEditingMaterial({ ...editingMaterial, product_name_hi: e.target.value })
                  }
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                />
                <input
                  required
                  placeholder="Specification (e.g. Fe 550D • 12mm)"
                  value={editingMaterial.specification}
                  onChange={(e) =>
                    setEditingMaterial({ ...editingMaterial, specification: e.target.value })
                  }
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                />
                <input
                  required
                  placeholder="Unit (per bag / per ton)"
                  value={editingMaterial.unit}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, unit: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                />
                <input
                  required
                  type="number"
                  placeholder="Price (₹)"
                  value={editingMaterial.price}
                  onChange={(e) =>
                    setEditingMaterial({ ...editingMaterial, price: Number(e.target.value) })
                  }
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-orange-300 font-bold"
                />
                <input
                  placeholder="Bulk Offer (optional)"
                  value={editingMaterial.bulk_offer ?? ''}
                  onChange={(e) => setEditingMaterial({ ...editingMaterial, bulk_offer: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white sm:col-span-2"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" /> Save Material
                </button>
                <button
                  type="button"
                  onClick={() => setEditingMaterial(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {constructionMaterials.map((mat) => (
              <div
                key={mat.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800"
              >
                <img
                  src={mat.image_url || 'https://placehold.co/120x120/0f172a/fb923c?text=Material'}
                  alt={mat.product_name}
                  className="w-16 h-16 rounded-xl object-cover bg-slate-900 border border-orange-500/25 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm text-white truncate">
                    {mat.brand} — {mat.product_name}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">{mat.specification}</div>
                  <div className="text-sm font-extrabold text-orange-400 mt-0.5">
                    ₹{mat.price.toLocaleString('en-IN')}{' '}
                    <span className="text-[11px] font-normal text-slate-400">{mat.unit}</span>
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingMaterial(mat)}
                    className="p-2 rounded-lg text-orange-300 hover:bg-orange-500/15 cursor-pointer"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      deleteConstruction(mat.id);
                      showToast('Material deleted');
                    }}
                    className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/15 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 3: MOBILES & OFFERS (Add / Edit / Delete + Image)                 */}
      {/* ===================================================================== */}
      {activeTab === 'mobile' && canManage('mobile') && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-indigo-500/30 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <h2 className="text-lg font-bold text-indigo-300 flex items-center gap-2">
              <Smartphone className="w-5 h-5 text-indigo-400" /> Mobile &amp; Smartphone Deals
            </h2>
            <button
              onClick={() =>
                setEditingMobile({
                  id: `mo-${Date.now()}`,
                  brand: '',
                  model_name: '',
                  image_url: '',
                  original_price: 49999,
                  discounted_price: 42999,
                  specs_ram_storage: '12GB RAM • 256GB',
                  specs_display: '6.7" AMOLED 120Hz',
                  specs_camera: '50MP OIS Triple Camera',
                  specs_battery: '5500mAh • 80W Charge',
                  highlight_badge: 'HOT DEAL',
                  valid_until: '2026-12-31',
                  is_active: true,
                  updated_at: new Date().toISOString(),
                })
              }
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white text-xs font-extrabold cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Mobile Deal
            </button>
          </div>

          {editingMobile && (
            <form
              onSubmit={handleSaveMobile}
              className="p-4 rounded-2xl bg-slate-950 border border-indigo-400/40 space-y-4"
            >
              <div className="flex items-center justify-between">
                <span className="text-sm font-bold text-indigo-300">
                  {mobileOffers.some((m) => m.id === editingMobile.id)
                    ? 'Edit Mobile Deal'
                    : 'Add New Mobile Deal'}
                </span>
                <button
                  type="button"
                  onClick={() => setEditingMobile(null)}
                  className="text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <ImageField
                value={editingMobile.image_url}
                onChange={(url) => setEditingMobile({ ...editingMobile, image_url: url })}
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                <input
                  required
                  placeholder="Brand (Samsung, Apple...)"
                  value={editingMobile.brand}
                  onChange={(e) => setEditingMobile({ ...editingMobile, brand: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                />
                <input
                  required
                  placeholder="Model Name"
                  value={editingMobile.model_name}
                  onChange={(e) => setEditingMobile({ ...editingMobile, model_name: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                />
                <input
                  required
                  placeholder="Offer Badge (e.g. FLAT ₹8,000 OFF)"
                  value={editingMobile.highlight_badge}
                  onChange={(e) => setEditingMobile({ ...editingMobile, highlight_badge: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                />
                <input
                  required
                  type="number"
                  placeholder="Original Price (₹)"
                  value={editingMobile.original_price}
                  onChange={(e) =>
                    setEditingMobile({ ...editingMobile, original_price: Number(e.target.value) })
                  }
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-slate-300"
                />
                <input
                  required
                  type="number"
                  placeholder="Discounted Price (₹)"
                  value={editingMobile.discounted_price}
                  onChange={(e) =>
                    setEditingMobile({ ...editingMobile, discounted_price: Number(e.target.value) })
                  }
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-sky-300 font-bold"
                />
                <input
                  type="date"
                  value={editingMobile.valid_until}
                  onChange={(e) => setEditingMobile({ ...editingMobile, valid_until: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                />
                <input
                  placeholder="RAM / Storage"
                  value={editingMobile.specs_ram_storage}
                  onChange={(e) => setEditingMobile({ ...editingMobile, specs_ram_storage: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                />
                <input
                  placeholder="Display"
                  value={editingMobile.specs_display}
                  onChange={(e) => setEditingMobile({ ...editingMobile, specs_display: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                />
                <input
                  placeholder="Camera"
                  value={editingMobile.specs_camera}
                  onChange={(e) => setEditingMobile({ ...editingMobile, specs_camera: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white"
                />
                <input
                  placeholder="Battery"
                  value={editingMobile.specs_battery}
                  onChange={(e) => setEditingMobile({ ...editingMobile, specs_battery: e.target.value })}
                  className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-sm text-white sm:col-span-2 lg:col-span-3"
                />
              </div>

              <div className="flex gap-2">
                <button
                  type="submit"
                  className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs cursor-pointer"
                >
                  <Save className="w-3.5 h-3.5" /> Save Mobile Deal
                </button>
                <button
                  type="button"
                  onClick={() => setEditingMobile(null)}
                  className="px-4 py-2 rounded-xl bg-slate-800 text-slate-300 text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {mobileOffers.map((m) => (
              <div
                key={m.id}
                className="flex items-center gap-3 p-3 rounded-xl bg-slate-950 border border-slate-800"
              >
                <img
                  src={m.image_url || 'https://placehold.co/120x120/0f172a/818cf8?text=Phone'}
                  alt={m.model_name}
                  className="w-16 h-16 rounded-xl object-cover bg-slate-900 border border-indigo-500/25 shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-sm text-white truncate">
                    {m.brand} {m.model_name}
                  </div>
                  <div className="text-[11px] text-slate-400 truncate">
                    MRP ₹{m.original_price.toLocaleString('en-IN')} • Valid till {m.valid_until}
                  </div>
                  <div className="text-sm font-extrabold text-sky-400 mt-0.5">
                    ₹{m.discounted_price.toLocaleString('en-IN')}
                  </div>
                </div>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => setEditingMobile(m)}
                    className="p-2 rounded-lg text-indigo-300 hover:bg-indigo-500/15 cursor-pointer"
                    title="Edit"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      deleteMobile(m.id);
                      showToast('Mobile deal deleted');
                    }}
                    className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/15 cursor-pointer"
                    title="Delete"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 4: SUB-ADMIN MANAGEMENT (SUPER ADMIN ONLY)                        */}
      {/* ===================================================================== */}
      {activeTab === 'sub_admins' && isSuper && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-white/10 space-y-5">
          <h2 className="text-lg font-bold text-white">Sub-Admin Accounts &amp; Category Assignment</h2>

          <form onSubmit={handleCreateSubAdmin} className="grid grid-cols-1 sm:grid-cols-4 gap-3">
            <input
              type="text"
              placeholder="Full Name"
              required
              value={newSubName}
              onChange={(e) => setNewSubName(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
            />
            <input
              type="email"
              placeholder="Email Address"
              required
              value={newSubEmail}
              onChange={(e) => setNewSubEmail(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
            />
            <select
              value={newSubCat}
              onChange={(e) => setNewSubCat(e.target.value as CategoryType)}
              className="px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
            >
              <option value="jewellery">Jewellery</option>
              <option value="construction">Construction</option>
              <option value="mobile">Mobile</option>
            </select>
            <button
              type="submit"
              className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-semibold cursor-pointer"
            >
              + Create Sub-Admin
            </button>
          </form>

          <div className="space-y-2.5">
            {admins
              .filter((a) => a.role === 'sub_admin')
              .map((sub) => (
                <div
                  key={sub.id}
                  className="flex flex-wrap items-center justify-between gap-3 p-3.5 rounded-xl bg-slate-950 border border-slate-800"
                >
                  <div>
                    <div className="font-bold text-white flex items-center gap-2">
                      {sub.full_name}
                      <span className="px-2 py-0.5 rounded bg-slate-800 text-xs capitalize text-indigo-300">
                        {sub.assigned_category}
                      </span>
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          sub.status === 'active'
                            ? 'bg-emerald-500/20 text-emerald-300'
                            : 'bg-rose-500/20 text-rose-300'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </div>
                    <div className="text-xs text-slate-400">{sub.email}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => toggleSubAdminStatus(sub.id)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-200 cursor-pointer"
                    >
                      {sub.status === 'active' ? (
                        <>
                          <Ban className="w-3.5 h-3.5 text-amber-400" /> Suspend
                        </>
                      ) : (
                        <>
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> Activate
                        </>
                      )}
                    </button>
                    <button
                      onClick={() => deleteSubAdmin(sub.id)}
                      className="p-2 rounded-lg text-rose-400 hover:bg-rose-500/15 cursor-pointer"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* TAB 5: GLOBAL APP BRANDING (SUPER ADMIN ONLY)                         */}
      {/* ===================================================================== */}
      {activeTab === 'branding' && isSuper && (
        <div className="p-5 rounded-2xl bg-slate-900/90 border border-white/10 space-y-4">
          <h2 className="text-lg font-bold text-white">App Branding &amp; Contact Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {[
              { key: 'brand_name', label: 'Brand Name (English)' },
              { key: 'brand_name_hi', label: 'Brand Name (Hindi)' },
              { key: 'logo_text', label: 'Logo Initials (2 chars)' },
              { key: 'support_phone', label: 'Support Phone' },
              { key: 'support_email', label: 'Support Email' },
              { key: 'address', label: 'Store Address' },
            ].map(({ key, label }) => (
              <div key={key}>
                <label className="text-xs text-slate-400 block mb-1">{label}</label>
                <input
                  type="text"
                  value={String(brandForm[key as keyof typeof brandForm] ?? '')}
                  onChange={(e) => setBrandForm({ ...brandForm, [key]: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-slate-950 border border-slate-700 text-sm text-white"
                />
              </div>
            ))}
          </div>
          <button
            onClick={handleSaveBranding}
            className="px-5 py-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-sm cursor-pointer"
          >
            Save Branding Changes
          </button>
        </div>
      )}
    </div>
  );
};
