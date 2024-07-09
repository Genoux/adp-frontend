//TODO: On dev sometime realtime wont connect we need to handle that

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

type Team = Database["public"]["Tables"]["teams"]["Row"];

type TeamDisplayProps = {
  team: Team;
  currentTeam: Team;
}

type ReadyButtonProps = {
  currentTeam: Team;
  clicked: boolean;
  onReadyClick: () => void;
}

const isTeamReady = (team: Team) => team.ready;

// Components
const TeamStatus: React.FC<{ isReady: boolean }> = ({ isReady }) =>
  isReady ? (
    <div className="flex h-6 items-center gap-1 border border-green-500 bg-green-500 bg-opacity-10 px-2 py-1">
      <CheckIcon className="h-3 w-3 text-green-500" />
      <p className="-mt-0.5 pr-0.5 text-xs font-medium">prêt</p>
    </div>
  ) : (
    <div className="flex h-6 items-center gap-1 border border-gray-700 px-2 py-1 opacity-70">
      <div className="mr-1 h-2 w-2 bg-zinc-600"></div>
      <p className="-mt-0.5 pr-0.5 text-xs font-light">pas prêt</p>
    </div>
  );

const TeamDisplay: React.FC<TeamDisplayProps> = ({ team, currentTeam }) => (
  <div className="flex h-16 w-full items-center justify-between border bg-[#0a0a0c] p-4">
    <div>
      <h1>{team.name}</h1>
      {currentTeam.name === team.name && (
        <p className={`text-xs text-${team.color}`}>{`Vous êtes l'équipe ${team.color === 'blue' ? 'bleue' : 'rouge'}`}</p>
      )}
    </div>
    <TeamStatus isReady={isTeamReady(team)} />
  </div>
);

const ReadyButton: React.FC<ReadyButtonProps> = ({ currentTeam, clicked, onReadyClick }) => {

  if (isTeamReady(currentTeam)) {
    return (
      <div className="flex text-base gap-1">
        {"En attente de l'autre équipe"}
        <AnimatedDot />
      </div>
    );
  }

  if (clicked) {
    return (
      <div className="w-56 flex items-center justify-center">
        <LoadingCircle size="h-3 w-3" />
      </div>
    );
  }

  return (
    <Button size="lg" className="w-56" onClick={onReadyClick} variant="default">
      Confirmer prêt
    </Button>
  );
};

// Main component
const LobbyView: React.FC = () => {
  const { socket } = useSocket();
  const { currentTeam, redTeam, blueTeam } = useTeams();
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

  if (!currentTeam || !redTeam || !blueTeam || !socket) {
    throw new Error('Current team or team ID is undefined');
  }

  return (
    <div className="mx-auto flex h-screen w-fit flex-col items-center justify-center">
      <div className="mb-4 border-b border-opacity-25 pb-4 text-center">
        <h1 className="text-2xl font-bold">{'Salle d\'attente'}</h1>
        <p className="text-sm font-normal opacity-50">
          En attente que les deux équipes soient prêtes
        </p>
      </div>
      <section className='flex flex-col gap-8 w-full'>
        <div className="flex w-full flex-col gap-4">
          <TeamDisplay team={blueTeam} currentTeam={currentTeam} />
          <TeamDisplay team={redTeam} currentTeam={currentTeam} />
        </div>
        <div className="flex h-12 items-center justify-center">
          <ReadyButton
            currentTeam={currentTeam}
            clicked={clicked}
            onReadyClick={handleReadyClick}
          />
        </div>
      </section>
    </div>
  );
};

export default LobbyView;