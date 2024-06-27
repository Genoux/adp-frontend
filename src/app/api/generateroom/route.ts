import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { supabase } from '@/app/lib/supabase/client';
import { Database } from '@/app/types/supabase';
import { cache } from 'react';

type Hero = Database["public"]["CompositeTypes"]["hero"];

export const runtime = 'edge';

const fetchChampions = cache(async (): Promise<Hero[]> => {
  const response = await fetch('https://ddragon.leagueoflegends.com/cdn/14.13.1/data/en_US/champion.json');
  const data = await response.json();
  
  return Object.values(data.data).map((champion: any) => ({
    id: champion.id,
    name: champion.name,
    selected: false,
  }));
});

function randomInt8() {
  return Math.floor(Math.random() * 256);
}

async function getRandomChampions(count: number): Promise<Hero[]> {
  const allChampions = await fetchChampions();
  const shuffledChampions = [...allChampions].sort(() => Math.random() - 0.5);
  return shuffledChampions.slice(0, count);
}

function generateArray(length: number): Hero[] {
  return Array.from({ length }, () => ({ id: null, name: null, selected: false }));
}

function createHeroesPool(champions: Hero[]): Hero[] {
  return champions.map(champion => ({
    id: champion.id,
    name: champion.name,
    selected: false
  }));
}

async function createRoom(blueTeamName: string, redTeamName: string) {
  const champions = await getRandomChampions(30);
  const id = randomInt8();

  try {
    const { error } = await supabase
      .from('rooms')
      .insert({id})

    if (error) {
      console.error("createRoom - roomError:", error);
      return { error: error };
    }

    const roomID = id;
    const teamsData = [
      { color: 'red', name: redTeamName, is_turn: false },
      { color: 'blue', name: blueTeamName, is_turn: true }
    ];


    const { data: teams, error: teamsError } = await supabase
    .from('teams')
    .insert(teamsData.map(team => ({
      ...team,
      heroes_selected: generateArray(5),
      heroes_ban: generateArray(5),
      room_id: roomID,
    })))
    .select('*');

    if (teamsError) {
      return { error: teamsError };
    }

    const [redTeam, blueTeam] = teams;

    const { data: updatedRoom, error: updateError } = await supabase
    .from('rooms')
    .update({
      red_team_id: redTeam.id,
      blue_team_id: blueTeam.id,
      heroes_pool: createHeroesPool(champions),
      status: 'waiting',
    })
    .eq('id', roomID)
    .select('*')
    .single();

    if (updateError) {
      console.error('updateRoom - error:', updateError);
      return { error: updateError };
    }

    return { room: updatedRoom, red: redTeam, blue: blueTeam };
  } catch (error) {
    console.error('createRoom - error:', error);
    return { error };
  }
}

export async function POST(request: NextRequest) {
  const { blueTeamName, redTeamName } = await request.json();
  const result = await createRoom(blueTeamName, redTeamName);
  return NextResponse.json(result);
}