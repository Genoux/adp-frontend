import ImageHash from '@/app/components/common/ImageHash';
import { useBlurHash } from '@/app/context/BlurHashContext';
import { defaultTransition } from '@/app/lib/animationConfig';
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

interface BlurHashes {
  [key: string]: string;
}
interface ChampionsPoolProps {
  team?: Team;
  selectedChampion?: string;
  handleClickedHero?: (hero: Hero) => void;
  className?: string;
}

const ChampionsPool: React.FC<ChampionsPoolProps> = ({
  team,
  selectedChampion,
  handleClickedHero = () => { },
  className= '',
}) => {
  const { room } = roomStore();
  const [hoveredHero, setHoveredHero] = useState<string | null>(null);

  const onHeroHover = (hero: Hero) => {
    setHoveredHero(hero.name);
  };

  const onHeroHoverEnd = () => {
    setHoveredHero(null);
  };

  const blurHashes: BlurHashes = useBlurHash();

  if (!room?.heroes_pool || !Array.isArray(room.heroes_pool)) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 0 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ defaultTransition, delay: 0.25, duration: 0.25 }}
      className={`flex h-full flex-col overflow-y-auto ${className}`}
    >
      <div className="grid cursor-pointer grid-cols-10 gap-2">
        {(room.heroes_pool as unknown as Hero[]).map(
          (hero: Hero, index: number) => {
            const isActive = hero.name === selectedChampion && team?.isturn;
            const isturnAvailable = team ? team.isturn : true;
            const shouldFade = hero.selected || (team && !isturnAvailable);
            const activeState = isActive || hoveredHero === hero.name;
            const imageName = `${hero.id
              .toLowerCase()
              .replace(/\s+/g, '')
              .replace(/[\W_]+/g, '')}`;
            const blurHash = blurHashes[imageName];

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
                onClick={team?.canSelect ? () => handleClickedHero(hero) : undefined}
              >
                <motion.div className="relative z-10 overflow-hidden rounded-lg transition-all">
                  <ImageHash
                    alt={hero.name}
                    blurhash={blurHash}
                    width={200}
                    height={200}
                    quality={80}
                    src={`/images/champions/tiles/${hero.id
                      .toLowerCase()
                      .replace(/\s+/g, '')
                      .replace(/[\W_]+/g, '')}.jpg`}
                  />
                  <div className="my-auto flex items-center justify-center overflow-hidden">
                    <AnimatePresence>
                      <motion.div
                        transition={{ duration: 0.1, defaultTransition}}
                        whileHover={
                          hero.name !== selectedChampion || !team?.canSelect
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
                          width={300}
                          height={300}
                          className="absolute h-full w-full scale-110 object-cover"
                        />
                      </motion.div>
                    </AnimatePresence>
                    {activeState && (
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 0.5 }}
                        exit={{ opacity: 0, transition: { duration: 0.02 } }}
                        transition={{
                          duration: 0.1,
                          defaultTransition,
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
                        exit={{ opacity: 0, transition: { duration: 0.02 }, }}
                        transition={{
                          duration: 0.1,
                          defaultTransition,
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
                              transition: { duration: 0.02 },
                            }}
                            transition={{
                              duration: 0.1,
                            }}
                            className="absolute left-0 top-0 mx-auto h-full w-full object-cover"
                          >
                            <Image
                              src={`/images/champions/splash/${hero.id
                                .toLowerCase()
                                .replace(/\s+/g, '')
                                .replace(/[\W_]+/g, '')}.jpg`}
                              alt={hero.name}
                              width={300}
                              height={300}
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
    </motion.div>
  );
};

export default ChampionsPool;
