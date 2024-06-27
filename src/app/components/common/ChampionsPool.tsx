import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import clsx from 'clsx';
import ExtendedImage from '@/app/components/common/ExtendedImage';
import useRoomStore from '@/app/stores/roomStore';
import useTeamStore from '@/app/stores/teamStore';
import useTeams from '@/app/hooks/useTeams';
import useCurrentHero from '@/app/hooks/useCurrentHero';
import defaultTransition from '@/app/lib/animationConfig';
import debounce from 'lodash/debounce';
import { Database } from '@/app/types/supabase';

type Hero = Database["public"]["CompositeTypes"]["hero"];

type ChampionsPoolProps = {
  className?: string;
}

const DEBOUNCE_TIME = 50; // ms

const ChampionsPool: React.FC<ChampionsPoolProps> = React.memo(({ className = '' }) => {
  const { room } = useRoomStore();
  const { currentTeam } = useTeams();
  const [hoveredHero, setHoveredHero] = useState<string | null>(null);
  const { updateTeam } = useTeamStore();
  const currentHero = useCurrentHero();
  const canInteract = currentTeam?.can_select && currentTeam.is_turn;
  
  const debouncedSetHoveredHero = useMemo(
    () => debounce((heroId: string | null) => setHoveredHero(heroId), DEBOUNCE_TIME),
    []
  );

  useEffect(() => {
    if (!canInteract) {
      setHoveredHero(null);
    }
  }, [canInteract]);

  const handleHoveredHero = useCallback(async (heroID: string | null) => {
    if (!canInteract) return;
    //debounce
    debouncedSetHoveredHero(heroID);
  }, [canInteract, debouncedSetHoveredHero]);

  const debouncedHandleClickedHero = useMemo(
    () => debounce((hero: Hero) => {
      if (!canInteract) return;
      const updateArray = room?.status === 'ban' ? 'heroes_ban' : 'heroes_selected';
      const currentArray = currentTeam[updateArray] as Hero[];

      const firstEmptyIndex = currentArray.findIndex(item => !item.selected);
      if (firstEmptyIndex !== -1) {
        const updatedArray = [...currentArray];
        updatedArray[firstEmptyIndex] = { ...hero, selected: false };

        updateTeam(currentTeam.id, {
          [updateArray]: updatedArray,
        });
      }
    }, DEBOUNCE_TIME),
    [canInteract, currentTeam, updateTeam, room?.status]
  );

  if (!room) return null;

  return (
    <motion.div
      animate={{
        opacity: canInteract || room?.status === 'planning' ? 1 : 0.8,
      }}
      className={clsx('relative grid grid-cols-10 gap-2', className)}
    >
      {(room.heroes_pool as Hero[]).map((hero, index) => {
        const isSelected = hero.id === currentHero?.id;
        const isHovered = hero.id === hoveredHero;

        return (
          <motion.div
            key={hero.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4, delay: 0.01 * index, defaultTransition }}
            className={clsx('relative overflow-hidden', {
              'pointer-events-none grayscale': hero.selected,
              'cursor-pointer': canInteract,
            })}
            onClick={() => canInteract && debouncedHandleClickedHero(hero)}
            onMouseEnter={() => handleHoveredHero(hero.id)}
            onMouseLeave={() => handleHoveredHero(null)}
          >
            {isHovered && !isSelected && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{defaultTransition, duration: 0.1}}
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
                    'from-red to-transparent glow-red border-red-700 border-2': room.status === 'ban',
                    'from-yellow-transparent to-transparent border-yellow border': room.status === 'select',
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
              transition={{ defaultTransition, duration: 0.1}}
              className="relative overflow-hidden"
            >
              {hero.id && (
                <ExtendedImage
                  alt={hero.id}
                  width={380}
                  height={380}
                  priority
                  type='tiles'
                  src={hero.id}
                />
              )}
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
});

ChampionsPool.displayName = 'ChampionsPool';

export default ChampionsPool;