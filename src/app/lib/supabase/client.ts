import { createClient } from '@supabase/supabase-js';
import { Database } from '@/app/types/supabase';

const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  { db: { schema: 'aram_draft_pick' } }
);

const tournament = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL ?? '',
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '',
  { db: { schema: 'live_tournament' } }
);

export { supabase, tournament };
