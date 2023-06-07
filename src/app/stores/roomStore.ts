import {create} from 'zustand';

// Update your RoomStore state
interface RoomStore {
  roomReady: Record<string, boolean>; // For each room id, store a boolean value
  setRoomReady: (roomId: string, isReady: boolean) => void;
  // Add your other states and functions...
}

// Create your store
export const roomStore = create<RoomStore>((set) => ({
  roomReady: {},
  setRoomReady: (roomId: string, isReady: boolean) => set((state) => ({
    roomReady: {
      ...state.roomReady,
      [roomId]: isReady,
    },
  })),
  // Add your other states and functions...
}));