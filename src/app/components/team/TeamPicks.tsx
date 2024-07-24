import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import useTeams from '@/app/hooks/useTeams';
import useRoomStore from '@/app/stores/roomStore';
import ExtendedImage from '@/app/components/common/ExtendedImage';
import { Database } from '@/app/types/supabase';
import defaultTransition from '@/app/lib/animationConfig';

type Team = Database["public"]["Tables"]["teams"]["Row"];
type Hero = Database["public"]["CompositeTypes"]["hero"];
type RoomStatus = Pick<Database["public"]["Tables"]["rooms"]["Row"], "status">;

const TeamPicks = ({ team }: { team: Team }) => {
  const { room } = useRoomStore();
  const { currentTeam, turnTeam } = useTeams();
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
          room={room!}
          hero={hero}
          colorTeam={turnTeam?.color}
          index={index}
          isCurrentSlot={index === currentIndex}
          is_turn={team.is_turn}
        />
      ))}
    </motion.div>
  );
};

interface HeroPickSlotProps {
  room: RoomStatus;
  colorTeam: string | undefined;
  hero: Hero;
  index: number;
  isCurrentSlot: boolean;
  is_turn: boolean;
}

const HeroPickSlot: React.FC<HeroPickSlotProps> = ({ room, colorTeam, hero, isCurrentSlot, is_turn }) => {
  const borderAnimation = isCurrentSlot && is_turn && room.status === 'select';

  return (
    <motion.div
      className={`relative h-full w-full overflow-hidden ${hero.id ? '' : 'border border-zinc-400 border-opacity-5'
        } bg-black bg-opacity-20`}
    >
      <motion.div
        animate={{ opacity: 1 }}
        initial={{ opacity: 0 }}
        transition={{ defaultTransition, delay: 1 }}
      >
        {borderAnimation && <BorderAnimation />}
      </motion.div>
      {hero.id && (
        <>
          <p className='absolute z-50 w-full h-full flex justify-center text-center items-end pb-6 font-semibold text-sm tracking-wide'>{hero.name}</p>
          <AnimatePresence mode='wait'>
            <motion.div
              key={hero.id}
              className='absolute z-20 w-full h-full'
              animate={{ x: 0, opacity: 1 }}
              initial={{ x: colorTeam === 'blue' ? -10 : 10, opacity: 0 }}
              transition={{ defaultTransition, duration: 0.2 }}
              exit={{ x: colorTeam === 'blue' ? -10 : 10, opacity: 0 }}
            >
              <HeroImage
                hero={hero}
                isCurrentSlot={isCurrentSlot}
              />
            </motion.div>
          </AnimatePresence>
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
      defaultTransition,
    }}
  />
);

interface HeroImageProps {
  hero: Hero;
  isCurrentSlot: boolean;
}

const HeroImage: React.FC<HeroImageProps> = ({ hero, isCurrentSlot }) => (
  <motion.div
    key={hero.selected ? hero.id : undefined}
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