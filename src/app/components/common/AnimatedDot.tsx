import { motion } from 'framer-motion';

const AnimatedDot = () => {
  // Define the animation variants for each dot
  const dotVariants = {
    initial: {
      opacity: 0
    },
    animate: (i: number) => ({
      opacity: [0, 1, 0],
      transition: {
        duration: 1.5,      // Duration for the full fade in and out cycle
        repeat: Infinity,   // Repeat the animation indefinitely
        ease: "easeInOut",
        times: [0, 0.5, 1], // Define when the keyframes hit during the duration
        delay: i * 0.15     // Stagger the start of each animation
      }
    })
  };

  return (
    <div style={{ display: 'inline-block', fontSize: '16px', whiteSpace: 'nowrap' }}>
      {Array.from({ length: 3 }).map((_, index) => (
        <motion.span
          key={index}
          style={{ display: 'inline-block', width: '0.4em', textAlign: 'center' }}
          variants={dotVariants}
          initial="initial"
          animate="animate"
          custom={index}  // Pass the index as a custom prop to control delay
        >
          .
        </motion.span>
      ))}
    </div>
  );
};

export default AnimatedDot;
