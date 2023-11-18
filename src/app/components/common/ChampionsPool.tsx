import { Database } from "@/app/types/supabase";
import Image from "next/image";
import clsx from "clsx";
import { roomStore } from "@/app/stores/roomStore";
import { useState, useEffect, useCallback } from "react";
import { AnimatePresence, motion } from 'framer-motion';

interface Hero {
  name: string;
  id: string;
  selected: boolean;
  clicked_hero: boolean;
}

interface HeroPoolProps {
  team?: Database["public"]["Tables"]["teams"]["Row"];
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
  const [hoverIndex, setHoverIndex] = useState(-1);
  const { room } = roomStore();
  const setHoverState = useCallback((index: number) => {
    setHoverIndex(index);
  }, []);

  useEffect(() => {
    if (!canSelect && room?.status !== 'planning') {
      setHoverState(-1);
    }
  }, [canSelect, room?.status, setHoverState]);

  if (!room?.heroes_pool || !Array.isArray(room.heroes_pool)) return null;

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-10 gap-2 cursor-pointer">
        {(room.heroes_pool as unknown as Hero[]).map(
          (hero: Hero, index: number) => {
            const isActive = hoverIndex === index || hero.name === selectedChampion && team?.isturn;
            const isturnAvailable = team ? team.isturn : true;
            const shouldFade = hero.selected || (team && !isturnAvailable);
            return (
              <motion.div
                initial={{ opacity: 1 }}
                animate={{ opacity: shouldFade ? 0.7 : 1 }}
                transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
                key={index}
                className={clsx("rounded-md", {
                  "bg-gray-800": isActive,
                  "grayscale": hero.selected,
                  "pointer-events-none": hero.selected || !isturnAvailable,
                  "z-50 border border-opacity-100 border-yellow overflow-hidden p-1 bg-transparent glow-yellow": hero.name === selectedChampion && team?.isturn,
                })}
                onClick={canSelect ? () => handleClickedHero(hero) : undefined}
                onMouseEnter={() => {
                  if (!canSelect && room?.status != 'planning') return
                  setHoverIndex(index);
                }}
                onMouseLeave={() => {
                  if (!hero.selected) {
                    setHoverIndex(-1);
                  }
                }}>
                <div className="relative overflow-hidden rounded">
                  <Image
                    src={`/images/champions/tiles/${hero.id.toLowerCase().replace(/\s+/g, '').replace(/[\W_]+/g, '')}.jpg`}
                    alt={hero.name}
                    sizes="100vw"
                    width={500}
                    height={500}
                  />
                  <div className="flex items-center justify-center my-auto overflow-hidden">
                    <AnimatePresence>
                      {isActive && (
                        <>
                          <motion.div
                            initial={{ opacity: 0 }} // Start invisible
                            animate={{ opacity: 0.5 }} // Fade in to half opacity
                            exit={{ opacity: 0 }} // Fade out to invisible
                            transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }} // Smooth transition
                            className="bg-gradient-to-t absolute z-50 from-yellow to-transparent bg-clip-content w-full h-full top-0 left-0">
                          </motion.div>
                          <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
                            className={`font-bold text-sm text-center z-50 text-white absolute h-full top-0 flex items-center`}>
                            <p className="z-50">{hero.name}</p>
                          </motion.div>
                          <motion.div
                            initial={{ scale: 1.3, opacity: 0 }}
                            animate={{ scale: 1.2, opacity: 1 }}
                            exit={{ scale: 1, opacity: 0, transition: { duration: 0.2 } }}
                            transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
                            className={`mx-auto absolute top-0 left-0 w-full h-full object-cover`}>
                            <Image
                              src={`/images/champions/splash/${hero.id.toLowerCase().replace(/\s+/g, '').replace(/[\W_]+/g, '')}.jpg`}
                              alt={hero.name}
                              width={800}
                              height={800}
                              className="w-full h-full object-cover"
                            />
                          </motion.div>
                        </>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </motion.div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default ChampionsPool;
