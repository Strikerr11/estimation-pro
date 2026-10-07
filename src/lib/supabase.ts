import { createClient } from '@supabase/supabase-js';

// Mock values so Vite and Vercel build smoothly without throwing errors
const supabaseUrl = 'https://xyzcompany.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsImlhdCI6MTYwMDAwMDAwMCwiZXhwIjoyMDAwMDAwMDAwfQ.demo';

export const supabase = createClient(supabaseUrl, supabaseAnonKey);