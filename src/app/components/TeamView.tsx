import { useState, useEffect, useContext } from "react";
import supabase from "@/app/services/supabase";
import { Database } from "@/app/types/supabase";
import SocketContext from "../context/SocketContext";
import Timer from "@/app/components/Timer";
import TeamContext from "@/app/context/TeamContext";
import RoomContext from "@/app/context/RoomContext";
import useEnsureContext from "@/app/hooks/useEnsureContext";
import HeroPool from "@/app/components/HeroPool";
import ConfirmButton from "@/app/components/ConfirmButton";

type Team = Database["public"]["Tables"]["teams"]["Row"];
type Room = Database["public"]["Tables"]["rooms"]["Row"];

const TeamView = () => {
  const [selectedChampion, setSelectedChampion] = useState<string>("");
  const [canSelect, setCanSelect] = useState(true);
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [clickedHero, setClickedHero] = useState<string | null>(null);

  const socket = useContext(SocketContext);
  const team = useEnsureContext(TeamContext);
  const room = useEnsureContext(RoomContext) as Room;

  useEffect(() => {
    if (socket) {
      socket.on("CHAMPION_SELECTED", (data) => {
        console.log("socket.on - data:", data);

        setCanSelect(true);
        setSelectedChampion("");
        setClickedHero(null);
      });

      // Clean up
      return () => {
        socket.off("CHAMPION_SELECTED");
      };
    }
  }, [socket]);

  const handleConfirmSelection = async () => {
    setCanSelect(false);
    socket?.emit("STOP_TIMER", { roomid: room.id });

    const champion = selectedChampion;

    // if (room.phase === "ban") {
    //   socket?.emit("BAN_CHAMPION", {
    //     roomid: room.id,
    //     selectedChampion: champion,
    //   });
    //   return;
    // }

    socket?.emit("SELECT_CHAMPION", {
      roomid: room.id,
      selectedChampion: champion,
    });
  };

  const handleClickedHero = async (hero: any) => {
    if (!team) return null;

    setClickedHero(hero.name);

    await supabase
      .from("teams")
      .update({ clicked_hero: hero.name })
      .eq("id", team.id);
  };

  useEffect(() => {
    if (team) {
      setClickedHero(team.clicked_hero);
      setSelectedChampion(team.clicked_hero || "");
    }
  }, [team]);

  useEffect(() => {
    if (team.isTurn) {
      setCanSelect(true);
    }
  }, [team.isTurn]);

  if (!team) return null;

  return (
    <>
      <div className={
        `w-full top-0 rounded-sm  z-50 mb-4 text-center uppercase font-medium py-1 ${
          team.color === 'blue' ? 'top-0  bg-blue-700' : 'right-0 bg-red-500'
        }`
      }>
       <p> {team.name}</p>
      </div>
  
      <Timer />
      <HeroPool
        team={team}
        selectedChampion={selectedChampion}
        canSelect={canSelect}
        handleClickedHero={handleClickedHero}
        setHoverIndex={setHoverIndex}
        hoverIndex={hoverIndex}
      />
      <div className="flex justify-center">
        <ConfirmButton
          team={team}
          selectedChampion={selectedChampion}
          canSelect={canSelect}
          handleConfirmSelection={handleConfirmSelection}
        />
      </div>
    </>
  );
  
};

const TeamHeader = ({ team }: { team: Team }) => {
  return (
    <div className="flex mb-6 gap-6">
      <div
        className={` z-0 top-0 h-6 w-1/2 left-0 bg-blue-500 ${
          team.isTurn
            ? team.color === "blue"
              ? "opacity-100"
              : "opacity-25"
            : team.color === "red"
            ? "opacity-100"
            : "opacity-25"
        }`}></div>
      <div
        className={` top-0 h-6 w-1/2 right-0 bg-red-500 ${
          team.isTurn
            ? team.color === "red"
              ? "opacity-100"
              : "opacity-25"
            : team.color === "blue"
            ? "opacity-100"
            : "opacity-25"
        }`}></div>
    </div>
  );
};

export default TeamView;
