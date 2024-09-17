import useSocket from '@/app/hooks/useSocket';
import useTeams from '@/app/hooks/useTeams';
import React from 'react';
import ReadyButton from './ReadyButton';
import TeamDisplay from './TeamDisplay';

const LobbyView: React.FC = () => {
  const { currentTeam, otherTeam, redTeam, blueTeam } = useTeams();
  const { socket } = useSocket();

  if (!currentTeam || !otherTeam || !redTeam || !blueTeam || !socket) {
    throw new Error('Current team or team ID is undefined');
  }

  return (
    <div className="mx-auto flex h-screen flex-col items-center justify-center">
      <div className="w-96 border bg-black bg-opacity-20 p-6">
        <div className="mb-4 border-b border-opacity-25 pb-4 text-center">
          <h1 className="text-2xl font-bold">{"Salle d'attente"}</h1>
          <p className="text-sm font-normal opacity-50">
            En attente que les deux équipes soient prêtes
          </p>
        </div>
        <section className="flex w-full flex-col gap-6">
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
          <div className='min-h-12 flex flex-col justify-center'>
            <ReadyButton currentTeam={currentTeam} otherTeam={otherTeam} />
          </div>
        </section>
      </div>
    </div>
  );
};

export default LobbyView;
