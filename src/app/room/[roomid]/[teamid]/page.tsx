"use client";

import React, { useEffect } from 'react';
import { AnimatePresence, motion } from "framer-motion";
import Link from 'next/link'
import DraftView from "@/app/components/DraftView";
import TeamView from "@/app/components/TeamView";
import FinishView from "@/app/components/FinishView";
import PlanningView from "@/app/components/PlanningView";
import LobbyView from "@/app/components/LobbyView";

import useSocket from "@/app/hooks/useSocket";
import SocketContext from "@/app/context/SocketContext";

import { roomStore } from "@/app/stores/roomStore";
import { teamStore } from "@/app/stores/teamStore";

import StateControllerButtons from "@/app/components/common/StateControllerButtons";

import LoadingCircle from "@/app/components/common/LoadingCircle";
import { Button } from '@/app/components/ui/button';

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
  const { room, fetchRoom, isLoading: isLoadingRoom, error: errorRoom, } = roomStore();

  useEffect(() => {
    fetchTeams(roomid, teamid);
  }, [roomid, teamid, fetchTeams]);

  useEffect(() => {
    fetchRoom(roomid);
  }, [roomid, fetchRoom]);


  if (connectionError || error || errorRoom) {
    return (
      <div className="flex flex-col items-center justify-center h-screen w-full gap-5">
        <p>Unable to connect to the server. Please try again later.</p>
        <Link href='/'><Button variant={'outline'}>Go back</Button></Link>
      </div>
    );
  }

  if (isLoading || isLoadingRoom || !socket) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        {<LoadingCircle /> }
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
      <main>
        <AnimatePresence mode="wait">
          <StateControllerButtons roomid={roomid} />
          <SocketContext.Provider value={socket}>
            {isLobbyView && <LobbyView />}
            <div className='container'>
              {isPlanningView && <PlanningView />}
              {isRoomView && <TeamView />}
              {isRoomView && <DraftView />}
            </div>
            {isFinishView && <FinishView />}
          </SocketContext.Provider>
        </AnimatePresence>
      </main>
    </>
  );
}
