import { roomStore } from '@/app/stores/roomStore';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import useTeams from '@/app/hooks/useTeams';

type Hero = {
  [key:string]: any;
}

type Team ={
  [key: string]: any;
}

const TeamPicks = ({ team } :Team) => {
  const { room } = roomStore();
  const { currentTeam } = useTeams();
  const [borderIndex, setBorderIndex] = useState<number | null>(null);

  useEffect(() => {
    if (team.isturn && team.canSelect && room?.status === 'select') {
      const timer = setTimeout(() => {
        setBorderIndex(
          team.heroes_selected.findIndex((hero: Hero) => !hero.selected)
        );
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setBorderIndex(null);
    }
  }, [team, room]);

  useEffect(() => {
    if (!team.clicked_hero) {
      setBorderIndex(null);
    }
  }, [team.clicked_hero]);

  const getHeroImageSrc = (id: string) =>
    `/images/champions/splash/${
      id
        ? id.toLowerCase().replace(/\s+/g, '').replace(/[\W_]+/g, '')
        : 'placeholder'
    }.webp`;

  const borderHeroImageSrc = useMemo(
    () => getHeroImageSrc(team.clicked_hero || 'placeholder'),
    [team.clicked_hero]
  );

  return (
    <motion.div className="flex h-full w-full gap-2">
      {team.heroes_selected.map((hero: Hero, index: number) => {
        const isBorderSlot = index === borderIndex;
        const isEmptySlot = !isBorderSlot && !hero.id;
        const heroImageSrc = getHeroImageSrc(hero.id);

        return (
          <motion.div
            key={index}
            className="relative h-full w-full overflow-hidden"
            animate={{ opacity: !currentTeam?.isturn ? 0.5 : 1 }}
          >
            {isBorderSlot && (
              <AnimatePresence>
                <div className="absolute bottom-0 left-0 right-0 z-50 flex h-full w-full items-end justify-center bg-gradient-to-t from-black to-transparent pb-6 text-center text-sm text-white">
                  {team.clicked_hero}
                </div>
                <div className="relative h-full w-full overflow-hidden">
                  <motion.div
                    className="glow-yellow-10 absolute inset-0 z-50 border border-yellow bg-opacity-10 bg-gradient-to-t from-yellow-transparent to-transparent"
                    animate={{ opacity: [0.2, 0.7] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                  />
                  {team.clicked_hero && (
                    <motion.div
                      className="absolute inset-0 z-10"
                      initial={{ scale: 1.2 }}
                    >
                      <Image
                        alt={team.clicked_hero}
                        src={borderHeroImageSrc}
                        layout="fill"
                        objectFit="cover"
                        quality={50}
                        className="sepia"
                      />
                    </motion.div>
                  )}
                </div>
              </AnimatePresence>
            )}
            <div
              className={clsx('relative h-full overflow-hidden border', {
                'border border-white border-opacity-10': isEmptySlot,
                'border border-white border-opacity-0': !isEmptySlot,
              })}
            >
              {hero.id && (
                <motion.div
                  className="absolute left-0 top-0 h-full w-full"
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{
                    duration: 0.5,
                    ease: [1, -0.6, 0.3, 1.2],
                    delay: 0.2,
                  }}
                >
                  <Image
                    alt={hero.name}
                    src={heroImageSrc}
                    layout="fill"
                    objectFit="cover"
                    quality={50}
                  />
                </motion.div>
              )}
              <div className="absolute bottom-0 left-0 right-0 z-50 flex h-1/2 w-full items-end justify-center bg-gradient-to-t from-black to-transparent pb-6 text-center text-sm text-white">
                {hero.name}
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default TeamPicks;
