import { useState, useEffect } from "react";
import supabase from "@/app/services/supabase";
import SocketContext from "../context/SocketContext";
import useEnsureContext from "@/app/hooks/useEnsureContext";
import Timer from "@/app/components/common/RoomTimer";
import ChampionsPool from "@/app/components/common/ChampionsPool";
import { Button } from "@/app/components/ui/button";
import { roomStore } from "@/app/stores/roomStore";
import teamStore from "@/app/stores/teamStore";
import useTeams from "@/app/hooks/useTeams";
import { motion } from 'framer-motion';
import { defaultTransition } from '@/app/lib/animationConfig'
import Image from "next/image";
import LoadingCircle from "@/app/components/common/LoadingCircle";
import { truncateString } from "@/app/lib/utils";
import ArrowAnimation from '@/app/components/common/ArrowAnimation';
import GameStatusBar from "@/app/components/common/RoomHeader";



const TeamView = () => {
  const [selectedChampion, setSelectedChampion] = useState<string>("");
  const [canSelect, setCanSelect] = useState(true);
  const [clickedHero, setClickedHero] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const socket = useEnsureContext(SocketContext);

  const { room, error, isLoading } = roomStore(state => ({
    room: state.room,
    error: state.error,
    isLoading: state.isLoading
  }));

  //const { team, other, blue, red } = useTeams(teamid as string);
  const { currentTeam: team, otherTeam, redTeam, blueTeam } = useTeams();
  console.log("TeamView - otherTeam:", otherTeam);
  const currentTeam = team?.isturn ? team : otherTeam;
  console.log("TeamView - currentTeam:", currentTeam);

  useEffect(() => {
    if (team?.nb_turn! > 0) {
      setSelectedChampion("");
      setClickedHero(null);
      setTimeout(() => {
        setCanSelect(true);
      }, 250);
    }
  }, [team?.nb_turn]);


  const handleConfirmSelection = async () => {
    if (socket) {
      console.log("handleConfirmSelection - selectedChampion:", selectedChampion);

      setCanSelect(false);
      setClickedHero(null);
      setCurrentImage(null)
      socket?.emit("STOP_TIMER", { roomid: room?.id });

      const champion = selectedChampion;

      socket.emit("SELECT_CHAMPION", {
        teamid: team?.id,
        roomid: room?.id,
        selectedChampion: champion,
      });
    }
  };

  useEffect(() => {
    if (team) {
      console.log("useEffect - team:", team);
      setSelectedChampion(team?.clicked_hero || "");
      setClickedHero(currentTeam?.clicked_hero || "");
      setCurrentImage(currentTeam?.clicked_hero || "");
    }
  }, [currentTeam?.clicked_hero, otherTeam?.clicked_hero, team, team?.clicked_hero]);

  const handleClickedHero = async (hero: any) => {
    if (hero.name === team?.clicked_hero) return null;
    if (!team) return null;

    await supabase
      .from("teams")
      .update({ clicked_hero: hero.name })
      .eq("id", team?.id);

    setClickedHero(hero.name);
  };

  useEffect(() => {
    if (!team?.isturn) {
      setCanSelect(false);
    } else {
      setCanSelect(true);
    }
  }, [team?.isturn]);

  if (!currentTeam || !otherTeam || !redTeam || !blueTeam) return <div>Team not found</div>

  const isBanPhase = room?.status === 'ban';

  const buttonText = team?.isturn
    ? isBanPhase
      ? "Confirmer le Ban"
      : "Confirmer la Selection"
    : `C'est à l'équipe ${otherTeam.color} de ${isBanPhase ? 'bannir' : 'choisir'}`;


  if (!room) return <div>Room not found</div>

  if (!team || error) {
    return <div>Team not found</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const widthVariants = {
    notTurn: { width: "6px" },
    isTurn: { width: "125px" }
  };

  return (
    <>
      {isBanPhase && (
        <motion.div
          exit="exit"
          initial={{ opacity: 0 }}
          animate={{ opacity: .05 }}
          transition={{
            delay: .2,
            duration: 1,
            ease: "linear"
          }}
          className="absolute h-full w-full bg-red-900 opacity-5 top-0 left-0 -z-50"></motion.div>
      )}

      <motion.div
        exit="exit"
        initial={{ opacity: 0 }}  // start at half the size
        animate={{ opacity: 1 }}    // animate to full size
        transition={defaultTransition}
      >
        <motion.div
          className={`absolute ${currentTeam?.color === 'blue' ? 'left-0' : 'right-0'} top-0 w-3/12 h-full -z-10`}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={defaultTransition}
        >
          {currentImage && (
            <Image
              src={`/images/champions/splash/${currentImage?.toLowerCase().replace(/\s+/g, '')}.jpg`}
              width={3840}
              height={1440}
              rel="preload"
              className={`w-full h-full object-cover object-center opacity-50 ${currentTeam?.color === 'blue' ? 'fade-gradient-left' : 'fade-gradient-right'}`}
              alt={``}
            />)}
        </motion.div>
        <motion.div
          exit="exit"
          initial={{ y: "30px", opacity: 0 }}  // start at half the size
          animate={{ y: "0px", opacity: 1 }}    // animate to full size
          transition={defaultTransition}
        >
          <GameStatusBar
            blueTeam={blueTeam}
            redTeam={redTeam}
            room={room}
            widthVariants={widthVariants}
            statusText={currentTeam === team
              ? isBanPhase
                ? `C'est à vous de bannir, vous êtes l'équipe ${currentTeam?.color.charAt(0).toUpperCase() + currentTeam?.color.slice(1)}`
                : `C'est à vous de choisir, vous êtes l'équipe ${currentTeam?.color.charAt(0).toUpperCase() + currentTeam?.color.slice(1)}`
              : `L'équipe ${currentTeam?.name.charAt(0).toUpperCase() + currentTeam?.name.slice(1)} entrain de choisir`}
          />
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ y: "85px", scale: 1.05 }}  // start at half the size
        animate={{ y: "0px", scale: 1 }}    // animate to full size
        transition={defaultTransition}
      >
        <ChampionsPool
          team={team}
          selectedChampion={selectedChampion}
          canSelect={canSelect}
          handleClickedHero={handleClickedHero}
          canHoverToShowName={true}
        />
      </motion.div>
      <motion.div
        exit="exit"
        initial={{ y: -10, opacity: 0 }}  // start at half the size
        animate={{ y: 28, opacity: 1 }}
        transition={defaultTransition}
      >
        <div className="flex justify-center my-4 z-50">
          {team?.isturn ? (
            <Button
              size="lg"
              className={`bg-yellow hover:bg-yellow-hover text-sm uppercase text-yellow-text rounded-sm font-bold w-64`}
              onClick={handleConfirmSelection}
              disabled={!selectedChampion || !canSelect || !team?.isturn}
            >
              {!canSelect ? (<LoadingCircle color="black" />) : (<>{buttonText}</>)}
            </Button>
          ) : (
            <div className="h-[44px] flex items-center">
              <div className="flex flex-col justify-center items-center">
                <p className="text-sm pr-3 opacity-80">Ce n’est pas votre tour</p>
                <p className="text-md font-medium">{`En attente de l'équipe ${otherTeam.name}`}
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
      </motion.div>
    </>
  );

};

export default TeamView;
