import { champions } from '@/app/utils/champions';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export const runtime = 'edge';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? '';
const supabase = createClient(SUPABASE_URL ?? '', SUPABASE_ANON_KEY ?? '', {
  db: { schema: 'aram_draft_pick' },
});

function randomInt8() {
  return Math.floor(Math.random() * 256);
}

async function randomChampions() {
  const shuffledChampions = [...champions].sort(() => Math.random() - 0.5);
  const randomChampions = shuffledChampions.slice(0, 30);

  return {
    list: randomChampions,
  };
}

function generateArray(key: string, length: number) {
  return new Array(length).fill({ id: null, [key]: null, selected: false });
}

async function createRoom(blueTeamName: string, redTeamName: string) {
  const champions = await randomChampions();
  const id = randomInt8();

  try {
    const { data: room, error: roomError } = await supabase
      .from('rooms')
      .insert({id: id})
      .select('id')
      .single();

    // Check for error
    if (roomError) {
      return { error: roomError };
    }

    const roomId = room.id;

    const { data: redTeam, error: redError } = await supabase
      .from('teams')
      .insert({
        color: 'red',
        isturn: false,
        heroes_selected: generateArray('name', 5),
        heroes_ban: generateArray('name', 3),
        name: redTeamName,
        room: roomId, // Use the room ID here
      })
      .select('*')
      .single();

    // Create blue team
    const { data: blueTeam, error: blueError } = await supabase
      .from('teams')
      .insert({
        color: 'blue',
        isturn: true,
        heroes_selected: generateArray('name', 5),
        heroes_ban: generateArray('name', 3),
        name: blueTeamName,
        room: roomId, // Use the room ID here
      })
      .select('*')
      .single();

    if (redError || blueError) {
      return;
    }

    const teamRedId = redTeam.id;
    const teamBlueId = blueTeam.id;

    const { data: updatedRoom, error: updateError } = await supabase
      .from('rooms')
      .update({
        red: teamRedId,
        blue: teamBlueId,
        heroes_pool: champions.list,
        status: 'waiting',
      })
      .eq('id', roomId)
      .select('*')
      .single();

    if (updateError) {
      console.log('updateRoom - error:', updateError);
      return;
    }

    return { room: updatedRoom, red: redTeam, blue: blueTeam };
  } catch (error) { 
    console.log('createRoom - error:', error);
  }
}

export async function POST(request: NextRequest) {
  const { blueTeamName, redTeamName } = await request.json();
  const value = await createRoom(blueTeamName, redTeamName);
  return NextResponse.json(value);
}
