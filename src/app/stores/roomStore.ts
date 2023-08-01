import { create } from 'zustand';
import supabase from '@/app/services/supabase';
import { Database } from '@/app/types/supabase';

type Room = Database['public']['Tables']['rooms']['Row'];

interface RoomState {
  room: Room | null;
  isLoading: boolean;
  error: Error | null;
  handleRoomUpdate: (payload: any, teamId: string) => void;
  fetchRoom: (roomId: string) => Promise<void>;
}

const handleRoomUpdate = (set: any) => (payload: any) => {
  // Update the room data in your state based on the payload
  set({ room: { ...payload.new } });
};

export const roomStore = create<RoomState>((set) => ({
  room: null,
  isLoading: false,
  error: null,
  handleRoomUpdate: handleRoomUpdate(set),
  fetchRoom: async (roomId: string) => {
    set({ isLoading: true, error: null });
    try {
      let { data: room, error } = await supabase
        .from('rooms')
        .select('*')
        .eq('id', roomId)
        .single(); // Fetching a single room

      if (error) {
        throw error;
      }

      set({ room });

      // Setting up the subscription for the room
      const subscription = supabase
        .channel(roomId)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'rooms',
            filter: `id=eq.${roomId}`,
          },
          (payload) => {
            handleRoomUpdate(set)(payload);
          }
        )
        .subscribe(() => console.log(`Realtime room ${roomId} update subscription has been set up.`));

    } catch (error) {
      set({ error } as any);
    } finally {
      set({ isLoading: false });
    }
  },
}));
