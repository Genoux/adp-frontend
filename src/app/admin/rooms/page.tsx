'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import supabase from '@/app/lib/supabase/auth/supabase-browser';
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { defaultTransition } from '@/app/lib/animationConfig';
import LoadingCircle from '@/app/components/common/LoadingCircle';

interface Room {
  [key: string]: any;
}

interface User {
  [key: string]: any;
}

const RoomComponent = ({ room }: { room: Room }) => {
  if (!room.status) {
    return null;
  }

  function changeText(status: string) {
    switch (status) {
      case 'select':
        return 'Picking';
      case 'ban':
        return 'Banning';
      case 'done':
        return 'Done';
      case 'planning':
        return 'Planning';
      default:
        return 'Unknown';
    }
  }

  const statusClass = (() => {
    switch (room.status) {
      case 'select':
        return 'bg-pink-600 animate-pulse'; // Green for picking or ban
      case 'ban':
        return 'bg-red-600 animate-pulse'; // Green for picking or ban
      case 'done':
        return 'bg-green-400'; // Red for done
      case 'planning':
        return 'bg-yellow-600 animate-pulse'; // Yellow for planning
      default:
        return 'bg-gray-600 animate-pulse'; // Gray for any other status
    }
  })();

  return (
    <Link href={`/room/${room.id}/spectator`} target="_blank" className="w-full hover:bg-white hover:bg-opacity-5 transition-all border rounded-sm p-3 justify-between flex gap-2 " passHref>
      <div className="flex items-center gap-2">
        <div className={`h-2 w-2 rounded-full duration-2000 ${statusClass}`}></div>
        <p className="h-full items-center flex text-base font-medium">{changeText(room.status)}</p>
      </div>
      <div className="flex gap-2 items-center">
        <p className="h-full items-center flex text-red font-semibold capitalize">{room.red.name}</p>
        <span className="opacity-50 text-xs">vs</span>
        <p className="h-full items-center flex text-blue font-semibold capitalize">{room.blue.name}</p>
      </div>


    </Link>
  )
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [user, setUser] = useState<User>(); // We can use the user object directly from the auth module
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        return null
      }
      setUser(user)
    }

    checkSession();
  }, [router]);


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
    const fetchRooms = async () => {
      const { data: rooms, error } = await supabase.from('rooms').select('*, red(*), blue(*)');
      if (!error && rooms) {
        setRooms(rooms);
      } else {
        console.error("Error fetching rooms:", error);
      }
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
  }
    , []);

  if (!user)
    return (
      <>
        <div className="flex flex-col h-screen items-center justify-center">
          <LoadingCircle />
        </div>
      </>
    )

  const logout = async () => {
    await supabase.auth.signOut();
    router.push("/auth");
  };

  return (
    <AnimatePresence>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ defaultTransition, delay: 0.1 }}
      >

        <div className=" mt-24">
          <div className="flex flex-col">
            <div className="flex w-full mb-6 justify-between items-center">
              <div className='text-sm'>
                <span className='opacity-60'>Account: </span>
                {(user as any)?.email}</div>
              <Button onClick={logout}>Logout</Button>
            </div>
            <div className="w-full flex flex-col gap-2 overflow-scroll h-4/5 relative border p-4 rounded-md">
              {rooms.length ? rooms.map((room, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ defaultTransition }}
                >
                  <RoomComponent room={room} />
                </motion.div>
              )) : <p>No rooms</p>}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
