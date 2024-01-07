import ChampionsPool from '@/app/components/common/ChampionsPool';
import Timer from '@/app/components/common/RoomTimer';
import { defaultTransition } from '@/app/lib/animationConfig';
import { roomStore } from '@/app/stores/roomStore';
import { motion } from 'framer-motion';
import useTeams from '@/app/hooks/useTeams';

export const WaitingView = () => {
  const { room } = roomStore();

  const { blueTeam, redTeam } = useTeams();

  if (!room) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={defaultTransition}
      className="flex flex-col items-center justify-start h-full gap-4 mt-12"
    >
      <div className='flex flex-col gap-4 items-center'>
        <Timer className='w-full' />
        <div className='text-center'>
          <h1 className="text-3xl font-bold">Phase de planification</h1>
          <p className="text-base text-[#737373]">{'Analyse de la sélection de champions'}</p>
        </div>
      </div>
      <div className='w-full flex justify-between px-6 lg:px-24'>
        <div className=
          {`bg-blue-500 bg-opacity-25 border border-blue rounded-full flex items-center px-2 h-7 justify-between gap-2`}
        >
          <div className={`bg-blue text-sm font-medium h-3 w-3 rounded-full`}></div>
          {blueTeam?.name.toUpperCase()}
        </div>

        <div className=
          {`bg-red-500 bg-opacity-25 border border-red rounded-full flex items-center px-2 h-7 justify-between gap-2`}
        >
          <div className={`bg-red text-sm font-medium h-3 w-3 rounded-full`}></div>
          {redTeam?.name.toUpperCase()}
        </div>
      </div>
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={defaultTransition}
        className='mb-6'
      >
        <ChampionsPool />
      </motion.div>
    </motion.div>
  );
};

export default WaitingView;
