import { AnimatePresence, motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import { roomStore } from '@/app/stores/roomStore';
interface ArrowAnimationProps {
  teamIsTurn?: boolean | null | undefined;
  orientation?: 'left' | 'right';
}

const ArrowAnimation: React.FC<ArrowAnimationProps> = ({
  teamIsTurn = false,
  orientation = 'right',
}) => {
  const { room } = roomStore();

  const [visibleRoomStatus, setVisibleRoomStatus] = useState(room?.status);
  const arrows = [0, 1, 2];

  useEffect(() => {
    const time = room?.status === 'ban' ? 0 : 1000;
    // First hide the current state
    setVisibleRoomStatus('');

    // Then after a delay, show the new state
    const timer = setTimeout(() => {
      setVisibleRoomStatus(room?.status);
    }, time); // delay of 1000ms

    return () => clearTimeout(timer);
  }, [room?.status]);

  if (!teamIsTurn || visibleRoomStatus === null) {
    return null;
  }

  const text = visibleRoomStatus === 'ban' ? 'Banning' : 'Picking';
  const color = visibleRoomStatus === 'ban' ? '#E62222' : '#DCFC35';
  const textColor = visibleRoomStatus === 'ban' ? 'text-red' : 'text-yellow';

  const arrowTransform = orientation === 'left' ? 'scaleX(-1)' : 'scaleX(1)';
  const flexDirection =
    orientation === 'left' ? 'flex-row-reverse' : 'flex-row';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, x: orientation === 'left' ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0 }}
      >
        <div
          className={`flex items-center justify-center gap-2 rounded border-opacity-20 px-3 py-1 delay-1000 ${flexDirection}`}
        >
          <div className="flex space-x-0.5">
            {arrows.map((i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0 }}
                animate={{ opacity: [0, 1, 0.7, 0.3, 0] }}
                transition={{
                  delay: i * 0.1,
                  duration: 1.2,
                  ease: 'easeInOut',
                  repeat: Infinity,
                }}
                className="text-white"
              >
                <svg
                  width="7"
                  height="10"
                  viewBox="0 0 7 10"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  style={{ transform: arrowTransform }}
                >
                  <path
                    d="M6 1L1.19522 4.84383C1.09514 4.92389 1.09514 5.07611 1.19522 5.15617L6 9"
                    stroke={color}
                    strokeWidth="1.5"
                  />
                </svg>
              </motion.div>
            ))}
          </div>
          <AnimatePresence>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: [0.3, 1, 0.3] }}
              transition={{
                duration: 1.2,
                ease: 'easeInOut',
                repeat: Infinity,
                repeatType: 'reverse',
              }}
              className={`text-md font-medium uppercase ${textColor}`}
            >
              {text}
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ArrowAnimation;
