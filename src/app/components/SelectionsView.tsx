import ChampionsPool from '@/app/components/common/ChampionsPool';
import useTeams from '@/app/hooks/useTeams';
import useRoomStore from '@/app/stores/roomStore';
import { motion } from 'framer-motion';
import ExtendedImage from '@/app/components/common/ExtendedImage';
import clsx from 'clsx';
import useCurrentHero from '@/app/hooks/useCurrentHero';
import defaultTransition from '@/app/lib/animationConfig';

const SelectionsView = () => {
  const { room, isLoading } = useRoomStore((state) => ({
    room: state.room,
    isLoading: state.isLoading,
  }));
  const { turnTeam } = useTeams();
  const currentHero = useCurrentHero();

  if (isLoading) return <div>Loading...</div>;

  return (
    <>
      {currentHero && turnTeam && (
        <motion.div
        key={currentHero.id}
        layout
            initial={{ x: turnTeam.color === 'blue' ? -5 : 5, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.2, defaultTransition }}
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
              type='centered'
            />
          </motion.div>
      )}
      {room!.status === 'ban' && (
        <div className="fixed left-0 top-0 -z-50 h-full w-full bg-red-900 bg-opacity-10" />
      )}
      <ChampionsPool className='px-0 xl:px-24' />
    </>
  );
};

export default SelectionsView;