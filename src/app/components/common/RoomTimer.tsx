import useSocket from '@/app/hooks/useSocket';
import { useCallback, useEffect, useState } from 'react';

interface TimerProps {
  className?: string;
  size?: 'small' | 'medium' | 'large';
}
const Timer: React.FC<TimerProps> = ({ className, size = 'medium' }) => {
  const [timer, setTimer] = useState<string>('');

  const { socket } = useSocket();

  const handleSocketEvents = useCallback((event: string) => {
    setTimer(event);
  }, []);

  const fontSize = {
    small: 'text-xl', // example size, adjust as needed
    medium: 'text-3xl',
    large: 'text-5xl', // example size, adjust as needed
  };

  useEffect(() => {
    socket?.on('TIMER', handleSocketEvents);

    return () => {
      socket?.off('TIMER', handleSocketEvents);
    };
  }, [handleSocketEvents, socket]);

  return (
    <div className={className}>
      <h1 className={`${fontSize[size]} mx-auto w-fit font-bold`}>
        {timer || '00:00'}
      </h1>
    </div>
  );
};

export default Timer;
