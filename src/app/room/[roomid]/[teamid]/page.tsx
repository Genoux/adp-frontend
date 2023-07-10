"use client";

import { useState, useCallback, createContext, useContext } from "react";
import RoomInfo from "@/app/components/RoomInfo";
import TeamView from "@/app/components/TeamView";
import FinishView from "@/app/components/FinishView";
import WaitingView from "@/app/components/WaitingView";
import useFetchRoom from "@/app/hooks/useFetchRoom";
import ReadyView from "@/app/components/ReadyView";
import { AnimatePresence, motion } from "framer-motion";
import LoadingCircle from "@/app/components/LoadingCircle";
import SocketContext from "@/app/context/SocketContext";
import useSocket from "@/app/hooks/useSocket";
import Timer from "@/app/components/Timer";
import useFetchTeam from "@/app/hooks/useFetchTeam";
import TeamContext from "@/app/context/TeamContext";


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
  const { data: room, error, isLoading } = useFetchRoom(roomid);

  if (isLoading || isTeamLoading) {
    return (
      <>
        <div className="flex min-h-screen flex-col items-center justify-center">
          <LoadingCircle />
        </div>
      </>
    );
  }

  if (error) {
    return <div>Something went wrong: {error.message}</div>; // You can replace this with an error component
  }

  if (!room) return null;

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
              {isReadyView &&
                <div className="text-center h-screen flex flex-col justify-center w-full">
                  <ReadyView teamid={teamid} roomid={roomid}/>
                </div>
              }
              {isWaitingView && (
                <div className="text-center mt-12 flex flex-col justify-center w-full">
                  <h1 className="text-4xl font-bold mb-2">Planning phase!</h1>
                  <h2 className="text-lg mb-6">
                    Define your selection strategy from the champion pool
                    </h2>
                  <Timer />
                  <WaitingView roomid={roomid} />
                </div>
              )}
              {isFinishView && <FinishView roomid={roomid} />}
              {isRoomView && (
                <div className="text-center">
                  <TeamView roomid={roomid} />
                  <RoomInfo roomid={roomid} />
                </div>
                )}
                </TeamContext.Provider>
            </SocketContext.Provider>
          </motion.div>
        </AnimatePresence>
      </main>
    </>
  );
}
