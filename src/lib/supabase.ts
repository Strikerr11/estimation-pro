import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || 'https://lfnzgietercjyoxmsnkd.supabase.co';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmbnpnaWV0ZXJjanlveG1zbmtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzODQ3NzQsImV4cCI6MjEwNjk2MDc3NH0.FEKtfJicr4tCargCfE8hNal-lQ-t89H5UPS6MFsHw-4';

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables. Check your Vercel settings.");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);