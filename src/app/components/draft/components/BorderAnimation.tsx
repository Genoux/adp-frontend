import defaultTransition from '@/app/lib/animationConfig';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';

interface BorderAnimationProps {
  type: 'ban' | 'select';
}

const className = {
  ban: 'border-red from-red to-transparent glow-red',
  select: 'border-yellow from-yellow to-transparent glow-yellow',
};

export const BorderAnimation: React.FC<BorderAnimationProps> = ({ type }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ defaultTransition, delay: 0.5 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className={clsx(
            'absolute inset-0 z-40 border border-opacity-20 bg-opacity-10 bg-gradient-to-t',
            className[type]
          )}
          animate={{ opacity: [0.4, 0.8] }}
          initial={{ opacity: 0 }}
          exit={{ opacity: 0 }}
          transition={{
            duration: 1,
            repeat: Infinity,
            repeatType: 'reverse',
            defaultTransition,
          }}
        />
      </motion.div>
    </AnimatePresence>
  );
};
