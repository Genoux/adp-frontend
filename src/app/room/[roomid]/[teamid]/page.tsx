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
import { CanSelectProvider } from '@/app/context/CanSelectContext';
import SocketContext from '@/app/context/SocketContext';
import useSocket from '@/app/hooks/useSocket';
import { roomStore } from '@/app/stores/roomStore';
import useTeamStore from '@/app/stores/teamStore';
import { motion, AnimatePresence } from 'framer-motion';
import LoadingScreen from '@/app/components/common/LoadingScreen';
import { defaultTransition } from '@/app/lib/animationConfig';

interface RoomProps {
  params: {
    roomid: string;
    teamid: string;
  };
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

  const isLobbyView = room?.cycle === -1;
  const isPlanningView = room?.cycle === 0;
  const isFinishView = room?.status === 'done';
  const isRoomView = room && !isLobbyView && !isPlanningView && !isFinishView;

  return (
    <main className="flex flex-col items-center justify-center">
      <SocketContext.Provider value={socket}>
        <BlurHashProvider>
          <AnimatePresence mode='wait'>
            {isLobbyView && (
              <motion.div
                key="lobbyView"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: .1, defaultTransition }}
              >
                <LobbyView />
              </motion.div>
            )}

            {isFinishView && (
              <motion.div
                key="finishView"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: .1, defaultTransition }}
              >
                <FinishView />
              </motion.div>
            )}

            {isPlanningView && (
              <motion.div
                key="planningView"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: .1, defaultTransition }}
              >
                <PlanningView />
                <NoticeBanner message="Si l'un de vos joueurs ne dispose pas du champion requis, veuillez en informer les administrateurs" />
              </motion.div>
            )}

            {isRoomView && (
              <>
                
                <motion.div
                  key="teamView"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: .1, defaultTransition }}
                >
                  <CanSelectProvider>
                    <TeamView />
                    <DraftView />
                  </CanSelectProvider>
                </motion.div>
              </>
            )}
          </AnimatePresence>
        </BlurHashProvider>
      </SocketContext.Provider>
    </main>
  );
}
