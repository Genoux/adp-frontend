import supabase from "@/app/services/supabase";
import Image from "next/image";
import ReadyView from "@/app/components/ReadyView";
import useSocket from "@/app/hooks/useSocket";
import useFetchTeam from "@/app/hooks/useFetchTeam";
import { roomStore } from "@/app/stores/roomStore";

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

  const { data: team, error, isLoading } = useFetchTeam(teamid);
  if(!team) return null;

  const handleChampionClick = (championName: string) => {
    setSelectedChampion(championName);
  };


  const handleConfirmSelection = async () => {
    socket?.emit("SELECT_CHAMPION", {
      roomid: roomid,
      selectedChampion: selectedChampion,
    });

    const champion = selectedChampion

    setSelectedChampion("");
    
    let updated_heroes_pool = team.heroes_pool.map((hero: any) =>
      hero.name === champion
        ? { ...hero, selected: true }
        : hero
    );

    await supabase.from('teams').update({ heroes_pool: updated_heroes_pool }).eq('id', teamid);
    
  };

  const updateTeamPool = async () => {
   
  }

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
      <button
        className={`${
          !selectedChampion || !team.isTurn ? "invisible" : "bg-blue-500"
        } text-white font-bold py-2 px-4 mt-4`}
        onClick={handleConfirmSelection}
        disabled={!selectedChampion || !team.isTurn}>
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
              hero.selected || !team.isTurn
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
