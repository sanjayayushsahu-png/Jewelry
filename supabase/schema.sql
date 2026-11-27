-- ============================================================================
-- BharatBazaar Live — PostgreSQL + Supabase RLS Schema
-- Implements strict Role-Based Access Control (Super Admin & Category Sub-Admins)
-- ============================================================================

create type public.admin_role as enum ('super_admin', 'sub_admin');
create type public.category_type as enum ('jewellery', 'construction', 'mobile');
create type public.account_status as enum ('active', 'suspended');
create type public.material_kind as enum ('cement', 'tmt_bar', 'other');

-- 1. Admin Profiles (linked to auth.users)
create table public.admin_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text unique not null,
  full_name text not null,
  role public.admin_role not null default 'sub_admin',
  assigned_category public.category_type,
  status public.account_status not null default 'active',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint sub_admin_must_have_category check (
    (role = 'super_admin' and assigned_category is null)
    or (role = 'sub_admin' and assigned_category is not null)
  )
);

-- 2. App Branding & Global Settings (Super Admin only for writes)
create table public.app_settings (
  id int primary key default 1 check (id = 1),
  brand_name text not null default 'Chhattisgarh Bazar',
  brand_name_hi text not null default 'छत्तीसगढ़ बाज़ार',
  tagline text not null default 'Daily Gold, Cement, Sariya & Smartphone Deals',
  tagline_hi text not null default 'दैनिक सोना, सीमेंट, सरिया और स्मार्टफोन ऑफर',
  logo_text text not null default 'CB',
  logo_url text,
  support_phone text not null default '+91 96302 73317',
  support_email text not null default 'support@chhattisgarhbazar.in',
  address text not null default 'Main Market Complex, Raipur, CG',
  updated_at timestamptz not null default now(),
  updated_by uuid references public.admin_profiles(id)
);

-- 3. Jewellery Rates
create table public.jewellery_rates (
  id uuid primary key default gen_random_uuid(),
  metal_name text not null,
  metal_name_hi text not null,
  purity text not null,
  unit text not null,
  rate numeric(12, 2) not null,
  previous_rate numeric(12, 2) not null,
  is_highlighted boolean not null default false,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.admin_profiles(id)
);

-- 4. Jewellery Offers / Banners
create table public.jewellery_offers (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  title_hi text not null,
  subtitle text not null,
  badge_text text not null default 'LIMITED OFFER',
  valid_until date not null,
  is_active boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.admin_profiles(id)
);

-- 5. Construction Materials (Cement, TMT Bars / Sariya, Others)
create table public.construction_materials (
  id uuid primary key default gen_random_uuid(),
  material_type public.material_kind not null,
  brand text not null,
  product_name text not null,
  product_name_hi text not null,
  specification text not null,
  unit text not null,
  price numeric(12, 2) not null,
  previous_price numeric(12, 2) not null,
  bulk_offer text,
  in_stock boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.admin_profiles(id)
);

-- 6. Mobile & Smartphone Offers
create table public.mobile_offers (
  id uuid primary key default gen_random_uuid(),
  brand text not null,
  model_name text not null,
  image_url text not null,
  original_price numeric(12, 2) not null,
  discounted_price numeric(12, 2) not null,
  specs_ram_storage text not null,
  specs_display text not null,
  specs_camera text not null,
  specs_battery text not null,
  highlight_badge text not null default 'HOT DEAL',
  valid_until date not null,
  is_active boolean not null default true,
  updated_at timestamptz not null default now(),
  updated_by uuid references public.admin_profiles(id)
);

-- RBAC Helper Functions
create or replace function public.is_active_super_admin()
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.admin_profiles
    where id = auth.uid() and role = 'super_admin' and status = 'active'
  );
$$;

create or replace function public.can_manage_category(target_cat public.category_type)
returns boolean language sql security definer stable as $$
  select exists (
    select 1 from public.admin_profiles
    where id = auth.uid() and status = 'active'
      and (role = 'super_admin' or (role = 'sub_admin' and assigned_category = target_cat))
  );
$$;

-- Enable RLS
alter table public.admin_profiles enable row level security;
alter table public.app_settings enable row level security;
alter table public.jewellery_rates enable row level security;
alter table public.jewellery_offers enable row level security;
alter table public.construction_materials enable row level security;
alter table public.mobile_offers enable row level security;

-- Policies
create policy "Admins read own profile or super admin reads all"
  on public.admin_profiles for select
  using (auth.uid() = id or public.is_active_super_admin());

create policy "Super Admin manages all admin profiles"
  on public.admin_profiles for all
  using (public.is_active_super_admin())
  with check (public.is_active_super_admin());

create policy "Public read app settings" on public.app_settings for select using (true);
create policy "Super Admin writes app settings" on public.app_settings for all
  using (public.is_active_super_admin()) with check (public.is_active_super_admin());

create policy "Public read jewellery rates" on public.jewellery_rates for select using (true);
create policy "Jewellery admins write rates" on public.jewellery_rates for all
  using (public.can_manage_category('jewellery')) with check (public.can_manage_category('jewellery'));

create policy "Public read jewellery offers" on public.jewellery_offers for select using (true);
create policy "Jewellery admins write offers" on public.jewellery_offers for all
  using (public.can_manage_category('jewellery')) with check (public.can_manage_category('jewellery'));

create policy "Public read construction materials" on public.construction_materials for select using (true);
create policy "Construction admins write materials" on public.construction_materials for all
  using (public.can_manage_category('construction')) with check (public.can_manage_category('construction'));

create policy "Public read mobile offers" on public.mobile_offers for select using (true);
create policy "Mobile admins write offers" on public.mobile_offers for all
  using (public.can_manage_category('mobile')) with check (public.can_manage_category('mobile'));

-- Realtime
alter publication supabase_realtime add table
  public.app_settings,
  public.jewellery_rates,
  public.jewellery_offers,
  public.construction_materials,
  public.mobile_offers;

-- ============================================================================
-- Unified Live Cloud Sync Store (All Products, Rates, Photos & Customer Orders)
-- ============================================================================
create table if not exists public.site_data (
  key text primary key,
  value jsonb not null,
  updated_at timestamptz not null default now()
);

create table if not exists public.customer_orders (
  id text primary key,
  category text not null,
  product_name text not null,
  product_price numeric(12, 2) not null,
  customer_name text not null,
  customer_phone text not null,
  city_address text not null,
  quantity text not null,
  notes text default '',
  status text not null default 'new',
  created_at timestamptz not null default now()
);

alter table public.site_data enable row level security;
alter table public.customer_orders enable row level security;

create policy "Public read site_data" on public.site_data for select using (true);
create policy "Authenticated admins write site_data" on public.site_data for all
  to authenticated using (true) with check (true);

create policy "Public submit customer orders" on public.customer_orders for insert
  to anon, authenticated with check (true);
create policy "Authenticated admins manage orders" on public.customer_orders for select
  to authenticated using (true);
create policy "Authenticated admins update orders" on public.customer_orders for update
  to authenticated using (true) with check (true);
create policy "Authenticated admins delete orders" on public.customer_orders for delete
  to authenticated using (true);

alter publication supabase_realtime add table public.site_data, public.customer_orders;
