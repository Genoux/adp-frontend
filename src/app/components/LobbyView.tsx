'use client';

import TeamStatus from '@/app/components/common/TeamStatus';
import { Button } from '@/app/components/ui/button';
import SocketContext from '@/app/context/SocketContext';
import useEnsureContext from '@/app/hooks/useEnsureContext';
import useTeams from '@/app/hooks/useTeams';
import supabase from '@/app/services/supabase';
import { roomStore } from '@/app/stores/roomStore';

interface Team {
  [key: string]: any;
}

interface TeamDisplayProps {
  team: Team;
  currentTeam: Team;
}

const TeamDisplay = ({ team, currentTeam }: TeamDisplayProps) => {

  const color = team.color === 'blue' ? 'bleue' : 'rouge';

  return (
    <div className='flex w-full justify-between items-center border rounded-md bg-[#0a0a0c] h-14 p-4'>
      <div>
        <h1>{team.name}</h1>
        {currentTeam.name === team.name && (
          <p className={`text-${team.color} text-xs`}>{`Vous êtes l'équipe ${color}`}</p>
        )}
      </div>
      <div>
        <TeamStatus team={team} showReadyState={true} />
      </div>
    </div>
  );
}


const ReadyView = () => {
  const socket = useEnsureContext(SocketContext);

  const { room, error } = roomStore((state) => ({
    room: state.room,
    error: state.error,
    isLoading: state.isLoading,
  }));

  const { currentTeam, otherTeam, redTeam, blueTeam } = useTeams();

  if (!room || error) {
    return <div>Room not found</div>;
  }

  if (!currentTeam || !otherTeam || !redTeam || !blueTeam)
    return <div>Team not found</div>;

  const handleReadyClick = async () => {
    const { data, error } = await supabase
      .from('teams')
      .update({ ready: true })
      .select('*, room(*)')
      .eq('id', currentTeam?.id)
      .single();

    if (data && !error) {
      socket.emit('TEAM_READY', { roomid: room.id, teamid: currentTeam?.id });
    }
  };

  return (
    <>
      <div className="text-center border-b border-opacity-25 pb-4">
        <h1 className="text-2xl font-bold">Salle d’attente</h1>
        <p className="text-sm font-normal opacity-50">{"En attente que les deux équipes soient prêtes."}</p>
      </div>

      <div className='flex flex-col gap-4 w-full mb-12'>
        <TeamDisplay team={blueTeam} currentTeam={currentTeam} />
        <TeamDisplay team={redTeam} currentTeam={currentTeam} />
      </div>

      {currentTeam.ready ? (
        <div className='w-full text-center'>
          <span className="pr-0.5 text-base">{`En attende de ${otherTeam.name}`}</span>
          <div className="sending-animation">
            <span className="sending-animation-dot">.</span>
            <span className="sending-animation-dot">.</span>
            <span className="sending-animation-dot">.</span>
          </div>
        </div>
      ) : (
        <Button
          size="lg"
          onClick={handleReadyClick}
        >
          {'Confirmer prêt'}
        </Button>
      )}
    </>
  );
};

export default ReadyView;
