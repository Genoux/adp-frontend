import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { roomStore } from '@/app/stores/roomStore';
import useTeams from '@/app/hooks/useTeams';
import HeroImage from './HeroImage';

type Hero = {
  [key: string]: any;
}

type Team = {
  [key: string]: any;
}

// const getHeroImageSrc = (id: string) =>
//   `/images/champions/splash/${id.toLowerCase().replace(/\s+/g, '').replace(/[\W_]+/g, '')}.webp`;

const TeamBans = ({ team }: Team) => {
  const { room } = roomStore();
  const { currentTeam } = useTeams();
  const [borderIndex, setBorderIndex] = useState<number | null>(null);

  useEffect(() => {
    if (team.isturn && team.canSelect && room?.status === 'ban') {
      setBorderIndex(team.heroes_ban.findIndex((hero: Hero) => !hero.selected));
    } else {
      setBorderIndex(null);
    }
  }, [room, team]);

  useEffect(() => {
    if (!team.clicked_hero) {
      setBorderIndex(null);
    }
  }, [team.clicked_hero]);

  return (
    <motion.div className="flex h-full w-full gap-2">
      {team.heroes_ban.map((hero: Hero, index: number) => {
        const isBorderSlot = index === borderIndex;
        const isEmptySlot = !isBorderSlot && !hero.id;
        // const heroImageSrc = getHeroImageSrc(hero.id);
        const isHeroSelected = hero?.selected;
        const hasHeroId = hero?.id && hero.id !== '';
        return (
          <motion.div
            key={hero.id || index}
            className="relative h-full w-full overflow-hidden"
            animate={{ opacity: !currentTeam?.isturn ? 0.5 : 1 }}
          >
            {isBorderSlot && (
              <AnimatePresence mode='wait'>
                <div className="absolute bottom-0 left-0 right-0 z-50 flex h-1/2 w-full items-end justify-center pb-6 text-center text-sm text-white">
                  {team.clicked_hero}
                </div>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{
                    duration: 0.2,
                  }}
                  exit={{ opacity: 0 }}
                  className="relative h-full w-full overflow-hidden">
                  <motion.div
                    className="glow-red-10 absolute inset-0 z-40 border border-red bg-opacity-10 bg-gradient-to-t from-red to-transparent"
                    animate={{ opacity: [0.5, 1] }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      repeatType: 'reverse',
                    }}
                  />
                  {team.clicked_hero && (
                    <motion.div
                      initial={{ opacity: 0, scale: 1.2 }}
                      animate={{ opacity: 1, scale: 1.2 }}
                      transition={{
                        duration: 0.3,
                      }}
                      className="absolute inset-0 z-10" >
                      <HeroImage type='tiles' heroId={team.clicked_hero} altText={team.clicked_hero || 'Selected Hero'} />
                    </motion.div>
                  )}
                </motion.div>
              </AnimatePresence>
            )}
            <div className={clsx('relative h-full overflow-hidden border bg-black bg-opacity-20', {
              'border border-white border-opacity-10': isEmptySlot,
              'border border-white border-opacity-0': !isEmptySlot,
            })}>
              {isHeroSelected && hasHeroId && (
                <motion.div
                  className="absolute z-10 left-0 top-0 h-full w-full grayscale bg-background"
                  initial={{ scale: 1.3 }}
                  animate={{ scale: 1 }}
                  transition={{
                    duration: 0.5,
                    ease: [1, -0.6, 0.3, 1.2],
                  }}
                >
                  <HeroImage type='tiles' heroId={hero.id} altText={team.clicked_hero || 'Selected Hero'} />
                </motion.div>
              )}
              {isHeroSelected && !hasHeroId ? (
                <div className="bg-zinc-900 bg-opacity-10 h-full w-full flex justify-center items-center">
                  <svg
                    width="32"
                    height="33"
                    viewBox="0 0 32 33"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      fillRule="evenodd"
                      clipRule="evenodd"
                      d="M31.3943 4.03759C32.2019 3.23022 32.2019 1.9212 31.3943 1.11383C30.5871 0.306458 29.278 0.306458 28.4708 1.11383L16 13.5846L3.52932 1.11383C2.72191 0.306458 1.4129 0.306458 0.605528 1.11383C-0.201843 1.9212 -0.201843 3.23022 0.605528 4.03759L13.0762 16.5083L0.605528 28.979C-0.201843 29.7866 -0.201843 31.0954 0.605528 31.9029C1.4129 32.7101 2.72191 32.7101 3.52932 31.9029L16 19.4321L28.4708 31.9029C29.278 32.7101 30.5871 32.7101 31.3943 31.9029C32.2019 31.0954 32.2019 29.7866 31.3943 28.979L18.9238 16.5083L31.3943 4.03759Z"
                      fill="#232328"
                    />
                  </svg>
                </div>
              ) :
              <div className="absolute bottom-0 left-0 right-0 z-10 flex h-1/2 w-full items-end justify-center bg-gradient-to-t from-black to-transparent pb-6 text-center text-sm text-white">
              {hero?.name}
            </div>
              }
             
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default TeamBans;
