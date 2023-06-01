"use client"

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import supabase from '@/app/services/supabase';
// Create a single supabase client for interacting with your database

export default function Room({ params }: { params: { roomid: string, teamid: string } }) {
  const roomid = params.roomid;
  const teamid = params.teamid;
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomNotFound, setRoomNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    if (roomid) {
      const newSocket = io('http://localhost:3000', { query: { room: roomid } });
      setSocket(newSocket);

      newSocket.on('connect', async () => {
        console.log(`Connected to room ${roomid}`);
        // Join the room
        newSocket.emit('joinRoom', roomid);

        const { data, error } = await supabase.from('teams').select('*, room(*)').eq('id', teamid).single();
        if (error || !data) {
          console.error('Error fetching data:', error);
          setRoomNotFound(true);
        } else {
          console.log('Fetched data:', data);
        }
      });
      
      setLoading(false)

      newSocket.on('welcome', (arg: any) => {
        console.log('Server says:', arg);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [roomid]);

  if (!loading) {
    if (roomNotFound) {
      return <h1>404 - Page Not Found</h1>;
    }

    return (
      <div>
        <p>Room: {roomid}</p>
        <p>Team: {teamid}</p>
      </div>
    );
  }
}
