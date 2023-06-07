import { create } from 'zustand';

interface RoomStore {
  rooms: Record<string, any>; // Now a mapping from room ids to room data
  setRoom: (roomId: string, roomData: any) => void; // Now needs room id as well
}

export const roomStore = create<RoomStore>((set) => ({
  rooms: {},
  setRoom: (roomId: string, roomData: any) => set((state) => ({
    rooms: {
      ...state.rooms,
      [roomId]: roomData, // Sets room data for specific id
    },
  })),
}));
