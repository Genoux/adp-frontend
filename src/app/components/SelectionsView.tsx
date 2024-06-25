import ChampionsPool from '@/app/components/common/ChampionsPool';
import useTeams from '@/app/hooks/useTeams';
import defaultTransition from '@/app/lib/animationConfig';
import useRoomStore from '@/app/stores/roomStore';
import { motion } from 'framer-motion';
import ExtendedImage from '@/app/components/common/ExtendedImage';
import clsx from 'clsx';

const SelectionsView = () => {
  const { room, isLoading } = useRoomStore((state) => ({
    room: state.room,
    isLoading: state.isLoading,
  }));

  const { currentTeam, turnTeam } = useTeams();

  if (isLoading) return <div>Loading...</div>;
  if (!currentTeam) return <div>Team not found</div>;

  return (
    <>
      {turnTeam?.clicked_hero && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ defaultTransition, duration: 1 }}
          className={clsx('fixed top-0 -z-10 h-full w-3/12', {
          'fade-gradient-left left-0': turnTeam?.color === 'blue',
          'fade-gradient-right right-0': turnTeam?.color === 'red',
        }
        )}>
          <ExtendedImage
            src={turnTeam?.clicked_hero}
            alt={turnTeam?.clicked_hero}
            fill
            style={{ objectPosition: 'center', objectFit: 'cover' }}
            type='centered'
          />
        </motion.div>
      )}
      {room?.status === 'ban' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          exit="exit"
          transition={{ delay: 0.2, duration: 1, ease: 'linear' }}
          className="fixed left-0 top-0 -z-50 h-full w-full bg-red-900 opacity-50"
        />
      )}
      <ChampionsPool className='px-0 xl:px-28' />
    </>
  );
};

export default SelectionsView;
