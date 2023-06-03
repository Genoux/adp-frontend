"use client";

import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import supabase from "@/app/services/supabase";
import Image from 'next/image';
// Create a single supabase client for interacting with your database

export default function Room({
  params,
}: {
  params: { roomid: string; teamid: string };
}) {
  const roomid = params.roomid;
  const teamid = params.teamid;
  const [socket, setSocket] = useState<Socket | null>(null);
  const [roomNotFound, setRoomNotFound] = useState(false);
  const [loading, setLoading] = useState(true);

  const [team, setTeam] = useState<any>(null);
  const [room, setRoom] = useState<any>(null);
  const [highlightedChampion, setHighlightedChampion] = useState<string>("");
  const [selectedChampion, setSelectedChampion] = useState<string>("");

  
  const handleChampionClick = (championName: string) => {
    console.log("handleChampionClick - championName:", championName);
    setSelectedChampion(championName);
  };

  //TODO - handle random selection
  const handleConfirmSelection = async () => {
    if (!selectedChampion) return;
    const { data: team } = await supabase
      .from("teams")
      .select("id, heroes_pool, number_of_pick, heroes_selected")
      .eq("room", roomid)
      .eq("isTurn", true)
      .single();
  
    if (!team) return;
  
    const { heroes_pool, heroes_selected } = team;
  
    let hero;
    if (selectedChampion) {
      hero = heroes_pool.find((hero: any) => hero.name === selectedChampion);
    } else {
      const unselectedHeroes = heroes_pool.filter((hero: any) => !hero.selected);
      if (unselectedHeroes.length === 0) throw new Error("No unselected heroes left");
      hero = unselectedHeroes[Math.floor(Math.random() * unselectedHeroes.length)];
    }
  
    hero.selected = true;
  
    const nullSlotIndex = heroes_selected.findIndex((hero: any) => hero.name === null);
    if (nullSlotIndex !== -1) {
      heroes_selected[nullSlotIndex] = hero;
    }
  
    const updatedHeroesPool = heroes_pool.map((hero: any) =>
      hero.name === selectedChampion ? { ...hero, selected: true } : hero
    );
  
    await Promise.all([
      supabase
        .from("teams")
        .update({ heroes_selected })
        .eq("id", team.id),
      supabase
        .from("teams")
        .update({ heroes_pool: updatedHeroesPool })
        .eq("room", roomid),
      supabase
        .from("teams")
        .update({ selected_hero: null })
        .eq("id", team.id),
      supabase
        .from("teams")
        .update({ number_of_pick: team.number_of_pick - 1 })
        .eq("id", team.id)
    ]);
  
    setSelectedChampion("");
  };
  
  useEffect(() => {
    if (roomid) {
      const newSocket = io("http://localhost:4000", {
        query: { room: roomid },
      });
      setSocket(newSocket);

      newSocket.on("connect", async () => {
        console.log(`Connected to room ${roomid}`);
        // Join the room
        newSocket.emit("joinRoom", roomid, teamid);

        const { data: teamData, error } = await supabase
          .from("teams")
          .select("*")
          .eq("id", teamid)
          .single();
        const { data: roomData, error: roomError } = await supabase
          .from("rooms")
          .select('*, red("*"), blue("*")')
          .eq("id", roomid)
          .single();

        if (error || !teamData || roomError || !roomData) {
          console.error("Error fetching data:", error);
          setRoomNotFound(true);
        } else {
          setLoading(false);
          setTeam(teamData);
          setRoom(roomData);
        }
      });

      newSocket.on("welcome", (arg: any) => {
        console.log("Server says:", arg);
      });

      return () => {
        newSocket.disconnect();
        setSocket(null);
      };
    }
  }, [roomid, teamid]);

  // Handle rendering
  if (loading) {
    return <p>Loading...</p>;
  }

  if (roomNotFound) {
    return <h1>404 - Page Not Found</h1>;
  }

  if (room.cycle === 0) {
    return <h1>waiting</h1>;
  }


  return (
    <div>
      <p>{room.cycle}</p>
      <h1>Room ID: {room?.id}</h1>
      <h1>Team ID: {team?.id}</h1>
      <pre>{team?.color}</pre>
      <pre>{team?.isTurn.toString()}</pre>

      <div className="flex my-24 gap-12 justify-center">
        <div>
          <h2>Red Team Selected Heroes:</h2>
          <div className="grid grid-cols-5 gap-4 mt-6">
            {room?.red?.heroes_selected?.map((hero: any, index: number) => (
              <div key={index} className="border p-4">
                <pre>Name: {hero.name}</pre>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h2>Blue Team Selected Heroes:</h2>
          <div className="grid grid-cols-5 gap-4 mt-6">
            {room?.blue?.heroes_selected?.map((hero: any, index: number) => (
              <div key={index} className="border p-4">
                <pre>Name: {hero.name}</pre>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {team?.heroes_pool?.map((hero: any, index: number) => (
          <div
            key={index}
            className={`border p-4 ${
              hero.name === selectedChampion ? "bg-red-500" : ""
            }`}
            onClick={() => handleChampionClick(hero.name)}
          >
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

      <button
        className={`${ !selectedChampion ? "invisible" : "bg-blue-500"}  text-white font-bold py-2 px-4 mt-4`}
        onClick={handleConfirmSelection}
        disabled={!selectedChampion}
      >
        Confirm Selection
      </button>
    </div>
  );
}
