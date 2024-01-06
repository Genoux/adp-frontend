import ChampionsPool from '@/app/components/common/ChampionsPool';
import GameStatusBar from '@/app/components/common/RoomHeader';
import { useCanSelect } from '@/app/context/CanSelectContext';
import useTeams from '@/app/hooks/useTeams';
import { defaultTransition } from '@/app/lib/animationConfig';
import supabase from '@/app/services/supabase';
import { roomStore } from '@/app/stores/roomStore';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

const TeamView = () => {
  const [selectedChampion, setSelectedChampion] = useState<string>('');
  const { canSelect, setCanSelect } = useCanSelect();
  const [currentImage, setCurrentImage] = useState<string | null>(null);

  const { room, isLoading } = roomStore((state) => ({
    room: state.room,
    error: state.error,
    isLoading: state.isLoading,
  }));

  const { currentTeam: team, otherTeam, redTeam, blueTeam } = useTeams();

  const currentTeam = team?.isturn ? team : otherTeam;
  const [isImageBeingRemoved, setIsImageBeingRemoved] = useState(false);

  useEffect(() => {
    if (currentImage) {
      setIsImageBeingRemoved(false);
    }
  }, [currentImage]);


  useEffect(() => {
    if (team?.nb_turn! > 0) {
      setSelectedChampion('');
      setTimeout(() => {
        setCanSelect(true);
      }, 1000);
    }
  }, [setCanSelect, team?.nb_turn]);

  useEffect(() => {
    if (team) {
      setSelectedChampion(team.clicked_hero || '');
      setCurrentImage(currentTeam?.clicked_hero || '');
    }
  }, [
    currentTeam?.clicked_hero,
    otherTeam?.clicked_hero,
    team,
    team?.clicked_hero,
  ]);

  const handleClickedHero = async (hero: any) => {
    if (hero.name === team?.clicked_hero) return null;
    if (!team) return null;

    setIsImageBeingRemoved(true);
    await supabase
      .from('teams')
      .update({ clicked_hero: hero.name })
      .eq('id', team.id);
  };

  const isBanPhase = room?.status === 'ban';

  if (!team || !currentTeam || !redTeam || !blueTeam || !room) {
    return <div>Team not found</div>;
  }

  if (isLoading) {
    return <div>Loading...</div>;
  }

  const widthVariants = {
    notTurn: { width: '6px' },
    isTurn: { width: '125px' },
  };

  return (
    <>
      {isBanPhase && (
        <motion.div
          exit="exit"
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.05 }}
          transition={{
            delay: 0.2,
            duration: 1,
            ease: 'linear',
          }}
          className="absolute left-0 top-0 -z-50 h-full w-full bg-red-900 opacity-5"
        ></motion.div>
      )}
      <motion.div
        exit="exit"
        initial={{ opacity: 0 }} // start at half the size
        animate={{ opacity: 1 }} // animate to full size
        transition={defaultTransition}
      >
    <AnimatePresence>
        {currentImage && (
          <motion.div
            key={currentImage} // Key based on currentImage
            className={`absolute ${
              currentTeam.color === 'blue' ? 'left-0' : 'right-0'
            } top-0 -z-10 h-full w-3/12`}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ 
              opacity: 0, 
              scale: isImageBeingRemoved ? 1  : 1.4,
              transition: { delay: isImageBeingRemoved ? 0 : .25, ease: [1, 0, 0.3, 1.2], duration: isImageBeingRemoved ? 0.1 : .5 } // Slower exit transition only when image is being removed due to user selection
            }}
          >
            <Image
              src={`/images/champions/splash/${currentImage.toLowerCase().replace(/\s+/g, '')}.jpg`}
              width={3840}
              height={1440}
              rel="preload"
              className={`h-full w-full object-cover object-center opacity-50 ${
                currentTeam.color === 'blue'
                  ? 'fade-gradient-left'
                  : 'fade-gradient-right'
              }`}
              alt={``}
            />
          </motion.div>
        )}
      </AnimatePresence>
        <motion.div
          exit="exit"
          initial={{ opacity: 0 }} // start at half the size
          animate={{ opacity: 1 }} // animate to full size
          transition={defaultTransition}
        >
          <GameStatusBar
            blueTeam={blueTeam}
            redTeam={redTeam}
            room={room}
            widthVariants={widthVariants}
            statusText={
              currentTeam === team
                ? isBanPhase
                  ? `C'est à vous de bannir, vous êtes l'équipe ${currentTeam?.color.charAt(0).toUpperCase() +
                  currentTeam?.color.slice(1)
                  }`
                  : `C'est à vous de choisir, vous êtes l'équipe ${currentTeam?.color.charAt(0).toUpperCase() +
                  currentTeam?.color.slice(1)
                  }`
                : `L'équipe ${currentTeam?.name.charAt(0).toUpperCase() +
                currentTeam?.name.slice(1)
                } entrain de choisir`
            }
          />
        </motion.div>
      </motion.div>
      <motion.div
        initial={{ y: '70px' }} // start at half the size
        animate={{ y: '0px' }} // animate to full size
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
        initial={{ y: -10, opacity: 0 }} // start at half the size
        animate={{ y: 25, opacity: 1 }}
        transition={defaultTransition}
      ></motion.div>
    </>
  );
};

export default TeamView;
