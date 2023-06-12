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

  await switchTurnAndUpdateCycle(roomid);
  console.log("MyEdgeFunction - roomid:", roomid);

  return NextResponse.json({
    name: `Done!`,
  });
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

  return { currentCycle, newCycle };
}

export async function switchTurnAndUpdateCycle(roomId: string) {
  const roomCycle = await updateRoomCycle(roomId);

  if (!roomCycle) {
    console.error("Room cycle not available");
    return;
  }

  const { currentCycle } = roomCycle;

  const { data: teams, error: teamFetchError } = await supabase
  .from("teams")
  .select("*, room(id, cycle, status)")
  .eq("room", roomId);

  if (teamFetchError || !teams || teams.length === 0) {
    console.error('Error fetching teams or no teams found:', teamFetchError);
    return 'No teams found';
  }

  //resetTimer(roomId);

  const value = shouldSwitchTurn(currentCycle);

  if (!value) {
    return;
  } else if (value === 'done') {
    // set room status to done
    await supabase
      .from('rooms')
      .update({ status: 'done' })
      .eq('id', roomId);
    
    await supabase.from('teams').update({ isTurn: false }).eq('room', roomId);
    
    return 'done';
  }

  const updatePromises = teams.map((team: any) => 
    supabase
      .from("teams")
      .update({ isTurn: !team.isTurn })
      .eq("id", team.id)
  );

  await Promise.all(updatePromises);
}

function shouldSwitchTurn(cycle: number) {
  if (cycle === 1 || cycle === 3 || cycle === 5 || cycle === 7 || cycle === 9) {
    return true; // Switch turns
  } else if (cycle >= 10) {
    return 'done'; // All rounds completed
  } else {
    return false; // Continue with the same team's turn
  }
}