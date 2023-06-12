import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface SocketHandlers {
  onMessage?: (msg: any) => void;
  onTimer?: (timer: string) => void;
}

export default function useSocket(roomid: string, teamid: string, handlers: SocketHandlers = {}) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketServerUrl = process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:4000';
    const newSocket = io(socketServerUrl);

    setSocket(newSocket);

    newSocket.on("connect", async () => {
      console.log("Connected to socket server");
      newSocket.emit('joinRoom', { roomid, teamid });
    });

    if (handlers.onMessage) {
      newSocket.on("message", handlers.onMessage);
    }

    if (handlers.onTimer) {
      newSocket.on("TIMER", handlers.onTimer);
    }

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
      setSocket(null);
    };
  }, [handlers.onMessage, handlers.onTimer, roomid, teamid]);

  return socket;
}
