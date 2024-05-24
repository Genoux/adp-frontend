import { supabase } from '@/app/lib/supabase/client';
import { create } from 'zustand';

type Room = {
  id: string;
  name: string;
  status: string;
  heroes_pool: any[];
};

interface RoomState {
  room: Room | null;
  isLoading: boolean;
  isSubscribed: boolean;
  error: Error | null;
  handleRoomUpdate: (payload: any) => void;
  fetchRoom: (roomId: string) => Promise<void>;
}

const handleRoomUpdate = (set: any) => (payload: any) => {
  set({ room: { ...payload.new } });
};

export const roomStore = create<RoomState>((set) => ({
  room: null,
  isLoading: false,
  isSubscribed: false,
  error: null,

  handleRoomUpdate: handleRoomUpdate(set),

  fetchRoom: async (roomId: string) => {
    set({ isLoading: true, error: null, isSubscribed: false });
    try {
      const { data: room, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single(); // Fetching a single room

      if (error) {
        throw error;
      }

      set({ room });

      // Setting up the subscription for the room
      supabase
        .channel(roomId)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'aram_draft_pick',
            table: 'rooms',
            filter: `id=eq.${roomId}`,
          },
          (payload) => {
            handleRoomUpdate(set)(payload);
          }
        )
        .subscribe((status, err) => {
          if (err) {
            console.error('.subscribe - err ROOM:', err);
          } else {
            console.log(`Channel subscribed to room ${roomId}`);
            set({ isSubscribed: true });
          }
        });
    } catch (error) {
      set({ error } as any);
    } finally {
      set({ isLoading: false });
    }
  },
}));
