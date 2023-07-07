// components/Timer.tsx
import { useState, useCallback, useEffect } from 'react';
import useSocket from '@/app/hooks/useSocket';

interface TimerProps {
  roomid: string;
  teamid: string;
}

const Timer = ({ roomid, teamid }: TimerProps) => {
  const [timer, setTimer] = useState<string>('');

  const handleSocketTimer = useCallback((msg: any) => {
    setTimer(msg);
  }, []);

  const socket = useSocket(roomid, teamid, {
    onTimer: handleSocketTimer,
  });

  useEffect(() => {
    return () => {
      // Clean up the socket when the component is unmounted
      socket?.disconnect();
    };
  }, [socket]);

  return (
    <h1 className="font-bold text-3xl border w-fit mx-auto px-4 py-2 mb-6 rounded-sm">
      {timer || '00:00'}
    </h1>
  );
};

export default Timer;