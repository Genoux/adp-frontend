import ChampionsPool from '@/app/components/common/ChampionsPool';
import useTeams from '@/app/hooks/useTeams';
import useRoomStore from '@/app/stores/roomStore';
import { motion } from 'framer-motion';
import ExtendedImage from '@/app/components/common/ExtendedImage';
import clsx from 'clsx';
import useCurrentHero from '@/app/hooks/useCurrentHero';
import defaultTransition from '@/app/lib/animationConfig';
import { useState } from 'react';

const SelectionsView = () => {
  const { room, isLoading } = useRoomStore((state) => ({
    room: state.room,
    isLoading: state.isLoading,
  }));
  const { turnTeam } = useTeams();
  const currentHero = useCurrentHero();
  const [isLoaded, setIsLoaded] = useState(false);

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      {currentHero && turnTeam && (
          <motion.div
            key={isLoaded ? currentHero.id : undefined}
            initial={{ x: turnTeam.color === 'blue' ? -5 : 5, opacity: 0 }}
            animate={{ x: isLoaded ? 0 : turnTeam.color === 'blue' ? -5 : 5, opacity: isLoaded ? 1 : 0 }}
            transition={{ duration: 0.2, defaultTransition }}
            exit={{ x: turnTeam.color === 'blue' ? -5 : 5, opacity: 0 }}
            className={clsx('absolute top-0 -z-10 h-full w-3/12', {
              'fade-gradient-left left-0': turnTeam.color === 'blue',
              'fade-gradient-right right-0': turnTeam.color === 'red',
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
      )}
      {room!.status === 'ban' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ defaultTransition, delay: 0.1 }}
          className="fixed left-0 top-0 -z-50 h-full w-full bg-red-900 bg-opacity-10" />
      )}
      <ChampionsPool className='px-0 xl:px-24' />
    </>
  );
};

export default SelectionsView;