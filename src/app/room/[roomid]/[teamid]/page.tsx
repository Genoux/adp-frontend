'use client';

import ErrorMessage from '@/app/components/common/ErrorMessage';
import LoadingScreen from '@/app/components/common/LoadingScreen';
import NoticeBanner from '@/app/components/common/NoticeBanner';
import RoomStatusBar from '@/app/components/common/RoomStatusBar';
import StateControllerButtons from '@/app/components/common/StateControllerButtons';
import DraftView from '@/app/components/DraftView';
import FinishView from '@/app/components/FinishView';
import LobbyView from '@/app/components/LobbyView';
import PlanningView from '@/app/components/PlanningView';
import TeamView from '@/app/components/TeamView';
import { BlurHashProvider } from '@/app/context/BlurHashContext';
import SocketContext from '@/app/context/SocketContext';
import useSocket from '@/app/hooks/useSocket';
import { defaultTransition } from '@/app/lib/animationConfig';
import { roomStore } from '@/app/stores/roomStore';
import useTeamStore from '@/app/stores/teamStore';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect } from 'react';

interface RoomProps {
  params: {
    roomid: string;
    teamid: string;
  };
}

export default function Room({ params }: RoomProps) {
  const { roomid, teamid } = params;
  const { socket, isConnected } = useSocket(roomid, teamid);
  const { fetchTeams, isLoading: isLoadingTeams, error: errorTeams, setCurrentTeamId } = useTeamStore();
  const { fetchRoom, room, isLoading: isLoadingRoom, error: errorRoom } = roomStore();

  useEffect(() => {
    fetchTeams(roomid);
    setCurrentTeamId(teamid);
    fetchRoom(roomid);
  }, [fetchRoom, fetchTeams, roomid, setCurrentTeamId, teamid]);


  if (isLoadingTeams || isLoadingRoom || !isConnected) return <LoadingScreen />;

  const isLobbyView = room?.status === 'waiting';
  const isPlanningView = room?.status === 'planning';
  const isFinishView = room?.status === 'done';
  const isRoomView = room && (room.status === 'select' || room.status === 'ban');

  if (errorTeams || errorRoom) return <ErrorMessage />;

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
              transition={defaultTransition}
            >
              <LobbyView />
            </motion.div>
          )}

          {isFinishView && (
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={defaultTransition}
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
              transition={defaultTransition}
              className="flex flex-col gap-12 px-4 pt-12"
            >
              <PlanningView />
              <NoticeBanner message="Si l'un de vos joueurs ne dispose pas du champion requis, veuillez en informer les administrateurs" />
            </motion.div>
          )}

          {isRoomView && (
            <AnimatePresence mode="wait">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={defaultTransition}
              >
                <div className="mx-auto flex h-screen min-h-[768px] w-full min-w-screen max-w-screen flex-col justify-between overflow-hidden">
                  <RoomStatusBar className="z-90 fixed left-0 top-0" />
                  <section className="flex h-full flex-col gap-4 p-4">
                    <div className="h-16"></div>
                    <div className="flex h-full flex-col justify-between gap-4">
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
