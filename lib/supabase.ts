import { createClient } from '@supabase/supabase-js';

// Access environment variables securely
// These should be set in .env file: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
const supabaseUrl = (import.meta as any).env?.VITE_SUPABASE_URL || '';
const supabaseAnonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY || '';

// Create a single supabase client for interacting with your database
// If environment variables are missing, this will likely throw or fail, 
// so in a real app check for existence.
// For this demo, we can conditionally export.

export const supabase = (supabaseUrl && supabaseAnonKey) 
  ? createClient(supabaseUrl, supabaseAnonKey)
  : null;