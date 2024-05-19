'use client';

import LoadingCircle from '@/app/components/common/LoadingCircle';
import { Button } from '@/app/components/ui/button';
import { defaultTransition } from '@/app/lib/animationConfig';
import supabase from '@/app/lib/supabase/auth/supabase-browser';
import { AnimatePresence, motion } from 'framer-motion';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

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
    <Link
      href={`/room/${room.id}/spectator`}
      target="_blank"
      className="flex w-full justify-between gap-2 border p-3 hover:bg-white hover:bg-opacity-5 "
      passHref
    >
      <div className="flex items-center gap-2">
        <div className={`duration-2000 h-2 w-2 ${statusClass}`}></div>
        <p className="flex h-full items-center text-base font-medium">
          {changeText(room.status)}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <p className="flex h-full items-center font-semibold capitalize text-red">
          {room.red.name}
        </p>
        <span className="text-xs opacity-50">vs</span>
        <p className="flex h-full items-center font-semibold capitalize text-blue">
          {room.blue.name}
        </p>
      </div>
    </Link>
  );
};

export default function RoomsPage() {
  const [rooms, setRooms] = useState<Room[]>([]);
  const [user, setUser] = useState<User>(); // We can use the user object directly from the auth module
  const router = useRouter();

  useEffect(() => {
    async function checkSession() {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        return null;
      }
      setUser(user);
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
      console.error('Error fetching room data:', error);
      return null;
    }
    return data;
  }

  useEffect(() => {
    const fetchRooms = async () => {
      const { data: rooms, error } = await supabase
        .from('rooms')
        .select('*, red(*), blue(*)');
      if (!error && rooms) {
        setRooms(rooms);
      } else {
        console.error('Error fetching rooms:', error);
      }
    };

    fetchRooms();

    // Subscribe to real-time updates to the rooms table
    supabase
      .channel('aram_draft_pick:rooms')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'aram_draft_pick',
          table: 'rooms',
        },
        async (payload) => {
          console.log('Real-time update:', payload);

          if (['UPDATE', 'INSERT'].includes(payload.eventType)) {
            // Fetch the full updated room data for the affected room
            const updatedRoom = await fetchFullRoomData(
              (payload.new as { id: string }).id
            );
            if (!updatedRoom) return; // Exit if fetching fails

            setRooms((currentRooms) => {
              return currentRooms.map((room) =>
                room.id === updatedRoom.id ? updatedRoom : room
              );
            });

            if (payload.eventType === 'INSERT') {
              setRooms((currentRooms) => [...currentRooms, updatedRoom]);
            }
          }

          if (payload.eventType === 'DELETE') {
            setRooms((currentRooms) =>
              currentRooms.filter((room) => room.id !== payload.old.id)
            );
          }
        }
      )
      .subscribe();
  }, []);

  if (!user)
    return (
      <>
        <div className="flex h-screen flex-col items-center justify-center">
          <LoadingCircle />
        </div>
      </>
    );

  const logout = async () => {
    await supabase.auth.signOut();
    router.push('/auth');
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ defaultTransition, delay: 0.1 }}
      >
        <div>
          <div className="flex flex-col">
            <div className="mb-6 flex w-full items-center justify-between">
              <div className="text-sm">
                <span className="opacity-60">Account: </span>
                {(user as any)?.email}
              </div>
              <Button onClick={logout}>Logout</Button>
            </div>
            <div className="relative flex h-4/5 w-full flex-col gap-2 overflow-scroll border p-4">
              {rooms.length ? (
                rooms.map((room, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ defaultTransition }}
                  >
                    <RoomComponent room={room} />
                  </motion.div>
                ))
              ) : (
                <p>No rooms</p>
              )}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
