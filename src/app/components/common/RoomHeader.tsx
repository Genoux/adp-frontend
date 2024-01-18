import ArrowAnimation from '@/app/components/common/ArrowAnimation';
import Timer from '@/app/components/common/RoomTimer';
import TeamName from '@/app/components/common/TeamName';
import { defaultTransition } from '@/app/lib/animationConfig';
import { motion } from 'framer-motion';
import React from 'react';

interface Team {
  [key: string]: any;
}

interface Room {
  [key: string]: any;
}

interface TeamIndicatorProps {
  team: Team;
  orientation: 'left' | 'right';
  roomStatus: string;
  widthVariants: any;
}

interface GameStatusBarProps {
  blueTeam: Team;
  redTeam: Team;
  room: Room;
  widthVariants: any;
  statusText: string;
}

// Component for the team indicator with arrow and name
const TeamIndicator: React.FC<TeamIndicatorProps> = ({
  team,
  orientation,
  roomStatus,
}) => {
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
          <ArrowAnimation
            roomStatus={roomStatus}
            teamIsTurn={team?.isturn}
            orientation={orientation}
          />
        </motion.div>
        <div className={`${!team.isturn ? 'opacity-60' : null}`}>
          <TeamName name={team.name} color={team.color} />
        </div>
      </div>
    </div>
  );
};

// The main component for the game status bar
const GameStatusBar: React.FC<GameStatusBarProps> = ({
  blueTeam,
  redTeam,
  room,
  widthVariants,
  statusText,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ defaultTransition, delay: 0.25, duration: 0.3 }}
      className="fixed left-0 top-0 z-50 w-full border-b border-neutral-400 border-opacity-20 bg-black/40 py-3 backdrop-blur-md"
    >
      <div className="mx-auto grid w-full max-w-[1440px] grid-cols-3 items-center justify-center px-6">
        <TeamIndicator
          team={blueTeam}
          orientation="right"
          roomStatus={room?.status}
          widthVariants={widthVariants}
        />
        <div className="flex w-full flex-col items-center">
          <Timer />
          <p className="text-center text-xs font-normal text-[#737373]">
            {statusText}
          </p>
        </div>
        <TeamIndicator
          team={redTeam}
          orientation="left"
          roomStatus={room?.status}
          widthVariants={widthVariants}
        />
      </div>
    </motion.div>
  );
};

export default GameStatusBar;
