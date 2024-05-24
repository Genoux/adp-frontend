import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';

interface Hero {
  [key: string]: any;
}

interface Team {
  [key: string]: any;
}

const TeamBans = ({ team }: Team) => {
  const [borderIndex, setBorderIndex] = useState<number | null>(null);

  useEffect(() => {
    if (team.isturn && team.canSelect) {
      setBorderIndex(team.heroes_ban.findIndex((hero: Hero) => !hero.selected));
    } else {
      setBorderIndex(null);
    }
  }, [team]);

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
      {team.heroes_ban.map((hero: Hero, index: number) => {
        const isBorderSlot = index === borderIndex;
        const isEmptySlot = !isBorderSlot && !hero.id;
        const heroImageSrc = getHeroImageSrc(hero.id);

        return (
          <motion.div
            key={index}
            className="relative h-full w-full overflow-hidden"
            animate={{ opacity: !team.isturn ? 0.8 : 1 }}
          >
            {isBorderSlot && (
              <AnimatePresence>
                <div className="absolute bottom-0 left-0 right-0 z-50 flex h-full w-full items-end justify-center pb-6 text-center text-sm text-white">
                  {team.clicked_hero}
                </div>
                <div className="relative h-full w-full overflow-hidden">
                  <motion.div
                    className="glow-red-10 absolute inset-0 z-40 border border-red bg-opacity-10 bg-gradient-to-t from-red to-transparent"
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
                        quality={80}
                      />
                    </motion.div>
                  )}
                </div>
              </AnimatePresence>
            )}
            <div
              className={clsx(
                'relative h-full overflow-hidden border bg-black bg-opacity-20',
                {
                  'border border-white border-opacity-10': isEmptySlot,
                  'border border-white border-opacity-0': !isEmptySlot,
                }
              )}
            >
              {hero.id && (
                <motion.div
                  className="absolute left-0 top-0 h-full w-full grayscale"
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

export default TeamBans;
