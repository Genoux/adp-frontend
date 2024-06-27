import { supabase } from '@/app/lib/supabase/client';
import { create } from 'zustand';
import { RealtimePostgresUpdatePayload } from '@supabase/supabase-js';

type Room = {
  id: string;
  name: string;
  status: string;
  heroes_pool: any[];
  ready: boolean;
};

type RoomState ={
  room: Room | null;
  isLoading: boolean;
  isSubscribed: boolean;
  error: Error | null;
  fetchRoom: (roomId: string) => Promise<void>;
  unsubscribe: () => void;
}

const useRoomStore = create<RoomState>((set) => {
  let unsubscribe: (() => void) | null = null;

  return {
    room: null,
    isLoading: false,
    isSubscribed: false,
    error: null,

    fetchRoom: async (roomId: string) => {
      set({ isLoading: true, error: null, isSubscribed: false });
      try {
        const { data: room, error } = await supabase
          .from('rooms')
          .select('*')
          .eq('id', roomId)
          .single();

        if (error) throw error;
        set({ room });

        subscribeToRoom(roomId);
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
    const updatedRoom: Room = {
      id: payload.new.id,
      name: payload.new.name,
      status: payload.new.status,
      heroes_pool: payload.new.heroes_pool,
      ready: payload.new.ready,
    };
    set({ room: updatedRoom });
  }

  function subscribeToRoom(roomId: string) {
    const channel = supabase
      .channel(roomId)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'aram_draft_pick',
          table: 'rooms',
          filter: `id=eq.${roomId}`,
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