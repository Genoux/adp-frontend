"use client";

import { useState, useCallback } from "react";
import RoomInfo from "@/app/components/RoomInfo";
import TeamView from "@/app/components/TeamView";
import FinishView from "@/app/components/FinishView";
import useSocket from "@/app/hooks/useSocket";
import WaitingView from "@/app/components/WaitingView";
import useFetchRoom from "@/app/hooks/useFetchRoom";
import ReadyView from "@/app/components/ReadyView";
import { AnimatePresence, motion } from "framer-motion";
import LoadingCircle from "@/app/components/LoadingCircle";
import SocketContext from "@/app/context/SocketContext";

interface RoomProps {
  params: {
    roomid: string;
    teamid: string;
  };
}

export default function Room({ params }: RoomProps) {
  const roomid = params.roomid;
  const teamid = params.teamid;
  const [timer, setTimer] = useState<string>("");

  const handleSocketTimer = useCallback((msg: any) => {
    setTimer(msg);
  }, []);

  const socket = useSocket(roomid, teamid, {
    onTimer: handleSocketTimer,
  });

  const { data: room, error, isLoading } = useFetchRoom(roomid);

  const getBgColor = () => {
    if (room.red.isTurn) {
      return "bg-red-600";
    } else if (room.blue.isTurn) {
      return "bg-blue-600";
    }
    return ""; // Default background color when no team has isTurn set to true
  };

  if (isLoading) {
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
  room.cycle = 6;
  room.status = "done";

  const isReadyView = room.cycle === -1;
  const isWaitingView = room.cycle === 0;
  const isFinishView = room.status === "done";
  const isRoomView =
    room.cycle !== 0 && room.cycle !== -1 && room.status !== "done";

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
                  <h1 className="font-bold text-3xl mb-6 border w-fit mx-auto px-4 py-2">
                    {timer || "00:00"}
                  </h1>
                  <WaitingView roomid={roomid} />
                </div>
              )}
              {isFinishView && <FinishView roomid={roomid} />}
              {isRoomView && (
                <div className="text-center">
                  <TeamView teamid={teamid} roomid={roomid} />
                  <RoomInfo roomid={roomid} />
                </div>
              )}
            </SocketContext.Provider>
          </motion.div>
        </AnimatePresence>
      </main>
    </>
  );
}
