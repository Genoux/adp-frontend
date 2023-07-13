"use client";

import { useState, useCallback, createContext, useContext } from "react";
import { Database } from "@/app/types/supabase";
import RoomInfo from "@/app/components/RoomInfo";
import TeamView from "@/app/components/TeamView";
import FinishView from "@/app/components/FinishView";
import WaitingView from "@/app/components/WaitingView";

import ReadyView from "@/app/components/ReadyView";
import { AnimatePresence, motion } from "framer-motion";
import LoadingCircle from "@/app/components/LoadingCircle";
import Timer from "@/app/components/Timer";

import useFetchRoom from "@/app/hooks/useFetchRoom";
import RoomContext from "@/app/context/RoomContext";

import useSocket from "@/app/hooks/useSocket";
import SocketContext from "@/app/context/SocketContext";

import useFetchTeam from "@/app/hooks/useFetchTeam";
import TeamContext from "@/app/context/TeamContext";

import useFetchData from "@/app/hooks/useFetchData";

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
  const { data: team, error: teamError, isLoading: isTeamLoading } = useFetchTeam(teamid);
  const { data: room, error: roomError, isLoading: isRoomLoading } = useFetchRoom(roomid);

  if (isTeamLoading || isRoomLoading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <LoadingCircle />
      </div>
    ); // Replace with your loading component
  }

  if (teamError) {
    return <div>Error fetching team data: {teamError.message}</div>;
  }

  if (roomError) {
    return <div>Error fetching room data: {roomError.message}</div>;
  }

  if (!room || !team) return null;

  const isReadyView = room.cycle === -1;
  const isWaitingView = room.cycle === 0;
  const isFinishView = room.status === "done";
  const isRoomView = room.cycle !== 0 && room.cycle !== -1 && room.status !== "done";

  return (
    <>
      <main className="">
        <AnimatePresence mode="wait">
          <motion.div
            className="relative"
            initial={{ top: 10, opacity: 0 }}
            animate={{ top: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1], delay: 0.2 }}
            key="home-page" // Add a unique key prop
          >
            <SocketContext.Provider value={socket}>
              <TeamContext.Provider value={team}>
                <RoomContext.Provider value={room}>
                  {isReadyView && <ReadyView />}
                  {isWaitingView &&
                    <>
                      <Timer />
                      <WaitingView /> 
                    </>
                  }
                  {isFinishView && <FinishView roomid={room.id}  />}
                  {isRoomView && <TeamView />}
                  {isRoomView && <RoomInfo roomid={room.id} />}
                </RoomContext.Provider>
              </TeamContext.Provider>
            </SocketContext.Provider>
          </motion.div>
        </AnimatePresence>
      </main>
    </>
  );
}
