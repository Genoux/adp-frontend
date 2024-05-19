'use client'

import { useEffect } from 'react';
import ErrorMessage from '@/app/components/common/ErrorMessage';
import NoticeBanner from '@/app/components/common/NoticeBanner';
import DraftView from '@/app/components/DraftView';
import FinishView from '@/app/components/FinishView';
import LobbyView from '@/app/components/LobbyView';
import PlanningView from '@/app/components/PlanningView';
import TeamView from '@/app/components/TeamView';
import { BlurHashProvider } from '@/app/context/BlurHashContext';
import SocketContext from '@/app/context/SocketContext';
import useSocket from '@/app/hooks/useSocket';
import { roomStore } from '@/app/stores/roomStore';
import useTeamStore from '@/app/stores/teamStore';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingScreen from '@/app/components/common/LoadingScreen';
import StateControllerButtons from '@/app/components/common/StateControllerButtons';
import RoomStatusBar from '@/app/components/common/RoomStatusBar';
import { defaultTransition } from '@/app/lib/animationConfig';

interface RoomProps {
  params: {
    roomid: string;
    teamid: string;
  };
}

interface Room {
  [key: string]: any;
}

export default function Room({ params }: RoomProps) {
  const { roomid, teamid } = params;
  const { socket, isConnected } = useSocket(roomid);
  const { fetchTeams, isLoading, error, setCurrentTeamId } = useTeamStore();
  const { room, fetchRoom, isLoading: isLoadingRoom, error: errorRoom } = roomStore();

  useEffect(() => {
    fetchTeams(roomid);
    setCurrentTeamId(teamid);
    fetchRoom(roomid);
  }, [roomid, teamid, fetchTeams, setCurrentTeamId, fetchRoom]);

  if (error || errorRoom) return <ErrorMessage />;
  if (isLoading || isLoadingRoom || !isConnected) return <LoadingScreen />;

  const isLobbyView = room?.status === "waiting"
  const isPlanningView = room?.status === "planning";
  const isFinishView = room?.status === 'done';
  const isRoomView = room && room?.status === 'select' || room?.status === 'ban';

  return (
    <main>
      <StateControllerButtons roomid={roomid} />
      <SocketContext.Provider value={socket}>
        <BlurHashProvider>
        
            {isLobbyView && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ defaultTransition }}>
                <LobbyView />
              </motion.div>
            )}

          {isFinishView && (
             <AnimatePresence mode='wait'>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ defaultTransition }}
              >
                <FinishView />
              </motion.div>
              </AnimatePresence>
            )}

            {isPlanningView && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ defaultTransition }}
                className='flex flex-col gap-12 pt-12 px-4'
              >
                <PlanningView />
                <NoticeBanner message="Si l'un de vos joueurs ne dispose pas du champion requis, veuillez en informer les administrateurs" />
              </motion.div>
            )}

          {isRoomView && (
              <AnimatePresence mode='wait'>
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ defaultTransition }}
              >
                <div className='overflow-hidden h-screen min-h-[768px] mx-auto w-full flex justify-between flex-col max-w-screen min-w-screen'>
                  <RoomStatusBar className='fixed top-0 left-0 z-90' />
                  <section className='p-4 h-full flex flex-col gap-4'>
                    <div className='h-16'></div>
                    <div className='h-full flex flex-col justify-between gap-4'>
                      <TeamView />
                      <DraftView />
                    </div>
                  </section>
                </div>
              </motion.div>
              </AnimatePresence>
            )}

        </BlurHashProvider>
      </SocketContext.Provider>
    </main>
  );
}
