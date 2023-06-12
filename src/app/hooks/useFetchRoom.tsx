'use client'

import { useEffect, useState } from 'react';
import supabase from '@/app/services/supabase';
import { PostgrestError } from '@supabase/supabase-js';
import { roomStore } from "@/app/stores/roomStore";

const useFetchRoom = (roomid: string) => {
  const [error, setError] = useState<PostgrestError | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { rooms, setRoom } = roomStore();
  const data = rooms[roomid];
  
  useEffect(() => {
    supabase
      .channel("*")
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "rooms",
          filter: `id=eq.${roomid}`,
        },
        (payload) => {
          const { new: room } = payload;
          setRoom(roomid, room);
        }
      )
      .subscribe();
  }, [roomid, setRoom]);

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        const { data: room, error: fetchError } = await supabase
          .from('rooms')
          .select('*')
          .eq('id', roomid)
          .single();

        if (fetchError) {
          throw fetchError;
        }
        setRoom(roomid, room);
      } catch (error) {
        setError(error as PostgrestError);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTeam();
  }, [roomid, setRoom]);

  return { data, error, isLoading };
};

export default useFetchRoom;
