import { createClient, SupabaseClient } from '@supabase/supabase-js';
import type { Database } from '@/app/types/supabase';

const supabase: SupabaseClient = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? ''
);

export default supabase;
