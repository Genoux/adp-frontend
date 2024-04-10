"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";

interface Room {
  [key: string]: any;
}



const RoomComponent = ({ room }: { room: Room }) => {
  if (!room.status) {
    return null;
  }

  const statusClass = (() => {
    switch (room.status) {
      case 'picking':
      case 'ban':
        return 'bg-green-600 animate-pulse'; // Green for picking or ban
      case 'done':
        return 'bg-red-600'; // Red for done
      case 'planning':
        return 'bg-yellow-600 animate-pulse'; // Yellow for planning
      default:
        return 'bg-gray-600 animate-pulse'; // Gray for any other status
    }
  })();

  return (
    <Link href={`/room/${room.id}/spectator`} target="_blank" className="w-full hover:bg-white hover:bg-opacity-5 transition-all border rounded-sm p-2 justify-between flex gap-2 " passHref>
      <div className="flex items-center gap-2">
        <div className={`h-full w-3 rounded-full duration-2000 ${statusClass}`}></div>
        <p className="h-full items-center flex text-base font-medium">{room.status}</p>
      </div>
      <div className="flex gap-2">
        <p className="h-full items-center flex text-red font-semibold">{room.red.name}</p>
        <span className="opacity-50">-</span>
        <p className="h-full items-center flex text-blue font-semibold">{room.blue.name}</p>
      </div>


    </Link>
  )
};

export default function Protected() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [rooms, setRooms] = useState<Room[]>([]);

  async function fetchFullRoomData(roomId: string) {
    const { data, error } = await supabase
      .from('rooms')
      .select('*, red(*), blue(*)')
      .eq('id', roomId)
      .single(); // Assuming 'id' is unique, .single() will return just one object

    if (error) {
      console.error("Error fetching room data:", error);
      return null;
    }
    return data;
  }




  useEffect(() => {
    // Fetch the initial list of rooms
    const fetchRooms = async () => {
      const { data: rooms, error } = await supabase.from('rooms').select('*, red(*), blue(*)');
      if (!error && rooms) {
        setRooms(rooms);
      } else {
        console.error("Error fetching rooms:", error);
      }
      setLoading(false);
    };

    fetchRooms();

    // Subscribe to real-time updates to the rooms table
    supabase
      .channel("public:rooms")
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'rooms',
      }, async (payload) => {
        console.log("Real-time update:", payload);

        if (['UPDATE', 'INSERT'].includes(payload.eventType)) {
          // Fetch the full updated room data for the affected room
          const updatedRoom = await fetchFullRoomData((payload.new as { id: string }).id);
          if (!updatedRoom) return; // Exit if fetching fails

          setRooms(currentRooms => {
            return currentRooms.map(room => room.id === updatedRoom.id ? updatedRoom : room);
          });

          if (payload.eventType === 'INSERT') {
            setRooms(currentRooms => [...currentRooms, updatedRoom]);
          }
        }

        if (payload.eventType === 'DELETE') {
          setRooms(currentRooms => currentRooms.filter(room => room.id !== payload.old.id));
        }
      })
      .subscribe();
  }, []);


  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error.message);
      return;
    }

    router.refresh();
    setUser(null);
  };

  console.log({ loading, user });

  if (loading) {
    return <h1>Loading...</h1>;
  }


  return (
    <div className="container max-w-2xl p-24">
      <div className="flex flex-col gap-12">
      <h1>{user?.email}</h1>
        <div className="flex flex-col w-full justify-between">
          {<p>Bonjour, {user?.email}</p>}
          <Button onClick={handleLogout} className="w-fit h-full">
            Logout
          </Button>
        </div>
        <div className="w-full h-full flex flex-col gap-2">
          {rooms.length ? rooms.map(room => <RoomComponent key={room.id} room={room} />) : <p>No rooms</p>}
        </div>
      </div>
    </div>
  );
}
