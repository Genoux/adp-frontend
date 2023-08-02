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
  const [splashHero, setSplashHero] = useState<string | null>(null);
  const [transitionInProgress, setTransitionInProgress] = useState(false);
  const [fadeSplash, setFadeSplash] = useState(true);

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

  useEffect(() => {
    if (team) {
      setFadeSplash(false); // Start fade-out

      setSelectedChampion(team.clicked_hero || "");
      // Delay to allow the fade-out to complete
      setTimeout(() => {
        // setSplashHero(other.clicked_hero);
        setClickedHero(currentTeam.clicked_hero); // Update the splash image
        setFadeSplash(true); // Start fade-in
      }, 150); // 500ms matches the CSS transition duration
    }
  }, [currentTeam.clicked_hero, other.clicked_hero, team]);

  const handleClickedHero = async (hero: any) => {
    if (hero.name === team.clicked_hero) return null;
    if (!team || transitionInProgress) return null;

    // Indicate that a transition is in progress
    setTransitionInProgress(true);

    // Start the fade-out
    setFade(false);
    await supabase
      .from("teams")
      .update({ clicked_hero: hero.name })
      .eq("id", team.id);

    // Delay to allow the fade-out to complete
    await new Promise(resolve => setTimeout(resolve, 250)); // 500ms matches the CSS transition duration

    // Update the splash hero
    //  setSplashHero(hero.name);

    // Start the fade-in
    setFade(true);

    // Indicate that the transition is complete
    setTransitionInProgress(false);
  };

  // useEffect(() => {
  //   if (team) {
  //     setClickedHero(team.clicked_hero);
  //     setSelectedChampion(team.clicked_hero || "");
  //   }
  // }, [team]);

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
<div
  className={`absolute ${currentTeam.color === 'blue' ? 'left-0' : 'right-0'} top-0 w-3/12 h-full -z-10 ${fadeSplash ? 'fade-in' : 'fade-out'}`}
  style={{ transform: fadeSplash ? 'translateX(0)' : currentTeam.color === 'blue' ? 'translateX(-5px)' : 'translateX(5px)' }}
>
  {clickedHero && (
    <Image
      src={`/images/champions/splash/${clickedHero}.jpg`}
      width={1920}
      height={1080}
      className={`absolute z-10 w-full h-full object-cover object-center ${currentTeam.color === 'blue' ? 'fade-gradient-left' : 'fade-gradient-right'}`}
      alt={`${clickedHero} splash`}
    />
  )}
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
