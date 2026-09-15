import { createClient } from '@supabase/supabase-js';

const rawUrl = import.meta.env.VITE_SUPABASE_URL || '';
const rawKey = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY || '';

const supabaseUrl = rawUrl.trim().replace(/[\uFEFF\u200B\u200C\u200D\uFEFF]/g, '');
const supabaseAnonKey = rawKey.trim().replace(/[\uFEFF\u200B\u200C\u200D\uFEFF]/g, '');

// If credentials are not yet configured in the environment, we instantiate a dummy client or handle it gracefully.
// This prevents the application from crashing on load before the remote database is fully connected.
export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey) 
  : null;
