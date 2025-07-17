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
  roomid?: number,
  handlers: SocketHandlers = {}
) {
  const [, forceUpdate] = useState({});

  useEffect(() => {
    if (!socket && roomid) {
      const socketServerUrl =
        process.env.NEXT_PUBLIC_SOCKET_SERVER_URL || 'http://localhost:4000';
      socket = io(socketServerUrl);

      const tryConnect = () => {
        if (!socket?.connected) {
          console.log('Attempting to reconnect...');
          socket?.connect();
        } else if (retryInterval) {
          clearInterval(retryInterval);
          retryInterval = null;
        }
      };

      socket.on('connect', async () => {
        if (retryInterval) {
          clearInterval(retryInterval);
          retryInterval = null;
        }
        socket?.emit('joinRoom', { roomid });
        console.log('Successfully joined room ' + roomid);
        forceUpdate({}); // Force a re-render to update the UI
      });

      socket.on('disconnect', () => {
        console.log('Disconnected from server');
        forceUpdate({}); // Force a re-render to update the UI
      });

      socket.on('connect_error', () => {
        if (!retryInterval) {
          retryInterval = setInterval(tryConnect, 2000);
        }
      });

      // Handle server messages
      socket.on('message', (message: string) => {
        console.log('Server message:', message);
      });

      // Handle server errors
      socket.on('error', (error: string) => {
        console.error('Server error:', error);
      });
    }

    if (socket && handlers.eventHandlers) {
      handlers.eventHandlers.forEach(({ eventName, eventHandler }) => {
        if (!socket) return;
        console.log('Adding event handler for ' + eventName);
        socket.on(eventName, eventHandler);
      });
    }

    return () => {
      // Clean up custom event handlers
      handlers.eventHandlers?.forEach(({ eventName, eventHandler }) => {
        socket?.off(eventName, eventHandler);
      });

      // Clean up built-in event handlers
      socket?.off('message');
      socket?.off('error');
    };
  }, [roomid, handlers.eventHandlers]);

  return {
    socket,
    isConnected: socket?.connected || false,
  };
}
