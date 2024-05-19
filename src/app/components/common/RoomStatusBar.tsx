import ArrowAnimation from '@/app/components/common/ArrowAnimation';
import Timer from '@/app/components/common/RoomTimer';
import TeamName from '@/app/components/common/TeamName';
import useTeams from '@/app/hooks/useTeams';
import { defaultTransition } from '@/app/lib/animationConfig';
import { roomStore } from '@/app/stores/roomStore';
import { motion } from 'framer-motion';
import React from 'react';

interface Team {
  [key: string]: any;
}

interface TeamIndicatorProps {
  team: Team;
  orientation: 'left' | 'right';
}

const getStatusText = (color: string, room: { status: string }) => {
  const isBanPhase = room?.status === 'ban';
  const teamName = color.charAt(0).toUpperCase() + color.slice(1);
  const toFrench = teamName === 'Blue' ? 'Bleue' : 'Rouge';
  if (color) {
    return isBanPhase
      ? `C'est à vous de bannir, vous êtes l'équipe ${toFrench}`
      : `C'est à vous de choisir, vous êtes l'équipe ${toFrench}`;
  }
  return '';
};

// Component for the team indicator with arrow and name
const TeamIndicator: React.FC<TeamIndicatorProps> = ({ team, orientation }) => {
  return (
    <div
      className={`flex items-center gap-2 ${
        orientation === 'right' ? 'justify-start' : 'justify-end'
      }`}
    >
      <div
        className={`flex items-center ${
          orientation === 'right' ? 'flex-row-reverse ' : 'flex-row'
        }`}
      >
        <motion.div
          className={`flex items-center justify-center ${
            orientation === 'right' ? 'mr-2' : 'ml-1'
          }`}
          initial={{ opacity: 0, x: orientation === 'right' ? 50 : -50 }} // start from left or right based on orientation
          animate={{ opacity: 1, x: 0 }} // animate to the original position
          transition={{ delay: 0.4, defaultTransition }}
        >
          <ArrowAnimation teamIsTurn={team?.isturn} orientation={orientation} />
        </motion.div>
        <div className={`${!team.isturn ? 'opacity-60' : null}`}>
          <TeamName name={team.name} color={team.color} />
        </div>
      </div>
    </div>
  );
};

interface RoomStatusBarProps {
  className?: string; // Optional className prop
}

// The main component for the Room status bar
const RoomStatusBar: React.FC<RoomStatusBarProps> = ({ className }) => {
  const { room } = roomStore();
  const { currentTeam, redTeam, blueTeam } = useTeams();

  return (
    <div
      className={`box-border w-full border-b border-neutral-400 border-opacity-20 bg-black/40 py-3 backdrop-blur-md ${className}`}
    >
      <div className="mx-auto grid w-full max-w-screen grid-cols-3 items-center justify-center px-4">
        <TeamIndicator team={blueTeam as Team} orientation="right" />
        <div className="flex w-full flex-col items-center">
          <Timer />
          <p className="text-center text-xs font-normal text-[#737373]">
            {getStatusText(currentTeam?.color as any, room?.status as any)}
          </p>
        </div>
        <TeamIndicator team={redTeam as Team} orientation="left" />
      </div>
    </div>
  );
};

export default RoomStatusBar;
