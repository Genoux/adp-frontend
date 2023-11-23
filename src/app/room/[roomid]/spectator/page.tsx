'use client';

import ChampionsPool from '@/app/components/common/ChampionsPool';
import ErrorMessage from '@/app/components/common/ErrorMessage';
import LoadingCircle from '@/app/components/common/LoadingCircle';
import GameStatusBar from '@/app/components/common/RoomHeader';
import DraftView from '@/app/components/DraftView';
import FinishView from '@/app/components/FinishView';
import Planningview from '@/app/components/PlanningView';
import { CanSelectProvider } from '@/app/context/CanSelectContext';
import SocketContext from '@/app/context/SocketContext';
import useSocket from '@/app/hooks/useSocket';
import useTeams from '@/app/hooks/useTeams';
import { roomStore } from '@/app/stores/roomStore';
import useTeamStore from '@/app/stores/teamStore';
import { motion } from 'framer-motion';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface SpectatorProps {
  params: {
    roomid: string;
  };
}
const Spectator = ({ params }: SpectatorProps) => {
  const roomid = params.roomid;

  const { socket, connectionError } = useSocket(roomid);
  const { teams, fetchTeams, isLoading: loadTeam } = useTeamStore();
  const { room, fetchRoom, isLoading } = roomStore();
  const { redTeam, blueTeam } = useTeams();

  const [selectedChampion, setSelectedChampion] = useState<string>('');
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentTeam, setCurrentTeam] = useState<any | null>(null);

  const widthVariants = {
    notTurn: { width: '6px' },
    isTurn: { width: '125px' },
  };

  useEffect(() => {
    console.log(room?.status);
  }, [room?.status]);

  useEffect(() => {
    fetchRoom(roomid);
    fetchTeams(roomid);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (teams) {
      const currentTeam = teams.find((team) => team.isturn);
      if (currentTeam) {
        setCurrentImage(currentTeam.clicked_hero || '');
        setCurrentTeam(currentTeam);
        setSelectedChampion(currentTeam.clicked_hero || '');
      }
    }
  }, [teams]);

  if (!socket || isLoading || loadTeam) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        {<LoadingCircle />}
      </div>
    );
  }

  if (!blueTeam || !redTeam || !room || connectionError) {
    return <ErrorMessage />;
  }

  if (room?.status === 'waiting') {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="pr-0.5 text-base">{`En attende des équipes`}</span>
        <div className="sending-animation">
          <span className="sending-animation-dot">.</span>
          <span className="sending-animation-dot">.</span>
          <span className="sending-animation-dot">.</span>
        </div>
      </div>
    );
  }

  if (room?.status === 'planning') {
    return (
      <div className="container">
        <SocketContext.Provider value={socket}>
          <div className="container flex flex-col items-center justify-center">
            <Planningview />
          </div>
        </SocketContext.Provider>
      </div>
    );
  }

  if (room?.status === 'done') {
    return <FinishView />;
  }

  return (
    <CanSelectProvider>
      <SocketContext.Provider value={socket}>
        {room?.status === 'ban' && (
          <motion.div
            exit="exit"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.05 }}
            transition={{
              delay: 0.2,
              duration: 1,
              ease: 'linear',
            }}
            className="absolute left-0 top-0 -z-50 h-full w-full bg-red-900 opacity-5"
          ></motion.div>
        )}

        <div
          className={`absolute ${
            currentTeam?.color === 'blue' ? 'left-0' : 'right-0'
          } top-0 -z-10 h-full w-3/12`}
        >
          {currentImage && (
            <Image
              src={`/images/champions/splash/${currentImage
                ?.toLowerCase()
                .replace(/\s+/g, '')}.jpg`}
              width={3840}
              height={1440}
              rel="preload"
              className={`h-full w-full object-cover object-center opacity-50 ${
                currentTeam?.color === 'blue'
                  ? 'fade-gradient-left'
                  : 'fade-gradient-right'
              }`}
              alt={``}
            />
          )}
        </div>
        <div className="container">
          <GameStatusBar
            blueTeam={blueTeam}
            redTeam={redTeam}
            room={room}
            widthVariants={widthVariants}
            statusText={`Vous êtes spectateur de ${blueTeam?.name.toUpperCase()} vs ${redTeam?.name.toUpperCase()}`}
          />
          <div className="mb-6">
            <ChampionsPool
              selectedChampion={selectedChampion}
              canSelect={true}
            />
          </div>
          <DraftView />
        </div>
      </SocketContext.Provider>
    </CanSelectProvider>
  );
};

export default Spectator;
