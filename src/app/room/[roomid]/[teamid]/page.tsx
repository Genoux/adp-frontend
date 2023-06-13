"use client";

import { useState, useCallback } from "react";
import RoomInfo from "@/app/components/RoomInfo";
import TeamView from "@/app/components/TeamView";
import FinishView from "@/app/components/FinishView";
import useSocket from "@/app/hooks/useSocket";
import WaitingView from "@/app/components/WaitingView";
import useFetchRoom from "@/app/hooks/useFetchRoom";
import ReadyView from "@/app/components/ReadyView";

import SocketContext from '@/app/context/SocketContext';

export default function Room({
  params,
}: {
  params: { roomid: string; teamid: string };
}) {
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
  if(!room) return null;

  // const handleConfirmSelection = async () => {
  //   socket?.emit("SELECT_CHAMPION", {
  //     roomid: roomid,
  //     selectedChampion: selectedChampion,
  //   });

  //   setSelectedChampion("");
  // };

  return (
    <SocketContext.Provider value={socket}>
      {room.cycle === -1 && (
        <ReadyView teamid={teamid} roomid={roomid} />
      )}
  
      {room.cycle === 0 && (
        <>
          <div>timer: {timer}</div>
          <WaitingView roomid={roomid} />
        </>
      )}
  
      {room.status === "done" && <FinishView roomid={roomid} />}
  
      {room.cycle !== 0 && room.cycle !== -1 && room.status !== "done" && (
        <div>
          <div>timer: {timer}</div>
          <RoomInfo roomid={roomid} />
          <TeamView teamid={teamid} roomid={roomid} />
        </div>
      )}
    </SocketContext.Provider>
  );
  
}
