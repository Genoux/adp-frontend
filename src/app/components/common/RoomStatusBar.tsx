import ArrowAnimation from '@/app/components/common/ArrowAnimation';
import Timer from '@/app/components/common/RoomTimer';
import TeamName from '@/app/components/common/TeamName/TeamName';
import useTeams from '@/app/hooks/useTeams';
import defaultTransition from '@/app/lib/animationConfig';
import useRoomStore from '@/app/stores/roomStore';
import { Database } from '@/app/types/supabase';
import { motion } from 'framer-motion';
import React from 'react';

type Team = Database['public']['Tables']['teams']['Row'];

interface TeamIndicatorProps {
  team: Team;
  orientation: 'left' | 'right';
}

const TeamIndicator: React.FC<TeamIndicatorProps> = ({ team, orientation }) => {
  const { room } = useRoomStore();

  return (
    <div
      className={`flex items-center gap-2 ${
        orientation === 'right' ? 'justify-start' : 'justify-end'
      }`}
    >
      <div
        className={`flex items-center ${
          orientation === 'right' ? 'flex-row-reverse' : 'flex-row'
        }`}
      >
        <motion.div
          className={`flex items-center justify-center ${
            orientation === 'right' ? 'mr-2' : 'ml-1'
          }`}
          key={team.is_turn ? team.id : undefined}
          initial={{ opacity: 0, x: orientation === 'right' ? 10 : -10 }}
          animate={{ opacity: room!.cycle < 17 ? 1 : 0, x: 0 }}
          transition={{ delay: 0.2, defaultTransition }}
        >
          <ArrowAnimation
            teamis_turn={team.is_turn}
            orientation={orientation}
          />
        </motion.div>
        <div
          className={`${!team.is_turn && room!.cycle < 17 ? 'opacity-60' : null}`}
        >
          <TeamName name={team.name} color={team.color} />
        </div>
      </div>
    </div>
  );
};

const RoomStatusBar = ({ className }: { className?: string }) => {
  const { redTeam, blueTeam } = useTeams();

  return (
    <div
      className={`z-20 box-border w-full border-b border-neutral-400 border-opacity-20 bg-black/40 py-4 backdrop-blur-md ${className}`}
    >
      <div className="mx-auto grid max-w-7xl grid-cols-3 px-4">
        <TeamIndicator team={blueTeam as Team} orientation="right" />
        <Timer />
        <TeamIndicator team={redTeam as Team} orientation="left" />
      </div>
    </div>
  );
};

export default RoomStatusBar;
