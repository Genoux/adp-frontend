import useSocket from '@/app/hooks/useSocket';
import { useCallback, useEffect, useState } from 'react';

const Timer = ({ className }: { className?: string }) => {
  const [timer, setTimer] = useState<string>('');

  const { socket } = useSocket();

  const handleSocketEvents = useCallback((event: string) => {
    setTimer(event);
  }, []);

  useEffect(() => {
    socket!.on('TIMER', handleSocketEvents);

    return () => {
      socket!.off('TIMER', handleSocketEvents);
    };
  }, [handleSocketEvents, socket]);

  return (
    <div className={className}>
      <h1 className='mx-auto w-fit font-bold text-4xl'>
        {timer || '00:00'}
      </h1>
    </div>
  );
};

export default Timer;
