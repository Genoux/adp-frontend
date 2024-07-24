'use client'

import React, { useEffect, useState, useCallback } from 'react';
import { CheckIcon } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import { useToast } from './ui/use-toast';
import useSocket from '@/app/hooks/useSocket';
import useTeams from '@/app/hooks/useTeams';
import { supabase } from '@/app/lib/supabase/client';
import LoadingCircle from '@/app/components/common/LoadingCircle';
import AnimatedDot from '@/app/components/common/AnimatedDot';
import { Database } from '@/app/types/supabase';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import defaultTransition from '@/app/lib/animationConfig';

type Team = Database["public"]["Tables"]["teams"]["Row"];

type TeamDisplayProps = {
  team: Team | undefined;
  isCurrentTeam: boolean;
}

type ReadyButtonProps = {
  currentTeam: Team;
  clicked: boolean;
  onReadyClick: () => void;
  className?: string;
  otherTeam: Team;
}

const isTeamReady = (team: Team) => team.ready;

// Components
const TeamStatus: React.FC<{ isReady: boolean, className?: string }> = ({ isReady, className }) => {
  return (
    <>

      {isReady ? (
        <motion.div
          initial={{ opacity: 0, y: 3 }}
          animate={{ opacity: 1, y: 0 }}
          transition={defaultTransition}
          className={clsx('flex items-center gap-1 border border-green-500 bg-green-500 bg-opacity-10 px-2 py-1', className)}>
          <CheckIcon className="h-3 w-3 text-green-500" />
          <p className="pr-0.5 text-xs font-medium">prêt</p>
        </motion.div>
      ) : (
        <div className={clsx('flex items-center px-4', className)}>
          <AnimatedDot className='-mt-2' />
        </div>
      )}
    </>
  );
}



const TeamDisplay = ({ team, isCurrentTeam }: TeamDisplayProps) => {
  if (!team) return null;

  return (
    <div className={`flex w-full items-center justify-between ${isCurrentTeam ? `bg-${team.color}-600 bg-opacity-5 border-opacity-50 border border-${team.color}-600` : 'border border-zinc-800 bg-zinc-900 bg-opacity-25 '} p-4`}>
      <div className='flex h-8 w-full justify-between items-center gap-1'>
        <div>
          <h1 className='text-lg uppercase'>{team.name}</h1>
          {isCurrentTeam && (
            <p className={`text-xs text-${team.color} opacity-80`}>{`Vous êtes l'équipe ${team.color === 'blue' ? 'bleue' : 'rouge'}`}</p>
          )}
        </div>
        <TeamStatus className='h-full' isReady={isTeamReady(team)} />
      </div>
    </div>
  );
}

const ReadyButton: React.FC<ReadyButtonProps> = ({ currentTeam, clicked, onReadyClick, className, otherTeam }) => {

  if (isTeamReady(currentTeam) && !isTeamReady(otherTeam)) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={defaultTransition}
        className={clsx('flex text-base gap-1', className)}>
        {"En attente de l'autre équipe"}
        <AnimatedDot />
      </motion.div>
    );
  }

  if (clicked) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={defaultTransition}
        className="w-full flex items-center justify-center">
        <LoadingCircle size="h-3 w-3" />
      </motion.div>
    );
  }

  return (
    <Button size="lg" className="w-full" onClick={onReadyClick} variant="default">
      Confirmer prêt
    </Button>
  );
};

// Main component
const LobbyView: React.FC = () => {
  const { socket } = useSocket();
  const { currentTeam, otherTeam, redTeam, blueTeam } = useTeams();
  const [clicked, setClicked] = useState<boolean>(false);
  const { toast } = useToast();

  useEffect(() => {
    if (!currentTeam) return;
    setClicked(isTeamReady(currentTeam));
  }, [currentTeam]);


  const handleReadyClick = useCallback(async () => {
    setClicked(true);

    if (!currentTeam || currentTeam.id === undefined) {
      throw new Error('Current team or team ID is undefined');
    }

    try {
      const { data, error } = await supabase
        .from('teams')
        .update({ ready: true })
        .eq('id', currentTeam.id)
        .select('*')
        .single();

      if (data && !error) {
        socket!.emit('TEAM_READY', { roomid: data.room_id, teamid: currentTeam.id });
        return;
      }

      throw new Error('Error setting ready phase', (error as any).message);
    } catch (error) {
      toast({
        title: 'Erreur (code: 500)',
        description: 'Une erreur est survenue lors de la confirmation, veuillez réessayer plus tard ou contacter un administrateur',
        variant: 'destructive',
      });
      setClicked(false);
    }
  }, [currentTeam, socket, toast]);

  if (!currentTeam || !otherTeam || !redTeam || !blueTeam || !socket) {
    throw new Error('Current team or team ID is undefined');
  }

  return (
    <div className="mx-auto flex h-screen flex-col items-center justify-center">
      <div className='border p-6 bg-black bg-opacity-20 w-96'>
        <div className="mb-4 border-b border-opacity-25 pb-4 text-center">
          <h1 className="text-2xl font-bold">{'Salle d\'attente'}</h1>
          <p className="text-sm font-normal opacity-50">
            En attente que les deux équipes soient prêtes
          </p>
        </div>
        <section className='flex flex-col gap-6 w-full'>
          <div className="flex w-full flex-col gap-4">
            <TeamDisplay
              team={blueTeam}
              isCurrentTeam={currentTeam.color === 'blue'}
            />
            <TeamDisplay
              team={redTeam}
              isCurrentTeam={currentTeam.color === 'red'}
            />
          </div>
          <div className="flex h-12 w-60 mx-auto items-center justify-center">
            <ReadyButton
              otherTeam={otherTeam}
              currentTeam={currentTeam}
              clicked={clicked}
              onReadyClick={handleReadyClick}
            />
          </div>
        </section>
      </div>
    </div>
  );
};

export default LobbyView;