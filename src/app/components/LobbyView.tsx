import TeamStatus from '@/app/components/common/TeamStatus';
import { Button } from '@/app/components/ui/button';
import useSocket from '@/app/hooks/useSocket';
import useTeams from '@/app/hooks/useTeams';
import { supabase } from '@/app/lib/supabase/client';
import LoadingCircle from '@/app/components/common/LoadingCircle';
import AnimatedDot from '@/app/components/common/AnimatedDot';
import ErrorMessage from '@/app/components/common/ErrorMessage';
import useTeamStore from '@/app/stores/teamStore';
import { useState } from 'react';

interface Team {
  [key: string]: any;
}

interface TeamDisplayProps {
  team: Team;
  currentTeam: Team;
}

const TeamDisplay = ({ team, currentTeam }: TeamDisplayProps) => {
  const color = team.color === 'blue' ? 'bleue' : 'rouge';
  const text = team.color === 'blue' ? 'text-blue' : 'text-red';

  return (
    <div className="flex h-16 w-full items-center justify-between border bg-[#0a0a0c] p-4">
      <div>
        <h1>{team.name}</h1>
        {currentTeam?.name === team.name && (
          <p className={text + " text-xs"}>{`Vous êtes l'équipe ${color}`}</p>
        )}
      </div>
      <TeamStatus team={team} showReadyState={true} />
    </div>
  );
};

const LobbyView = () => {
  const { socket } = useSocket();
  const { isSubscribed } = useTeamStore();
  const { currentTeam, otherTeam, redTeam, blueTeam } = useTeams();
  const [clicked, setClicked] = useState(false);

  if (!currentTeam || !otherTeam || !redTeam || !blueTeam || !socket) {
    return <ErrorMessage />;
  }

  const handleReadyClick = async () => {
    setClicked(true);

    const { data, error } = await supabase
      .from('teams')
      .update({ ready: true })
      .eq('id', currentTeam.id)
      .select('*, room(*)')
      .single();

    if (data && !error) {
      socket.emit('TEAM_READY', { roomid: data.room.id, teamid: currentTeam.id });
    }

    setTimeout(() => {
      setClicked(false);
    }, 1000);
  };

  const buttonDisabled = !socket || !currentTeam || !isSubscribed || clicked;

  return (
    <div className="mx-auto flex h-screen w-fit flex-col items-center justify-center">
      <div className="mb-4 border-b border-opacity-25 pb-4 text-center">
        <h1 className="text-2xl font-bold">Salle d’attente</h1>
        <p className="text-sm font-normal opacity-50">
          En attente que les deux équipes soient prêtes
        </p>
      </div>
      <div className="mb-12 flex w-full flex-col gap-4">
        <TeamDisplay team={blueTeam} currentTeam={currentTeam} />
        <TeamDisplay team={redTeam} currentTeam={currentTeam} />
      </div>

      <div className="flex h-12 items-center justify-center">
        {currentTeam.ready ? (
            <p className="flex text-base gap-1">En attente de {otherTeam.name}<AnimatedDot /></p>
        ) : (
          <Button size="lg" className="w-56" onClick={handleReadyClick} disabled={buttonDisabled} variant={!buttonDisabled ? 'default' : 'outline'}>
            {socket && isSubscribed && !clicked ? 'Confirmer prêt' : <LoadingCircle size='h-3 w-3' />}
          </Button>
        )}
      </div>
    </div>
  );
};

export default LobbyView;
