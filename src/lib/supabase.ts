import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.VITE_SUPABASE_URL as string | undefined)?.trim();
const supabaseAnonKey = (import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined)?.trim();

const hasValidUrl =
  Boolean(supabaseUrl) &&
  supabaseUrl!.startsWith('https://') &&
  !supabaseUrl!.includes('your-project-id') &&
  !supabaseUrl!.includes('demo');

const hasValidKey =
  Boolean(supabaseAnonKey) &&
  supabaseAnonKey !== 'your-anon-public-key' &&
  supabaseAnonKey !== 'demo' &&
  !supabaseAnonKey!.includes('paste_your') &&
  supabaseAnonKey!.length > 20;

export const isSupabaseConfigured = hasValidUrl && hasValidKey;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;
