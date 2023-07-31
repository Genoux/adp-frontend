"use client";

import React, { useEffect } from 'react';
import RoomInfo from "@/app/components/RoomInfo";
import TeamView from "@/app/components/TeamView";
import FinishView from "@/app/components/FinishView";
import WaitingView from "@/app/components/WaitingView";

import ReadyView from "@/app/components/ReadyView";
import { AnimatePresence, motion } from "framer-motion";
import LoadingCircle from "@/app/components/LoadingCircle";
import Timer from "@/app/components/Timer";

import useSocket from "@/app/hooks/useSocket";
import SocketContext from "@/app/context/SocketContext";

import { roomStore } from "@/app/stores/roomStore";
import { teamStore } from "@/app/stores/teamStore";

interface RoomProps {
  params: {
    roomid: string;
    teamid: string;
  };
}

export default function Room({ params }: RoomProps) {
  const roomid = params.roomid;
  const teamid = params.teamid;

  const socket = useSocket(roomid, teamid);
  const { teams, fetchTeams, isLoading, error } = teamStore();
  const { room, error: errorRoom, isLoading: isLoadingRoom, fetchRoom } = roomStore();

  useEffect(() => {
    fetchTeams(roomid, teamid);
    fetchRoom(roomid)
  }, [roomid, teamid, fetchTeams, fetchRoom]);


  if (isLoading || isLoadingRoom) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <LoadingCircle />
      </div>
    );
  }

  if (error) {
    return <div>Error fetching team data: {error.message}</div>;
  }

  if (errorRoom) {
    return <div>Error fetching room data: {errorRoom.message}</div>;
  }

  if (!room || !teams) return null;

  const isReadyView = room.cycle === -1;
  const isWaitingView = room.cycle === 0;
  const isFinishView = room.status === "done";
  const isRoomView =
    room.cycle !== 0 && room.cycle !== -1 && room.status !== "done";

  return (
    <>
      <main>
        <AnimatePresence mode="wait">
          <motion.div
            initial={{ top: 10, opacity: 0 }}
            animate={{ top: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1], delay: 0.2 }}
            key="home-page" // Add a unique key prop
          >
            <SocketContext.Provider value={socket}>
              {isReadyView && <ReadyView />}
              {isWaitingView && (
                <>
                  <Timer />
                  <WaitingView />
                </>
              )}
              {isFinishView && <FinishView />}
              {isRoomView && <TeamView />}
              {isRoomView && <RoomInfo />}
            </SocketContext.Provider>
          </motion.div>
        </AnimatePresence>
      </main>
    </>
  );
}
