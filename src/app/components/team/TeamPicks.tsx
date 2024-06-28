import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import useTeams from '@/app/hooks/useTeams';
import useRoomStore from '@/app/stores/roomStore';
import ExtendedImage from '@/app/components/common/ExtendedImage';
import { Database } from '@/app/types/supabase';

type Team = Database["public"]["Tables"]["teams"]["Row"];
type Hero = Database["public"]["CompositeTypes"]["hero"];

const TeamPicks = ({ team }: { team: Team }) => {
  const { room } = useRoomStore();
  const { currentTeam } = useTeams();
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  useEffect(() => {
    if (room?.status !== 'select' || !team) return;
    if (team.is_turn && team.can_select) {
      const index = (team.heroes_selected as Hero[]).findIndex((hero) => !hero.selected);
      setCurrentIndex(index);
    }
  }, [room?.status, team]);

  const opacity = useMemo(() =>
    currentTeam?.is_turn || currentTeam === undefined ? 1 : 0.8,
    [currentTeam]);

  if (!team) return null;

  return (
    <motion.div className="flex h-full w-full gap-2" animate={{ opacity }}>
      {(team.heroes_selected as Hero[]).map((hero, index) => (
        <HeroPickSlot
          key={`${index}-${hero.id}`}
          hero={hero}
          index={index}
          isCurrentSlot={index === currentIndex}
          is_turn={team.is_turn}
        />
      ))}
    </motion.div>
  );
};

interface HeroPickSlotProps {
  hero: Hero;
  index: number;
  isCurrentSlot: boolean;
  is_turn: boolean;
}

const HeroPickSlot: React.FC<HeroPickSlotProps> = ({ hero, isCurrentSlot, is_turn }) => {
  const showImage = hero.id !== undefined && hero.id !== null;
  const showBorder = isCurrentSlot && is_turn;
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
}

const HeroImage: React.FC<HeroImageProps> = ({ hero, isCurrentSlot }) => (
  <motion.div
    initial={{ scale: 1.25 }}
    animate={{ scale: hero.selected ? 1 : 1.25 }}
    className={`h-full w-full ${isCurrentSlot && !hero.selected ? 'sepia' : ''}`}
    transition={{ duration: 0.4, ease: [1, -0.6, 0.3, 1.2] }}
  >
    {hero.id && (
      <ExtendedImage
        alt={hero.id}
        type="centered"
        fill
        src={hero.id}
        style={{ objectPosition: 'center', objectFit: 'cover' }}
      />
    )}
  </motion.div>
);

export default TeamPicks;