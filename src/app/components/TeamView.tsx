import ChampionsPool from '@/app/components/common/ChampionsPool';
import useTeams from '@/app/hooks/useTeams';
import { defaultTransition } from '@/app/lib/animationConfig';
import { roomStore } from '@/app/stores/roomStore';
import { AnimatePresence, motion } from 'framer-motion';
import ExtendedImage from '@/app/components/common/ExtendedImage';
import React, { useEffect, useState } from 'react';
interface Team {
  [key: string]: any;
}

type TeamViewProps = {
  className?: string;
};

const TeamView: React.FC<TeamViewProps> = ({ className }) => {
  const [selectedChampion, setSelectedChampion] = useState<string | null>(null);
  const [currentImageBlue, setCurrentImageBlue] = useState<string>('');
  const [currentImageRed, setCurrentImageRed] = useState<string>('');
  const { room, isLoading } = roomStore((state) => ({
    room: state.room,
    isLoading: state.isLoading,
  }));
  const { currentTeam, blueTeam, redTeam } = useTeams();

  useEffect(() => {
    setSelectedChampion(currentTeam?.clicked_hero || null);
  }, [currentTeam]);

  useEffect(() => {
    const updateImage = (
      team: Team | undefined,
      setCurrentImage: React.Dispatch<React.SetStateAction<string | ''>>
    ) => {
      if (team) {
        setCurrentImage(team.clicked_hero || null);
      }
    };

    updateImage(blueTeam, setCurrentImageBlue);
    updateImage(redTeam, setCurrentImageRed);
  }, [blueTeam, redTeam]);

  // const handleClickedHero = async (hero: Hero) => {
  //   if (!currentTeam || hero.name === currentTeam.clicked_hero) return;
  //   await supabase
  //     .from('teams')
  //     .update({ clicked_hero: hero.name })
  //     .eq('id', currentTeam.id);
  // };

  if (isLoading) return <div>Loading...</div>;
  if (!currentTeam) return <div>Team not found</div>;

  return (
    <>
      {room?.status === 'ban' && <BanPhaseOverlay />}
      <AnimatePresence>
        <ImageComponent
          key={`blue-${currentImageBlue}`}
          image={currentImageBlue}
          position="left"
        />
        <ImageComponent
          key={`red-${currentImageRed}`}
          image={currentImageRed}
          position="right"
        />
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ defaultTransition, duration: 0.2 }}
        className={className}
      >
        <ChampionsPool
          className='px-24'
          team={currentTeam}
          selectedChampion={selectedChampion}
        />
      </motion.div>
    </>
  );
};

const BanPhaseOverlay: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 0.1 }}
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
      <ExtendedImage
        src={image}
        type='splash'
        variant='splash'
        fill
        sizes='100vw'
        className={`h-full w-full object-cover object-center opacity-50 ${position === 'left' ? 'fade-gradient-left' : 'fade-gradient-right'}`}
        alt={image}
      />
    )}
  </motion.div>
);

export default TeamView;
