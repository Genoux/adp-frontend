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
import Image from "next/image";

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
  //const [roomReady, SetRoomReady] = useState(false);

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
      socket.on("TIMER", (arg: any) => {
        if (arg === "00:00:00") {
          setSelectedChampion("");
        }
        setTimer(arg);
      });
    }
  }, [socket, setTimer]);

  useEffect(() => {
    console.log("useEffect - room.id:", roomid.current);

    const subscription = supabase
    .channel('*').on(
      'postgres_changes',
      {
        event: 'UPDATE',
        schema: 'public',
        table: 'rooms',
        filter: `id=eq.${roomid.current}`,
      },
      (payload) => {
        const { new: room } = payload;
        console.log("useEffect - room:", room);
        setRoom(roomid.current, room);
      })
      .subscribe(() => {
        console.log('Received event on channel public:rooms');
      })
  }, []);

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

  //TODO MAKE THIS A COMPONENT
  if (room.cycle === 0) {
    return (
      <main>
        <p>{room.cycle.toString()}</p>
         <div> timer: {timer.toString()} </div>
        <div className="grid grid-cols-6">
        {room.heroes_pool.map((hero: any, index: number) => (
          <div
            key={index}>
            <Image
              src={`/images/champions/tiles/${hero.name
                .replace(/\s/g, "")
                .toLowerCase()}.jpg`}
              alt={hero.name}
              width={60}
              height={60}
            />
            <pre>{hero.name}</pre>
          </div>
        ))}
        </div>
      </main>
    );
  }

  if (room.status === "done") {
    return <div>Room is done</div>; // Render a message if the room is done
  }

  return (
    <>
      <div> timer: {timer.toString()} </div>
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
