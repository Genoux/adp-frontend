import AnimatedDot from '@/app/components/common/AnimatedDot'; // Make sure this path is correct
import defaultTransition from '@/app/lib/animationConfig';
import { Database } from '@/app/types/supabase';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { CheckIcon } from 'lucide-react';
import React from 'react';

type Team = Database['public']['Tables']['teams']['Row'];

type TeamDisplayProps = {
  team: Team;
  isCurrentTeam: boolean;
};

export interface TeamStatusProps {
  isReady: boolean;
  className?: string;
}

const TeamStatus: React.FC<TeamStatusProps> = ({ isReady, className }) => {
  return (
    <>
      {isReady ? (
        <motion.div
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={defaultTransition}
          className={clsx(
            'flex items-center gap-1 border border-green-500 bg-green-500 bg-opacity-10 px-2 py-1',
            className
          )}
        >
          <CheckIcon className="h-3 w-3 text-green-500" />
          <p className="pr-0.5 text-xs font-medium">prêt</p>
        </motion.div>
      ) : (
        <div className={clsx('flex items-center px-4', className)}>
          <AnimatedDot className="-mt-2" />
        </div>
      )}
    </>
  );
};

const TeamDisplay: React.FC<TeamDisplayProps> = ({ team, isCurrentTeam }) => {
  return (
    <div
      className={`flex w-full items-center justify-between ${
        isCurrentTeam
          ? `bg-${team.color}-600 border border-opacity-50 bg-opacity-5 border-${team.color}-600`
          : 'border border-zinc-800 bg-zinc-900 bg-opacity-25'
      } p-4`}
    >
      <div className="flex h-8 w-full items-center justify-between gap-1">
        <div>
          <h1 className="text-lg uppercase">{team.name}</h1>
          {isCurrentTeam && (
            <p className={`text-xs text-${team.color} opacity-80`}>
              {`Vous êtes l'équipe ${team.color === 'blue' ? 'bleue' : 'rouge'}`}
            </p>
          )}
        </div>
        <TeamStatus className="h-full" isReady={team.ready} />
      </div>
    </div>
  );
};

export default TeamDisplay;
