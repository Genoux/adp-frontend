import { defaultTransition } from '@/app/lib/animationConfig';
import { AnimatePresence, motion } from 'framer-motion';
import { Info, X } from 'lucide-react';
import { useState } from 'react';

type NoticeBannerProps = {
  message: string;
};

const NoticeBanner: React.FC<NoticeBannerProps> = ({ message }) => {
  const [isVisible, setIsVisible] = useState(true);

  const variants = {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, transition: { duration: 0.2 } },
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
          transition={{ delay: 2, ...defaultTransition }}
          className="mx-auto flex w-fit cursor-pointer items-center justify-between gap-6 rounded-md border border-opacity-25 bg-[#0a0a0c] px-4 py-3 text-white"
        >
          <div className="flex items-center gap-2">
            <Info size={16} color="#BBBBBB" />
            <p className="text-sm font-normal text-[#b8b8b8]">{message}</p>
          </div>
          <X
            className="cursor-pointer transition-all hover:opacity-70"
            size={14}
            onClick={() => setIsVisible(false)}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default NoticeBanner;
