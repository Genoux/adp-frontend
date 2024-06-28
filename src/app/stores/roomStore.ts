import { supabase } from '@/app/lib/supabase/client';
import { create } from 'zustand';
import { RealtimePostgresUpdatePayload } from '@supabase/supabase-js';
import { Database } from '@/app/types/supabase';

type Room = Database["public"]["Tables"]["rooms"]["Row"];

type RoomState ={
  room: Room | null;
  isLoading: boolean;
  isSubscribed: boolean;
  error: Error | null;
  fetchRoom: (roomID: number) => Promise<void>;
  unsubscribe: () => void;
}

const useRoomStore = create<RoomState>((set) => {
  let unsubscribe: (() => void) | null = null;

  return {
    room: null,
    isLoading: false,
    isSubscribed: false,
    error: null,

    fetchRoom: async (roomID: number) => {
      set({ isLoading: true, error: null, isSubscribed: false });
      try {
        const { data: room, error } = await supabase
          .from('rooms')
          .select('*')
          .eq('id', roomID)
          .single();

        if (error) throw error;
        set({ room });

        subscribeToRoom(roomID);
      } catch (error) {
        set({ error: error as Error });
      } finally {
        set({ isLoading: false });
      }
    },

    unsubscribe: () => {
      if (unsubscribe) {
        unsubscribe();
        unsubscribe = null;
        set({ isSubscribed: false });
      }
    },
  };

  function handleRoomUpdate(payload: RealtimePostgresUpdatePayload<Room>) {
    const updatedRoom: Room = payload.new;
    set({ room: updatedRoom });
  }

  function subscribeToRoom(roomID: number) {
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
          console.error('.subscribe - err ROOM:', err);
          set({ error: err });
        } else {
          set({ isSubscribed: true });
        }
      });

    unsubscribe = () => channel.unsubscribe();
  }
});

export default useRoomStore;