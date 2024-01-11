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

const TeamBans: React.FC<Team> = ({ team }) => {
  const { room } = roomStore((state) => state);
  const isDone = room?.status === 'done';
  const [borderIndex, setBorderIndex] = useState<number | null>(null);

  useEffect(() => {
    const shouldSetBorder =
      team.isturn && room?.status === 'ban' && team.nb_turn > 0;

    if (shouldSetBorder) {
      const timer = setTimeout(() => {
        setBorderIndex(
          team.heroes_ban.findIndex((hero: Hero) => !hero.selected)
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
    const lol = {
      backgroundImage: `url("/images/champions/splash/${heroId
        .toLowerCase()
        .replace(/\s+/g, '')
        .replace(/[\W_]+/g, '')}.jpg")`,
      backgroundSize: 'cover',
      height: '100%',
      width: '100%',
    };
    return lol;
  };

  return (
    <motion.div
      className={`flex h-full w-full gap-2 ${team.isturn || isDone ? 'opacity-100' : 'opacity-60'
        }`}
    >
      {Array.from({ length: 3 }).map((_, index) => {
        const hero = team.heroes_ban[index];
        const isClickedHeroSlot = index === borderIndex && team.clicked_hero;
        const isBorderSlot = index === borderIndex;
        const isEmptySlot = !isClickedHeroSlot && !hero.id;

        const slotClassName = clsx(
          'h-24 w-full rounded-md overflow-hidden relative',
          isEmptySlot
            ? 'border border-white bg-slate-900 bg-opacity-20 border-opacity-5'
            : 'border border-white border-opacity-0'
        );

        return (
          <div key={index} className="relative w-full h-24 ">

            {isBorderSlot && (
              <AnimatePresence>
                <motion.div
                  key="border" // Key is static, but the presence of this div is controlled by isBorderSlot
                  initial={{ opacity: 0, zIndex: 50 }} // Starts from fully transparent
                  animate={{ opacity: 1 }} // Fades to fully opaque
                  exit={{ opacity: 0, transition: { duration: 1 } }} // 2 seconds fade out
                  transition={{
                    duration: 1,
                    repeat: Infinity,
                    repeatType: 'reverse',
                  }}
                  className="absolute left-0 top-0 z-50 h-24 w-full rounded-md border border-red-600 bg-red-600 bg-opacity-40"
                ></motion.div>
              </AnimatePresence>
            )}
            <div className={slotClassName}>
              <AnimatePresence>
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
                      className="absolute left-0 top-0 h-full w-full bg-cover bg-center"
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

                        className='absolute left-0 top-0 z-50 flex w-full h-full justify-center items-center'>
                        <p className='text-sm'>{team.clicked_hero}</p>
                      </motion.div>à
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
                      className="absolute left-0 top-0 h-full w-full overflow-hidden bg-cover bg-center grayscale"
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
                      className="absolute z-50 flex h-full w-full items-end justify-center bg-gradient-to-t from-[#000000] to-transparent"
                    >
                      <motion.div className='z-50 absolute top-0 left-0 w-full h-full flex justify-center items-center'><p className='text-sm'>{hero.name}</p></motion.div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>
          </div>
        );
      })}
    </motion.div>
  );
};

export default TeamBans;
