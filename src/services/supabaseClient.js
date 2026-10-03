import { createClient } from '@supabase/supabase-js';

// Read Supabase environment variables from Vite env or window global
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

export const isSupabaseConfigured = Boolean(supabaseUrl && supabaseAnonKey);

// Debug info (URL is not a secret - safe to expose for troubleshooting)
export const debugInfo = {
  url: supabaseUrl || '(not set)',
  keyPresent: Boolean(supabaseAnonKey),
  keyPrefix: supabaseAnonKey ? supabaseAnonKey.substring(0, 12) + '...' : '(not set)'
};

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;
