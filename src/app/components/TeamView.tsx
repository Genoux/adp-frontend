// imports
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import supabase from "@/app/services/supabase";
import Image from "next/image";

interface TeamViewProps {
  teamid: string; // Replace with your specific type
  selectedChampion: string;
  setSelectedChampion: (championName: string) => void;
  handleConfirmSelection: () => Promise<void>;
}

const TeamView: React.FC<TeamViewProps> = ({
  teamid,
  handleConfirmSelection,
  selectedChampion,
  setSelectedChampion,
}) => {
  const [team, setTeam] = useState<any>(null);
  const [isTurn, setIsTurn] = useState<boolean>(false);
  const [heroesPool, setHeroesPool] = useState<Array<any>>([]);
  const [champions, setChampions] = useState<any>(null);
  const [teamRoom, setTeamRoom] = useState<string | null>(null);

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
          (payload) => {
            const { new: updatedTeam } = payload;
            setIsTurn(updatedTeam.isTurn);
            setHeroesPool(updatedTeam.heroes_pool);
          }
        )
        .subscribe();

      return () => {
        // Unsubscribe from room updates when component unmounts
        channel.unsubscribe();
      };
    }
  },  [team, teamid]);

  const handleChampionClick = (championName: string) => {
    setSelectedChampion(championName);
  };

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
