'use client';

import '@/app/utils/strings';
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

//import PreloadImages from '@/app/components/PreloadImages';

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

  if (errorTeams || errorRoom) return <ErrorMessage />;

  const renderContent = () => {
    switch (room?.status) {
      case 'waiting':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={defaultTransition}
          >
            <LobbyView />
          </motion.div>
        );
      case 'planning':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={defaultTransition}
            className='flex flex-col gap-6 relative'
          >
            <PlanningView />
            <NoticeBanner className="-mt-[100px]" message="Si l'un de vos joueurs ne dispose pas du champion requis, veuillez en informer les administrateurs" />
          </motion.div>
        );
      case 'done':
        return (
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
        );
      case 'select':
      case 'ban':
        return (
          <AnimatePresence mode="wait">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={defaultTransition}
            >
              <div className="mx-auto flex h-screen min-h-[768px] w-full min-w-screen max-w-screen flex-col justify-between overflow-hidden">
                <RoomStatusBar className="z-90 fixed left-0 top-0" />
                <section className="flex h-full flex-col gap-4 pb-4 pt-4">
                  <div className="h-12"></div>
                  <div className="flex h-full flex-col justify-between gap-4">
                    <TeamView />
                    <DraftView />
                  </div>
                </section>
              </div>
            </motion.div>
          </AnimatePresence>
        );
      default:
        return null;
    }
  };

  return (
    <main>
      <StateControllerButtons roomid={roomid} />
      <SocketContext.Provider value={socket}>
        <BlurHashProvider>
          {renderContent()}
        </BlurHashProvider>
      </SocketContext.Provider>
    </main>
  );
}
