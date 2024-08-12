import useTeams from '@/app/hooks/useTeams';
import useRoomStore from '@/app/stores/roomStore';
import { Database } from '@/app/types/supabase';
import { motion } from 'framer-motion';
import React from 'react';
import { HeroSlot } from './components/HeroSlot';
import { useSelectionAnimation } from './useSelectionAnimation';

type Team = Database['public']['Tables']['teams']['Row'];
type Hero = Database['public']['CompositeTypes']['hero'];

const TeamBans: React.FC<{ team: Team }> = ({ team }) => {
  const { room } = useRoomStore();
  const { currentTeam } = useTeams();
  const { isCurrentSlot } = useSelectionAnimation(room, team, 'ban');

  const opacity = currentTeam?.is_turn || currentTeam === undefined ? 1 : 0.8;

  if (!room || !team) return null;

  return (
    <motion.div
      className="relative flex h-full w-full gap-2"
      animate={{ opacity }}
    >
      {(team.heroes_ban as Hero[]).map((hero, index) => {
        return (
          <div key={index} className="relative w-full overflow-hidden">
            <HeroSlot
              key={index}
              hero={hero}
              isCurrentSlot={isCurrentSlot(hero, index)}
              type="ban"
            />
          </div>
        );
      })}
    </motion.div>
  );
};

export default TeamBans;
