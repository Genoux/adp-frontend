import ChampionsPool from '@/app/components/common/ChampionsPool';
import GameStatusBar from '@/app/components/common/RoomHeader';
import { useCanSelect } from '@/app/context/CanSelectContext';
import useTeams from '@/app/hooks/useTeams';
import { defaultTransition } from '@/app/lib/animationConfig';
import supabase from '@/app/services/supabase';
import { roomStore } from '@/app/stores/roomStore';
import { AnimatePresence, motion } from 'framer-motion';
import { default as NextImage } from 'next/image';
import { useEffect, useState } from 'react';
import SocketContext from '@/app/context/SocketContext';
import useEnsureContext from '@/app/hooks/useEnsureContext';

// const preloadSplashImages = (heroes: { id: string; }[]) => {
//   heroes.forEach((hero) => {
//     const img = new Image() as HTMLImageElement;
//     img.src = `/images/champions/splash/${hero.id.toLowerCase().replace(/\s+/g, '').replace(/[\W_]+/g, '')}.jpg`;
//    console.log("heroes.forEach - img.src:", img.src);

//   });
// };


const TeamView = () => {
  const [selectedChampion, setSelectedChampion] = useState<string>('');
  const { canSelect, setCanSelect } = useCanSelect();
  const [currentImageBlue, setCurrentImageBlue] = useState<string | null>(null);
  const [currentImageRed, setCurrentImageRed] = useState<string | null>(null);
  

  const socket = useEnsureContext(SocketContext);



  const { room, isLoading } = roomStore((state) => ({
    room: state.room,
    error: state.error,
    isLoading: state.isLoading,
  }));

  const { currentTeam: team, otherTeam, redTeam, blueTeam } = useTeams();

  const currentTeam = team?.isturn ? team : otherTeam;

  useEffect(() => {
    const handleConfirmation = async (data: any) => {
      if (data) {
        console.log("handleConfirmation - data:", data);
      }
    };

    // Listen to the 'CHAMPION_CONFIRMED' event
    socket.on('CHAMPION_SELECTED', handleConfirmation);

    return () => {
      // Clean up the event listener
      socket.off('CHAMPION_SELECTED', handleConfirmation);
    };
  }, [socket]);


  useEffect(() => {
    //preloadSplashImages(room?.heroes_pool as { id: string; }[]);
  }, [room?.heroes_pool]);

  useEffect(() => {
    if (team?.nb_turn! > 0) {

      setTimeout(() => {
        setCanSelect(true);
      }, 1000);
    }
  }, [setCanSelect, team?.nb_turn]);

  useEffect(() => {
    if (blueTeam?.clicked_hero) {
      setCurrentImageBlue(blueTeam?.clicked_hero || '');
      setCurrentImageRed('');
    }

  }, [blueTeam?.clicked_hero]);

  useEffect(() => {
    if (redTeam?.clicked_hero) {
      setCurrentImageRed(redTeam?.clicked_hero || '');
      setCurrentImageBlue('');
    }

  }, [redTeam?.clicked_hero]);

  useEffect(() => {
    if (team) {
      setSelectedChampion(team?.clicked_hero || '');
    }
  }, [team, team?.clicked_hero]);



  const handleClickedHero = async (hero: any) => {
    if (hero.name === team?.clicked_hero) return null;
    if (!team) return null;

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
          {currentImageBlue && (
            <motion.div
              key={currentImageBlue} // Key based on currentImage
              className={`absolute left-0 top-0 -z-10 h-full w-3/12`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                transition: { ease: [1, 0, 0.3, 1.2], duration: .1 }
              }}
            >
              <NextImage
                src={`/images/champions/splash/${currentImageBlue.toLowerCase()
                  .replace(/\s+/g, '')
                  .replace(/[\W_]+/g, '')}.jpg`}
                width={960}
                height={360}
                priority
                quality={100}
                className={`h-full w-full object-cover object-center opacity-50 fade-gradient-left`}
                alt={``}
              />
            </motion.div>
          )}

        </AnimatePresence>
        <AnimatePresence>
          {currentImageRed && (
            <motion.div
              key={currentImageRed} // Key based on currentImage
              className={`absolute right-0 top-0 -z-10 h-full w-3/12`}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{
                opacity: 0,
                transition: { ease: [1, 0, 0.3, 1.2], duration: .1 }
              }}
            >
              <NextImage
                src={`/images/champions/splash/${currentImageRed.toLowerCase()
                  .replace(/\s+/g, '')
                  .replace(/[\W_]+/g, '')}.jpg`}
                width={960}
                height={360}
                priority
                quality={100}
                className={`h-full w-full object-cover object-center opacity-50 fade-gradient-right`}
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
