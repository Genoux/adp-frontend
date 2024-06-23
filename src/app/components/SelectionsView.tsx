import ChampionsPool from '@/app/components/common/ChampionsPool';
import useTeams from '@/app/hooks/useTeams';
import defaultTransition from '@/app/lib/animationConfig';
import useRoomStore from '@/app/stores/roomStore';
import { motion } from 'framer-motion';
import ExtendedImage from '@/app/components/common/ExtendedImage';
import clsx from 'clsx';

type SelectionViewProps = {
  className?: string;
};

const SelectionsView = ({ className }: SelectionViewProps) => {
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
        <div className={clsx('fixed top-0 -z-10 h-full w-3/12', {
          'fade-gradient-left left-0': turnTeam?.color === 'blue',
          'fade-gradient-right right-0': turnTeam?.color === 'red',
        }
        )}>
          <ExtendedImage
            src={turnTeam?.clicked_hero || ''}
            alt={turnTeam?.clicked_hero || ''}
            fill
            style={{ objectPosition: 'center', objectFit: 'cover' }}
            type='centered'
          />
        </div>
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
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ defaultTransition, duration: 0.2 }}
        className={clsx('flex h-full w-full flex-col items-center justify-center', className)}
      >

        <ChampionsPool className='px-0 xl:px-28' />
      </motion.div>
    </>
  );
};

// const ImageComponent: React.FC<{ image: string; position: 'left' | 'right' }> = ({ image, position }) => (
//   <AnimatePresence mode='wait'>
//     <motion.div
//       className={`fixed top-0 -z-10 h-full w-3/12 ${position === 'left' ? 'left-0' : 'right-0'}`}
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       transition={{ defaultTransition, delay: 0, duration: 0.3 }}
//     >
//       {image && (
//         <ExtendedImage
//           src={image}
//           type='centered'
//           fill
//           className={`h-full w-full object-cover object-center opacity-50 ${position === 'left' ? 'fade-gradient-left' : 'fade-gradient-right'}`}
//           alt={image}
//         />
//       )}
//     </motion.div>
//   </AnimatePresence>
// );

SelectionsView.displayName = 'SelectionsView';

export default SelectionsView;
