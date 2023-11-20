import ArrowAnimation from '@/app/components/common/ArrowAnimation';
import Timer from '@/app/components/common/RoomTimer';
import { truncateString } from '@/app/lib/utils';
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
  widthVariants,
}) => {
  return (
    <div
      className={`flex items-center gap-2 ${
        orientation === 'right' ? 'justify-start' : 'justify-end'
      }`}
    >
      {orientation === 'right' && (
        <motion.div
          initial={team?.isturn ? 'isTurn' : 'notTurn'}
          animate={team?.isturn ? 'isTurn' : 'notTurn'}
          variants={widthVariants}
          className={`h-6 w-1 bg-${team?.color} rounded-full`}
        />
      )}
      <div
        className={`flex items-center ${
          orientation === 'right' ? 'flex-row-reverse ' : 'flex-row'
        }`}
      >
        <ArrowAnimation
          roomStatus={roomStatus}
          teamIsTurn={team?.isturn}
          orientation={orientation}
        />
        <span
          className={`text-2xl ${orientation === 'right' ? 'mr-2' : 'ml-2'}`}
        >
          {truncateString(team?.name.toUpperCase(), 6)}
        </span>
      </div>

      {orientation === 'left' && (
        <motion.div
          initial={team?.isturn ? 'isTurn' : 'notTurn'}
          animate={team?.isturn ? 'isTurn' : 'notTurn'}
          variants={widthVariants}
          className={`h-6 w-1 bg-${team?.color} rounded-full`}
        />
      )}
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
    <div className="my-3 grid w-full grid-cols-3 items-center justify-center">
      <TeamIndicator
        team={blueTeam}
        orientation="right"
        roomStatus={room?.status}
        widthVariants={widthVariants}
      />
      <div className="flex w-full flex-col items-center">
        <Timer />
        <p className="text-center text-xs font-medium">{statusText}</p>
      </div>
      <TeamIndicator
        team={redTeam}
        orientation="left"
        roomStatus={room?.status}
        widthVariants={widthVariants}
      />
    </div>
  );
};

export default GameStatusBar;
