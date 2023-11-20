import { motion } from 'framer-motion';
import React from 'react';

interface ArrowAnimationProps {
  roomStatus: 'ban' | 'select' | string | null | undefined;
  teamIsTurn?: boolean | null | undefined;
  orientation?: 'left' | 'right';
}

const ArrowAnimation: React.FC<ArrowAnimationProps> = ({
  roomStatus,
  teamIsTurn = false,
  orientation = 'right',
}) => {
  const arrows = [0, 1, 2];

  if (!teamIsTurn) {
    return null;
  }

  const text = roomStatus === 'ban' ? 'Banning' : 'Picking';
  const color = roomStatus === 'ban' ? '#E62222' : '#DCFC35';
  const textColor = roomStatus === 'ban' ? 'text-red' : 'text-yellow';

  const arrowTransform = orientation === 'left' ? 'scaleX(-1)' : 'scaleX(1)';
  const flexDirection =
    orientation === 'left' ? 'flex-row-reverse' : 'flex-row';

  return (
    <div
      className={`flex items-center justify-center gap-2 rounded border-opacity-20 px-3 py-1 transition-all delay-1000 ${flexDirection}`}
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
                stroke-width="1.5"
              />
            </svg>
          </motion.div>
        ))}
      </div>
      <p
        className={`text-md animate-pulse font-medium uppercase duration-1000 ${textColor}`}
      >
        {text}
      </p>
    </div>
  );
};

export default ArrowAnimation;
