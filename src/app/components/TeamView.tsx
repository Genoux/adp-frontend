import { useState, useEffect } from "react";
import supabase from "@/app/services/supabase";
import SocketContext from "../context/SocketContext";
import useEnsureContext from "@/app/hooks/useEnsureContext";
import Timer from "@/app/components/common/RoomTimer";
import HeroPool from "@/app/components/common/ChampionsPool";
import { Button } from "@/app/components/ui/button";
import { roomStore } from "@/app/stores/roomStore";
import { teamStore } from "@/app/stores/teamStore";
import useTeams from "@/app/hooks/useTeams";
import clsx from "clsx";
import Image from "next/image";

const TeamView = () => {
  const [selectedChampion, setSelectedChampion] = useState<string>("");
  const [canSelect, setCanSelect] = useState(true);
  const [clickedHero, setClickedHero] = useState<string | null>(null);

  const [fade, setFade] = useState(clickedHero !== null);


  const socket = useEnsureContext(SocketContext);

  const { room, error, isLoading } = roomStore(state => ({
    room: state.room,
    error: state.error,
    isLoading: state.isLoading
  }));

  const { current: team, other, blue, red } = useTeams(teamStore);
  const currentTeam = team.isTurn ? team : other;

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
    if (socket) {
      setCanSelect(false);
      socket?.emit("STOP_TIMER", { roomid: room?.id });

      const champion = selectedChampion;

      socket?.emit("SELECT_CHAMPION", {
        roomid: room?.id,
        selectedChampion: champion,
      });
    }
  };

  const handleClickedHero = async (hero: any) => {
    if (!team) return null;

    setFade(false); // Start the fade-out
    setTimeout(() => setFade(true), 500); // Trigger the fade-in

    setClickedHero(hero.name);

    await supabase
      .from("teams")
      .update({ clicked_hero: hero.name })
      .eq("id", team.id);
  };

  useEffect(() => {
    if (team) {
      setFade(true)
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
      <div className="absolute left-0 top-0 w-3/12 h-full -z-10">
        <Image
          src={`/images/champions/splash/${currentTeam.clicked_hero}.jpg`}
          width={1920}
          height={1080}
          alt={`${currentTeam.clicked_hero} splash`}
          className={`absolute z-10 w-full h-full object-cover object-center ${fade ? 'fade-in' : 'fade-out'}`}
        />
      </div>

      <div className="flex justify-between items-center mb-6">
        <div className={`flex flex-col items-center bg-blue text-md px-6 py-2 rounded-full font-bold`}>{blue.name.charAt(0).toUpperCase() + blue.name.slice(1)}</div>
        <div className="flex flex-col items-center">
          <p className="font-medium text-md mb-1">
            {`L'équipe ${currentTeam.name.charAt(0).toUpperCase() + currentTeam.name.slice(1)} entrain de choisir`}
          </p>
          <Timer />
        </div>
        <div className={`flex flex-col items-center bg-red text-md px-6 py-2 rounded-full font-bold`}>{red.name.charAt(0).toUpperCase() + red.name.slice(1)}</div>
      </div>
      <HeroPool
        team={team}
        selectedChampion={selectedChampion}
        canSelect={canSelect}
        clickedHero={clickedHero}
        handleClickedHero={handleClickedHero}
      />
      <div className="flex justify-center">
        {team.isTurn ? (
          <Button
            size="lg"
            className="bg-yellow hover:bg-yellow-hover rounded-sm"
            onClick={handleConfirmSelection}
            disabled={!selectedChampion || !canSelect || !team.isTurn}
          >
            {buttonText}
          </Button>
        ) : (
          <div>
            <span className="pr-0.5">{`It's ${other.color} team to pick`}</span>
            <div className="sending-animation">
              <span className="sending-animation-dot">.</span>
              <span className="sending-animation-dot">.</span>
              <span className="sending-animation-dot">.</span>
            </div>
          </div>
        )}
      </div>
    </>
  );

};

export default TeamView;
