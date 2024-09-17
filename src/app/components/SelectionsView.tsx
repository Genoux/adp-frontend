'use client';

import ChampionsPool from '@/app/components/common/ChampionsPool';
import ExtendedImage from '@/app/components/common/ExtendedImage';
import useCurrentHero from '@/app/hooks/useCurrentHero';
import useTeams from '@/app/hooks/useTeams';
import defaultTransition from '@/app/lib/animationConfig';
import useRoomStore from '@/app/stores/roomStore';
import useTeamStore from '@/app/stores/teamStore';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';

const SelectionsView = () => {
  const { room, isLoading } = useRoomStore((state) => ({
    room: state.room,
    isLoading: state.isLoading,
  }));
  const { turnTeam } = useTeams();
  const currentHero = useCurrentHero();
  const { isSpectator } = useTeamStore();

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      <AnimatePresence mode="wait">
        {currentHero && (turnTeam || isSpectator) && (
          <motion.div
            key={currentHero.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ ...defaultTransition, duration: 0.2 }}
            exit={{ opacity: 0, transition: defaultTransition }}
            className={clsx('fixed top-0 -z-10 h-full w-3/12', {
              'fade-gradient-left left-0':
                isSpectator || turnTeam?.color === 'blue',
              'fade-gradient-right right-0':
                !isSpectator && turnTeam?.color === 'red',
            })}
          >
            {currentHero.id && (
              <ExtendedImage
                heroId={currentHero.id}
                type="centered"
                size="large"
                alt={currentHero.id}
              />
            )}
          </motion.div>
        )}
      </AnimatePresence>
      {room!.status === 'ban' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ defaultTransition, delay: 0.2 }}
          className="fixed left-0 top-0 -z-50 h-full w-full bg-red-900 bg-opacity-10"
        />
      )}
      <ChampionsPool className="px-0 xl:px-24" />
    </>
  );
};

export default SelectionsView;
