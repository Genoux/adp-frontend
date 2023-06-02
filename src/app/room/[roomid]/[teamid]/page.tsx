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
  
  const [team, setTeam] = useState<any>(null);
  const [room, setRoom] = useState<any>(null);

  useEffect(() => {
    if (roomid) {
      const newSocket = io('http://localhost:3000', { query: { room: roomid } });
      setSocket(newSocket);

      newSocket.on('connect', async () => {
        console.log(`Connected to room ${roomid}`);
        // Join the room
        newSocket.emit('joinRoom', roomid);

        const { data: teamData, error } = await supabase.from('teams').select('*').eq('id', teamid).single();
        const { data: roomData, error: roomError } = await supabase.from('rooms').select('*').eq('id', roomid).single();
        
        if (error || !teamData || roomError || !roomData) {
          console.error('Error fetching data:', error);
          setRoomNotFound(true);
        } else {
          setLoading(false)
          setTeam(teamData);
          setRoom(roomData);
        }
      });
      
      newSocket.on('welcome', (arg: any) => {
        console.log('Server says:', arg);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [roomid, teamid]);

  // Handle rendering
  if (loading) {
    return <p>Loading...</p>
  }
  
  if (roomNotFound) {
    return <h1>404 - Page Not Found</h1>;
  }

  return (
    <div>
      <h1>Room ID: {room?.id}</h1>
      <h1>Team ID: {team?.id}</h1>
      <pre>{team?.color}</pre>
      <pre>{team?.isTurn.toString()}</pre>
      {team?.heroes_pool?.map((hero: any, index: number) => (
        <div key={index}>
          <pre>{hero.name}</pre>
        </div>
      ))}
    </div>
  );
}

