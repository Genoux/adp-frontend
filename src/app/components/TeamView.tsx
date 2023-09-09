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
import { defaultTransition } from '@/app/lib/animationConfig'
import Image from "next/image";
import LoadingCircle from "@/app/components/common/LoadingCircle";
import TeamStatus from "@/app/components/common/TeamStatus";
import { truncateString } from "@/app/lib/utils";
import BannerPhase from "@/app/components/common/BannerPhase"

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

  const { current: team, other, blue, red } = useTeams(teamStore);
  const currentTeam = team.isturn ? team : other;
  type AnimationState = {
    zIndex: number;
    opacity: number;
  };

  const [animationState, setAnimationState] = useState<AnimationState>({
    zIndex: 50,
    opacity: 0
  });

  useEffect(() => {
    console.log(room?.status)

    if (room?.status === "ban" || room?.status === "select") {
      setAnimationState({ opacity: 1, zIndex: 50 });

      const opacityTimeout = setTimeout(() => {
        setAnimationState(prev => ({ ...prev, opacity: 0 }));

        const zIndexTimeout = setTimeout(() => {
          setAnimationState(prev => ({ ...prev, zIndex: 0 }));
        }, 300);

        return () => clearTimeout(zIndexTimeout);
      }, 2000);

      return () => clearTimeout(opacityTimeout);
    }
  }, [room?.status]);


  useEffect(() => {
    socket.on("CHAMPION_SELECTED", (data) => {
      console.log("socket.on - data:", data);
      setSelectedChampion("");
      setClickedHero(null);
      setTimeout(() => {
        setCanSelect(true);
      }, 500);
    });

    return () => {
      socket.off("CHAMPION_SELECTED");
    };
  }, [socket]);


  const handleConfirmSelection = async () => {
    if (socket) {
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
      setCanSelect(team.isturn);
      setSelectedChampion(team.clicked_hero || "");
      setCurrentImage(currentTeam.clicked_hero || "");
      setClickedHero(currentTeam.clicked_hero); // Update the splash image
    }
  }, [currentTeam.clicked_hero, other.clicked_hero, team, team.clicked_hero]);

  const handleClickedHero = async (hero: any) => {
    if (hero.name === team.clicked_hero) return null;
    if (!team) return null;

    await supabase
      .from("teams")
      .update({ clicked_hero: hero.name })
      .eq("id", team.id);

    setClickedHero(hero.name); // Update the splash image
  };

  useEffect(() => {
    if (!team.isturn) {
      setSelectedChampion("");
      setCanSelect(false);
      setClickedHero(null);
    } else {
      setCanSelect(true);
    }
  }, [team.isturn]);



  const isBanPhase = room?.status === 'ban';

  const buttonText = team.isturn
    ? isBanPhase
      ? "Confirmer le Ban"
      : "Confirmer la Selection"
    : `C'est à l'équipe ${other.color} de ${isBanPhase ? 'bannir' : 'choisir'}`;


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
          animate={{ opacity: 1 }}
          transition={{
            delay: .2,
            duration: 0.3,
            ease: [0.585, 0.535, 0.230, 0.850]
          }}
          className="absolute top-0 left-0 border-[6px] h-full w-full border-red-500 blur-2xl -z-50"></motion.div>
      )}

      <BannerPhase
        roomStatus={room?.status}
        onBannerVisibleChange={(visible: boolean) => { }}
      />

      <motion.div
        exit="exit"
        initial={{ opacity: 0 }}  // start at half the size
        animate={{ opacity: 1 }}    // animate to full size
        transition={defaultTransition}
      >
        <motion.div
          className={`absolute ${currentTeam.color === 'blue' ? 'left-0' : 'right-0'} top-0 w-3/12 h-full -z-10`}
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={defaultTransition}
        >
          {currentImage && (
            <Image
              src={`/images/champions/splash/${currentImage?.toLowerCase().replace(/\s+/g, '')}.jpg`}
              width={1920}
              height={1080}
              rel="preload"
              className={`absolute z-10 w-full h-full object-cover object-center ${currentTeam.color === 'blue' ? 'fade-gradient-left' : 'fade-gradient-right'}`}
              alt={``}
            />)}
        </motion.div>
        <motion.div
          exit="exit"
          initial={{ y: "30px", opacity: 0 }}  // start at half the size
          animate={{ y: "0px", opacity: 1 }}    // animate to full size
          transition={defaultTransition}
          className="grid grid-cols-3 items-center my-3">
          <p className={`flex items-center gap-2 justify-start`}>
            <motion.div
              initial={blue.isturn ? "isTurn" : "notTurn"}
              animate={blue.isturn ? "isTurn" : "notTurn"}
              variants={widthVariants}
              className={`h-6 w-1 bg-${blue.color} rounded-full`}></motion.div>
            <span className="text-2xl">{truncateString(blue.name.toUpperCase(), 6)} </span>
            <TeamStatus team={blue} showReadyState={false} /></p>
          <div className="flex flex-col items-center">
            <Timer />
            <p className="font-medium text-sm">
              {currentTeam === team
                ? isBanPhase
                  ? `C'est à vous de bannir, vous êtes l'équipe ${currentTeam.color.charAt(0).toUpperCase() + currentTeam.color.slice(1)}`
                  : `C'est à vous de choisir, vous êtes l'équipe ${currentTeam.color.charAt(0).toUpperCase() + currentTeam.color.slice(1)}`
                : `L'équipe ${currentTeam.name.charAt(0).toUpperCase() + currentTeam.name.slice(1)} entrain de choisir`}
            </p>
          </div>
          <p className={`flex items-center gap-2 justify-end`}>
            <TeamStatus team={red} showReadyState={false} />

            <span className="text-2xl">{truncateString(red.name.toUpperCase(), 6)} </span>
            <motion.div
              initial={red.isturn ? "isTurn" : "notTurn"}
              animate={red.isturn ? "isTurn" : "notTurn"}
              variants={widthVariants}
              className={`h-6 w-1 bg-${red.color} rounded-full`}></motion.div>

          </p>
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ y: "80px", scale: 1.05 }}  // start at half the size
        animate={{ y: "0px", scale: 1 }}    // animate to full size
        transition={defaultTransition}
      >
        <ChampionsPool
          team={team}
          selectedChampion={selectedChampion}
          canSelect={canSelect}
          handleClickedHero={handleClickedHero}
        />
      </motion.div>
      <motion.div
        exit="exit"
        initial={{ y: 70, opacity: 0 }}  // start at half the size
        animate={{ y: 25, opacity: 1 }}
        transition={defaultTransition}
      >
        <div className="flex justify-center my-4">
          {team.isturn ? (
            <Button
              size="lg"
              className={`bg-yellow hover:bg-yellow-hover text-sm uppercase text-yellow-text rounded-sm font-bold w-64`}
              onClick={handleConfirmSelection}
              disabled={!selectedChampion || !canSelect || !team.isturn}
            >

              {!canSelect ? (<LoadingCircle color="black" />) : (<>{buttonText}</>)}
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
      </motion.div>
    </>
  );

};

export default TeamView;
