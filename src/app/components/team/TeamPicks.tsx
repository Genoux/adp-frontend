import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import useTeams from '@/app/hooks/useTeams';
import useRoomStore from '@/app/stores/roomStore';
import ExtendedImage from '@/app/components/common/ExtendedImage';

type Hero = {
  id: string;
  name: string;
  selected: boolean | null;
};

type Team = {
  id: string;
  isturn: boolean;
  canSelect: boolean;
  heroes_selected: Hero[];
  clicked_hero?: string;
};

const TeamPicks = ({ team }: { team: Team }) => {
  const { room } = useRoomStore();
  const { currentTeam } = useTeams();
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  useEffect(() => {
    if (room?.status !== 'select') return;
    if (team.isturn && team.canSelect) {
      const index = team.heroes_selected.findIndex(hero => !hero.selected);
      setCurrentIndex(index);
    }
  }, [room?.status, team.isturn, team.canSelect, team.heroes_selected]);

  const opacity = useMemo(() => 
    currentTeam?.isturn || currentTeam === undefined ? 1 : 0.8,
  [currentTeam]);

  return (
    <motion.div className="flex h-full w-full gap-2" animate={{ opacity }}>
      {team.heroes_selected.map((hero, index) => (
        <HeroPickSlot
          key={`${index}-${hero.id}`}
          hero={hero}
          index={index}
          isCurrentSlot={index === currentIndex}
          isTurn={team.isturn}
          teamId={team.id}
        />
      ))}
    </motion.div>
  );
};

const HeroPickSlot = ({ hero, isCurrentSlot, isTurn, teamId }: {
  hero: Hero;
  index: number;
  isCurrentSlot: boolean;
  isTurn: boolean;
  teamId: string;
}) => {
  const showImage = hero.id !== undefined && hero.id !== null;
  const showBorder = isCurrentSlot && isTurn;
  const isEmptySlot = !showBorder && !showImage;

  return (
    <motion.div
      className={`relative h-full w-full overflow-hidden border ${
        isEmptySlot ? 'border-white border-opacity-5' : 'border-opacity-0'
      } bg-black bg-opacity-20`}
    >
      {(showBorder || hero.selected === null) && <BorderAnimation />}
      {showImage && (
        <HeroImage 
          hero={hero}
          isCurrentSlot={isCurrentSlot}
          teamId={teamId}
        />
      )}
    </motion.div>
  );
};

const BorderAnimation = () => (
  <motion.div
    className="glow-yellow-10 absolute inset-0 z-40 border border-yellow bg-opacity-10 bg-gradient-to-t from-yellow-transparent to-transparent"
    animate={{ opacity: [0.4, 1] }}
    initial={{ opacity: 0 }}
    exit={{ opacity: 0 }}
    transition={{
      duration: 1,
      repeat: Infinity,
      repeatType: 'reverse',
    }}
  />
);

const HeroImage = ({ hero, isCurrentSlot, teamId }: { 
  hero: Hero; 
  isCurrentSlot: boolean;
  teamId: string;
}) => (
  <motion.div
    initial={{ scale: 1.25 }}
    animate={{ scale: hero.selected ? 1 : 1.25 }}
    className={`h-full w-full ${isCurrentSlot && !hero.selected ? 'sepia' : ''}`}
    transition={{ duration: 0.4, ease: [1, -0.6, 0.3, 1.2] }}
  >
    <ExtendedImage
      alt={teamId}
      type="centered"
      fill
      src={hero.id}
      style={{ objectPosition: 'center', objectFit: 'cover' }}
    />
  </motion.div>
);

export default TeamPicks;