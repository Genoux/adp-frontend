import AnimatedDot from '@/app/components/common/AnimatedDot'; // Make sure this path is correct
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { CheckIcon } from 'lucide-react';
import React from 'react';

// Assuming defaultTransition is defined somewhere in your project
const defaultTransition = { type: 'spring', stiffness: 500, damping: 30 };

export interface TeamStatusProps {
  isReady: boolean;
  className?: string;
}

const TeamStatus: React.FC<TeamStatusProps> = ({ isReady, className }) => {
  return (
    <>
      {isReady ? (
        <motion.div
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={defaultTransition}
          className={clsx(
            'flex items-center gap-1 border border-green-500 bg-green-500 bg-opacity-10 px-2 py-1',
            className
          )}
        >
          <CheckIcon className="h-3 w-3 text-green-500" />
          <p className="pr-0.5 text-xs font-medium">prêt</p>
        </motion.div>
      ) : (
        <div className={clsx('flex items-center px-4', className)}>
          <AnimatedDot className="-mt-2" />
        </div>
      )}
    </>
  );
};

export default TeamStatus;
