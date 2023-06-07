"use client";

import { useEffect, useState, useCallback, useRef } from "react";
import { io, Socket } from "socket.io-client";
import supabase from "@/app/services/supabase";
import RoomInfo from "@/app/components/RoomInfo";
import TeamView from "@/app/components/TeamView";
import ReadyView from "@/app/components/ReadyView";
import useSocket from "@/app/hooks/useSocket";
import { roomStore } from "@/app/stores/roomStore";
import { allNamesNotNull } from "@/app/utils/helpers";

export default function Room({
  params,
}: {
  params: { roomid: string; teamid: string };
}) {
  const roomid = useRef(params.roomid);
  const teamid = useRef(params.teamid);
  //const [room, setRoom] = useState<any>(null); // TODO: replace with your specific type
  const [roomNotFound, setRoomNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedChampion, setSelectedChampion] = useState<string>("");
  const [timer, setTimer] = useState<string>("");
  const [roomReady, SetRoomReady] = useState(false);

  const [roomState, setRoomState] = useState<any>(null);


  const socket = useSocket(roomid.current, teamid.current);
// Use the `setRoom` function from your store
  const { rooms, setRoom } = roomStore();
  const room = rooms[roomid.current];
  const [loadingRoom, setLoadingRoom] = useState(true);

  useEffect(() => {
    const findRoom = async () => {
      const { data: room, error } = await supabase
        .from("rooms")
        .select('*')
        .eq("id", roomid.current)
        .single();
    
      if (error || !room) {
        console.error("Error fetching data:", error);
      } else {
        setRoom(roomid.current, room);
        setLoadingRoom(false); 
      }
    }
    findRoom();
  }, [setRoom]);
  


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
  }, [socket, setTimer]);

  const handleConfirmSelection = async () => {
    socket?.emit('SELECT_CHAMPION', { roomid: roomid.current, selectedChampion: selectedChampion });
    setSelectedChampion("");
  };

  const debugTimer = async () => {
    socket?.emit('ROOM_READY', { roomid: roomid.current });

  };

  if (loadingRoom) {
    return <div>Loading...</div>; // Render a loading spinner while room data is being fetched
  }

  if (room.status === "done") {
    return <div>Room is done</div>; // Render a message if the room is done
  }

  return (
    <>
      <div> timer: {timer.toString()} </div>
      <button onClick={debugTimer}>start timer</button>
      <RoomInfo roomid={roomid.current} />
      <TeamView
        teamid={teamid.current}
        roomid={roomid.current}
        handleConfirmSelection={handleConfirmSelection}
        setSelectedChampion={setSelectedChampion}
        selectedChampion={selectedChampion}
      />
    </>
  );
}
