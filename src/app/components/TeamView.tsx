import { useState, useEffect, useCallback, useContext } from "react";
import supabase from "@/app/services/supabase";
import Image from "next/image";
import clsx from 'clsx';
import useFetchTeam from "@/app/hooks/useFetchTeam";
import { roomStore } from "@/app/stores/roomStore";
import SocketContext from "../context/SocketContext";

interface TeamViewProps {
  teamid: string;
  roomid: string;
}

const TeamView: React.FC<TeamViewProps> = ({ teamid, roomid }) => {
  const { rooms } = roomStore();
  const room = rooms[roomid];
  const [selectedChampion, setSelectedChampion] = useState<string>("");
  const [canSelect, setCanSelect] = useState(true);

  const socket = useContext(SocketContext);

  const handleSocketEvents = useCallback(
    (event: string, msg: any) => {
      console.log(`${event} - msg:`, msg);
      setCanSelect(event !== 'TIMER' || msg !== '00:00:00');
    },
    []
  );

  useEffect(() => {
    const events = ['TIMER', 'CHAMPION_SELECTED', 'TIMER_RESET'];
    
    events.forEach(event => {
      socket?.on(event, (msg: any) => handleSocketEvents(event, msg));
    });

    return () => {
      events.forEach(event => {
        socket?.off(event, handleSocketEvents);
      });
    };
  }, [socket, handleSocketEvents]);

  const handleConfirmSelection = async () => {
    setCanSelect(false);
    socket?.emit("STOP_TIMER", { roomid: roomid });
    const champion = selectedChampion;
    let updated_heroes_pool = team?.heroes_pool.map((hero: any) =>
      hero.name === champion ? { ...hero, selected: true } : hero
    );
    await supabase
      .from("teams")
      .update({ heroes_pool: updated_heroes_pool, pick: true })
      .eq("id", teamid);
    socket?.emit("SELECT_CHAMPION", {
      roomid: roomid,
      selectedChampion: champion,
    });
    setSelectedChampion("");
  };

  const { data: team } = useFetchTeam(teamid);
  
  useEffect(() => {
    setCanSelect(team?.isTurn)
  }, [team?.isTurn])
  
  if (!team) return null;

  return (
    <>
      <p>CAN SELECT: {canSelect?.toString()}</p>
      <p>TURN: { team.isTurn.toString() }</p>
      <button
        className={clsx("text-white font-bold py-2 px-4 mt-4", {
          "bg-slate-600 text-gray-400 pointer-events-none": !selectedChampion || !canSelect || !team.isTurn,
          "bg-blue-500": selectedChampion && canSelect && team.isTurn
        })}
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
            className={clsx("border p-4 transition ease-in-out", {
              "bg-gray-800": hero.name === selectedChampion,
              "opacity-25 pointer-events-none": hero.selected || !team.isTurn
            })}
            onClick={() => {
              if (canSelect) {
                setSelectedChampion(hero.name);
              }
            }}>
            <Image
              src={`/images/champions/tiles/${hero.name.replace(/\s/g, "").toLowerCase()}.jpg`}
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
