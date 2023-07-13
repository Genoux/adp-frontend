import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';
 
export const config = {
  runtime: 'edge',
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';

// Create a single supabase client for interacting with your database
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
 
export default async function MyEdgeFunction(request: NextRequest, event: NextFetchEvent) {
  const body = await request.json();
  const roomid = body.roomid;

  const cycle = await updateRoomCycle(roomid);

  return NextResponse.json({cycle: cycle});
}


export async function updateRoomCycle(roomId: string) {
  const { data: room, error: fetchError } = await supabase
  .from("rooms")
  .select("*")
  .eq("id", roomId)
  .single();

  if (fetchError || !room) {
    console.error('Error fetching room:', fetchError);
    return;
  }

  const currentCycle = room.cycle;
  const newCycle = currentCycle + 1;

  const { error: updateError } = await supabase
  .from('rooms')
  .update({ cycle: newCycle })
  .eq('id', roomId);

  if (updateError) {
    console.error('Error updating room:', updateError);
    return;
  }

  return currentCycle;
}