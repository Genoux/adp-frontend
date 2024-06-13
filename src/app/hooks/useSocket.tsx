import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface EventHandlers {
  eventName: string;
  eventHandler: (data: any) => void;
}

interface SocketHandlers {
  eventHandlers?: EventHandlers[];
}

let socket: Socket | null = null;
let retryInterval: NodeJS.Timeout | null = null;

export default function useSocket(
  roomid?: string,
  teamid?: string,
  handlers: SocketHandlers = {}
) {
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    if (!socket && roomid) {
      const socketServerUrl =
        process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:1313';
      socket = io(socketServerUrl);

      const tryConnect = () => {
        if (!socket?.connected) {
          console.log('Attempting to reconnect...');
          socket?.connect();
        } else {
          if (retryInterval) {
            clearInterval(retryInterval);
            retryInterval = null;
          }
        }
      };

      socket.on('connect', async () => {
        if (retryInterval) {
          clearInterval(retryInterval);
          retryInterval = null;
        }
        setIsConnected(true);

        socket?.emit('joinRoom', { roomid, teamid });
        console.log('Successfully joined room ' + roomid);
      });

      socket.on('disconnect', () => {
        setIsConnected(false); // Update connection status on disconnect
      });

      socket.on('connect_error', () => {
        console.error('Connection failed. Retrying in a few seconds...');
        if (!retryInterval) {
          retryInterval = setInterval(tryConnect, 2000);
        }
      });

      if (handlers.eventHandlers) {
        handlers.eventHandlers.forEach(({ eventName, eventHandler }) => {
          socket?.on(eventName, eventHandler);
        });
      }
    } else {
      setIsConnected(socket?.connected || false);
    }

    return () => {
      if (retryInterval) {
        clearInterval(retryInterval);
        retryInterval = null;
      }
      if (socket && roomid) {
        socket.disconnect();
        socket = null;
      }
    };
  }, [handlers.eventHandlers, roomid, teamid]);

  return { socket, isConnected }; // Return the socket
}
