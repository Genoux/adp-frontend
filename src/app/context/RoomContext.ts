import React from 'react';
import { Database } from '../types/supabase';

type HeroPoolItem = {
  name: string;
  selected: boolean;
  // ... other properties
};

type Room = Database["public"]["Tables"]["rooms"]["Row"];

//type Room = Database["public"]["Tables"]["rooms"]["Row"]

const RoomContext = React.createContext<Room | null>(null);

export default RoomContext;