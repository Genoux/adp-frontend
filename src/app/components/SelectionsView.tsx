'use client';

import ChampionsPool from '@/app/components/common/ChampionsPool';
import useTeams from '@/app/hooks/useTeams';
import useRoomStore from '@/app/stores/roomStore';
import { AnimatePresence, motion } from 'framer-motion';
import ExtendedImage from '@/app/components/common/ExtendedImage';
import clsx from 'clsx';
import useCurrentHero from '@/app/hooks/useCurrentHero';
import defaultTransition from '@/app/lib/animationConfig';
import { useState } from 'react';
import useTeamStore from '@/app/stores/teamStore';

const SelectionsView = () => {
  const { room, isLoading } = useRoomStore((state) => ({
    room: state.room,
    isLoading: state.isLoading,
  }));
  const { turnTeam } = useTeams();
  const currentHero = useCurrentHero();
  const [isLoaded, setIsLoaded] = useState(false);
  const { isSpectator } = useTeamStore();

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      {currentHero && (turnTeam || isSpectator) && (
        <AnimatePresence mode='wait'>
          <motion.div
            key={isLoaded ? currentHero.id : undefined}
            initial={{ y: 5, opacity: 0 }}
            animate={{ y: isLoaded ? 0 : 5, opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.2, defaultTransition }}
            exit={{ y: 2, opacity: 0 }}
            className={clsx('fixed top-0 -z-10 h-full w-3/12', {
              'fade-gradient-left left-0': isSpectator || turnTeam?.color === 'blue',
              'fade-gradient-right right-0': !isSpectator && turnTeam?.color === 'red',
            })}
          >
            <ExtendedImage
              src={currentHero.id || ''}
              alt={currentHero.id || ''}
              style={{ objectPosition: 'center', objectFit: 'cover' }}
              fill
              onLoad={() => {
                setIsLoaded(true);
              }}
              placeholder='empty'
              type='centered'
            />
          </motion.div>
        </AnimatePresence>
      )}
      {room!.status === 'ban' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ defaultTransition, delay: 0.2 }}
          className="fixed left-0 top-0 -z-50 h-full w-full bg-red-900 bg-opacity-10"
        />
      )}
      <ChampionsPool className='px-0 xl:px-24' />
    </>
  );
};

export default SelectionsView;