// imports
import { use, useEffect, useState } from "react";
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

  const [team, setTeam] = useState<any>(null);
  const [isTurn, setIsTurn] = useState<boolean>(false);
  const [isTeamReady, setisTeamReady] = useState<boolean>(false);
  //const [roomReady, setRoomReady] = useState<boolean>(false);
  const [heroesPool, setHeroesPool] = useState<Array<any>>([]);
  const [champions, setChampions] = useState<any>(null);
  const [teamRoom, setTeamRoom] = useState<string | null>(null);

  const roomReady = roomStore((state: { roomReady: { [x: string]: any; }; }) => state.roomReady[roomid] || false);
  console.log("roomReady:", roomReady);

  const socket = useSocket(team?.room, teamid);

  useEffect(() => {
    if (socket) {
      console.log("useEffect - socket:", socket);
      //socket.on('ROOM_READY', () => setRoomReady(true));
    }
   
  }, [socket]);

// When you fetch the team data, also update heroesPool and teamRoom
useEffect(() => {
  const setData = async () => {
    const { data: team, error } = await supabase
      .from("teams")
      .select("*")
      .eq("id", teamid)
      .single();
    console.log("setData - team:", team);

    setTeam(team);
    setIsTurn(team.isTurn);
    setHeroesPool(team ? team.heroes_pool : []);
    setTeamRoom(team ? team.room : null);


  };

  const fetchData = async () => {
    await setData();
  };

  fetchData();
}, [teamid]);

  useEffect(() => {
    if (team && team.room) {
      const channel = supabase
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
            const { new: updatedTeam } = payload;
            setIsTurn(updatedTeam.isTurn);
            setHeroesPool(updatedTeam.heroes_pool);

            // When our team's ready state changes, check if both teams are ready
          }
        )
        .subscribe();

      return () => {
        // Unsubscribe from room updates when component unmounts
        channel.unsubscribe();
      };
    }
  },  [socket, team, teamid]);

  const handleChampionClick = (championName: string) => {
    setSelectedChampion(championName);
  };

  const handleReadyClick = async () => {
    // Your existing logic to mark the team as ready
    const { data: team } = await supabase.from('teams').update({ ready: true }).select("*, room(*)").eq('id', teamid).single();
    socket?.emit('TEAM_READY', { roomid: team.room.id });
    setisTeamReady(true);
  };

  if (!roomReady) {
    return (
      <>
        <p>{isTeamReady.toString()}</p>
        <ReadyView onReadyClick={handleReadyClick} team={team} />
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
        {team ? (
          <>
            <h1 className="text-2xl mb-4">Team Color: {team.color}</h1>
            <h2 className="text-xl mb-4">
              {String(isTurn)}
              {isTurn
                ? "It's your turn!"
                : "Waiting for the other team..."}
            </h2>
            {heroesPool.map((hero: any, index: number) => (
              <div
                key={index}
                className={`border p-4 ${
                  hero.name === selectedChampion ? "bg-gray-800" : ""
                } ${
                  hero.selected || !isTurn
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
          </>
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </>
  );
};

export default TeamView;
