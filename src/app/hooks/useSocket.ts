// useSocket.ts
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { getTeam, getRoom } from '../services/api';

export default function useSocket(roomid: string, teamid: string) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io("http://localhost:4000", {
      query: { room: roomid },
    });

    setSocket(newSocket);

    newSocket.on("connect", async () => {
      console.log(`Connected to room ${roomid}`);
      newSocket.emit('joinRoom', roomid, teamid);
      // handle connection...
    });

    

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
      setSocket(null);
    };
  }, [roomid, teamid]);

  return socket;
}
