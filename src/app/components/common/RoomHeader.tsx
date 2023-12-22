import ArrowAnimation from '@/app/components/common/ArrowAnimation';
import Timer from '@/app/components/common/RoomTimer';
import { truncateString } from '@/app/lib/utils';
import React from 'react';
import { motion } from 'framer-motion';
import { defaultTransition } from '@/app/lib/animationConfig';

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
    <div className={`flex items-center gap-2 ${orientation === 'right' ? 'justify-start' : 'justify-end'}`}>
      <div
        className={`flex items-center ${orientation === 'right' ? 'flex-row-reverse ' : 'flex-row'
          }`}
      >
        <motion.div
          className={`flex items-center justify-center ${orientation === 'right' ? 'mr-2' : 'ml-2'}`}
          initial={{ opacity: 0, x: orientation === 'right' ? 50 : -50 }} // start from left or right based on orientation
          animate={{ opacity: 1, x: 0 }} // animate to the original position
          transition={{ delay: .4, defaultTransition }}
        >
          <ArrowAnimation
            roomStatus={roomStatus}
            teamIsTurn={team?.isturn}
            orientation={orientation}
          />
        </motion.div>


        <div className=
          {`${team?.isturn ? `bg-${team.color}-500 bg-opacity-25 border border-${team.color} rounded-full` :
            'bg-gray-700 bg-opacity-25 border border-gray-700 rounded-full'
            } w-full flex items-center px-2 h-7 justify-between gap-2`}
        >
          <div className={`${team?.isturn ? `bg-${team.color}` : 'bg-zinc-700'
            } text-sm font-medium h-3 w-3 rounded-full`}></div>
          {truncateString(team?.name.toUpperCase(), 6)}
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
    <div className="my-3 grid w-full grid-cols-3 items-end justify-center border-b pt-2 pb-4 mb-6">
      <TeamIndicator
        team={blueTeam}
        orientation="right"
        roomStatus={room?.status}
        widthVariants={widthVariants}
      />
      <div className="flex w-full flex-col items-center">
        <Timer />
        <p className="text-center text-sm font-normal text-[#737373]">{statusText}</p>
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
