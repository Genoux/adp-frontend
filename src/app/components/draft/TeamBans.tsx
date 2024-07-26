import React from 'react';
import { motion } from 'framer-motion';
import useRoomStore from '@/app/stores/roomStore';
import useTeams from '@/app/hooks/useTeams';
import { Database } from '@/app/types/supabase';
import { HeroSlot } from './components/HeroSlot';
import { useSelectionAnimation } from './useSelectionAnimation';

type Team = Database["public"]["Tables"]["teams"]["Row"];
type Hero = Database["public"]["CompositeTypes"]["hero"];

const TeamBans: React.FC<{ team: Team }> = ({ team }) => {
  const { room } = useRoomStore();
  const { currentTeam } = useTeams();
  const { isCurrentSlot } = useSelectionAnimation(room, team, 'ban');

  const opacity = currentTeam?.is_turn || currentTeam === undefined ? 1 : 0.8;

  if (!room || !team) return null;

  return (
    <motion.div className="flex h-full w-full gap-2 relative" animate={{ opacity }}>
      {(team.heroes_ban as Hero[]).map((hero, index) => {
        return (
          <div key={index} className='relative overflow-hidden w-full'>
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