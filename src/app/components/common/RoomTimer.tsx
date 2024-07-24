import useSocket from '@/app/hooks/useSocket';
import { useCallback, useEffect, useState } from 'react';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import defaultTransition from '@/app/lib/animationConfig';

const Timer = ({ className }: { className?: string }) => {
  const [timer, setTimer] = useState<string>('');
  const [initialTimer, setInitialTimer] = useState<string>('');
  
  const { socket } = useSocket();

  const handleSocketEvents = useCallback((event: string) => {
    setTimer(event);
    if (initialTimer === '') {
    setInitialTimer(event);
      
    }
  }, [initialTimer]);

  useEffect(() => {
    socket!.on('TIMER', handleSocketEvents);

    return () => {
      socket!.off('TIMER', handleSocketEvents);
    };
  }, [handleSocketEvents, socket]);

  return (
    <motion.div
      key={initialTimer}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={defaultTransition}
      className={className}>
      <h1 className={clsx('mx-auto w-fit font-bold text-4xl', className)}>
        {timer ? timer : <p className='invisible'>00:00</p>}
      </h1>
    </motion.div>
  );
};

export default Timer;
