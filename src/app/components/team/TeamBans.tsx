import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useMemo, useState } from 'react';
import { roomStore } from '@/app/stores/roomStore';
import useTeams from '@/app/hooks/useTeams';

type Hero = {
  [key: string]: any;
}

type Team = {
  [key: string]: any;
}

const TeamBans = ({ team }: Team) => {
  const { room } = roomStore();
  const { currentTeam } = useTeams();
  const [borderIndex, setBorderIndex] = useState<number | null>(null);

  useEffect(() => {
    if (team.isturn && team.canSelect && room?.status === 'ban') {
      const timer = setTimeout(() => {
        setBorderIndex(team.heroes_ban.findIndex((hero: Hero) => !hero.selected));
      }, 1000);
      return () => clearTimeout(timer);
    } else {
      setBorderIndex(null);
    }
  }, [room, team]);

  useEffect(() => {
    if (!team.clicked_hero) {
      setBorderIndex(null);
    }
  }, [team.clicked_hero]);

  const getHeroImageSrc = (id: string) =>
    `/images/champions/splash/${id
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
        const isHeroSelected = hero?.selected;
        const hasHeroId = hero?.id && hero.id !== '';
        return (
          <motion.div
            key={index}
            className="relative h-full w-full overflow-hidden"
            animate={{ opacity: !currentTeam?.isturn ? 0.5 : 1 }}
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
                        quality={50}
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
      {isHeroSelected ? (
        hasHeroId ? (
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
              alt={hero?.name}
              src={heroImageSrc}
              layout="fill"
              objectFit="cover"
              quality={80}
            />
          </motion.div>
        ) : (
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
        )
      ) : null}
      <div className="absolute bottom-0 left-0 right-0 z-50 flex h-full w-full items-end justify-center bg-black bg-opacity-10 pb-6 text-center text-sm text-white">
        {hero?.name}
      </div>
    </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default TeamBans;
