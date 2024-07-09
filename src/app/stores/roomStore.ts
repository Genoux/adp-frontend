import { supabase } from '@/app/lib/supabase/client';
import { create } from 'zustand';
import { RealtimePostgresUpdatePayload } from '@supabase/supabase-js';
import { Database } from '@/app/types/supabase';

type Room = Database["public"]["Tables"]["rooms"]["Row"];

type RoomState = {
  room: Room | null;
  isLoading: boolean;
  error: Error | null;
  fetchRoom: (roomID: number) => Promise<void>;
  unsubscribe: () => void;
}

const useRoomStore = create<RoomState>((set) => {
  let unsubscribe: (() => void) | null = null;

  function handleRoomUpdate(payload: RealtimePostgresUpdatePayload<Room>) {
    const updatedRoom: Room = payload.new;
    set({ room: updatedRoom });
  }

  const subscribeToRoom = async (roomID: number): Promise<void> => {
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 5000; // 5 seconds

    const subscribeWithRetry = async (retries = 0): Promise<void> => {
      try {
        return new Promise((resolve, reject) => {
          const channel = supabase
            .channel(JSON.stringify(roomID))
            .on(
              'postgres_changes',
              {
                event: 'UPDATE',
                schema: 'public',
                table: 'rooms',
                filter: `id=eq.${roomID}`,
              },
              handleRoomUpdate
            )
            .subscribe((status, err) => {
              if (err) {
                console.error(`.subscribe - err ROOM (attempt ${retries + 1}):`, err);
                if (retries < MAX_RETRIES) {
                  setTimeout(() => subscribeWithRetry(retries + 1), RETRY_DELAY);
                } else {
                  reject(err);
                }
              } else {
                unsubscribe = () => channel.unsubscribe();
                resolve();
              }
            });
        });
      } catch (error) {
        console.error(`Failed to subscribe to room ${roomID} after ${MAX_RETRIES} attempts:`, error);
        throw error;
      }
    };

    return subscribeWithRetry();
  };

  return {
    room: null,
    isLoading: false,
    error: null,
    fetchRoom: async (roomID: number) => {
      set({ isLoading: true, error: null });
      try {
        const { data: room, error } = await supabase
          .from('rooms')
          .select('*')
          .eq('id', roomID)
          .single();
        
        if (error) throw error;
        
        set({ room });
        
        await subscribeToRoom(roomID);
        set({ isLoading: false });
      } catch (error) {
        console.error('Error fetching room:', error);
        set({ error: error as Error, isLoading: false });
      }
    },
    unsubscribe: () => {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
      }
    },
  };
});

export default useRoomStore;