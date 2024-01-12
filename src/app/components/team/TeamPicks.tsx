import { roomStore } from '@/app/stores/roomStore';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

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
  const { room } = roomStore((state) => state);
  const isDone = room?.status === 'done';
  const [borderIndex, setBorderIndex] = useState<number | null>(null);

  useEffect(() => {
    const shouldSetBorder =
      team.isturn && room?.status === 'select' && team.nb_turn > 0;

    if (shouldSetBorder) {
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

  const getHeroImageStyle = (heroId: string) => {
    if (!heroId) {
      return {};
    }

    return {
      backgroundImage: `url("/images/champions/splash/${heroId
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[\W_]+/g, '')}.jpg")`,
      backgroundSize: 'cover',
      height: '100%',
      width: '100%',
    };
  };

  return (
    <motion.div
      className={`flex h-full w-full gap-2 ${
        team.isturn || isDone ? 'opacity-100' : 'opacity-60'
      }`}
    >
      {Array.from({ length: 5 }).map((_, index) => {
        const hero = team.heroes_selected[index];
        const isClickedHeroSlot = index === borderIndex && team.clicked_hero;
        const isBorderSlot = index === borderIndex;
        const isEmptySlot = !isClickedHeroSlot && !hero.id;

        const slotClassName = clsx(
          'h-44 w-full rounded-md overflow-hidden relative',
          isEmptySlot
            ? 'border border-white border-opacity-10'
            : 'border border-white border-opacity-0'
        );

        return (
          <div key={index} className="relative h-44 w-full">
            {isBorderSlot && (
              <AnimatePresence>
                <motion.div
                  key="border" // Key is static, but the presence of this div is controlled by isBorderSlot
                  initial={{ opacity: 0, zIndex: 50 }} // Starts from fully transparent
                  animate={{ opacity: 1 }} // Fades to fully opaque
                  exit={{ opacity: 0, transition: { duration: 2 } }} // 2 seconds fade out
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                  className="glow-yellow-10 absolute left-0 top-0 z-50 h-44 w-full rounded-md border border-yellow bg-yellow-300 bg-opacity-10"
                ></motion.div>
              </AnimatePresence>
            )}
            <div className={slotClassName}>
              {isClickedHeroSlot && (
                <>
                  <motion.div
                    key="clicked_hero"
                    initial={{ opacity: 0, scale: 1.3, zIndex: 1 }}
                    animate={{ opacity: 1, scale: 1.3 }}
                    exit={{
                      opacity: 1,
                      scale: 1.3,
                      transition: { duration: 0.25 },
                    }}
                    className="absolute left-0 top-0 h-full w-full bg-cover bg-center sepia"
                    style={getHeroImageStyle(team.clicked_hero)}
                  />
                  <AnimatePresence>
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{
                        opacity: 0,
                        transition: { duration: 0.25 },
                      }}
                      className="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-gradient-to-t from-black to-transparent"
                    >
                      <p className="text-sm">{team.clicked_hero}</p>
                    </motion.div>
                    à
                  </AnimatePresence>
                </>
              )}

              {hero.id && (
                <>
                  <motion.div
                    key="hero"
                    initial={{ opacity: 1, scale: 1.3, zIndex: 2 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{
                      opacity: 0,
                      scale: 1,
                      transition: { delay: 0.3, duration: 0.25 },
                    }}
                    transition={{
                      delay: 0.15,
                      duration: 0.5,
                      ease: [1, -0.6, 0.3, 1.2],
                    }}
                    className="absolute left-0 top-0 h-full w-full overflow-hidden bg-cover bg-center"
                    style={getHeroImageStyle(hero.id)}
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{
                      delay: 0,
                      duration: 0.8,
                      ease: [1, -0.6, 0.3, 1.2],
                    }}
                    className="absolute z-50 flex h-full w-full items-end justify-center bg-gradient-to-t from-[#000000] to-transparent pb-4 text-xs"
                  >
                    <motion.div className="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center">
                      <p className="text-sm">{hero.name}</p>
                    </motion.div>
                  </motion.div>
                </>
              )}
            </div>
          </div>
        );
      })}
    </motion.div>
  );
};

export default TeamPicks;
