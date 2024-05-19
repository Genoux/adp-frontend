import { roomStore } from '@/app/stores/roomStore';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Hero {
  name: string;
  id: string;
  selected: boolean;
}

interface Team {
  [key: string]: any;
  applyHeightVariants?: boolean;
}

const TeamPicks: React.FC<Team> = ({ team }) => {
  const { room } = roomStore();
  const [borderIndex, setBorderIndex] = useState<number | null>(null);

  useEffect(() => {
    if (team.isturn && room?.status === 'select' && team.nb_turn > 0) {
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

  return (
    <motion.div className="flex h-full w-full gap-2">
      {Array.from({ length: 5 }).map((_, index) => {
        const hero = team.heroes_selected[index];
        const isBorderSlot = index === borderIndex;
        const isEmptySlot = !isBorderSlot && !hero.id;
        const imageSrc = `/images/champions/splash/${
          hero.id
            ? hero.id
                .toLowerCase()
                .replace(/\s+/g, '')
                .replace(/[\W_]+/g, '')
            : 'placeholder'
        }.jpg`;
        const ClickedHero = `/images/champions/splash/${
          team.clicked_hero
            ? team.clicked_hero
                .toLowerCase()
                .replace(/\s+/g, '')
                .replace(/[\W_]+/g, '')
            : 'placeholder'
        }.jpg`;
        return (
          <motion.div
            animate={{ opacity: !team.isturn ? 0.8 : 1 }}
            key={index}
            className="relative h-full w-full overflow-hidden"
          >
            {isBorderSlot && (
              <AnimatePresence>
                <div className="absolute bottom-0 left-0 right-0 z-50 flex h-full w-full items-end justify-center bg-gradient-to-t from-black to-transparent pb-6 text-center text-sm text-white">
                  {team.clicked_hero}
                </div>
                <div className="relative h-full w-full overflow-hidden">
                  <motion.div
                    animate={{ opacity: [0.2, 0.7] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                    className="glow-yellow-10 absolute inset-0 z-50 border border-yellow bg-opacity-10 bg-gradient-to-t from-yellow-transparent to-transparent"
                  />
                  {team.clicked_hero && (
                    <motion.div
                      className="absolute inset-0 z-10"
                      initial={{ scale: 1.2 }}
                    >
                      <Image
                        alt={team.clicked_hero}
                        src={ClickedHero}
                        layout="fill"
                        objectFit="cover"
                        quality={80}
                        className={clsx('sepia', {})}
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
                    src={imageSrc}
                    layout="fill"
                    objectFit="cover"
                    quality={80}
                  />
                </motion.div>
              )}
              <div className="absolute bottom-0 left-0 right-0 z-50 flex h-full w-full items-end justify-center bg-gradient-to-t from-black to-transparent pb-6 text-center text-sm text-white">
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
