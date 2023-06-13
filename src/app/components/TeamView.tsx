"use client";

import { useState, useEffect, useCallback, useContext } from "react";
import supabase from "@/app/services/supabase";
import Image from "next/image";
import useFetchTeam from "@/app/hooks/useFetchTeam";
import { roomStore } from "@/app/stores/roomStore";
import SocketContext from "../contexts/SocketContext"; // Import your SocketContext


interface TeamViewProps {
  teamid: string;
  roomid: string;
}

const TeamView: React.FC<TeamViewProps> = ({ teamid, roomid }) => {
  const { rooms } = roomStore();
  const room = rooms[roomid];
  const [selectedChampion, setSelectedChampion] = useState<string>("");
  const [canSelect, setCanSelect] = useState(true); // Add this line. Assuming you start with canSelect as true.

  const socket = useContext(SocketContext); // Get socket from context

  const handleSocketTimer = useCallback(
    (msg: any) => {
      if (msg === "00:00:00") {
        console.log("msg:", msg);
        setSelectedChampion("");
        setCanSelect(false); // When timer is 0, canSelect becomes false
      } else {
          //setCanSelect(true);
         // When timer is not 0, canSelect becomes true  
      }
    },
    [setSelectedChampion]
  );

  useEffect(() => {
    // if the 'TIMER' event is emitted, the handleSocketTimer function will be called
    socket?.on('TIMER', handleSocketTimer);
  
    // Clean up the event listener
    return () => {
      socket?.off('TIMER', handleSocketTimer);
    };
  }, [socket, handleSocketTimer]);


  useEffect(() => {
    const handleChampionSelected = (msg: boolean) => {
      setCanSelect(true);
    };

    socket?.on('CHAMPION_SELECTED', handleChampionSelected);

    // Clean up the event listener
    return () => {
      socket?.off('CHAMPION_SELECTED', handleChampionSelected);
    };
  }, [setCanSelect, socket]); // Add socket to the dependency array

  const { data: team, isLoading } = useFetchTeam(teamid);

  if (!team) return null;

  const handleConfirmSelection = async () => {
    setCanSelect(false);

    socket?.emit("STOP_TIMER", {
      roomid: roomid,
    });

    const champion = selectedChampion;

    setSelectedChampion("");

    // let updated_heroes_pool = team.heroes_pool.map((hero: any) =>
    //   hero.name === champion ? { ...hero, selected: true } : hero
    // );

    // await supabase
    //   .from("teams")
    //   .update({ heroes_pool: updated_heroes_pool, pick: true })
    //   .eq("id", teamid);

    socket?.emit("SELECT_CHAMPION", {
      roomid: roomid,
      selectedChampion: champion,
    });
  };


  return (
    <>
      <p>CAN SELECT: {canSelect.toString()}</p>
      <button
        className={`${
          !selectedChampion || !canSelect || !team.isTurn
            ? "bg-slate-600 text-gray-400 pointer-events-none"
            : "bg-blue-500"
        } text-white font-bold py-2 px-4 mt-4`}
        onClick={handleConfirmSelection}
        disabled={!selectedChampion || !team.isTurn}>
        Confirm Selection
      </button>
      <div className="grid grid-cols-5 gap-4">
        <h1 className="text-2xl mb-4">Team Color: {team.color}</h1>
        <h2 className="text-xl mb-4">
          {String(team.isTurn)}
          {team.isTurn ? "It's your turn!" : "Waiting for the other team..."}
        </h2>
        {team.heroes_pool.map((hero: any, index: number) => (
          <div
            key={index}
            className={`border p-4 ${
              hero.name === selectedChampion ? "bg-gray-800" : ""
            } ${
              hero.selected || !team.isTurn
                ? "opacity-25 pointer-events-none"
                : ""
            }`}
            onClick={() => {
              if (canSelect) {
                setSelectedChampion(hero.name);
              }
            }}>
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
