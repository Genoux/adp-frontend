"use client";

import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import supabase from "@/app/services/supabase";
import RoomInfo from "@/app/components/RoomInfo";
import TeamView from "@/app/components/TeamView";
import ReadyView from "@/app/components/ReadyView";
import useSocket from "@/app/hooks/useSocket";
import { allNamesNotNull } from "@/app/utils/helpers";

export default function Room({
  params,
}: {
  params: { roomid: string; teamid: string };
}) {
  const roomid = params.roomid;
  const teamid = params.teamid;
  const [roomNotFound, setRoomNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedChampion, setSelectedChampion] = useState<string>("");
  const [timer, setTimer] = useState<string>("");
  const [roomReady, SetRoomReady] = useState(false);

  const socket = useSocket(roomid, teamid);

  const findRoom = useCallback(async () => {
    
    const { data: room, error } = await supabase
      .from("rooms")
      .select('id')
      .eq("id", roomid)
      .single();
  
    if (error || !room) {
      console.error("Error fetching data:", error);
      setRoomNotFound(true);
    } else {
      setLoading(false);
    }
  }, [roomid]);

  useEffect(() => {
    if (socket) {
      socket.on("message", (arg: any) => {
        console.log("Server says:", arg);
      });
      socket.on("ROOM_READY", (arg: any) => {
        SetRoomReady(true);
      });
      socket.on("TIMER", (arg: any) => {
        console.log("socket.on - arg:", arg);
        if (arg === "00:00:00") {
          setSelectedChampion("");
        }
        setTimer(arg);
        console.log("Server says:", arg);
      });
    }
    findRoom();
  }, [findRoom, roomid, socket]);

  const handleConfirmSelection = async () => {
    socket?.emit('SELECT_CHAMPION', { roomid: roomid, selectedChampion: selectedChampion });
    setSelectedChampion("");
  };

  const debugTimer = async () => {
    socket?.emit('ROOM_READY', { roomid: roomid });

  };

  if (loading) {
    return <p className="font-bold">Loading room...</p>;
  }

  return (
    <div>
      {!roomNotFound && (
        <>
          <div> timer: {timer.toString()} </div>
          <button onClick={debugTimer}>start timer</button>
          <RoomInfo roomid={roomid} />
          <TeamView
            teamid={teamid}
            handleConfirmSelection={handleConfirmSelection}
            setSelectedChampion={setSelectedChampion}
            selectedChampion={selectedChampion}
          />
        </>
      )}
    </div>
  );
}
