"use client";

import { useState, useCallback  } from "react";
import RoomInfo from "@/app/components/RoomInfo";
import TeamView from "@/app/components/TeamView";
import FinishView from "@/app/components/FinishView";
import useSocket from "@/app/hooks/useSocket";
import WaitingView from "@/app/components/WaitingView";
import useFetchRoom from "@/app/hooks/useFetchRoom";

export default function Room({
  params,
}: {
  params: { roomid: string; teamid: string };
}) {
  const roomid = params.roomid;
  const teamid = params.teamid;
  const [selectedChampion, setSelectedChampion] = useState<string>("");
  const [timer, setTimer] = useState<string>("");

  const handleSocketMessage = useCallback((msg: any) => {
    console.log("handleSocketMessage - msg:", msg);
  }, []);

  const handleSocketTimer = useCallback((msg: any) => {
    setTimer(msg);
    if(msg === "00:00:00") {
      setSelectedChampion("");
    }
  }, []);

  const socket = useSocket(roomid, teamid, {
    onMessage: handleSocketMessage,
    onTimer: handleSocketTimer
  });

  const { data: room, error, isLoading } = useFetchRoom(roomid);
  if(!room) return null;

  const handleConfirmSelection = async () => {
    socket?.emit("SELECT_CHAMPION", {
      roomid: roomid,
      selectedChampion: selectedChampion,
    });
    setSelectedChampion("");
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (room.cycle === 0) {
    return (
      <>
        <div> timer: {timer.toString()} </div>
        <WaitingView roomid={roomid} />
      </>
    );
  }

  if (room.status === "done") {
    return <FinishView roomid={roomid} />;
  }

  return (
    <>
      {room.cycle !== 0 && (
        <div>
          <div> timer: {timer.toString()} </div>
          <RoomInfo roomid={roomid} />
          <TeamView
            teamid={teamid}
            roomid={roomid}
            handleConfirmSelection={handleConfirmSelection}
            setSelectedChampion={setSelectedChampion}
            selectedChampion={selectedChampion}
          />
        </div>
      )}
    </>
  );
}
