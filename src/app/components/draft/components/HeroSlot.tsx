import ExtendedImage from '@/app/components/common/ExtendedImage';
import defaultTransition from '@/app/lib/animationConfig';
import { Database } from '@/app/types/supabase';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React from 'react';
import { BorderAnimation } from './BorderAnimation';

type Hero = Database['public']['CompositeTypes']['hero'];

interface HeroSlotProps {
  hero: Hero;
  isCurrentSlot: boolean;
  type: 'select' | 'ban';
}

export const HeroSlot: React.FC<HeroSlotProps> = ({
  hero,
  isCurrentSlot,
  type,
}) => {
  const isPick = type === 'select';

  return (
    <motion.div
      className={clsx(
        'relative h-full w-full overflow-hidden bg-black bg-opacity-20',
        {
          'border-white border-opacity-0': hero.id && isPick,
          'border border-zinc-400 border-opacity-5':
            !hero.id || !isPick || !hero.selected,
        }
      )}
    >
      <BorderAnimation type={type} isVisible={isCurrentSlot} />
      {hero.id ? (
        <>
          <p
            className={clsx(
              'absolute z-50 flex h-full w-full justify-center font-semibold tracking-wide',
              isPick
                ? 'items-end pb-6 text-center text-xs'
                : 'items-center text-xs'
            )}
          >
            {hero.name}
          </p>
          {!isPick &&
            (hero.selected ? (
              <div className="absolute left-0 top-0 z-40 h-full w-full bg-zinc-950 opacity-25 mix-blend-multiply"></div>
            ) : (
              <div className="absolute left-0 top-0 z-40 h-full w-full bg-red-500 opacity-30 mix-blend-overlay"></div>
            ))}
          <AnimatePresence mode="wait">
            <motion.div
              key={hero.id}
              className="flex h-full w-full items-center justify-center"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ defaultTransition, duration: 0.2 }}
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

const HeroImage: React.FC<{ hero: Hero; type: 'select' | 'ban' }> = React.memo(
  ({ hero, type }) => (
    <motion.div
      className={clsx('relative h-full w-full overflow-hidden', {
        grayscale: type === 'ban',
        sepia: type === 'select' && !hero.selected,
      })}
      initial={{ scale: 1.25 }}
      animate={{ scale: hero.selected ? 1 : 1.25 }}
      transition={{ defaultTransition, duration: 0.6, ease: [1, -1, 0.5, 1.5] }}
    >
      {hero.id && (
        <ExtendedImage
          alt={hero.id}
          type={type === 'select' ? 'centered' : 'tiles'}
          size="default"
          heroId={hero.id}
          style={{
            objectPosition: 'center',
            objectFit: 'cover',
            width: '100%',
            height: '100%',
          }}
        />
      )}
    </motion.div>
  )
);

HeroImage.displayName = 'HeroImage';

const EmptySelectedSlot: React.FC = React.memo(() => (
  <div className="flex h-full w-full items-center justify-center bg-neutral-950 bg-opacity-50">
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
