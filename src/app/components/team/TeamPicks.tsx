import { roomStore } from '@/app/stores/roomStore';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import useTeams from '@/app/hooks/useTeams';
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

const TeamPicks = ({ team }: Team) => {
  const { room } = roomStore();
  const { currentTeam } = useTeams();
  const [borderIndex, setBorderIndex] = useState<number | null>(null);

  useEffect(() => {
    if (team.isturn && team.canSelect && room?.status === 'select') {
      const index = team.heroes_selected.findIndex((hero: Hero) => !hero.selected);
      setBorderIndex(index);
    } else {
      setBorderIndex(null);
    }
  }, [team, room]);

  return (
    <motion.div className="flex h-full w-full gap-2">
      {team.heroes_selected.map((hero: Hero, index: number) => {
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
                className="glow-yellow-10 absolute inset-0 z-40 border border-yellow bg-opacity-10 bg-gradient-to-t from-yellow-transparent to-transparent"
                animate={{ opacity: [0.4, 1] }}
                initial={{ opacity: 0 }}
                exit={{ opacity: 0 }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatType: 'reverse',
                }}
              />
            )}

            {!isEmptySlot && (
              <>
                <motion.div
                  initial={{ scale: 1.25 }}
                  animate={{ scale: isBorderSlot ? 1.25 : 1 }}
                  className={clsx('h-full w-full', { sepia: isBorderSlot })}
                  transition={{ duration: 0.4, delay: 0.5, ease: [1, -0.6, 0.3, 1.2] }}
                >
                  {(team.clicked_hero || hero.id) && (
                    <ExtendedImage
                      alt={team.clicked_hero || ''}
                      type={'centered'}
                      src={isBorderSlot ? team.clicked_hero : hero.id}
                      style={{ objectPosition: 'center', objectFit: 'cover' }}
                      fill
                    />
                  )}
                </motion.div>
                <p className="z-10 text-sm absolute bottom-0 items-end left-0 h-full w-full flex justify-center pb-4">
                  {isBorderSlot ? team.clicked_hero : hero.name}
                </p>
              </>
            )}
          </motion.div>
        );
      })}
    </motion.div>
  );
};

export default TeamPicks;
