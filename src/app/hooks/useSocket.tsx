import { useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';

interface EventHandlers {
  eventName: string;
  eventHandler: (data: any) => void;
}

interface SocketHandlers {
  eventHandlers?: EventHandlers[];
}

export default function useSocket(
  roomid: string,
  teamid?: string,
  handlers: SocketHandlers = {}
) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);

  useEffect(() => {
    const socketServerUrl =
      process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:1313';
    const newSocket = io(socketServerUrl);

    let retryInterval: NodeJS.Timeout | null = null;

    const tryConnect = () => {
      if (!newSocket.connected) {
        console.log('Attempting to reconnect...');
        newSocket.connect();
      } else {
        if (retryInterval) {
          clearInterval(retryInterval);
          retryInterval = null;
        }
      }
    };

    newSocket.on('connect', async () => {
      if (retryInterval) {
        clearInterval(retryInterval);
        retryInterval = null;
      }
      setSocket(newSocket);
      setIsConnected(true);
      
      newSocket.emit('joinRoom', { roomid, teamid });
      console.log('Successfully joined room ' + roomid);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false); // Update connection status on disconnect
    });

    newSocket.on('connect_error', () => {
      console.error('Connection failed. Retrying in a few seconds...');
      if (!retryInterval) {
        retryInterval = setInterval(tryConnect, 2000);
      }
    });

    if (handlers.eventHandlers) {
      handlers.eventHandlers.forEach(({ eventName, eventHandler }) => {
        newSocket.on(eventName, eventHandler);
      });
    }

    return () => {
      if (retryInterval) {
        clearInterval(retryInterval);
        retryInterval = null;
      }
      if (newSocket) {
        newSocket.disconnect();
      }
      setSocket(null);
    };
  }, [handlers.eventHandlers, roomid, teamid]);

  return { socket, isConnected }; // Return the socket
}
