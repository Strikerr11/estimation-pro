import { createClient } from '@supabase/supabase-js';

// Hardcoded directly to avoid any Vite environment injection failure on Vercel
const supabaseUrl = 'https://lfnzgietercjyoxmsnkd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmbnpnaWV0ZXJjanlveG1zbmtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzODQ3NzQsImV4cCI6MjEwNjk2MDc3NH0.FEKtfJicr4tCargCfE8hNal-lQ-t89H5UPS6MFsHw-4';
// (Make sure your real legacy anon key is pasted above)

export const supabase = createClient(supabaseUrl, supabaseAnonKey);