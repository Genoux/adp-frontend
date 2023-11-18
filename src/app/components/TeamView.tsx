import { useState, useEffect } from "react";
import supabase from "@/app/services/supabase";
import Timer from "@/app/components/common/RoomTimer";
import ChampionsPool from "@/app/components/common/ChampionsPool";
import { roomStore } from "@/app/stores/roomStore";
import { teamStore } from "@/app/stores/teamStore";
import useTeams from "@/app/hooks/useTeams";
import { AnimatePresence, motion } from 'framer-motion';
import { defaultTransition } from '@/app/lib/animationConfig'
import Image from "next/image";
import { truncateString } from "@/app/lib/utils";
import ArrowAnimation from '@/app/components/common/ArrowAnimation';
import { useCanSelect } from '@/app/context/CanSelectContext';

const TeamView = () => {
  const [selectedChampion, setSelectedChampion] = useState<string>("");
  const { canSelect, setCanSelect } = useCanSelect();
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const { room, error, isLoading } = roomStore(state => ({
    room: state.room,
    error: state.error,
    isLoading: state.isLoading
  }));

  const { current: team, other, blue, red } = useTeams(teamStore);
  const currentTeam = team.isturn ? team : other;

  useEffect(() => {
    if (team.nb_turn > 0) {
      setSelectedChampion("");
      setTimeout(() => {
        setCanSelect(true);
      }, 1000);
    }

  }, [setCanSelect, team.nb_turn]);

  useEffect(() => {
    if (team) {
      setSelectedChampion(team.clicked_hero || "");
      setCurrentImage(currentTeam.clicked_hero || "");
    }
  }, [currentTeam.clicked_hero, other.clicked_hero, team, team.clicked_hero]);

  const handleClickedHero = async (hero: any) => {
    if (hero.name === team.clicked_hero) return null;
    if (!team) return null;

    await supabase
      .from("teams")
      .update({ clicked_hero: hero.name })
      .eq("id", team.id);
  };

  const isBanPhase = room?.status === 'ban';

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
        className="pb-2"
      >
        {currentImage && (
          <AnimatePresence mode="wait">
            <motion.div
              key={currentImage}  // Key based on currentImage
              className={`absolute ${currentTeam.color === 'blue' ? 'left-0' : 'right-0'} top-0 w-3/12 h-full -z-10`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <Image
                src={`/images/champions/splash/${currentImage.toLowerCase().replace(/\s+/g, '')}.jpg`}
                width={3840}
                height={1440}
                rel="preload"
                className={`w-full h-full object-cover object-center opacity-50 ${currentTeam.color === 'blue' ? 'fade-gradient-left' : 'fade-gradient-right'}`}
                alt={``}
              />
            </motion.div>
          </AnimatePresence>
        )}
        <motion.div
          exit="exit"
          initial={{ y: "30px", opacity: 0 }}  // start at half the size
          animate={{ y: "0px", opacity: 1 }}    // animate to full size
          transition={defaultTransition}
          className="grid grid-cols-3 items-center my-3 w-full">
          <div className={`flex items-center gap-2 justify-start`}>
            <motion.div
              initial={blue.isturn ? "isTurn" : "notTurn"}
              animate={blue.isturn ? "isTurn" : "notTurn"}
              variants={widthVariants}
              className={`h-6 w-1 bg-${blue.color} rounded-full`}>
            </motion.div>
            <span className="text-2xl mr-2">{truncateString(blue.name.toUpperCase(), 6)}</span>
            <ArrowAnimation roomStatus={room?.status} teamIsTurn={blue.isturn} orientation="right" />
          </div>
          <div className="flex flex-col w-full items-center">
            <Timer />
            <p className="font-medium text-xs text-center">
              {currentTeam === team
                ? isBanPhase
                  ? `C'est à vous de bannir, vous êtes l'équipe ${currentTeam.color.charAt(0).toUpperCase() + currentTeam.color.slice(1)}`
                  : `C'est à vous de choisir, vous êtes l'équipe ${currentTeam.color.charAt(0).toUpperCase() + currentTeam.color.slice(1)}`
                : `L'équipe ${currentTeam.name.charAt(0).toUpperCase() + currentTeam.name.slice(1)} entrain de choisir`}
            </p>
          </div>
          <p className={`flex items-center gap-2 justify-end`}>
            <ArrowAnimation roomStatus={room?.status} teamIsTurn={red.isturn} orientation="left" />
            <span className="text-2xl ml-2">{truncateString(red.name.toUpperCase(), 6)} </span>
            <motion.div
              initial={red.isturn ? "isTurn" : "notTurn"}
              animate={red.isturn ? "isTurn" : "notTurn"}
              variants={widthVariants}
              className={`h-6 w-1 bg-${red.color} rounded-full`}></motion.div>
          </p>
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
        />
      </motion.div>
      <motion.div
        exit="exit"
        initial={{ y: -10, opacity: 0 }}  // start at half the size
        animate={{ y: 25, opacity: 1 }}
        transition={defaultTransition}
      >
      </motion.div>
    </>
  );

};

export default TeamView;
