import useSocket from '@/app/hooks/useSocket';
import defaultTransition from '@/app/lib/animationConfig';
import useRoomStore from '@/app/stores/roomStore';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useCallback, useEffect, useState } from 'react';

const Timer = ({ className }: { className?: string }) => {
  const [timer, setTimer] = useState<string>('');
  const [initialTimer, setInitialTimer] = useState<string>('');
  const { room } = useRoomStore();
  const { socket } = useSocket();

  const handleSocketEvents = useCallback(
    (event: string) => {
      setTimer(event);
      if (initialTimer === '') {
        setInitialTimer(event);
      }
    },
    [initialTimer]
  );

  useEffect(() => {
    if (socket) {
      socket.on('TIMER', handleSocketEvents);
      return () => {
        socket.off('TIMER', handleSocketEvents);
      };
    }
  }, [handleSocketEvents, socket]);

  return (
    <>
      <AnimatePresence mode="wait">
        <motion.div
          key={initialTimer}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={defaultTransition}
          exit={{ opacity: 0 }}
          className={className}
        >
          <div>
            <p className={clsx('mx-auto w-fit text-4xl font-bold', className)}>
              {timer || '\u00A0'}
            </p>
          </div>
        </motion.div>
      </AnimatePresence>
    </>
  );
};

export default Timer;
