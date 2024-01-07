import { useState } from 'react';
import { X } from 'lucide-react';
import { Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { defaultTransition } from '@/app/lib/animationConfig';

type NoticeBannerProps = {
  message: string;
};

const NoticeBanner: React.FC<NoticeBannerProps> = ({ message }) => {
  const [isVisible, setIsVisible] = useState(true);

  const variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0},
    exit: { opacity: 0, transition: { duration: 0.2 } }
  };

  if (!isVisible) return null;

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial="initial"
          animate="animate"
          exit="exit"
          variants={variants}
          transition={{delay: 2, ...defaultTransition }}
          className="px-4 py-3 w-fit mx-auto bg-[#0a0a0c] text-white cursor-pointer flex justify-between items-center border border-opacity-25 gap-6 rounded-md"
        >
          <div className='flex gap-2 items-center'>
            <Info size={16} color='#BBBBBB' />
            <p className="text-sm font-normal text-[#b8b8b8]">{message}</p>
          </div>
          <X className='cursor-pointer hover:opacity-70 transition-all' size={14} onClick={() => setIsVisible(false)} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NoticeBanner;
