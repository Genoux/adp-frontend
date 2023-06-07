// imports
import { use, useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import supabase from "@/app/services/supabase";
import Image from "next/image";
import ReadyView from "@/app/components/ReadyView";
import useSocket from "@/app/hooks/useSocket";
import {roomStore} from "@/app/stores/roomStore";

interface TeamViewProps {
  teamid: string; // Replace with your specific type
  roomid: string;
  selectedChampion: string;
  setSelectedChampion: (championName: string) => void;
  handleConfirmSelection: () => Promise<void>;
}

const TeamView: React.FC<TeamViewProps> = ({
  teamid,
  roomid,
  handleConfirmSelection,
  selectedChampion,
  setSelectedChampion,
}) => {

  const [isTurn, setIsTurn] = useState<boolean>(false);
  const [isTeamReady, setIsTeamReady] = useState<boolean>(false);
  const [teamColor, setTeamColor] = useState<any>(null);
  const [heroesPool, setHeroesPool] = useState<Array<any>>([]);
  const socket = useSocket(roomid, teamid);
  const { rooms } = roomStore();
  const  room  = rooms[roomid]

// When you fetch the team data, also update heroesPool and teamRoom
useEffect(() => {
  const fetchTeam = async () => {
    const { data: team, error } = await supabase
      .from("teams")
      .select("*")
      .eq("id", teamid)
      .single();

    const subscription = supabase
      .channel(teamid)
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "teams",
          filter: `id=eq.${teamid}`,
        },
        async (payload) => {
          try {
            const { new: updatedTeam } = payload;
            console.log("updatedTeam:", updatedTeam);
            setIsTeamReady(updatedTeam.ready)
            setIsTurn(updatedTeam.isTurn);
            setHeroesPool(updatedTeam.heroes_pool);
          } catch (error) {
            console.error("Error updating team:", error);
          }
        }
      )
      .subscribe(() => {
        console.log(`Subscription to team ${teamid} ready.`);
      });

    setIsTeamReady(team.ready)
    setIsTurn(team.isTurn);
    setHeroesPool(team.heroes_pool);
    setTeamColor(team.color);
    // Cleanup: unsubscribe when component unmounts
    return () => {
      subscription.unsubscribe();
    };
  };

  fetchTeam();
}, [teamid]);

  const handleChampionClick = (championName: string) => {
    setSelectedChampion(championName);
  };

  const handleReadyClick = async () => {
    // Your existing logic to mark the team as ready
    const { data: team } = await supabase.from('teams').update({ ready: true }).select("*, room(*)").eq('id', teamid).single();
    socket?.emit('TEAM_READY', { roomid: team.room.id });
    setIsTeamReady(true);
  };

  if (!room.ready) {
    return (
      <>
        <p>{isTeamReady.toString()}</p>
        <ReadyView onReadyClick={handleReadyClick} />
      </>
    )
  }

  return (
    <>
      <button
        className={`${
          !selectedChampion ? "invisible" : "bg-blue-500"
        }  text-white font-bold py-2 px-4 mt-4`}
        onClick={handleConfirmSelection}
        disabled={!selectedChampion}>
        Confirm Selection
      </button>
      <div className="grid grid-cols-5 gap-4">
        <h1 className="text-2xl mb-4">Team Color: {teamColor}</h1>
        <h2 className="text-xl mb-4">
          {String(isTurn)}
          {isTurn ? "It's your turn!" : "Waiting for the other team..."}
        </h2>
        {heroesPool.map((hero: any, index: number) => (
          <div
            key={index}
            className={`border p-4 ${
              hero.name === selectedChampion ? "bg-gray-800" : ""
            } ${
              hero.selected || !isTurn ? "opacity-25 pointer-events-none" : ""
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
