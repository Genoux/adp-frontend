"use client";

import React, { useEffect } from 'react';
import { AnimatePresence, motion } from "framer-motion";

import DraftView from "@/app/components/DraftView";
import TeamView from "@/app/components/TeamView";
import FinishView from "@/app/components/FinishView";
import PlanningView from "@/app/components/PlanningView";
import LobbyView from "@/app/components/LobbyView";

import useSocket from "@/app/hooks/useSocket";
import SocketContext from "@/app/context/SocketContext";

import { roomStore } from "@/app/stores/roomStore";
import { teamStore } from "@/app/stores/teamStore";

import { setWaiting, setPlanning, setBan, setSelect, setFinish } from "@/app/utils/stateController";

interface StateControllerButtonsProps {
  roomid: string;
}

interface RoomProps {
  params: {
    roomid: string;
    teamid: string;
  };
}

const StateControllerButtons: React.FC<StateControllerButtonsProps> = ({ roomid }) => {
  return (
    <div className="flex flex-row gap-4">
      <button className="btn btn-primary" onClick={() => setWaiting(roomid)}>
        Set Waiting
      </button>
      <button className="btn btn-primary" onClick={() => setPlanning(roomid)}>
        Set Planning
      </button>
      <button className="btn btn-primary" onClick={() => setBan(roomid)}>
        Set Ban
      </button>
      <button className="btn btn-primary" onClick={() => setSelect(roomid)}>
        Set Select
      </button>
      <button className="btn btn-primary" onClick={() => setFinish(roomid)}>
        Set Finish
      </button>
    </div>
  );
}

export default function Room({ params }: RoomProps) {
  const roomid = params.roomid;
  const teamid = params.teamid;

  const socket = useSocket(roomid, teamid);
  const { teams, fetchTeams, isLoading, error } = teamStore();
  const { room, fetchRoom, isLoading: isLoadingRoom,  error: errorRoom, } = roomStore();

  useEffect(() => {
    fetchTeams(roomid, teamid);
  }, [roomid, teamid, fetchTeams]);
  
  useEffect(() => {
    fetchRoom(roomid);
  }, [roomid, fetchRoom]);
 
  if (isLoading || isLoadingRoom) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        {/* <LoadingCircle /> */}
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

  const isLobbyView = room.cycle === -1;
  const isPlanningView = room.cycle === 0;
  const isFinishView = room.status === "done";
  const isRoomView = room.cycle !== 0 && room.cycle !== -1 && room.status !== "done";

  return (
    <>
      <main>
      <StateControllerButtons roomid={roomid} />

        <AnimatePresence mode="wait">
          <motion.div
            initial={{ top: 10, opacity: 0 }}
            animate={{ top: 0, opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1], delay: 0.2 }}
            key="home-page" // Add a unique key prop
          >
            <SocketContext.Provider value={socket}>
              {isLobbyView && <LobbyView />}
              {isPlanningView && (
                <>
                  <PlanningView />
                </>
              )}
              {isFinishView && <FinishView />}
              {isRoomView && <TeamView />}
              {isRoomView && <DraftView />}
            </SocketContext.Provider>
          </motion.div>
        </AnimatePresence>
      </main>
    </>
  );
}
