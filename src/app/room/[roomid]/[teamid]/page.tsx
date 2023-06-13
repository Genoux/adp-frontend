"use client"

import { useState, useCallback } from "react";
import RoomInfo from "@/app/components/RoomInfo";
import TeamView from "@/app/components/TeamView";
import FinishView from "@/app/components/FinishView";
import useSocket from "@/app/hooks/useSocket";
import WaitingView from "@/app/components/WaitingView";
import useFetchRoom from "@/app/hooks/useFetchRoom";
import ReadyView from "@/app/components/ReadyView";

import SocketContext from '@/app/context/SocketContext';

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
    onTimer: handleSocketTimer
  });

  const { data: room, error, isLoading } = useFetchRoom(roomid);

  if (isLoading) {
    return <div>Loading...</div>; // You can replace this with a loading spinner or some similar component
  }

  if (error) {
    return <div>Something went wrong: {error.message}</div>; // You can replace this with an error component
  }

  if(!room) return null;

  const isReadyView = room.cycle === -1;
  const isWaitingView = room.cycle === 0;
  const isFinishView = room.status === "done";
  const isRoomView = room.cycle !== 0 && room.cycle !== -1 && room.status !== "done";

  return (
    <SocketContext.Provider value={socket}>
      {isReadyView && (
        <ReadyView teamid={teamid} roomid={roomid} />
      )}
  
      {isWaitingView && (
        <>
          <div>timer: {timer}</div>
          <WaitingView roomid={roomid} />
        </>
      )}
  
      {isFinishView && <FinishView roomid={roomid} />}
  
      {isRoomView && (
        <div>
          <div>timer: {timer}</div>
          <RoomInfo roomid={roomid} />
          <TeamView teamid={teamid} roomid={roomid} />
        </div>
      )}
    </SocketContext.Provider>
  );
}
