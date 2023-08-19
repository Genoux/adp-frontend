import { useState, useEffect } from "react";
import supabase from "@/app/services/supabase";
import SocketContext from "../context/SocketContext";
import useEnsureContext from "@/app/hooks/useEnsureContext";
import Timer from "@/app/components/common/RoomTimer";
import ChampionsPool from "@/app/components/common/ChampionsPool";
import { Button } from "@/app/components/ui/button";
import { roomStore } from "@/app/stores/roomStore";
import { teamStore } from "@/app/stores/teamStore";
import useTeams from "@/app/hooks/useTeams";
import { motion } from 'framer-motion';
import Image from "next/image";

const TeamView = () => {
  const [selectedChampion, setSelectedChampion] = useState<string>("");
  const [canSelect, setCanSelect] = useState(true);
  const [clickedHero, setClickedHero] = useState<string | null>(null);
  const [transitionInProgress, setTransitionInProgress] = useState(false);
  const [fadeSplash, setFadeSplash] = useState(true);

  const socket = useEnsureContext(SocketContext);

  const { room, error, isLoading } = roomStore(state => ({
    room: state.room,
    error: state.error,
    isLoading: state.isLoading
  }));

  const { current: team, other, blue, red } = useTeams(teamStore);
  const currentTeam = team.isturn ? team : other;

  useEffect(() => {
    socket.on("CHAMPION_SELECTED", (data) => {
      console.log("socket.on - data:", data);
      setSelectedChampion("");
      setClickedHero(null);
      setTimeout(() => {
        setCanSelect(true);
      }, 500);
    });

    // Clean up
    return () => {
      socket.off("CHAMPION_SELECTED");
    };
  }, [socket]);


  const handleConfirmSelection = async () => {
    if (socket) {
      setCanSelect(false);
      setClickedHero(null);
      socket?.emit("STOP_TIMER", { roomid: room?.id });

      const champion = selectedChampion;
      console.log("handleConfirmSelection - champion:", champion);

      socket?.emit("SELECT_CHAMPION", {
        teamid: team?.id,
        roomid: room?.id,
        selectedChampion: champion,
      });
    }
  };

  useEffect(() => {
    if (team) {
      setSelectedChampion(team.clicked_hero || "");
      setClickedHero(currentTeam.clicked_hero); // Update the splash image
      setTimeout(() => {
        setFadeSplash(true); // Start fade-out
        setTransitionInProgress(false)
      }, 400); // 500ms matches the CSS transition duration
    }
  }, [currentTeam.clicked_hero, other.clicked_hero, team]);

  const handleClickedHero = async (hero: any) => {
    if (hero.name === team.clicked_hero) return null;
    if (!team || transitionInProgress) return null;

    // Indicate that a transition is in progress
    setFadeSplash(false); // Start fade-in
    setTransitionInProgress(true);

    // Start the fade-out
    //setFade(false);
    await supabase
      .from("teams")
      .update({ clicked_hero: hero.name })
      .eq("id", team.id);

    // Delay to allow the fade-out to complete
    await new Promise(resolve => setTimeout(resolve, 200)); // loadimage wait for fade out
    setClickedHero(hero.name); // Update the splash image

  };

  useEffect(() => {
    if (team?.isturn) {
      setCanSelect(true);
    } else {
      setSelectedChampion("");
      setCanSelect(false);
      setClickedHero(null);
    }
  }, [team?.isturn]);

  const buttonText = team.isturn
    ? "Confirm Selection"
    : `It's ${other.color} team to pick`;


  if (!team || error) {
    return <div>Team not found</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const slideVariants = {
    initial: { scaleY: '32px' },
    animate: { y: '0%' },
    exit: { y: '100%' }
  };

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
            rel="preload"
            className={`absolute z-10 w-full h-full object-cover object-center ${currentTeam.color === 'blue' ? 'fade-gradient-left' : 'fade-gradient-right'}`}
            alt={`${clickedHero} splash`}
          />
        )}
      </div>
      <div className="flex justify-between items-center mb-6">
        <div className={`flex flex-col items-center bg-blue text-md px-6 py-2 rounded-full font-bold`}>{blue.name.charAt(0).toUpperCase() + blue.name.slice(1)}</div>
        <div className="flex flex-col items-center">
            <Timer />
            <p className="font-medium text-md mt-2">
              {currentTeam === team
                ? `C\'est à vous de choisir, vous êtes l\'équipe ${currentTeam.color.charAt(0).toUpperCase() + currentTeam.color.slice(1)}`
                : `L'équipe ${currentTeam.name.charAt(0).toUpperCase() + currentTeam.name.slice(1)} entrain de choisir`}
            </p>
        </div>
        <div className={`flex flex-col items-center bg-red text-md px-6 py-2 rounded-full font-bold`}>{red.name.charAt(0).toUpperCase() + red.name.slice(1)}</div>
      </div>
      <div className="team">
        <motion.div
          layout={false}
          exit="exit"
          initial={{ scale: 1.05 }}  // start at half the size
          animate={{ scale: 1 }}    // animate to full size
          transition={{ delay: 0, duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
        >
          <ChampionsPool
            team={team}
            selectedChampion={selectedChampion}
            canSelect={canSelect}
            clickedHero={clickedHero}
            handleClickedHero={handleClickedHero}
          />
        </motion.div>
      </div>
      <div className="flex justify-center my-6">
        {team.isturn ? (
          <Button
            size="lg"
            className="bg-yellow hover:bg-yellow-hover text-sm uppercase text-yellow-text rounded-sm font-bold"
            onClick={handleConfirmSelection}
            disabled={!selectedChampion || !canSelect || !team.isturn}
          >
            {buttonText}
          </Button>
        ) : (
          <div className="h-[44px] flex items-center">
            <div className="flex flex-col justify-center items-center">
              <p className="text-sm pr-3 opacity-80">Ce n’est pas votre tour</p>
              <p className="text-lg font-medium">{`En attente de l'équipe ${other.color}`}
                <div className="sending-animation pl-1">
                  <span className="sending-animation-dot">.</span>
                  <span className="sending-animation-dot">.</span>
                  <span className="sending-animation-dot">.</span>
                </div>
              </p>
            </div>

          </div>
        )}
      </div>
    </>
  );

};

export default TeamView;
