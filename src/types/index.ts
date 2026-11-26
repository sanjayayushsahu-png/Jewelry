export type AdminRole = 'super_admin' | 'sub_admin';
export type CategoryType = 'jewellery' | 'construction' | 'mobile';
export type AccountStatus = 'active' | 'suspended';
export type Language = 'en' | 'hi';

export interface AdminProfile {
  id: string;
  email: string;
  password?: string;
  full_name: string;
  role: AdminRole;
  assigned_category: CategoryType | null;
  status: AccountStatus;
  created_at: string;
}

export interface AppSettings {
  brand_name: string;
  brand_name_hi: string;
  tagline: string;
  tagline_hi: string;
  logo_text: string;
  logo_url?: string;
  support_phone: string;
  support_email: string;
  address: string;
  updated_at: string;
}

export interface JewelleryRate {
  id: string;
  metal_name: string;
  metal_name_hi: string;
  purity: string;
  unit: string;
  rate: number;
  previous_rate: number;
  is_highlighted: boolean;
  updated_at: string;
}

export interface JewelleryOffer {
  id: string;
  title: string;
  title_hi: string;
  subtitle: string;
  badge_text: string;
  valid_until: string;
  is_active: boolean;
}

export interface JewelleryItem {
  id: string;
  name: string;
  name_hi: string;
  category: string;
  purity: string;
  weight: string;
  price: number;
  making_charge: string;
  image_url: string;
  badge: string;
}

export interface ConstructionMaterial {
  id: string;
  material_type: 'cement' | 'tmt_bar' | 'other';
  brand: string;
  product_name: string;
  product_name_hi: string;
  specification: string;
  unit: string;
  price: number;
  previous_price: number;
  bulk_offer?: string;
  image_url?: string;
  in_stock: boolean;
  updated_at: string;
}

export interface MobileOffer {
  id: string;
  brand: string;
  model_name: string;
  image_url: string;
  original_price: number;
  discounted_price: number;
  specs_ram_storage: string;
  specs_display: string;
  specs_camera: string;
  specs_battery: string;
  highlight_badge: string;
  valid_until: string;
  is_active: boolean;
  updated_at: string;
}

export interface CustomerOrder {
  id: string;
  category: CategoryType;
  product_name: string;
  product_price: number;
  customer_name: string;
  customer_phone: string;
  city_address: string;
  quantity: string;
  notes: string;
  status: 'new' | 'contacted' | 'completed';
  created_at: string;
}
