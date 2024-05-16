import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import NextImage from 'next/image';
import ChampionsPool from '@/app/components/common/ChampionsPool';
//import { useCanSelect } from '@/app/context/CanSelectContext';
import useTeams from '@/app/hooks/useTeams';
import { supabase } from '@/app/lib/supabase/client';
import { roomStore } from '@/app/stores/roomStore';
import { defaultTransition } from '@/app/lib/animationConfig';

interface Team {
  [key: string]: any;
}

interface Hero {
  name: string | null;
}

type TeamViewProps = {
  className?: string;
};

const TeamView: React.FC<TeamViewProps> = ({ className }) => {
  const [selectedChampion, setSelectedChampion] = useState<string | null>(null);
 // const { canSelect, setCanSelect } = useCanSelect();
  const [currentImageBlue, setCurrentImageBlue] = useState<string>('');
  const [currentImageRed, setCurrentImageRed] = useState<string>('');
  const { room, isLoading } = roomStore(state => ({
    room: state.room,
    isLoading: state.isLoading,
  }));
  const { currentTeam: team, otherTeam, blueTeam, redTeam } = useTeams();
  const currentTeam = team?.isturn ? team : otherTeam;

  // useEffect(() => {
  //   if (team?.nb_turn! > 0) {
  //     setTimeout(() => setCanSelect(true), 1000);
  //   }
  // }, [setCanSelect, team]);

  useEffect(() => {
    setSelectedChampion(team?.clicked_hero || null);
  }, [team]);

  useEffect(() => {
    const updateImage = (team: Team | undefined, setCurrentImage: React.Dispatch<React.SetStateAction<string | ''>>) => {
      if (team) {
        setCurrentImage(team.clicked_hero || null);
      }
    };

    updateImage(blueTeam, setCurrentImageBlue);
    updateImage(redTeam, setCurrentImageRed);
  }, [blueTeam, redTeam]);

  const handleClickedHero = async (hero: Hero) => {
    if (!team || hero.name === team.clicked_hero) return;
    await supabase.from('teams').update({ clicked_hero: hero.name }).eq('id', team.id);
  };

  if (isLoading) return <div>Loading...</div>;
  if (!team || !currentTeam) return <div>Team not found</div>;

  return (
    <>
      {room?.status === 'ban' && <BanPhaseOverlay />}
      <AnimatePresence>
        <ImageComponent key={`blue-${currentImageBlue}`} image={currentImageBlue} position="left" />
        <ImageComponent key={`red-${currentImageRed}`} image={currentImageRed} position="right" />
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={defaultTransition}
        className={className}
      >
        <ChampionsPool
          team={team}
          selectedChampion={selectedChampion || ''}
          handleClickedHero={handleClickedHero}
        />
      </motion.div>
    </>
  );
};

const BanPhaseOverlay: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.05 }}
    exit="exit"
    transition={{ delay: 0.2, duration: 1, ease: 'linear' }}
    className="fixed left-0 top-0 -z-50 h-full w-full bg-red-900 opacity-50"
  />
);

interface ImageComponentProps {
  image: string;
  position: 'left' | 'right';
}

const ImageComponent: React.FC<ImageComponentProps> = ({ image, position }) => (
  <motion.div
    className={`fixed top-0 -z-10 h-full w-3/12 ${position === 'left' ? 'left-0' : 'right-0'}`}
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
  >
    {image && (
    <NextImage
      src={`/images/champions/splash/${image?.toLowerCase().replace(/\s+/g, '').replace(/[\W_]+/g, '')}.jpg`}
      width={960}
      height={360}
      quality={100}
      className={`h-full w-full object-cover object-center opacity-50 ${position === 'left' ? 'fade-gradient-left' : 'fade-gradient-right'}`}
      alt={image}
    />
    )}
  </motion.div>
);

export default TeamView;
