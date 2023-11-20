'use client';

import TeamStatus from '@/app/components/common/TeamStatus';
import { Button } from '@/app/components/ui/button';
import SocketContext from '@/app/context/SocketContext';
import useEnsureContext from '@/app/hooks/useEnsureContext';
import useTeams from '@/app/hooks/useTeams';
import supabase from '@/app/services/supabase';
import { roomStore } from '@/app/stores/roomStore';

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
    <div className="absolute left-1/2 top-1/2 flex -translate-x-1/2 -translate-y-1/2 transform flex-col items-center justify-center overflow-y-hidden text-3xl">
      <div className="mb-6 text-center">
        <h1 className="mb-2 text-4xl font-bold">{`Salle d'attente`}</h1>
        <p className="text-base">{`Les joueurs attendent dans la salle jusqu'à ce que tout le monde soit prêt.`}</p>
        <div className="mt-6 flex items-center justify-center">
          <div className={`h-6 w-1 bg-${currentTeam.color} rounded-full`}></div>
          <p
            className={`rounded-md p-2 text-base font-bold text-white`}
          >{`Vous êtes l'équipe ${currentTeam.name.toUpperCase()}`}</p>
          <div className={`h-6 w-1 bg-${currentTeam.color} rounded-full`}></div>
        </div>
      </div>
      <div className="mb-12 w-full rounded-md border border-opacity-10">
        <div className="grid grid-cols-2 text-base">
          <p
            className={`flex flex-col items-center gap-2 border-r p-6`}
          >
            {blueTeam.name.toUpperCase()}
            <TeamStatus team={blueTeam} showReadyState={true} />
          </p>

          <p
            className={`flex flex-col items-center gap-2 p-6`}
          >
            {redTeam.name.toUpperCase()}
            <TeamStatus team={redTeam} showReadyState={true} />
          </p>
        </div>
      </div>
      {currentTeam.ready ? (
        <div>
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
          className={`mt-6 rounded-sm bg-yellow px-24 text-sm font-bold uppercase text-yellow-text hover:bg-yellow-hover`}
          onClick={handleReadyClick}
        >
          {'Nous sommes prêt'}
        </Button>
      )}
    </div>
  );
};

export default ReadyView;
