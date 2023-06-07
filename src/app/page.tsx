"use client";

import Image from "next/image";
import { useState } from "react";
import supabase from "@/app/services/supabase";
import { randomChampions } from "@/app/utils/champions";
import { generateArray, purgeAllRooms } from "@/app/utils/helpers";
import Link from "next/link";

interface Room {
  id: number;
  name: string;
  blue: number;
  red: number;
  status: string;
  [key: string]: any;
}

function Home() {
  const [roomData, setRoomData] = useState<Room[] | null>(null);

  const createRoom = async () => {

    //TODO remove this
    //const purge = await purgeAllRooms();
   // console.log("createRoom - purge:", purge);

    const champions = await randomChampions();

    const teamRedId = Math.floor(Math.random() * 1000000);
    const teamBlueId = Math.floor(Math.random() * 1000000);
    const roomID = Math.floor(Math.random() * 1000000);
    const roomName = Math.random().toString(36).substring(7);
    try {
      const { red, redError } = await supabase.from("teams").insert({
        id: teamRedId,
        color: "red",
        isTurn: false,
        heroes_pool: champions.list,
        heroes_selected: generateArray("name", 5),
        number_of_pick: 1,
      });

      const { blue, blueError } = await supabase.from("teams").insert({
        id: teamBlueId,
        color: "blue",
        isTurn: true,
        heroes_pool: champions.list,
        heroes_selected: generateArray("name", 5),
        number_of_pick: 1,
      });

      const { room: newRoom, roomError } = await supabase.from("rooms").insert({
        id: roomID,
        name: roomName,
        blue: teamBlueId,
        red: teamRedId,
        status: "waiting",
      });
      
      //todo room are not assigned to the teams - fix it
      // for each team, update the room id
      await supabase
        .from("teams")
        .update({
          room: roomID,
        })
        .eq("id", teamRedId);

      await supabase
        .from("teams")
        .update({
          room: roomID,
        })
        .eq("id", teamBlueId);

      if (redError || blueError || roomError) {
        console.log("createRoom - error:", redError, blueError, roomError);
        return;
      }

      const { data: rooms, error } = await supabase
        .from("rooms")
        .select("id, name, blue, red")
        .eq("id", roomID);
      if (error) {
        console.log("createRoom - error:", error);
        return;
      }

      setRoomData(rooms); // Update the room state with the fetched room ID
    } catch (error) {
      console.log("createRoom - error:", error);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        {roomData ? (
          roomData.map((room, index) => (
            <div key={index}>
              <p>ID: {room.id}</p>
              <p>Name: {room.name}</p>
              <p>
                Blue:
                <Link href={`/room/${room.id}/${room.blue}`} target="_blank">
                  {room.blue}
                </Link>
              </p>
              <p>
                Red:
                <Link href={`/room/${room.id}/${room.red}`} target="_blank">
                  {room.red}
                </Link>
              </p>
              <p>Status: {room.status}</p>
            </div>
          ))
        ) : (
          <button onClick={createRoom}>Click me</button>
        )}
      </div>
    </main>
  );
}

export default Home;
