'use client';

import ChampionsPool from '@/app/components/common/ChampionsPool';
import ErrorMessage from '@/app/components/common/ErrorMessage';
import GameStatusBar from '@/app/components/common/RoomHeader';
import DraftView from '@/app/components/DraftView';
import FinishView from '@/app/components/FinishView';
import Planningview from '@/app/components/PlanningView';
import { BlurHashProvider } from '@/app/context/BlurHashContext';
import { CanSelectProvider } from '@/app/context/CanSelectContext';
import SocketContext from '@/app/context/SocketContext';
import useSocket from '@/app/hooks/useSocket';
import useTeams from '@/app/hooks/useTeams';
import { roomStore } from '@/app/stores/roomStore';
import useTeamStore from '@/app/stores/teamStore';
import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';

interface SpectatorProps {
  params: {
    roomid: string;
  };
}
const Spectator = ({ params }: SpectatorProps) => {
  const roomid = params.roomid;

  const { socket, isConnected } = useSocket(roomid);
  const { teams, fetchTeams, isLoading: loadTeam } = useTeamStore();
  const { room, fetchRoom, isLoading } = roomStore();
  const { redTeam, blueTeam } = useTeams();

  const [selectedChampion, setSelectedChampion] = useState<string>('');
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentTeam, setCurrentTeam] = useState<any | null>(null);

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

  if (!isConnected || isLoading || loadTeam) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <div className='flex gap-1'>
          <p>Connection en cours</p>
          <div className="sending-animation">
            <span className="sending-animation-dot">.</span>
            <span className="sending-animation-dot">.</span>
            <span className="sending-animation-dot">.</span>
          </div>
        </div>
      </div>
    );
  }

  if (!blueTeam || !redTeam|| !room ) {
    return <ErrorMessage />;
  }

  if (room?.status === 'waiting') {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <Eye size={40} className="mb-4" />
        <h1 className="text-2xl font-bold">Vous êtes spectateur</h1>
        <div className="opacity-50">
          <span className="pr-0.5 text-base">{`En attende des équipes`}</span>
          <div className="sending-animation">
            <span className="sending-animation-dot">.</span>
            <span className="sending-animation-dot">.</span>
            <span className="sending-animation-dot">.</span>
          </div>
        </div>
      </div>
    );
  }

  if (room?.status === 'planning') {
    return (
      <SocketContext.Provider value={socket}>
        <BlurHashProvider>
          <div className="flex flex-col items-center justify-center">
            <Planningview />
          </div>
        </BlurHashProvider>
      </SocketContext.Provider>
    );
  }

  if (room?.status === 'done') {
    return <FinishView />;
  }

  return (
    <CanSelectProvider>
      <SocketContext.Provider value={socket}>
        <BlurHashProvider>
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

          <div className={`absolute ${currentTeam?.color === 'blue' ? 'left-0' : 'right-0'} top-0 -z-10 h-full w-3/12`}>
            {currentImage && (
              <Image
                src={`/images/champions/splash/${currentImage
                  ?.toLowerCase()
                  .replace(/\s+/g, '')}.jpg`}
                width={500}
                height={500}
                rel="preload"
                className={`h-full w-full object-cover object-center opacity-50 ${currentTeam?.color === 'blue'
                    ? 'fade-gradient-left'
                    : 'fade-gradient-right'
                  }`}
                alt={``}
              />
            )}
          </div>
          <div>
            <GameStatusBar />
              <ChampionsPool
                selectedChampion={selectedChampion}
                canSelect={false}
              />
            <DraftView />
          </div>
        </BlurHashProvider>
      </SocketContext.Provider>
    </CanSelectProvider>
  );
};

export default Spectator;
