import { motion } from 'framer-motion';

const AnimatedDot = ({ className }: { className?: string }) => {
  const dotVariants = {
    initial: {
      opacity: 0,
    },
    animate: (i: number) => ({
      opacity: [0, 1, 0],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        ease: 'easeInOut',
        times: [0, 0.5, 1],
        delay: i * 0.15,
      },
    }),
  };

  return (
    <div className={`inline-block whitespace-nowrap text-base ${className}`}>
      {Array.from({ length: 3 }).map((_, index) => (
        <motion.span
          key={index}
          className="inline-block w-[0.4em] text-center"
          variants={dotVariants}
          initial="initial"
          animate="animate"
          custom={index}
        >
          .
        </motion.span>
      ))}
    </div>
  );
};

export default AnimatedDot;
