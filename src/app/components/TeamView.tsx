// imports
import { useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import supabase from "@/app/services/supabase";
import Image from 'next/image';


interface TeamViewProps {
  teamid: string; // Replace with your specific type
  selectedChampion: string;
  setSelectedChampion: (championName: string) => void;
  handleConfirmSelection: () => Promise<void>;
}


const TeamView: React.FC<TeamViewProps> = ({ teamid, handleConfirmSelection, selectedChampion, setSelectedChampion }) => {
  const [team, setTeam] = useState<any>(null);

  useEffect(() => {
    const setData = async () => {
      const { data: teamData, error } = await supabase
      .from("teams")
      .select("*")
      .eq("id", teamid)
      .single();
      
      setTeam(teamData);
    }
    setData();
  }, [teamid]);

  const handleChampionClick = (championName: string) => {
    console.log("handleChampionClick - championName:", championName);
    setSelectedChampion(championName);
  };

  return (
    <div className="grid grid-cols-5 gap-4">
      {team?.heroes_pool?.map((hero: any, index: number) => (
        <div
          key={index}
          className={`border p-4 ${ hero.name === selectedChampion ? "bg-gray-800" : ""} ${hero.selected ? "opacity-25 pointer-events-none" : ""}`}
          onClick={() => handleChampionClick(hero.name)}
        >
          <Image
            src={`/images/champions/tiles/${hero.name.replace(/\s/g, "").toLowerCase()}.jpg`}
            alt={hero.name}
            width={60}
            height={60}
          />
          <pre>{hero.name}</pre>
        </div>
      ))}
      <button
        className={`${ !selectedChampion ? "invisible" : "bg-blue-500"}  text-white font-bold py-2 px-4 mt-4`}
        onClick={handleConfirmSelection}
        disabled={!selectedChampion}
      >
        Confirm Selection
      </button>
    </div>
  );
};

export default TeamView;