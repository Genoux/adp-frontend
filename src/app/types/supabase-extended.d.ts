// types/supabase-extended.d.ts
import type { Database } from './supabase';

declare module '@supabase/supabase-js' {
  export interface SupabaseClient {
    from<T extends keyof Database['public']['Tables']>(
      table: T
    ): SupabaseQueryBuilder<Database['public']['Tables'][T]['Row']>;
  }
}
