import React, { useState, useCallback, useEffect } from 'react';
import { roomStore } from '@/app/stores/roomStore';
import { Database } from '@/app/types/supabase';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import useNextBlurhash from "use-next-blurhash";
import debounce from 'lodash/debounce';

interface Hero {
  name: string;
  id: string;
  selected: boolean;
  clicked_hero: boolean;
}

interface HeroPoolProps {
  team?: Database['public']['Tables']['teams']['Row'];
  selectedChampion?: string;
  canSelect?: boolean;
  handleClickedHero?: (hero: Hero) => void;
}

const ChampionsPool: React.FC<HeroPoolProps> = ({
  team,
  selectedChampion,
  canSelect,
  handleClickedHero = () => { },
}) => {
  const [blurDataUrl] = useNextBlurhash("LAHfPK02lU~Ct-={0KxtTe-VDhIo");

  const [hoverIndex, setHoverIndex] = useState(-1);
  const { room } = roomStore();

  const debouncedSetHoverIndex = useCallback(debounce((index) => {
    setHoverIndex(index);
  }, 100), []);

  useEffect(() => {
    if (!canSelect && room?.status !== 'planning') {
      debouncedSetHoverIndex(-1);
    }
  }, [canSelect, debouncedSetHoverIndex, room?.status]);

  if (!room?.heroes_pool || !Array.isArray(room.heroes_pool)) return null;

  return (
    <div className="flex flex-col px-24">
      <div className="grid cursor-pointer grid-cols-10 gap-2">
        {(room.heroes_pool as unknown as Hero[]).map(
          (hero: Hero, index: number) => {
            const isActive =
              hoverIndex === index ||
              (hero.name === selectedChampion && team?.isturn);
            const isturnAvailable = team ? team.isturn : true;
            const shouldFade = hero.selected || (team && !isturnAvailable);
            return (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: shouldFade ? 0.7 : 1 }}
                transition={{ duration: .1, ease: [0.4, 0.0, 0.2, 1] }}
                key={index}
                whileTap={{
                  scale: 0.9,
                  zIndex: 50,
                }}
                whileHover={
                  !isActive && hero.name !== selectedChampion
                    ? {
                      scale: 1.05,
                      zIndex: 50,
                    }
                    : {}
                }
                className={clsx('z-10 overflow-hidden rounded-md', {
                  'bg-gray-800': isActive,
                  grayscale: hero.selected,
                  'pointer-events-none': hero.selected || !isturnAvailable,
                  'glow-yellow z-50 overflow-hidden rounded-xl border border-yellow border-opacity-100 bg-transparent p-1':
                    hero.name === selectedChampion && team?.isturn,
                })}
                onClick={canSelect ? () => handleClickedHero(hero) : undefined}
                onMouseEnter={() => debouncedSetHoverIndex(index)}
                onMouseLeave={() => {
                  if (!hero.selected) {
                    setHoverIndex(-1);
                  }
                }}
              >
                <motion.div className="relative z-10 overflow-hidden rounded-lg transition-all">
                  <Image
                    placeholder="blur"
                    blurDataURL={blurDataUrl}
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
                      {isActive && (
                        <>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 0.5 }}
                            exit={{ opacity: 0 }}
                            transition={{
                              duration: 0.1,
                              ease: [0.4, 0.0, 0.2, 1],
                            }}
                            className="absolute left-0 top-0 z-50 h-full w-full overflow-hidden rounded-lg bg-gradient-to-t from-yellow to-transparent bg-clip-content"
                          ></motion.div>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{
                              duration: 0.2,
                              ease: [0.4, 0.0, 0.2, 1],
                            }}
                            className={`absolute top-0 z-50 flex h-full items-center text-center text-sm font-bold text-white`}
                          >
                            <p className="z-50">{hero.name}</p>
                          </motion.div>
                          <motion.div
                           initial={{ scale: 1.3, opacity: 0 }}
                           animate={{ scale: 1.2, opacity: 1 }}
                           whileHover={{ scale: 1 }}
                           exit={{ scale: 1, opacity: 0, transition: { duration: 0.2 } }}
                           transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
                           className="absolute left-0 top-0 mx-auto h-full w-full object-cover"
                          >
                            <Image
                              src={`/images/champions/splash/${hero.id
                                .toLowerCase()
                                .replace(/\s+/g, '')
                                .replace(/[\W_]+/g, '')}.jpg`}
                              alt={hero.name}
                              width={800}
                              height={800}
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
