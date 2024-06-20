'use client';

import '@/app/utils/strings';
import ChampionsPool from '@/app/components/common/ChampionsPool';
import ErrorMessage from '@/app/components/common/ErrorMessage';
import RoomStatusBar from '@/app/components/common/RoomStatusBar';
import DraftView from '@/app/components/DraftView';
import FinishView from '@/app/components/FinishView';
import Planningview from '@/app/components/PlanningView';
import SocketContext from '@/app/context/SocketContext';
import useSocket from '@/app/hooks/useSocket';
import useTeams from '@/app/hooks/useTeams';
import { roomStore } from '@/app/stores/roomStore';
import useTeamStore from '@/app/stores/teamStore';
import { Eye } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { defaultTransition } from '@/app/lib/animationConfig';
import AnimatedDot from '@/app/components/common/AnimatedDot';
import LoadingScreen from '@/app/components/common/LoadingScreen';
import ExtendedImage from '@/app/components/common/ExtendedImage';
interface SpectatorProps {
  params: {
    roomid: string;
  };
}

const BanPhaseOverlay: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.1 }}
    exit="exit"
    transition={{ delay: 0.2, duration: 1, ease: 'linear' }}
    className="fixed left-0 top-0 -z-50 h-full w-full bg-red-900 opacity-50"
  />
);

const Spectator = ({ params }: SpectatorProps) => {
  const roomid = params.roomid;

  const { socket, isConnected } = useSocket(roomid);
  const { teams, fetchTeams, isLoading: loadTeam } = useTeamStore();
  const { room, fetchRoom, isLoading } = roomStore();
  const { redTeam, blueTeam } = useTeams();

  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentTeam, setCurrentTeam] = useState<any | null>(null);

  useEffect(() => {
    fetchRoom(roomid);
    fetchTeams(roomid);
  }, [fetchRoom, fetchTeams, roomid]);

  useEffect(() => {
    if (teams) {
      const currentTeam = teams.find((team) => team.isturn);
      if (currentTeam) {
        setCurrentImage(currentTeam.clicked_hero || '');
        setCurrentTeam(currentTeam);
      }
    }
  }, [teams]);

  if (!isConnected || isLoading || loadTeam) return <LoadingScreen />;

  if (!blueTeam || !redTeam || !room) return <ErrorMessage />;

  const renderContent = () => {
    switch (room?.status) {
      case 'waiting':
        return (
          <div className="mx-auto flex h-screen min-h-[768px] w-full min-w-screen max-w-screen flex-col items-center justify-center overflow-hidden">
            <Eye size={40} className="mb-4" />
            <h1 className="text-2xl font-bold">Vous êtes spectateur</h1>
            <div className="opacity-50">
              <span className="pr-0.5 text-base flex gap-1">{`En attende des équipes`} <AnimatedDot /></span>
            </div>
          </div>
        );
      case 'planning':
        return <Planningview  />;
      case 'done':
        return <FinishView />;
      default:
        return (
          <>
            <div
              className={`absolute ${currentTeam?.color === 'blue' ? 'left-0' : 'right-0'} top-0 -z-10 h-full w-3/12`}
            >
              {currentImage && (
                <ExtendedImage
                  src={currentImage}
                  fill
                  type='splash'
                  variant='splash'
                  style={{ objectFit: 'cover' }}
                  alt={currentImage}
                  className={`h-full w-full object-cover object-center opacity-50 ${currentTeam?.color === 'blue'
                    ? 'fade-gradient-left'
                    : 'fade-gradient-right'
                    }`}
                />
              )}
            </div>
            <AnimatePresence mode="wait">
              {room?.status === 'ban' && <BanPhaseOverlay />}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ defaultTransition }}
              >
                <div className="mx-auto flex h-screen min-h-[752px] w-full min-w-screen max-w-screen flex-col justify-between overflow-hidden">
                  <RoomStatusBar className="z-90 fixed left-0 top-0" />
                  <section className="flex h-full flex-col gap-4 pb-4 pt-4">
                    <div className="h-14"></div>
                    <div className="flex h-full flex-col justify-between gap-4 px-4">
                      <ChampionsPool className='px-24' />
                      <DraftView />
                    </div>
                  </section>
                </div>
              </motion.div>
            </AnimatePresence>
          </>
        );
    }
  };

  return (
    <SocketContext.Provider value={socket}>
        {renderContent()}
    </SocketContext.Provider>
  );
};

export default Spectator;
