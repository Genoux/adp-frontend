import ChampionsPool from '@/app/components/common/ChampionsPool';
import Timer from '@/app/components/common/RoomTimer';
import useTeams from '@/app/hooks/useTeams';
import { defaultTransition } from '@/app/lib/animationConfig';
import { roomStore } from '@/app/stores/roomStore';
import { motion } from 'framer-motion';

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
      className="mt-12 flex h-full flex-col items-center justify-start gap-4"
    >
      <div className="flex flex-col items-center gap-4">
        <Timer className="w-full" />
        <div className="text-center">
          <h1 className="text-3xl font-bold">Phase de planification</h1>
          <p className="text-base text-[#737373]">
            {'Analyse de la sélection de champions'}
          </p>
        </div>
      </div>
      <div className="flex w-full justify-between px-6 lg:px-24">
        <div
          className={`flex h-7 items-center justify-between gap-2 rounded-full border border-blue bg-blue-500 bg-opacity-25 px-2`}
        >
          <div
            className={`h-3 w-3 rounded-full bg-blue text-sm font-medium`}
          ></div>
          {blueTeam?.name.toUpperCase()}
        </div>

        <div
          className={`flex h-7 items-center justify-between gap-2 rounded-full border border-red bg-red-500 bg-opacity-25 px-2`}
        >
          <div
            className={`h-3 w-3 rounded-full bg-red text-sm font-medium`}
          ></div>
          {redTeam?.name.toUpperCase()}
        </div>
      </div>
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={defaultTransition}
        className="mb-6"
      >
        <ChampionsPool />
      </motion.div>
    </motion.div>
  );
};

export default WaitingView;
