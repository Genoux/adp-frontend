"use client"

import { useState, useEffect } from "react";
import supabase from "@/app/services/supabase";
import Image from "next/image";
import ReadyView from "@/app/components/ReadyView";
import useSocket from "@/app/hooks/useSocket";
import useFetchTeam from "@/app/hooks/useFetchTeam";
import { roomStore } from "@/app/stores/roomStore";
import { switchTurnAndUpdateCycle } from "../utils/roomCycle";

interface TeamViewProps {
  teamid: string;
  roomid: string;
  selectedChampion: string;
  setSelectedChampion: (championName: string) => void;
  //handleConfirmSelection: () => Promise<void>;
}

const TeamView: React.FC<TeamViewProps> = ({
  teamid,
  roomid,
//  handleConfirmSelection,
  selectedChampion,
  setSelectedChampion,
}) => {

  const socket = useSocket(roomid, teamid);
  const { rooms } = roomStore();
  const room = rooms[roomid];

  const [canPick, setCanPick] = useState<boolean>(true);

  const { data: team, error, isLoading } = useFetchTeam(teamid);
  if(!team) return null;

  const handleChampionClick = (championName: string) => {
    setSelectedChampion(championName);
  };

  const handleConfirmSelection = async () => {
    
    setCanPick(false)

    socket?.emit("STOP_TIMER", {
      roomid: roomid,
    });

    const champion = selectedChampion

    setSelectedChampion("");
    
    let updated_heroes_pool = team.heroes_pool.map((hero: any) =>
      hero.name === champion
        ? { ...hero, selected: true }
        : hero
    );

    await supabase.from('teams').update({ heroes_pool: updated_heroes_pool, pick: true }).eq('id', teamid);

    socket?.emit("SELECT_CHAMPION", {
      roomid: roomid,
      selectedChampion: champion,
    });

    if(!socket) return;

   // await switchTurnAndUpdateCycle(roomid);
  //  try {
  //   const response1 = await fetch(`/api/roomcycle/`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       roomid: roomid,
  //     }),
  //   });

  //   const data1 = await response1.json();
  //   console.log("First fetch is done!");

  //   // Run the second fetch
  //   const response2 = await fetch(`/api/switchteam/`, {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //     },
  //     body: JSON.stringify({
  //       roomid: roomid,
  //       roomCycle: data1.cycle,
  //     }),
  //   });

  //   const data2 = await response2.json();
  //   console.log("Second fetch is done!");
 
  //   socket?.emit("RESET_TIMER", {
  //     roomid: roomid,
  //   });
  //   console.log("Timer reset!");

  // } catch (error) {
  //   // Handle any errors that occurred during the fetch calls
  //   console.error("An error occurred:", error);
  // }
    setTimeout(() => {
      setCanPick(true)
    }, 500);
  };

  const handleReadyClick = async () => {
    const { data: team } = await supabase.from('teams').update({ ready: true }).select("*, room(*)").eq('id', teamid).single();
    socket?.emit("TEAM_READY", { roomid, teamid });
    team.ready = true;
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!room.ready || room.cycle === -1) {
    return (
      <>
        <p>{team.ready}</p>
        <ReadyView onReadyClick={handleReadyClick} />
      </>
    );
  }

  return (
    <>
      <p>{canPick.toString()}</p>
      <button
        className={`${
          !selectedChampion || !team.isTurn || !canPick ? "invisible" : "bg-blue-500"
        } text-white font-bold py-2 px-4 mt-4`}
        onClick={handleConfirmSelection}
        disabled={!selectedChampion || !team.isTurn }>
        Confirm Selection
      </button>
      <div className="grid grid-cols-5 gap-4">
        <h1 className="text-2xl mb-4">Team Color: {team.color}</h1>
        <h2 className="text-xl mb-4">
          {String(team.isTurn)}
          {team.isTurn
            ? "It's your turn!"
            : "Waiting for the other team..."}
        </h2>
        {team.heroes_pool.map((hero: any, index: number) => (
          <div
            key={index}
            className={`border p-4 ${
              hero.name === selectedChampion ? "bg-gray-800" : ""
            } ${
              (hero.selected || !team.isTurn) || !canPick
                ? "opacity-25 pointer-events-none"
                : ""
            }`}
            onClick={() => handleChampionClick(hero.name)}>
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
    </>
  );
};

export default TeamView;
