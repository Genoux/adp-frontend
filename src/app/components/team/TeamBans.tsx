
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import useTeams from '@/app/hooks/useTeams';
import useRoomStore from '@/app/stores/roomStore';
import ExtendedImage from '@/app/components/common/ExtendedImage';

type Hero = {
  id: string;
  name: string;
  selected: boolean;
  [key: string]: any;
};

type Team = {
  [key: string]: any;
};

const TeamBans = ({ team }: Team) => {
  const { room } = useRoomStore();
  const { currentTeam } = useTeams();
  const [borderIndex, setBorderIndex] = useState<number | null>(null);

  useEffect(() => {
    if (team.isturn && team.canSelect && room?.status === 'ban') {
      setBorderIndex(team.heroes_ban.findIndex((hero: Hero) => !hero.selected));
    } else {
      setBorderIndex(null);
    }
  }, [team, room]);

  return (
    <motion.div className="flex h-full w-full gap-2">
      {team.heroes_ban.map((hero: Hero, index: number) => {
        const isBorderSlot = index === borderIndex && team.isturn;
        const isEmptySlot = !isBorderSlot && !hero.id;

        return (
          <motion.div
            key={`${index} ${hero.id}`}
            className={clsx('relative h-full w-full overflow-hidden border border-white bg-black bg-opacity-20', {
              'border-opacity-5': isEmptySlot,
              'border-opacity-0': !isEmptySlot,
            })}
            animate={{ opacity: currentTeam?.isturn || currentTeam === undefined ? 1 : 0.8 }}
          >
            {isBorderSlot && (
              <motion.div
                className="glow-red-10 absolute inset-0 z-10 border border-red bg-opacity-10 bg-gradient-to-t from-red to-transparent"
                animate={{ opacity: [0.5, 1] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
            )}
            {!isEmptySlot && hero.id !== null ? (
              <>
                <motion.div
                  className="h-full w-full grayscale"
                  initial={{ scale: 1.25 }}
                  animate={{ scale: isBorderSlot ? 1.25 : 1 }}
                  transition={{ duration: 0.4, delay: 0.2, ease: [1, -0.6, 0.3, 1.2] }}
                >
                  {(team.clicked_hero || hero.id) && (
                    <ExtendedImage
                      alt={team.clicked_hero || ''}
                      type={'tiles'}
                      src={isBorderSlot ? team.clicked_hero : hero.id}
                      style={{ objectPosition: 'center', objectFit: 'cover' }}
                      fill
                    />
                  )}
                </motion.div>
                <p className='z-20 text-sm absolute bottom-0 items-end left-0 h-full w-full flex justify-center pb-4'>
                  {isBorderSlot ? team.clicked_hero : hero.name}
                </p>
              </>
            ) : (
              <>
                {
                  hero.id === null ? (
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
                  ) : (
                    null
                  )
                }

              </>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default TeamBans;
