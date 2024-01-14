'use client';

import ErrorMessage from '@/app/components/common/ErrorMessage';
import LoadingCircle from '@/app/components/common/LoadingCircle';
import NoticeBanner from '@/app/components/common/NoticeBanner';
import StateControllerButtons from '@/app/components/common/StateControllerButtons';
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
import { AnimatePresence } from 'framer-motion';
import React, { useEffect } from 'react';

interface RoomProps {
  params: {
    roomid: string;
    teamid: string;
  };
}

export default function Room({ params }: RoomProps) {
  const roomid = params.roomid;
  const teamid = params.teamid;

  const { socket, connectionError, isConnected } = useSocket(roomid);
  const { teams, fetchTeams, isLoading, error, setCurrentTeamId } =
    useTeamStore();
  const {
    room,
    fetchRoom,
    isLoading: isLoadingRoom,
    error: errorRoom,
  } = roomStore();

  useEffect(() => {
    fetchTeams(roomid);
    setCurrentTeamId(teamid);
  }, [roomid, fetchTeams, setCurrentTeamId, teamid]);

  useEffect(() => {
    fetchRoom(roomid);
  }, [roomid, fetchRoom]);

  if (connectionError || error || errorRoom) {
    return <ErrorMessage />;
  }

  if (isLoading || isLoadingRoom || !isConnected) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        {<LoadingCircle />}
      </div>
    );
  }

  if (!room || !teams) return null;

  const isLobbyView = room.cycle === -1;
  const isPlanningView = room.cycle === 0;
  const isFinishView = room.status === 'done';
  const isRoomView =
    room.cycle !== 0 && room.cycle !== -1 && room.status !== 'done';

  return (
    <main className="flex h-full flex-col items-center justify-start">
      <StateControllerButtons roomid={room.id as any} />
      <AnimatePresence mode="wait">
        <SocketContext.Provider value={socket}>
          <BlurHashProvider>
            {isLobbyView ? (
              <section className="flex h-full flex-col justify-center gap-10">
                <LobbyView />
              </section>
            ) : isFinishView ? (
              <FinishView />
            ) : (
              <section className="h-full" id="main">
                {isPlanningView && (
                  <div className="flex flex-col">
                    <PlanningView />
                    <NoticeBanner message="Si l'un de vos joueurs ne dispose pas du champion requis, veuillez en informer les administrateurs" />
                  </div>
                )}
                <CanSelectProvider>
                  {isRoomView && <TeamView />}
                  {isRoomView && <DraftView />}
                </CanSelectProvider>
              </section>
            )}
          </BlurHashProvider>
        </SocketContext.Provider>
      </AnimatePresence>
    </main>
  );
}
