"use client"
import { useEffect, useState } from 'react'
import { io, Socket } from 'socket.io-client';
import { useRouter } from 'next/router'

export default function Room({ params }: { params: { roomid: string } }) {
  const roomid =  params.roomid
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    if (roomid) {
      const newSocket = io('http://localhost:3000', { query: { room: roomid as string } });
      setSocket(newSocket);

      newSocket.on('connect', () => {
        console.log(`connected to room ${roomid}`);
        // Join the room
        newSocket.emit('joinRoom', roomid);
      });

      newSocket.on('welcome', (arg: any) => {
        console.log('server says: ', arg);
      });

      return () => {
        newSocket.disconnect();
      };
    }
  }, [roomid]);



  // Use roomid and teamid in your component logic

  return <p>Post: {roomid}</p>;
}