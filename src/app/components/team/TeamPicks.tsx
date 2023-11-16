import { useState, useEffect, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { roomStore } from "@/app/stores/roomStore";
import clsx from 'clsx';
import { defaultTransition } from '@/app/lib/animationConfig'

interface Team {
  [key: string]: any;
  applyHeightVariants?: boolean;
}

interface Hero {
  name: string;
  id: string;
  selected: boolean;
}

const TeamPicks: React.FC<Team> = ({ team }) => {
  const { room } = roomStore(state => state);
  const isDone = room?.status === "done";
  const [borderIndex, setBorderIndex] = useState<number | null>(null);
  

  useEffect(() => {
    const shouldSetBorder = team.isturn && room?.status === 'select' && team.nb_turn > 0;
    
    if (shouldSetBorder) {
      // Delay setting the new border index
      const delay = 1000; // 2 seconds delay
      const timer = setTimeout(() => {
        setBorderIndex(team.heroes_selected.findIndex((hero: Hero) => !hero.selected));
      }, delay);
  
      // Clean up the timeout if the component unmounts or the dependencies change
      return () => clearTimeout(timer);
    } else {
      // If the condition is not met, set borderIndex to null immediately
     // setBorderIndex(null);
    }
  }, [team, room]);

  useEffect(() => {
    if (!team.clicked_hero) {
      setBorderIndex(null);
    }
  }, [team.clicked_hero]);

  const getHeroImageStyle = (heroId: string) => {
    // If heroId is undefined, return an empty style object or a default style
    if (!heroId) {
      return {}; // or some default style if needed
    }

    return {
      backgroundImage: `url("/images/champions/splash/${heroId.toLowerCase().replace(/\s+/g, '').replace(/[\W_]+/g, '')}.jpg")`,
      backgroundSize: 'cover',
      height: '100%',
      width: '100%'
    };
  };

  return (
    <motion.div className={`grid grid-cols-5 h-44 pb-4 gap-2 w-full ${team.isturn || isDone ? "opacity-100" : "opacity-60"}`}>
      {Array.from({ length: 5 }).map((_, index) => {
        const hero = team.heroes_selected[index];
        const isClickedHeroSlot = index === borderIndex && team.clicked_hero;
        const isBorderSlot = index === borderIndex;
        const isEmptySlot = !isClickedHeroSlot && !hero.id;

        const slotClassName = clsx(
          "h-full w-full rounded-md overflow-hidden relative",
          isEmptySlot ? "border border-white border-opacity-10" : "border border-white border-opacity-0"
        );

        return (
          <div key={index} className='relative'>
            {isBorderSlot &&
              <AnimatePresence>
                <motion.div
                  key="border" // Key is static, but the presence of this div is controlled by isBorderSlot
                  initial={{ opacity: 0, zIndex: 50 }} // Starts from fully transparent
                  animate={{ opacity: 1 }} // Fades to fully opaque
                  exit={{ opacity: 0, transition: { duration: 1 } }} // 2 seconds fade out
                  transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
                  className="absolute rounded-md z-50 top-0 left-0 w-full h-full bg-yellow-300 bg-opacity-10 border-yellow border glow-yellow-10">
                </motion.div>
              </AnimatePresence>
            }
          <div className={slotClassName}>
              <AnimatePresence>
                {isClickedHeroSlot && (
                  <motion.div
                    key="clicked_hero"
                    initial={{ opacity: 0, scale: 1.5, zIndex: 1 }}
                    animate={{ opacity: 1, scale: 1.5 }}
                    exit={{ opacity: 1, scale: 1.5, transition: { duration: 0.25 } }}
                    className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
                    style={getHeroImageStyle(team.clicked_hero)}
                  />
                )}

                {hero.id && (
                  <motion.div
                    key="hero"
                    initial={{ opacity: 1, scale: 1.5, zIndex: 2 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1, transition: { delay: 0.3, duration: 0.25 } }}
                    transition={{ delay: 0.15, duration: 0.5, ease: [1,-0.6,.3,1.4] }}
                    className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
                    style={getHeroImageStyle(hero.id)}
                  />
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
};

export default TeamPicks;
