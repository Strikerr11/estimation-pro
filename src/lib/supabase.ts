import { createClient } from '@supabase/supabase-js';

// Hardcoded directly to avoid any Vite environment injection failure on Vercel
const supabaseUrl = 'https://lfnzgietercjyoxmsnkd.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxmbnpnaWV0ZXJjanlveG1zbmtkIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDEyMzg3MjksImV4cCI6MjA1NjgxNDcyOX0.YOUR_ACTUAL_ANON_KEY_STRING_HERE'; 
// (Make sure your real legacy anon key is pasted above)

export const supabase = createClient(supabaseUrl, supabaseAnonKey);