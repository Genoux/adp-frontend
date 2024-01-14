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
  handlers: SocketHandlers = {}
) {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [connectionError, setConnectionError] = useState<boolean>(false);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  const MAX_RETRIES = 2; // Maximum retries
  const RETRY_INTERVAL = 2000; // Retry every 5 seconds

  useEffect(() => {
    const socketServerUrl =
      process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:1313';
    const newSocket = io(socketServerUrl);

    let retryCount = 0;
    let retryInterval: any;

    const tryConnect = () => {
      if (retryCount >= MAX_RETRIES) {
        console.error('Max retries reached. Giving up on connecting.');
        setConnectionError(true); // Set the error state here
        clearInterval(retryInterval);
        return;
      }

      if (!newSocket.connected) {
        console.log('Attempting to reconnect...');
        newSocket.connect();
        retryCount++;
      } else {
        clearInterval(retryInterval);
      }
    };

    newSocket.on('connect', async () => {
      clearInterval(retryInterval); // Clear retry interval upon successful connection
      setSocket(newSocket);
      setIsConnected(true);
      newSocket.emit('joinRoom', { roomid });
      console.log('Successfully joined room ' + roomid);
    });

    newSocket.on('disconnect', () => {
      setIsConnected(false); // Update connection status on disconnect
    });

    newSocket.on('connect_error', () => {
      console.error('Connection failed. Retrying in a few seconds...');
      retryInterval = setInterval(tryConnect, RETRY_INTERVAL);
    });

    if (handlers.eventHandlers) {
      handlers.eventHandlers.forEach(({ eventName, eventHandler }) => {
        newSocket.on(eventName, eventHandler);
      });
    }

    return () => {
      clearInterval(retryInterval); // Clear retry interval upon cleanup
      if (newSocket) {
        newSocket.disconnect();
      }
      setSocket(null);
    };
  }, [handlers.eventHandlers, roomid]);

  return { socket, connectionError, isConnected }; // Return the socket
}
