// TODO: Fix types

import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import useTeams from '@/app/hooks/useTeams';
import useRoomStore from '@/app/stores/roomStore';
import ExtendedImage from '@/app/components/common/ExtendedImage';

type Hero = {
  id: string | null;
  name: string;
  selected: boolean | null;
};

export type Team = {
  id: string;
  isturn: boolean;
  name: string;
  clicked_hero: string | null;
  heroes_selected: Hero[];
  heroes_ban: Hero[];
  room: string;
  ready: boolean;
  color: string | null;
  canSelect: boolean;
};

interface TeamPicksProps {
  team: Team | undefined;
}

const TeamPicks: React.FC<TeamPicksProps> = ({ team }) => {
  const { room } = useRoomStore();
  const { currentTeam } = useTeams();
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  useEffect(() => {
    if (room?.status !== 'select' || !team) return;
    if (team.isturn && team.canSelect) {
      const index = team.heroes_selected.findIndex((hero: Hero) => !hero.selected);
      setCurrentIndex(index);
    }
  }, [room?.status, team]);

  const opacity = useMemo(() =>
    currentTeam?.isturn || currentTeam === undefined ? 1 : 0.8,
    [currentTeam]);

  if (!team) return null;

  return (
    <motion.div className="flex h-full w-full gap-2" animate={{ opacity }}>
      {team.heroes_selected.map((hero: Hero, index: number) => (
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

interface HeroPickSlotProps {
  hero: Hero;
  index: number;
  isCurrentSlot: boolean;
  isTurn: boolean;
  teamId: string;
}

const HeroPickSlot: React.FC<HeroPickSlotProps> = ({ hero, isCurrentSlot, isTurn, teamId }) => {
  const showImage = hero.id !== undefined && hero.id !== null;
  const showBorder = isCurrentSlot && isTurn;
  const isEmptySlot = !showBorder && !showImage;

  return (
    <motion.div
      className={`relative h-full w-full overflow-hidden border ${isEmptySlot ? 'border-white border-opacity-5' : 'border-opacity-0'
        } bg-black bg-opacity-20`}
    >
      {(showBorder || hero.selected === null) && <BorderAnimation />}
      {showImage && (
        <>
          <p className='absolute z-50 w-full h-full flex justify-center text-center items-end pb-6 font-semibold text-sm tracking-wide'>{hero.name}</p>
          <motion.div
            className='absolute z-20 w-full h-full'
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <HeroImage
              hero={hero}
              isCurrentSlot={isCurrentSlot}
              teamId={teamId}
            />
          </motion.div>
        </>
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

interface HeroImageProps {
  hero: Hero;
  isCurrentSlot: boolean;
  teamId: string;
}

const HeroImage: React.FC<HeroImageProps> = ({ hero, isCurrentSlot, teamId }) => (
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
      src={hero.id || ''}
      style={{ objectPosition: 'center', objectFit: 'cover' }}
    />
  </motion.div>
);

export default TeamPicks;