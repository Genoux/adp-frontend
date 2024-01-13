import ChampionsPool from '@/app/components/common/ChampionsPool';
import GameStatusBar from '@/app/components/common/RoomHeader';
import { useCanSelect } from '@/app/context/CanSelectContext';
import useTeams from '@/app/hooks/useTeams';
import { defaultTransition } from '@/app/lib/animationConfig';
import supabase from '@/app/services/supabase';
import { roomStore } from '@/app/stores/roomStore';
import { AnimatePresence, motion } from 'framer-motion';
import { default as NextImage } from 'next/image';
import { SetStateAction, useEffect, useState } from 'react';
//import SocketContext from '@/app/context/SocketContext';
//import useEnsureContext from '@/app/hooks/useEnsureContext';
import { Json } from '../types/supabase';
import { delay } from 'lodash';

interface Team {
  [key: string]: any;
}

interface Room {
  [key: string]: any;
}

interface BlueTeam {
  [key: string]: any;
}

interface RedTeam {
  [key: string]: any;
}

const TeamView = () => {
  const [selectedChampion, setSelectedChampion] = useState<string>('');
  const { canSelect, setCanSelect } = useCanSelect();
  const [currentImageBlue, setCurrentImageBlue] = useState<string | null>(null);
  const [currentImageRed, setCurrentImageRed] = useState<string | null>(null);
  //const socket = useEnsureContext(SocketContext);
  const { room, isLoading } = roomStore((state) => ({
    room: state.room,
    error: state.error,
    isLoading: state.isLoading,
  }));
  const { currentTeam: team, otherTeam, redTeam, blueTeam } = useTeams();
  const currentTeam = team?.isturn ? team : otherTeam;

  // useEffect(() => {
  //   const handleConfirmation = async (data: any) => {
  //     if (data) {
  //       await supabase.from('teams').update({ clicked_hero: null }).eq('id', currentTeam?.id);
  //     };
  //   };
  //   socket.on('CHAMPION_SELECTED', handleConfirmation);

  //   return () => {
  //     socket.off('CHAMPION_SELECTED', handleConfirmation);
  //   };
  // }, [currentTeam?.id, socket]);

  useEffect(() => {
    if (team?.nb_turn! > 0) {
      setTimeout(() => setCanSelect(true), 1000);
    }
  }, [team?.nb_turn, setCanSelect]);

  const updateCurrentImages = (
    team:
      | {
          clicked_hero: string | null;
          color: string;
          connected: boolean | null;
          created_at: string | null;
          heroes_ban: Json;
          heroes_selected: Json;
          id: number;
          isturn: boolean | null;
          name: string;
          nb_turn: number | null;
          ready: boolean | null;
          room: number;
          selected_hero: string | null;
          socketid: Json;
        }
      | undefined,
    setCurrentImage: {
      (value: SetStateAction<string | null>): void;
      (value: SetStateAction<string | null>): void;
      (arg0: string): void;
    }
  ) => {
    if (team?.clicked_hero) {
      setCurrentImage(team.clicked_hero);
    } else {
      setCurrentImage('');
      setSelectedChampion('');
    }
  };

  useEffect(() => {
    updateCurrentImages(blueTeam, setCurrentImageBlue);
    updateCurrentImages(redTeam, setCurrentImageRed);
  }, [blueTeam, blueTeam?.clicked_hero, redTeam, redTeam?.clicked_hero]);

  useEffect(() => {
    setSelectedChampion(team?.clicked_hero || '');
  }, [team]);

  const handleClickedHero = async (hero: { name: string | null }) => {
    if (!team || hero.name === team.clicked_hero) return;
    await supabase
      .from('teams')
      .update({ clicked_hero: hero.name })
      .eq('id', team.id);
  };

  const isBanPhase = room?.status === 'ban';
  const widthVariants = {
    notTurn: { width: '6px' },
    isTurn: { width: '125px' },
  };

  if (!team || !currentTeam || isLoading) {
    return <div>{isLoading ? 'Loading...' : 'Team not found'}</div>;
  }

  return (
    <>
      {isBanPhase && <BanPhaseOverlay />}

      <MainContent
        team={team}
        room={room as Room}
        currentImageBlue={currentImageBlue || ''}
        currentImageRed={currentImageRed || ''}
        widthVariants={widthVariants}
        blueTeam={blueTeam as BlueTeam}
        redTeam={redTeam as RedTeam}
      />

      <ChampionsPoolComponent
        {...{ team, selectedChampion, canSelect, handleClickedHero }}
      />
    </>
  );
};

export default TeamView;

const BanPhaseOverlay = () => (
  <motion.div
    exit="exit"
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.05 }}
    transition={{ delay: 0.2, duration: 1, ease: 'linear' }}
    className="fixed left-0 top-0 -z-50 h-full w-full bg-red-900 opacity-50"
  ></motion.div>
);

const ChampionsPoolComponent = ({
  team,
  selectedChampion,
  canSelect,
  handleClickedHero,
}: {
  team: Team;
  selectedChampion: string;
  canSelect: boolean;
  handleClickedHero: (hero: { name: string | null }) => void;
}) => {
  return (
    <motion.div
      initial={{ y: '120px' }}
      animate={{ y: '0px' }}
      transition={{defaultTransition}}
      className='mt-24'
    >
      <ChampionsPool
        team={team as Team}
        selectedChampion={selectedChampion}
        canSelect={canSelect}
        handleClickedHero={handleClickedHero}
      />
    </motion.div>
  );
};

const MainContent = ({
  currentImageBlue,
  currentImageRed,
  widthVariants,
  team,
  blueTeam,
  redTeam,
  room,
}: {
  currentImageBlue: string | null;
  currentImageRed: string | null;
  widthVariants: { notTurn: { width: string }; isTurn: { width: string } };
  team: Team;
  blueTeam: BlueTeam;
  redTeam: RedTeam;
  room: Room;
}) => {
  return (
    <>
      <AnimatePresence>
        {currentImageBlue && (
          <ImageComponent
            key={currentImageBlue}
            image={currentImageBlue}
            position="left"
          />
        )}
        {currentImageRed && (
          <ImageComponent
            key={currentImageRed}
            image={currentImageRed}
            position="right"
          />
        )}
      </AnimatePresence>
      <GameStatusBar
        blueTeam={blueTeam as BlueTeam}
        redTeam={redTeam as RedTeam}
        room={room as Room}
        widthVariants={widthVariants}
        statusText={getStatusText(team?.color, room?.status)}
      />
    </>
  );
};

const ImageComponent = ({
  image,
  position,
}: {
  image: string;
  position: string;
}) => (
  <motion.div
    className={`fixed top-0 -z-10 h-full w-3/12 ${
      position === 'left' ? 'left-0' : 'right-0'
    }`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0, transition: { duration: 0.2 } }}
  >
    <NextImage
      src={`/images/champions/splash/${image
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[\W_]+/g, '')}.jpg`}
      width={960}
      height={360}
      priority
      quality={100}
      className={`h-full w-full object-cover object-center opacity-50 ${
        position === 'left' ? 'fade-gradient-left' : 'fade-gradient-right'
      }`}
      alt={image}
    />
  </motion.div>
);

const getStatusText = (color: string, room: { status: string }) => {
  const isBanPhase = room?.status === 'ban';
  const teamName = color.charAt(0).toUpperCase() + color.slice(1);
  const toFrench = teamName === 'Blue' ? 'Bleue' : 'Rouge';
  if (color) {
    return isBanPhase
      ? `C'est à vous de bannir, vous êtes l'équipe ${toFrench}`
      : `C'est à vous de choisir, vous êtes l'équipe ${toFrench}`;
  }
  return '';
};
