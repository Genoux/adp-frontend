import React from "react";
import { Database } from "../types/supabase";

type Room = Database["public"]["Tables"]["rooms"]["Row"];

const RoomContext = React.createContext<Room | null>(null);

export default RoomContext;
