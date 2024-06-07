import TeamStatus from '@/app/components/common/TeamStatus';
import { Button } from '@/app/components/ui/button';
import SocketContext from '@/app/context/SocketContext';
import useEnsureContext from '@/app/hooks/useEnsureContext';
import useTeams from '@/app/hooks/useTeams';
import { supabase } from '@/app/lib/supabase/client';
import clsx from 'clsx';
import { useEffect, useState } from 'react';

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
          <p className={clsx(`${text} text-xs`)}>{`Vous êtes l'équipe ${color}`}</p>
        )}
      </div>
      <div>
        <TeamStatus team={team} showReadyState={true} />
      </div>
    </div>
  );
};

const LobbyView = () => {
  const socket = useEnsureContext(SocketContext);
  const { currentTeam, otherTeam, redTeam, blueTeam } = useTeams();
  const [isReadyToInteract, setIsReadyToInteract] = useState(false);

  useEffect(() => {
    if (currentTeam && socket) {
      setIsReadyToInteract(true);
    }
  }, [currentTeam, socket]);

  if (!currentTeam || !otherTeam || !redTeam || !blueTeam) {
    return <div>Team not found</div>;
  }

  const handleReadyClick = async () => {
    const { data, error } = await supabase
      .from('teams')
      .update({ ready: true })
      .eq('id', currentTeam.id)
      .select('*, room(*)')
      .single();

    if (data && !error) {
      socket.emit('TEAM_READY', { roomid: data.room.id, teamid: currentTeam.id });
    }
  };

  return (
    <div className="mx-auto flex h-screen w-fit flex-col items-center justify-center">
      <div className="mb-4 border-b border-opacity-25 pb-4 text-center">
        <h1 className="text-2xl font-bold">Salle d’attente</h1>
        <p className="text-sm font-normal opacity-50">
          {'En attente que les deux équipes soient prêtes'}
        </p>
      </div>
      <div className="mb-12 flex w-full flex-col gap-4">
        <TeamDisplay team={blueTeam} currentTeam={currentTeam} />
        <TeamDisplay team={redTeam} currentTeam={currentTeam} />
      </div>

      <div className="flex h-12 items-center justify-center">
        {currentTeam.ready ? (
          <div className="w-full text-center">
            <span className="pr-0.5 text-base">{`En attente de ${otherTeam.name}`}</span>
            <div className="sending-animation">
              <span className="sending-animation-dot">.</span>
              <span className="sending-animation-dot">.</span>
              <span className="sending-animation-dot">.</span>
            </div>
          </div>
        ) : (
          <Button size="lg" className="w-full" onClick={handleReadyClick} disabled={!isReadyToInteract}>
            <span>{'Confirmer prêt'}</span>
          </Button>
        )}
      </div>
    </div>
  );
};

export default LobbyView;
