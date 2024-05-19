import { useEffect, useState } from 'react';
import { roomStore } from '@/app/stores/roomStore';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
interface Hero {
  name: string;
  id: string;
  selected: boolean;
}

interface Team {
  [key: string]: any;
}

const TeamBans: React.FC<Team> = ({ team }) => {
  const { room } = roomStore();
  const [borderIndex, setBorderIndex] = useState<number | null>(null);

  useEffect(() => {
    if (team.isturn) {
      setBorderIndex(team.heroes_ban.findIndex((hero: Hero) => !hero.selected));
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
    <motion.div
      className="flex h-full w-full gap-2">
      {Array.from({ length: 3 }).map((_, index) => {
        const hero = team.heroes_ban[index];
        const isBorderSlot = index === borderIndex;
        const isEmptySlot = !isBorderSlot && !hero.id;
        const imageSrc = `/images/champions/splash/${hero.id ? hero.id.toLowerCase().replace(/\s+/g, '').replace(/[\W_]+/g, '') : 'placeholder'}.jpg`;
        const ClickedHero = `/images/champions/splash/${team.clicked_hero ? team.clicked_hero.toLowerCase().replace(/\s+/g, '').replace(/[\W_]+/g, '') : 'placeholder'}.jpg`;

        return (

          <motion.div
            animate={{ opacity: !team.isturn ? 0.8 : 1 }}
            key={index} className="relative h-full w-full overflow-hidden">
            {isBorderSlot && (
              <AnimatePresence>
                <div className="flex items-end justify-center pb-6 absolute bottom-0 h-full w-full left-0 right-0 z-50 text-center text-sm text-white">
                  {team.clicked_hero}
                </div>
                <div className='relative overflow-hidden w-full h-full'>
                  <motion.div
                    animate={{ opacity: [0.2, 0.7] }}
                    transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse' }}
                    className="glow-red-10 absolute inset-0 z-40 border border-red bg-gradient-to-t from-red to-transparent bg-opacity-10"
                  />
                  {team.clicked_hero && (
                    <motion.div
                      className="absolute inset-0 z-10"
                      initial={{ scale: 1.2 }}>
                      <Image
                        alt={team.clicked_hero}
                        src={ClickedHero}
                        layout="fill"
                        objectFit="cover"
                        quality={80}
                      />
                    </motion.div>
                  )}
                </div>
              </AnimatePresence>
            )}
            <div className={clsx("relative h-full overflow-hidden border bg-black bg-opacity-20", {
              'border border-white border-opacity-10': isEmptySlot,
              'border border-white border-opacity-0': !isEmptySlot
            })}>
              {hero.id && (
                <motion.div
                  className="h-full w-full absolute top-0 left-0 grayscale"
                  initial={{ scale: 1.2 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, ease: [1, -0.6, 0.3, 1.2], delay: 0.2 }}
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
              <div className="flex items-end justify-center pb-6 absolute bottom-0 h-full w-full left-0 right-0 z-50 text-center text-sm text-white bg-gradient-to-t from-black to-transparent">
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
