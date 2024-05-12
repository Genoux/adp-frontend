import ChampionsPool from '@/app/components/common/ChampionsPool';
import Timer from '@/app/components/common/RoomTimer';
import TeamName from '@/app/components/common/TeamName';
import useTeams from '@/app/hooks/useTeams';
import { defaultTransition } from '@/app/lib/animationConfig';
import { roomStore } from '@/app/stores/roomStore';
import { motion } from 'framer-motion';

export const PlanningView = () => {
  const { room } = roomStore();

  const { blueTeam, redTeam } = useTeams();

  if (!room) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ defaultTransition, delay: 0.25, duration: 1.25 }}
      className="flex flex-col items-center justify-center gap-4 max-w-7xl mx-auto"
    >
      <div className="flex flex-col items-center gap-4">
        <Timer className="w-full" size="large" />
        <div className="text-center">
          <h1 className="text-3xl font-bold">Phase de planification</h1>
          <p className="text-base text-[#737373]">
            {'Analyse de la sélection de champions'}
          </p>
        </div>
      </div>
      <div className="flex w-full justify-between">
        <TeamName name={blueTeam?.name || ''} color={blueTeam?.color || ''} />
        <TeamName name={redTeam?.name || ''} color={redTeam?.color || ''} />
      </div>
      <ChampionsPool />
    </motion.div>
  );
};

export default PlanningView;
