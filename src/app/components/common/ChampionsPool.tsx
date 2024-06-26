import defaultTransition from '@/app/lib/animationConfig';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import React, { useState, useCallback } from 'react';
import ExtendedImage from '@/app/components/common/ExtendedImage';
import useRoomStore from '@/app/stores/roomStore';
import useTeamStore from '@/app/stores/teamStore';
import useTeams from '@/app/hooks/useTeams';
import useCurrentHero from '@/app/hooks/useCurrentHero';

type Hero = {
  id: string;
  name: string;
  selected: boolean;
}

type ChampionsPoolProps = {
  className?: string;
}

const ChampionsPool: React.FC<ChampionsPoolProps> = React.memo(({
  className = '',
}) => {
  const { room } = useRoomStore();
  const { currentTeam } = useTeams();
  const [hoveredHero, setHoveredHero] = useState<string | null>(null);
  const { updateTeam, teamAction } = useTeamStore();
  const currentHero = useCurrentHero();

  const handleClickedHero = useCallback((hero: Hero) => {
    if (!currentTeam?.canSelect) return;

    const updateArray = room?.status === 'ban' ? 'heroes_ban' : 'heroes_selected';
    const currentArray = currentTeam[updateArray];

    const firstEmptyIndex = currentArray.findIndex(item => !item.selected);
    if (firstEmptyIndex !== -1) {
      const updatedArray = [...currentArray];
      updatedArray[firstEmptyIndex] = { ...hero, selected: false };

      updateTeam(currentTeam.id, {
        [updateArray]: updatedArray,
      });
    }
  }, [currentTeam, updateTeam, room?.status]);

  if (!room?.heroes_pool || !Array.isArray(room.heroes_pool)) return null;

  return (
    <motion.div
      animate={{
        opacity: teamAction ? 1 : 0.8,
      }}
      className={clsx(
        'relative grid grid-cols-10 gap-2', className
      )}
    >
      {room.heroes_pool.map((hero: Hero, index: number) => {
        const isSelected = hero.id === currentHero?.id && currentTeam?.isturn;
        const isHovered = hero.id === hoveredHero;
        const canInteract = room?.status !== 'planning' && ((currentTeam?.isturn && currentTeam.canSelect) || currentTeam === undefined);

        return (
          <motion.div
            key={hero.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.01 * index, defaultTransition }}
            className={clsx('relative overflow-hidden', {
              'pointer-events-none grayscale': hero.selected,
              'pointer-events-none': (!currentTeam?.isturn || !currentTeam?.canSelect || !teamAction) && room?.status !== 'planning',
              'cursor-pointer': !hero.selected && canInteract,
            })}
            onClick={canInteract ? () => handleClickedHero(hero) : undefined}
            onMouseEnter={() => setHoveredHero(hero.id)}
            onMouseLeave={() => setHoveredHero(null)}
          >
            {isHovered && !isSelected && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={defaultTransition}
                className="absolute left-0 top-0 z-20 h-full w-full bg-gray-900 bg-opacity-70"
              >
                <p className="flex h-full text-center w-full items-center justify-center text-xs font-bold">
                  {hero.name}
                </p>
              </motion.div>
            )}
            {isSelected && (
              <motion.div
                className={clsx(
                  'absolute left-0 top-0 z-50 h-full w-full overflow-hidden bg-gradient-to-t',
                  {
                    'from-red to-transparent glow-red  border-red-700 border-2':
                      isSelected && room.status === 'ban',
                    'from-yellow-transparent to-transparent border-yellow border':
                      isSelected && room.status === 'select',
                  }
                )}
              >
                <p className="flex h-full text-center w-full items-center justify-center text-xs font-semibold">
                  {hero.name}
                </p>
              </motion.div>
            )}
            <motion.div
              animate={{
                scale: isHovered && !isSelected ? 1.2 : 1,
              }}
              transition={{ duration: 0.1, defaultTransition }}
              className="relative overflow-hidden"
            >
              <ExtendedImage
                alt={hero.id}
                width={380}
                height={380}
                priority
                type='tiles'
                src={hero.id}
              />
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
});

ChampionsPool.displayName = 'ChampionsPool';

export default ChampionsPool;