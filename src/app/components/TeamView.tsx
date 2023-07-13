import { useState, useEffect, useCallback, useContext, use } from "react";
import supabase from "@/app/services/supabase";
import { Database } from "@/app/types/supabase";
import clsx from "clsx";
import useFetchTeam from "@/app/hooks/useFetchTeam";
import SocketContext from "../context/SocketContext";
import { Button } from "@/app/components/ui/button";
import Timer from "@/app/components/Timer";
import TeamContext from "@/app/context/TeamContext";

import RoomContext from "@/app/context/RoomContext";
import useEnsureContext from "@/app/hooks/useEnsureContext";
import HeroPool from "@/app/components/HeroPool";
//import { ConfirmButton } from "@/app/components/ConfirmButton";

interface TeamViewProps {
  roomid: string;
}

type Team = Database["public"]["Tables"]["teams"]["Row"];

function getOppositeColor(color: string) {
  if (color.toLowerCase() === "red") {
    return "blue";
  } else if (color.toLowerCase() === "blue") {
    return "red";
  } else {
    return "Unknown color"; // or you may throw an error here
  }
}

const TeamView = () => {
  const [selectedChampion, setSelectedChampion] = useState<string>("");
  const [canSelect, setCanSelect] = useState(true);
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [clickedHero, setClickedHero] = useState<string | null>(null);

  const socket = useContext(SocketContext);
  const team = useEnsureContext(TeamContext);
  const room = useEnsureContext(RoomContext);

  useEffect(() => {
    if (socket) {
      socket.on("CHAMPION_SELECTED", (data) => {
        console.log("socket.on - data:", data);
        // handle the data here
        setCanSelect(true);
        setSelectedChampion("");
        setClickedHero(null);
      });

      // Clean up
      return () => {
        socket.off("CHAMPION_SELECTED");
      };
    }
  }, [socket]); // Make sure to include socket in the dependency array



  const handleConfirmSelection = async () => {
    if (!team || !Array.isArray(team.heroes_pool)) return null;

    setCanSelect(false);
    socket?.emit("STOP_TIMER", { roomid: room.id });

    const champion = selectedChampion;

    // let updated_heroes_pool = team.heroes_pool?.map((hero: any) =>
    //   hero.name === champion ? { ...hero, selected: true } : hero
    // );

    // await supabase
    //   .from("teams")
    //   .update({ heroes_pool: updated_heroes_pool, pick: true })
    //   .eq("id", team.id);

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
    if(team.isTurn) {
      setCanSelect(true);
    }
  }, [team.isTurn]);

  if (!team) return null;

  return (
    <>
    <p>can select: {canSelect.toString()}</p>
      <p>is turn: {team?.isTurn?.toString()}</p>
      <TeamHeader team={team} />
      <Timer />
      <HeroPool
        team={team}
        selectedChampion={selectedChampion}
        canSelect={canSelect}
        handleClickedHero={handleClickedHero}
        setHoverIndex={setHoverIndex}
        hoverIndex={hoverIndex}
      />
      <ConfirmButton
        team={team}
        selectedChampion={selectedChampion}
        canSelect={canSelect}
        handleConfirmSelection={handleConfirmSelection}
      />
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

const ConfirmButton = ({
  team,
  selectedChampion,
  canSelect,
  handleConfirmSelection,
}: {
  team: Team;
  selectedChampion: string;
  canSelect: boolean;
  handleConfirmSelection: () => void;
}) => {
  return (
    <div className="py-10">
      {team.isTurn ? (
        <Button
          size="lg"
          className={clsx("py-2 px-4", {
            "pointer-events-none": !selectedChampion || !canSelect,
          })}
          onClick={handleConfirmSelection}
          disabled={!selectedChampion || !canSelect}>
          Confirm Selection
        </Button>
      ) : (
        <Button
          variant="ghost"
          size="lg"
          className={clsx({
            "pointer-events-none":
              !selectedChampion || !canSelect || !team.isTurn,
          })}>
          <p className="pr-0.5 text-xl">{`It's ${getOppositeColor(
            team.color?.toLowerCase() || ""
          )} team to pick`}</p>
          <div className="sending-animation">
            <span className="sending-animation-dot">.</span>
            <span className="sending-animation-dot">.</span>
            <span className="sending-animation-dot">.</span>
          </div>
        </Button>
      )}
    </div>
  );
};

export default TeamView;
