'use client'

import { Button } from '@/app/components/ui/button';
import useSocket from '@/app/hooks/useSocket';
import useTeams from '@/app/hooks/useTeams';
import { supabase } from '@/app/lib/supabase/client';
import LoadingCircle from '@/app/components/common/LoadingCircle';
import AnimatedDot from '@/app/components/common/AnimatedDot';
import ErrorMessage from '@/app/components/common/ErrorMessage';
import useTeamStore from '@/app/stores/teamStore';
import { useEffect, useState } from 'react';
import { CheckIcon } from 'lucide-react';


type Team = {
  [key: string]: any;
}

type TeamDisplayProps = {
  team: Team;
  currentTeam: Team;
}

const TeamDisplay = ({ team, currentTeam }: TeamDisplayProps) => {

  return (
    <div className="flex h-16 w-full items-center justify-between border bg-[#0a0a0c] p-4">
      <div>
        <h1>{team.name}</h1>
        {currentTeam?.name === team.name && (
          <p className={`text-xs text-${team.color}`}>{`Vous êtes l'équipe ${team.color === 'blue' ? 'bleue' : 'rouge'}`}</p>
        )}
      </div>
      {team.ready ? (
        <div className="flex h-6 items-center gap-1 border border-green-500 bg-green-500 bg-opacity-10 px-2 py-1">
          <CheckIcon className="h-3 w-3 text-green-500" />
          <p className="-mt-0.5 pr-0.5 text-xs font-medium">prêt</p>
        </div>
      ) : (
        <div className="flex h-6 items-center gap-1 border border-gray-700 px-2 py-1 opacity-70">
          <div className="mr-1 h-2 w-2 bg-zinc-600"></div>
          <p className="-mt-0.5 pr-0.5 text-xs font-light">{`pas prêt`}</p>
        </div>
      )}
    </div>
  );
};

const LobbyView = () => {
  const { socket, isConnected } = useSocket();
  const { isSubscribed } = useTeamStore();
  const { currentTeam, redTeam, blueTeam } = useTeams();
  const [clicked, setClicked] = useState(false);
  const [online, setOnline] = useState(false);

  useEffect(() => {
    if (isConnected && isSubscribed) {
      setOnline(true);
    } else {
      setOnline(false);
    }
  }, [isConnected, isSubscribed]);

  if (!currentTeam || !redTeam || !blueTeam || !socket) {
    return <ErrorMessage />;
  }

  const handleReadyClick = async () => {
    setClicked(true);

    const { data, error } = await supabase
      .from('teams')
      .update({ ready: true })
      .eq('id', currentTeam.id)
      .select('*')
      .single();

    if (data && !error) {
      socket.emit('TEAM_READY', { roomid: data.room, teamid: currentTeam.id });
    }
  };

  return (
    <div className="mx-auto flex h-screen w-fit flex-col items-center justify-center">
      <div className="mb-4 border-b border-opacity-25 pb-4 text-center">
        <h1 className="text-2xl font-bold">Salle d’attente</h1>
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
          {currentTeam.ready ? (
            <div className="flex text-base gap-1">{"En attente de l'autre équipe"}<AnimatedDot /></div>
          ) : (
            <>
              {online ? (
                <Button size="lg" className="w-56" onClick={handleReadyClick} disabled={!online} variant={!clicked ? 'default' : 'outline'}>
                  {!clicked ? 'Confirmer prêt' : <LoadingCircle size='h-3 w-3' />}
                </Button>
              ) : (
                <Button size="lg" className="w-56" disabled={true} variant={'outline'}>
                  <LoadingCircle size='h-3 w-3' />
                </Button>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default LobbyView;
