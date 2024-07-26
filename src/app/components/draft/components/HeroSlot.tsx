import React, { useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import ExtendedImage from '@/app/components/common/ExtendedImage';
import defaultTransition from '@/app/lib/animationConfig';
import { Database } from '@/app/types/supabase';
import { BorderAnimation } from './BorderAnimation';
import clsx from 'clsx';

type Hero = Database["public"]["CompositeTypes"]["hero"];

interface HeroSlotProps {
  hero: Hero;
  isCurrentSlot: boolean;
  type: 'select' | 'ban';
}

export const HeroSlot: React.FC<HeroSlotProps> = ({ hero, isCurrentSlot, type }) => {
  const isPick = type === 'select';

  const borderAnimation = useMemo(() => {
    if (isCurrentSlot) {
      return <BorderAnimation type={type} />;
    }
    return null;
  }, [isCurrentSlot, type]);

  return (
    <motion.div
      className={clsx(
        'relative h-full w-full overflow-hidden bg-black bg-opacity-20',
        {
          'border-white border-opacity-0': hero.id && isPick,
          'border border-zinc-400 border-opacity-5': !hero.id || !isPick || !hero.selected,
        }
      )}
    >
      {borderAnimation}
      {hero.id ? (
        <>
          <p className={clsx(
            'absolute z-50 w-full h-full flex justify-center font-semibold tracking-wide',
            isPick ? 'text-center items-end pb-6 text-xs' : 'items-center text-xs'
          )}>
            {hero.name}
          </p>
          {!isPick && (
            hero.selected ? (
              <div className='bg-zinc-950 opacity-25 z-40 absolute top-0 left-0 w-full h-full mix-blend-multiply'></div>
            ) : (
              <div className='bg-red-500 z-40 opacity-30 absolute top-0 left-0 w-full h-full mix-blend-overlay'></div>
            )
          )}
          <AnimatePresence mode='wait'>
            <motion.div
              key={hero.id}
              className='w-full h-full flex justify-center items-center'
              initial={{ y: 5, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 2, opacity: 0 }}
              transition={{ defaultTransition, duration: 0.15 }}
            >
              <HeroImage hero={hero} type={type} />
            </motion.div>
          </AnimatePresence>
        </>
      ) : hero.id === null && hero.selected === true && !isPick ? (
        <EmptySelectedSlot />
      ) : null}
    </motion.div>
  );
};

HeroSlot.displayName = 'HeroSlot';

const HeroImage: React.FC<{ hero: Hero; type: 'select' | 'ban' }> = React.memo(({ hero, type }) => (
  <motion.div
    className={clsx('h-full w-full relative', {
      'grayscale': type === 'ban',
      'sepia': type === 'select' && !hero.selected,
    })}
    initial={{ scale: 1.25 }}
    animate={{ scale: hero.selected ? 1 : 1.25 }}
    transition={{ defaultTransition, duration: 0.6, ease: [1, -1, .5, 1.5] }}
  >
    {hero.id && (
      <ExtendedImage
        alt={hero.id}
        type={type === 'select' ? "centered" : "tiles"}
        fill
        src={hero.id}
        style={{ objectPosition: 'center', objectFit: 'cover' }}
      />
    )}
  </motion.div>
));

HeroImage.displayName = 'HeroImage';

const EmptySelectedSlot: React.FC = React.memo(() => (
  <div className="bg-neutral-950 bg-opacity-50 h-full w-full flex justify-center items-center">
    <svg
      width="32"
      height="33"
      viewBox="0 0 32 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M31.3943 4.03759C32.2019 3.23022 32.2019 1.9212 31.3943 1.11383C30.5871 0.306458 29.278 0.306458 28.4708 1.11383L16 13.5846L3.52932 1.11383C2.72191 0.306458 1.4129 0.306458 0.605528 1.11383C-0.201843 1.9212 -0.201843 3.23022 0.605528 4.03759L13.0762 16.5083L0.605528 28.979C-0.201843 29.7866 -0.201843 31.0954 0.605528 31.9029C1.4129 32.7101 2.72191 32.7101 3.52932 31.9029L16 19.4321L28.4708 31.9029C29.278 32.7101 30.5871 32.7101 31.3943 31.9029C32.2019 31.0954 32.2019 29.7866 31.3943 28.979L18.9238 16.5083L31.3943 4.03759Z"
        fill="#232328"
      />
    </svg>
  </div>
));

EmptySelectedSlot.displayName = 'EmptySelectedSlot';

export default HeroSlot;