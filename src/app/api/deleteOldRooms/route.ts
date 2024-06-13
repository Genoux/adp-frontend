// api/deleteOldRooms.js

import { createClient } from '@supabase/supabase-js';

import { NextResponse } from 'next/server';

export const runtime = 'edge';

export async function GET() {
  
  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
  const supabase = createClient(SUPABASE_URL ?? '', SUPABASE_ANON_KEY ?? '', {
    db: { schema: 'aram_draft_pick' },
  });

  const timeThreshold = new Date(Date.now() - 30 * 1000); // 30 seconds

  // Delete rooms older than the specified interval
  const { data, error } = await supabase
  .from('aram_draft_pick.rooms')
  .delete()
  .lte('created_at', timeThreshold);

  if (error) {
    return NextResponse.json({ error });
  }

  return NextResponse.json({ ok: true, data });
}
