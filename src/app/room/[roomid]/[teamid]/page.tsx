'use client';

import ChampionsPool from '@/app/components/common/ChampionsPool';
import LoadingCircle from '@/app/components/common/LoadingCircle';
import StateControllerButtons from '@/app/components/common/StateControllerButtons';
import DraftView from '@/app/components/DraftView';
import FinishView from '@/app/components/FinishView';
import LobbyView from '@/app/components/LobbyView';
import PlanningView from '@/app/components/PlanningView';
import TeamView from '@/app/components/TeamView';
import { Button } from '@/app/components/ui/button';
import { CanSelectProvider } from '@/app/context/CanSelectContext';
import SocketContext from '@/app/context/SocketContext';
import useSocket from '@/app/hooks/useSocket';
import { roomStore } from '@/app/stores/roomStore';
import { teamStore } from '@/app/stores/teamStore';
import { AnimatePresence } from 'framer-motion';
import { ServerCrash } from 'lucide-react';
import Link from 'next/link';
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

  const { socket, connectionError } = useSocket(roomid, teamid);
  const { teams, fetchTeams, isLoading, error } = teamStore();
  const {
    room,
    fetchRoom,
    isLoading: isLoadingRoom,
    error: errorRoom,
  } = roomStore();

  useEffect(() => {
    fetchTeams(roomid, teamid);
  }, [roomid, teamid, fetchTeams]);

  useEffect(() => {
    fetchRoom(roomid);
  }, [roomid, fetchRoom]);

  const handleRefresh = () => {
    window.location.reload();
  };

  if (connectionError || error || errorRoom) {
    return (
      <div className="flex h-screen w-full flex-col items-center justify-center gap-8">
        <ServerCrash size={48} />
        <div className="flex flex-col items-center gap-1">
          <p className="px-24 text-2xl font-bold">
            Impossible de se connecter au serveur.{' '}
          </p>
          <p className="text-sm opacity-60">
            Veuillez réessayer plus tard ou essayer de rafraîchir.
          </p>
        </div>
        <div className="flex gap-2">
          <Link href="/">
            <Button variant="outline">Accueille</Button>
          </Link>
          <Button variant="secondary" onClick={handleRefresh}>
            Rafraîchir
          </Button>
        </div>
      </div>
    );
  }

  if (isLoading || isLoadingRoom || !socket) {
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
    <>
      <StateControllerButtons roomid={roomid} />
      <main>
        <AnimatePresence mode="wait">
          <SocketContext.Provider value={socket}>
            {isLobbyView && <LobbyView />}
            <div className="container">
              {isPlanningView && <PlanningView />}
              <CanSelectProvider>
                {isRoomView && <TeamView />}
                {isRoomView && <DraftView />}
              </CanSelectProvider>
            </div>
            {isFinishView && <FinishView />}
          </SocketContext.Provider>
        </AnimatePresence>
      </main>
    </>
  );
}
