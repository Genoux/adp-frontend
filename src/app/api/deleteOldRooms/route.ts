// api/deleteOldRooms.js

import { createClient } from '@supabase/supabase-js';
import type { NextApiRequest, NextApiResponse } from 'next';

export const runtime = 'edge';

import { NextResponse } from 'next/server';

export async function GET() {

  const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
  const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
  const supabase = createClient(SUPABASE_URL ?? '', SUPABASE_ANON_KEY ?? '', {
    db: { schema: 'aram_draft_pick' },
  });
  

  // Define the interval for deletion
  const interval = '30 seconds'; // Change to '2 hours' for production

  // Delete rooms older than the specified interval
  const { data, error } = await supabase
    .from('rooms')
    .delete()
    .lte('created_at', new Date(Date.now() - 30000)); // 30000 ms = 30 seconds

  if (error) {
    return NextResponse.json({ error });
  }

  return NextResponse.json({ ok: true, data });
}
