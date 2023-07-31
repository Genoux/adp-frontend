"use client"

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

interface EventHandlers {
  eventName: string;
  eventHandler: (data: any) => void;
}

interface SocketHandlers {
  eventHandlers?: EventHandlers[];
}

export default function useSocket(
  roomid: string,
  teamid: string,
  handlers: SocketHandlers = {}
) {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const socketServerUrl =
      process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || "http://localhost:4000";
    const newSocket = io(socketServerUrl);

    setSocket(newSocket);

    newSocket.on("connect", async () => {
      console.log("Connected to socket server");
      newSocket.emit("joinRoom", { roomid, teamid });
      console.log("Successfully joined room");
    });

    newSocket.on("testEvent", (data) => {
      console.log(data.message);
    });

    if (handlers.eventHandlers) {
      console.log("useEffect - handlers:", handlers);
      handlers.eventHandlers.forEach(({ eventName, eventHandler }) => {
        newSocket.on(eventName, eventHandler);
      });
    }

    return () => {
      if (newSocket) {
        newSocket.disconnect();
      }
      setSocket(null);
    };
  }, [handlers, handlers.eventHandlers, roomid, teamid]);

  return socket; // Return the socket
}
