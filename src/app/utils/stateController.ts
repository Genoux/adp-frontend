import { supabase } from '@/app/lib/supabase/client';

const local =
  process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:4000';

const myHeaders = new Headers();
myHeaders.append('Content-Type', '');

type RequestRedirect = 'follow' | 'error' | 'manual';
type RequestInit = {
  method: 'POST';
  headers: Headers;
  redirect: RequestRedirect | undefined;
};

const requestOptions: RequestInit = {
  method: 'POST',
  headers: myHeaders,
  redirect: 'follow' as RequestRedirect | undefined,
};

async function resetArray(roomID: number): Promise<void> {
  try {
    // Fetch current heroes_pool from the room
    const { data: room, error: fetchError } = await supabase
      .from('rooms')
      .select('heroes_pool')
      .eq('id', roomID)
      .single();

    if (fetchError || !room) {
      throw new Error('Error fetching room or heroes pool');
    }

    // Null check and update heroes_pool
    const updatedHeroesPool = Array.isArray(room.heroes_pool)
      ? room.heroes_pool.map((hero: any) => ({ ...hero, selected: false }))
      : [];

    // Update the heroes_pool in the room and reset team selections and bans in a single transaction
    const { error: updateError } = await supabase
      .from('rooms')
      .update({ heroes_pool: updatedHeroesPool })
      .eq('id', roomID);

    if (updateError) {
      throw new Error('Error updating heroes pool');
    }

    const resetSelected = Array(5).fill({
      id: null,
      name: null,
      selected: false,
    });
    const resetBan = Array(3).fill({ id: null, name: null, selected: false });

    const { error: resetError } = await supabase
      .from('teams')
      .update({ heroes_selected: resetSelected, heroes_ban: resetBan })
      .eq('room_id', roomID);

    if (resetError) {
      throw new Error('Error resetting team selections and bans');
    }
  } catch (error) {
    console.error((error as any).message);
  }
}

export async function setWaiting(roomID: number): Promise<void> {
  try {
    await resetArray(roomID);

    const response = await fetch(
      `${local}/api/waiting?roomID=${roomID}`,
      requestOptions
    );

    if (!response.ok) {
      throw new Error('Error setting waiting phase');
    }
  } catch (error) {
    console.error('Error setting waiting phase:', error);
  }
}

export async function setPlanning(roomID: number): Promise<void> {
  try {
    const response = await fetch(`${local}/api/planning?roomID=${roomID}`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Error setting planning phase');
    }
  } catch (error) {
    console.error(error);
  }
}

export async function setDraft(roomID: number): Promise<void> {
  await resetArray(roomID);

  try {
    const response = await fetch(`${local}/api/draft?roomID=${roomID}`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Error setting draft phase');
    }
  } catch (error) {
    console.error('Error setting draft phase:', error);
  }
}

export async function userTrigger(roomID: number): Promise<void> {
  try {
    const response = await fetch(`${local}/api/usertrigger?roomID=${roomID}`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Error setting Draft phase');
    }
  } catch (error) {
    console.error(error);
  }
}

export async function setFinish(roomID: number): Promise<void> {
  try {
    const response = await fetch(`${local}/api/done?roomID=${roomID}`, {
      method: 'POST',
    });

    if (!response.ok) {
      throw new Error('Error setting finish phase');
    }
  } catch (error) {
    console.error(error);
  }
}
