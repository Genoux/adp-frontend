import { useState, useEffect, useContext } from "react";
import supabase from "@/app/services/supabase";
import { Database } from "@/app/types/supabase";
import SocketContext from "../context/SocketContext";
import useEnsureContext from "@/app/hooks/useEnsureContext";
import Timer from "@/app/components/common/RoomTimer";
import HeroPool from "@/app/components/common/ChampionsPool";
import { Button } from "@/app/components/ui/button";
import { roomStore } from "@/app/stores/roomStore";
import { teamStore } from "@/app/stores/teamStore";
import useTeams from "@/app/hooks/useTeams";

const TeamView = () => {
  const [selectedChampion, setSelectedChampion] = useState<string>("");
  const [canSelect, setCanSelect] = useState(true);
  const [clickedHero, setClickedHero] = useState<string | null>(null);

  const socket = useEnsureContext(SocketContext);

  const { room, error, isLoading } = roomStore(state => ({
    room: state.room,
    error: state.error,
    isLoading: state.isLoading
  }));

  const { current: team, other } = useTeams(teamStore);

  useEffect(() => {
    socket.on("CHAMPION_SELECTED", (data) => {
      setCanSelect(true);
      setSelectedChampion("");
      setClickedHero(null);
    });

    // Clean up
    return () => {
      socket.off("CHAMPION_SELECTED");
    };
  }, [socket]);


  const handleConfirmSelection = async () => {
    setCanSelect(false);
    socket?.emit("STOP_TIMER", { roomid: room?.id });

    const champion = selectedChampion;

    socket?.emit("SELECT_CHAMPION", {
      roomid: room?.id,
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
    if (team?.isTurn) {
      setCanSelect(true);
    }
  }, [team?.isTurn]);

  const buttonText = team.isTurn
    ? "Confirm Selection"
    : `It's ${other.color} team to pick`;


  if (!team || error) {
    return <div>Team not found</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <>
      <div className={
        `w-full top-0 rounded-sm  z-50 mb-4 text-center uppercase font-medium py-1 ${team.color === 'blue' ? 'top-0  bg-blue-700' : 'right-0 bg-red-500'
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
      />
      <div className="flex justify-center">

        <Button
          size="lg"
          onClick={handleConfirmSelection}
          disabled={!selectedChampion || !canSelect || !team.isTurn}
        >
          {buttonText}
        </Button>
      </div>
    </>
  );

};

export default TeamView;
