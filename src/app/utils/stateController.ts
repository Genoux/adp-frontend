import { supabase } from '@/app/lib/supabase/client';

export async function resetForPlanning(roomid: string) {
  // Reset room cycle and status
  await supabase
    .from('rooms')
    .update({ cycle: 0, status: 'planning' })
    .eq('id', roomid);

  // Fetch current heroes_pool from the room
  const { data: room, error: fetchError } = await supabase
    .from('rooms')
    .select('heroes_pool')
    .eq('id', roomid)
    .single();
  if (fetchError || !room) {
    return console.error('Error fetching room or heroes pool', fetchError);
  }

  // Null check for heroes_pool
  const updatedHeroesPool = Array.isArray(room.heroes_pool)
    ? room.heroes_pool.map((hero: any) => ({
        ...hero,
        selected: false,
      }))
    : [];

  // Update the heroes_pool in the room
  const { error: updateError } = await supabase
    .from('rooms')
    .update({ heroes_pool: updatedHeroesPool })
    .eq('id', roomid);
  if (updateError) {
    return console.error('Error updating heroes pool', updateError);
  }

  // Prepare reset objects for teams
  const resetSelected = Array(5).fill({ name: null, selected: false });
  const resetBan = Array(3).fill({ name: null, selected: false });

  // Reset heroes_selected and heroes_ban in teams
  await supabase
    .from('teams')
    .update({ heroes_selected: resetSelected, heroes_ban: resetBan })
    .eq('room', roomid);
}

export async function setWaiting(roomid: string) {
  await supabase
    .from('rooms')
    .update({ cycle: -1, status: 'waiting' })
    .eq('id', roomid);
  await supabase.from('teams').update({ ready: false }).eq('room', roomid);
}

export async function setPlanning(roomid: string) {
  resetForPlanning(roomid);
}

export async function setBan(roomid: string) {
  await supabase
    .from('rooms')
    .update({ cycle: 1, status: 'ban' })
    .eq('id', roomid);
  await supabase.from('teams').update({ ready: true }).eq('room', roomid);
  await supabase
    .from('teams')
    .update({ isturn: true })
    .eq('room', roomid)
    .eq('color', 'blue');
  await supabase
    .from('teams')
    .update({ isturn: false })
    .eq('room', roomid)
    .eq('color', 'red');
}

export async function setSelect(roomid: string) {
  await supabase
    .from('rooms')
    .update({ cycle: 7, status: 'select' })
    .eq('id', roomid);
  await supabase.from('teams').update({ ready: true }).eq('room', roomid);
  await supabase
    .from('teams')
    .update({ isturn: true })
    .eq('room', roomid)
    .eq('color', 'blue');
  await supabase
    .from('teams')
    .update({ isturn: false })
    .eq('room', roomid)
    .eq('color', 'red');
}

export async function setFinish(roomid: string) {
  await supabase
    .from('rooms')
    .update({ cycle: 17, status: 'done' })
    .eq('id', roomid);
  await supabase.from('teams').update({ ready: true }).eq('room', roomid);
  await supabase
    .from('teams')
    .update({ isturn: false })
    .eq('room', roomid)
    .eq('color', 'blue');
  await supabase
    .from('teams')
    .update({ isturn: false })
    .eq('room', roomid)
    .eq('color', 'red');
}