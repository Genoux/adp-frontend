"use client"

import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { useRouter } from 'next/router';
import { createClient } from '@supabase/supabase-js';

// Create a single supabase client for interacting with your database
const supabase = createClient('http://localhost:54321', 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0');

export default function Room({ params }: { params: { roomid: string } }) {
  const roomid = params.roomid;
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

        const { data, error } = await supabase.from('rooms').select('*').eq('id', roomid).single();
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

    return <p>Post: {roomid}</p>;
  }
}
