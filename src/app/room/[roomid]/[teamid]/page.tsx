"use client";

import React, { useEffect } from 'react';
import { AnimatePresence } from "framer-motion";
import DraftView from "@/app/components/DraftView";
import TeamView from "@/app/components/TeamView";
import FinishView from "@/app/components/FinishView";
import PlanningView from "@/app/components/PlanningView";
import LobbyView from "@/app/components/LobbyView";
import useSocket from "@/app/hooks/useSocket";
import SocketContext from "@/app/context/SocketContext";
import { roomStore } from "@/app/stores/roomStore";
import useTeamStore from "@/app/stores/teamStore";
import StateControllerButtons from "@/app/components/common/StateControllerButtons";
import LoadingCircle from "@/app/components/common/LoadingCircle";
import ErrorMessage from '@/app/components/common/ErrorMessage';

interface RoomProps {
  params: {
    roomid: string;
    teamid: string;
  };
}

export default function Room({ params }: RoomProps) {
  const roomid = params.roomid;
  const teamid = params.teamid;

  const { socket, connectionError } = useSocket(roomid);
  const { teams, fetchTeams, isLoading, error, setCurrentTeamId } = useTeamStore();
  const { room, fetchRoom, isLoading: isLoadingRoom, error: errorRoom, } = roomStore();

  useEffect(() => {
    fetchTeams(roomid);
    setCurrentTeamId(teamid);
  }, [roomid, fetchTeams, setCurrentTeamId, teamid]);

  useEffect(() => {
    fetchRoom(roomid);
  }, [roomid, fetchRoom]);

  if (connectionError || error || errorRoom) {
    return (
      <ErrorMessage />
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
  const isFinishView = room.status === "done";
  const isRoomView = room.cycle !== 0 && room.cycle !== -1 && room.status !== "done";

  return (
    <>
      <StateControllerButtons roomid={room.id as any} />
      <main className='px-0 lg:px-12 '>
        <AnimatePresence mode="wait">
          <SocketContext.Provider value={socket}>
            {isLobbyView && <LobbyView />}
            <div className='container'>
              {isPlanningView && <PlanningView />}
              {isRoomView && <TeamView />}
              {isRoomView && <DraftView applyHeightVariants={true} />}
            </div>
            {isFinishView && <FinishView />}
          </SocketContext.Provider>
        </AnimatePresence>
      </main>
    </>
  );
}
