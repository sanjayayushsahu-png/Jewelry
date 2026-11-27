import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  AdminProfile,
  AppSettings,
  CategoryType,
  ConstructionMaterial,
  CustomerOrder,
  JewelleryItem,
  JewelleryOffer,
  JewelleryRate,
  Language,
  MobileOffer,
} from '../types';
import {
  INITIAL_ADMINS,
  INITIAL_CONSTRUCTION,
  INITIAL_JEWELLERY_ITEMS,
  INITIAL_JEWELLERY_OFFERS,
  INITIAL_JEWELLERY_RATES,
  INITIAL_MOBILES,
  INITIAL_SETTINGS,
} from '../data/seedData';
import { isSupabaseConfigured, supabase } from '../lib/supabase';

interface AppContextValue {
  lang: Language;
  toggleLang: () => void;
  settings: AppSettings;
  admins: AdminProfile[];
  currentUser: AdminProfile | null;
  jewelleryRates: JewelleryRate[];
  jewelleryOffers: JewelleryOffer[];
  jewelleryItems: JewelleryItem[];
  constructionMaterials: ConstructionMaterial[];
  mobileOffers: MobileOffer[];
  orders: CustomerOrder[];
  login: (email: string, password: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => Promise<void>;
  canManage: (category: CategoryType) => boolean;
  updateSettings: (next: Partial<AppSettings>) => Promise<void>;
  upsertSubAdmin: (admin: Omit<AdminProfile, 'created_at'>) => Promise<void>;
  toggleSubAdminStatus: (id: string) => Promise<void>;
  deleteSubAdmin: (id: string) => Promise<void>;
  upsertJewelleryRate: (item: JewelleryRate) => Promise<void>;
  deleteJewelleryRate: (id: string) => Promise<void>;
  upsertJewelleryOffer: (item: JewelleryOffer) => Promise<void>;
  deleteJewelleryOffer: (id: string) => Promise<void>;
  upsertJewelleryItem: (item: JewelleryItem) => Promise<void>;
  deleteJewelleryItem: (id: string) => Promise<void>;
  upsertConstruction: (item: ConstructionMaterial) => Promise<void>;
  deleteConstruction: (id: string) => Promise<void>;
  upsertMobile: (item: MobileOffer) => Promise<void>;
  deleteMobile: (id: string) => Promise<void>;
  submitOrder: (order: Omit<CustomerOrder, 'id' | 'status' | 'created_at'>) => CustomerOrder;
  updateOrderStatus: (id: string, status: CustomerOrder['status']) => void;
  deleteOrder: (id: string) => void;
}

const STORAGE_KEY = 'cg_bazar_state_v3';

const AppContext = createContext<AppContextValue | null>(null);

function loadLocal<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}_${key}`);
    return raw ? (JSON.parse(raw) as T) : fallback;
  } catch {
    return fallback;
  }
}

async function saveCloudKey<T>(key: string, value: T) {
  if (!isSupabaseConfigured || !supabase) return;
  const { error } = await supabase
    .from('site_data')
    .upsert({ key, value, updated_at: new Date().toISOString() }, { onConflict: 'key' });
  if (error) {
    console.error(`[Cloud Sync] Failed saving ${key}:`, error.message);
  }
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lang, setLang] = useState<Language>(() => loadLocal('lang', 'en'));
  const [settings, setSettings] = useState<AppSettings>(() => {
    const loaded = loadLocal('settings', INITIAL_SETTINGS);
    if (
      loaded.brand_name === 'BharatBazaar Live' ||
      loaded.brand_name_hi === 'भारतबाज़ार लाइव' ||
      loaded.address === 'Main Market Complex, Raipur, CG' ||
      loaded.support_phone === '+91 98765 43210'
    ) {
      return INITIAL_SETTINGS;
    }
    return loaded;
  });

  useEffect(() => {
    if (
      settings.brand_name === 'BharatBazaar Live' ||
      settings.brand_name_hi === 'भारतबाज़ार लाइव' ||
      settings.address === 'Main Market Complex, Raipur, CG' ||
      settings.support_phone === '+91 98765 43210'
    ) {
      setSettings(INITIAL_SETTINGS);
    }
  }, [settings.brand_name, settings.brand_name_hi, settings.address, settings.support_phone]);

  const [admins, setAdmins] = useState<AdminProfile[]>(() => loadLocal('admins', INITIAL_ADMINS));
  const [currentUser, setCurrentUser] = useState<AdminProfile | null>(() => loadLocal('currentUser', null));
  const [jewelleryRates, setJewelleryRates] = useState<JewelleryRate[]>(() =>
    loadLocal('jewelleryRates', INITIAL_JEWELLERY_RATES),
  );
  const [jewelleryOffers, setJewelleryOffers] = useState<JewelleryOffer[]>(() =>
    loadLocal('jewelleryOffers', INITIAL_JEWELLERY_OFFERS),
  );
  const [jewelleryItems, setJewelleryItems] = useState<JewelleryItem[]>(() =>
    loadLocal('jewelleryItems', INITIAL_JEWELLERY_ITEMS),
  );
  const [constructionMaterials, setConstructionMaterials] = useState<ConstructionMaterial[]>(() =>
    loadLocal('constructionMaterials', INITIAL_CONSTRUCTION),
  );
  const [mobileOffers, setMobileOffers] = useState<MobileOffer[]>(() =>
    loadLocal('mobileOffers', INITIAL_MOBILES),
  );
  const [orders, setOrders] = useState<CustomerOrder[]>(() => loadLocal('orders', []));

  useEffect(() => {
    localStorage.setItem(`${STORAGE_KEY}_lang`, JSON.stringify(lang));
    localStorage.setItem(`${STORAGE_KEY}_settings`, JSON.stringify(settings));
    localStorage.setItem(`${STORAGE_KEY}_admins`, JSON.stringify(admins));
    localStorage.setItem(`${STORAGE_KEY}_currentUser`, JSON.stringify(currentUser));
    localStorage.setItem(`${STORAGE_KEY}_jewelleryRates`, JSON.stringify(jewelleryRates));
    localStorage.setItem(`${STORAGE_KEY}_jewelleryOffers`, JSON.stringify(jewelleryOffers));
    localStorage.setItem(`${STORAGE_KEY}_jewelleryItems`, JSON.stringify(jewelleryItems));
    localStorage.setItem(`${STORAGE_KEY}_constructionMaterials`, JSON.stringify(constructionMaterials));
    localStorage.setItem(`${STORAGE_KEY}_mobileOffers`, JSON.stringify(mobileOffers));
    localStorage.setItem(`${STORAGE_KEY}_orders`, JSON.stringify(orders));
  }, [
    lang,
    settings,
    admins,
    currentUser,
    jewelleryRates,
    jewelleryOffers,
    jewelleryItems,
    constructionMaterials,
    mobileOffers,
    orders,
  ]);

  // Live Supabase Cloud Sync (reads on load + subscribes to real-time updates across all devices)
  useEffect(() => {
    if (!isSupabaseConfigured || !supabase) return;
    const client = supabase;

    const fetchCloudData = async () => {
      const { data: rows, error } = await client.from('site_data').select('key, value');
      if (!error && rows) {
        for (const row of rows) {
          if (row.key === 'settings' && row.value) setSettings(row.value as AppSettings);
          if (row.key === 'jewelleryRates' && Array.isArray(row.value))
            setJewelleryRates(row.value as JewelleryRate[]);
          if (row.key === 'jewelleryOffers' && Array.isArray(row.value))
            setJewelleryOffers(row.value as JewelleryOffer[]);
          if (row.key === 'jewelleryItems' && Array.isArray(row.value))
            setJewelleryItems(row.value as JewelleryItem[]);
          if (row.key === 'constructionMaterials' && Array.isArray(row.value))
            setConstructionMaterials(row.value as ConstructionMaterial[]);
          if (row.key === 'mobileOffers' && Array.isArray(row.value))
            setMobileOffers(row.value as MobileOffer[]);
        }
      }

      const { data: cloudOrders, error: ordErr } = await client
        .from('customer_orders')
        .select('*')
        .order('created_at', { ascending: false });
      if (!ordErr && cloudOrders) {
        setOrders(cloudOrders as CustomerOrder[]);
      }
    };

    fetchCloudData();

    const channel = client
      .channel('cg-bazar-live-sync')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'site_data' }, () => {
        fetchCloudData();
      })
      .on('postgres_changes', { event: '*', schema: 'public', table: 'customer_orders' }, () => {
        fetchCloudData();
      })
      .subscribe();

    return () => {
      client.removeChannel(channel);
    };
  }, [currentUser]);

  const toggleLang = () => setLang((prev) => (prev === 'en' ? 'hi' : 'en'));

  const canManage = (category: CategoryType) => {
    if (!currentUser || currentUser.status !== 'active') return false;
    if (currentUser.role === 'super_admin') return true;
    return currentUser.role === 'sub_admin' && currentUser.assigned_category === category;
  };

  const login = async (email: string, password: string) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error || !data.user) return { ok: false, error: error?.message ?? 'Invalid credentials' };

      const { data: profile, error: pErr } = await supabase
        .from('admin_profiles')
        .select('*')
        .eq('id', data.user.id)
        .maybeSingle();

      if (profile) {
        if (profile.status === 'suspended') {
          await supabase.auth.signOut();
          return { ok: false, error: 'Your account has been suspended by the Super Admin.' };
        }
        setCurrentUser(profile);
        return { ok: true };
      }

      if (data.user.email?.toLowerCase() === 'sanjayayushsahu@gmail.com') {
        const ownerProfile: AdminProfile = {
          id: data.user.id,
          email: data.user.email,
          full_name: 'Sanjay Sahu (Super Admin)',
          role: 'super_admin',
          assigned_category: null,
          status: 'active',
          created_at: new Date().toISOString(),
        };
        setCurrentUser(ownerProfile);
        return { ok: true };
      }

      if (pErr) return { ok: false, error: `Profile error: ${pErr.message}` };
      return { ok: false, error: 'Admin profile not found in admin_profiles table.' };
    }

    const found = admins.find(
      (a) => a.email.toLowerCase() === email.trim().toLowerCase() && a.password === password,
    );
    if (!found) return { ok: false, error: 'Invalid email or password.' };
    if (found.status === 'suspended') {
      return { ok: false, error: 'Account suspended. Contact the Super Admin.' };
    }
    setCurrentUser(found);
    return { ok: true };
  };

  const logout = async () => {
    if (isSupabaseConfigured && supabase) await supabase.auth.signOut();
    setCurrentUser(null);
  };

  const updateSettings = async (next: Partial<AppSettings>) => {
    if (currentUser?.role !== 'super_admin') return;
    const updated = { ...settings, ...next, updated_at: new Date().toISOString() };
    setSettings(updated);
    await saveCloudKey('settings', updated);
  };

  const upsertSubAdmin = async (admin: Omit<AdminProfile, 'created_at'>) => {
    if (currentUser?.role !== 'super_admin') return;
    setAdmins((prev) => {
      const exists = prev.some((a) => a.id === admin.id);
      if (exists) return prev.map((a) => (a.id === admin.id ? { ...a, ...admin } : a));
      return [...prev, { ...admin, created_at: new Date().toISOString() }];
    });
  };

  const toggleSubAdminStatus = async (id: string) => {
    if (currentUser?.role !== 'super_admin') return;
    setAdmins((prev) =>
      prev.map((a) =>
        a.id === id && a.role === 'sub_admin'
          ? { ...a, status: a.status === 'active' ? 'suspended' : 'active' }
          : a,
      ),
    );
  };

  const deleteSubAdmin = async (id: string) => {
    if (currentUser?.role !== 'super_admin') return;
    setAdmins((prev) => prev.filter((a) => !(a.id === id && a.role === 'sub_admin')));
  };

  const upsertJewelleryRate = async (item: JewelleryRate) => {
    if (!canManage('jewellery')) return;
    const stamped = { ...item, updated_at: new Date().toISOString() };
    const next = jewelleryRates.some((x) => x.id === stamped.id)
      ? jewelleryRates.map((x) => (x.id === stamped.id ? stamped : x))
      : [stamped, ...jewelleryRates];
    setJewelleryRates(next);
    await saveCloudKey('jewelleryRates', next);
  };

  const deleteJewelleryRate = async (id: string) => {
    if (!canManage('jewellery')) return;
    const next = jewelleryRates.filter((x) => x.id !== id);
    setJewelleryRates(next);
    await saveCloudKey('jewelleryRates', next);
  };

  const upsertJewelleryOffer = async (item: JewelleryOffer) => {
    if (!canManage('jewellery')) return;
    const next = jewelleryOffers.some((x) => x.id === item.id)
      ? jewelleryOffers.map((x) => (x.id === item.id ? item : x))
      : [item, ...jewelleryOffers];
    setJewelleryOffers(next);
    await saveCloudKey('jewelleryOffers', next);
  };

  const deleteJewelleryOffer = async (id: string) => {
    if (!canManage('jewellery')) return;
    const next = jewelleryOffers.filter((x) => x.id !== id);
    setJewelleryOffers(next);
    await saveCloudKey('jewelleryOffers', next);
  };

  const upsertJewelleryItem = async (item: JewelleryItem) => {
    if (!canManage('jewellery')) return;
    const next = jewelleryItems.some((x) => x.id === item.id)
      ? jewelleryItems.map((x) => (x.id === item.id ? item : x))
      : [item, ...jewelleryItems];
    setJewelleryItems(next);
    await saveCloudKey('jewelleryItems', next);
  };

  const deleteJewelleryItem = async (id: string) => {
    if (!canManage('jewellery')) return;
    const next = jewelleryItems.filter((x) => x.id !== id);
    setJewelleryItems(next);
    await saveCloudKey('jewelleryItems', next);
  };

  const upsertConstruction = async (item: ConstructionMaterial) => {
    if (!canManage('construction')) return;
    const stamped = { ...item, updated_at: new Date().toISOString() };
    const next = constructionMaterials.some((x) => x.id === stamped.id)
      ? constructionMaterials.map((x) => (x.id === stamped.id ? stamped : x))
      : [stamped, ...constructionMaterials];
    setConstructionMaterials(next);
    await saveCloudKey('constructionMaterials', next);
  };

  const deleteConstruction = async (id: string) => {
    if (!canManage('construction')) return;
    const next = constructionMaterials.filter((x) => x.id !== id);
    setConstructionMaterials(next);
    await saveCloudKey('constructionMaterials', next);
  };

  const upsertMobile = async (item: MobileOffer) => {
    if (!canManage('mobile')) return;
    const stamped = { ...item, updated_at: new Date().toISOString() };
    const next = mobileOffers.some((x) => x.id === stamped.id)
      ? mobileOffers.map((x) => (x.id === stamped.id ? stamped : x))
      : [stamped, ...mobileOffers];
    setMobileOffers(next);
    await saveCloudKey('mobileOffers', next);
  };

  const deleteMobile = async (id: string) => {
    if (!canManage('mobile')) return;
    const next = mobileOffers.filter((x) => x.id !== id);
    setMobileOffers(next);
    await saveCloudKey('mobileOffers', next);
  };

  const submitOrder = (input: Omit<CustomerOrder, 'id' | 'status' | 'created_at'>): CustomerOrder => {
    const created: CustomerOrder = {
      ...input,
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      status: 'new',
      created_at: new Date().toISOString(),
    };
    setOrders((prev) => [created, ...prev]);
    if (isSupabaseConfigured && supabase) {
      supabase
        .from('customer_orders')
        .insert(created)
        .then(({ error }) => {
          if (error) console.error('[Cloud Sync] Order insert failed:', error.message);
        });
    }
    return created;
  };

  const updateOrderStatus = (id: string, status: CustomerOrder['status']) => {
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status } : o)));
    if (isSupabaseConfigured && supabase) {
      supabase.from('customer_orders').update({ status }).eq('id', id).then(() => {});
    }
  };

  const deleteOrder = (id: string) => {
    setOrders((prev) => prev.filter((o) => o.id !== id));
    if (isSupabaseConfigured && supabase) {
      supabase.from('customer_orders').delete().eq('id', id).then(() => {});
    }
  };

  return (
    <AppContext.Provider
      value={{
        lang,
        toggleLang,
        settings,
        admins,
        currentUser,
        jewelleryRates,
        jewelleryOffers,
        jewelleryItems,
        constructionMaterials,
        mobileOffers,
        orders,
        login,
        logout,
        canManage,
        updateSettings,
        upsertSubAdmin,
        toggleSubAdminStatus,
        deleteSubAdmin,
        upsertJewelleryRate,
        deleteJewelleryRate,
        upsertJewelleryOffer,
        deleteJewelleryOffer,
        upsertJewelleryItem,
        deleteJewelleryItem,
        upsertConstruction,
        deleteConstruction,
        upsertMobile,
        deleteMobile,
        submitOrder,
        updateOrderStatus,
        deleteOrder,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
};
