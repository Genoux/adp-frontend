import { roomStore } from '@/app/stores/roomStore';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useState } from 'react';

interface Hero {
  name: string;
  id: string;
  selected: boolean;
  clicked_hero: boolean;
}

interface Team {
  [key: string]: any;
}

interface HeroPoolProps {
  team?: Team;
  selectedChampion?: string;
  canSelect?: boolean;
  handleClickedHero?: (hero: Hero) => void;
}

const ChampionsPool: React.FC<HeroPoolProps> = ({
  team,
  selectedChampion,
  canSelect,
  handleClickedHero = () => {},
}) => {
  const { room } = roomStore();
  const [hoveredHero, setHoveredHero] = useState<string | null>(null);

  const onHeroHover = (hero: Hero) => {
    setHoveredHero(hero.name);
  };

  const onHeroHoverEnd = () => {
    setHoveredHero(null);
  };

  if (!room?.heroes_pool || !Array.isArray(room.heroes_pool)) return null;

  return (
    <div className="flex flex-col overflow-y-auto px-6 lg:px-24 min-h-[200px] mb-3">
      <div className="grid cursor-pointer grid-cols-10 gap-2">

        {(room.heroes_pool as unknown as Hero[]).map(
          (hero: Hero, index: number) => {
            const isActive = hero.name === selectedChampion && team?.isturn;
            const isturnAvailable = team ? team.isturn : true;
            const shouldFade = hero.selected || (team && !isturnAvailable);
            const activeState = isActive || hoveredHero === hero.name;
            return (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: shouldFade ? 0.7 : 1 }}
                transition={{ duration: 0.1, ease: [0.4, 0.0, 0.2, 1] }}
                key={index}
                onHoverStart={() => onHeroHover(hero)}
                onHoverEnd={onHeroHoverEnd}
                className={clsx('z-10 overflow-hidden rounded-md', {
                  'bg-gray-800': isActive,
                  grayscale: hero.selected,
                  'pointer-events-none': hero.selected || !isturnAvailable,
                  'glow-yellow z-50 overflow-hidden rounded-xl border border-yellow border-opacity-100 bg-transparent p-1':
                    hero.name === selectedChampion &&
                    team?.isturn &&
                    room.status === 'select',
                  'glow-red rounded-xl border border-red-700 bg-red-700 bg-opacity-20 p-1':
                    hero.name === selectedChampion &&
                    team?.isturn &&
                    room.status === 'ban',
                })}
                onClick={canSelect ? () => handleClickedHero(hero) : undefined}
              >
                <motion.div className="relative z-10 overflow-hidden rounded-lg transition-all">
                  <Image
                    priority
                    src={`/images/champions/tiles/${hero.id
                      .toLowerCase()
                      .replace(/\s+/g, '')
                      .replace(/[\W_]+/g, '')}.jpg`}
                    alt={hero.name}
                    sizes="100vw"
                    width={500}
                    height={500}
                  />

                  <div className="my-auto flex items-center justify-center overflow-hidden">
                    <AnimatePresence>
                      <motion.div
                        transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
                        whileHover={
                          hero.name !== selectedChampion || !canSelect
                            ? {
                                opacity: 1,
                              }
                            : { opacity: 0 }
                        }
                        className="absolute top-0 z-50 flex h-full w-full items-center justify-center text-center opacity-0"
                      >
                        <Image
                          src={`/images/champions/splash/${hero.id
                            .toLowerCase()
                            .replace(/\s+/g, '')
                            .replace(/[\W_]+/g, '')}.jpg`}
                          alt={hero.name}
                          width={500}
                          height={500}
                          className="absolute h-full w-full scale-110 object-cover"
                        />
                      </motion.div>
                    </AnimatePresence>
                    {activeState && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 0.2,
                          ease: [0.4, 0.0, 0.2, 1],
                        }}
                        className={clsx(
                          `absolute left-0 top-0 z-50 h-full w-full rounded-lg bg-gradient-to-t`,
                          {
                            'from-yellow to-transparent':
                              room.status === 'select' ||
                              room.status === 'planning',
                            'from-red to-transparent': room.status === 'ban',
                          }
                        )}
                      ></motion.div>
                    )}

                    {activeState && (
                      <motion.div
                        initial={{ opacity: 0, y: 5, zIndex: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 0.2,
                          ease: [0.4, 0.0, 0.2, 1],
                        }}
                        className={`bg- absolute top-0 z-40 flex h-full items-center text-center text-sm font-bold text-white`}
                      >
                        <p>{hero.name}</p>
                      </motion.div>
                    )}

                    <AnimatePresence>
                      {activeState && (
                        <>
                          <motion.div
                            initial={{ scale: 1.1, opacity: 0 }}
                            animate={{ scale: 1.1, opacity: 1 }}
                            whileHover={{ scale: 1 }}
                            exit={{
                              scale: 1,
                              opacity: 0,
                              transition: { duration: 0.2 },
                            }}
                            transition={{
                              duration: 0.2,
                              ease: [0.4, 0.0, 0.2, 1],
                            }}
                            className="absolute left-0 top-0 mx-auto h-full w-full object-cover"
                          >
                            <Image
                              src={`/images/champions/splash/${hero.id
                                .toLowerCase()
                                .replace(/\s+/g, '')
                                .replace(/[\W_]+/g, '')}.jpg`}
                              alt={hero.name}
                              width={500}
                              height={500}
                              priority
                              className="h-full w-full object-cover"
                            />
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              </motion.div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default ChampionsPool;
