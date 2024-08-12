import ExtendedImage from '@/app/components/common/ExtendedImage';
import useCurrentHero from '@/app/hooks/useCurrentHero';
import useTeams from '@/app/hooks/useTeams';
import defaultTransition from '@/app/lib/animationConfig';
import useRoomStore from '@/app/stores/roomStore';
import useTeamStore from '@/app/stores/teamStore';
import { Database } from '@/app/types/supabase';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import debounce from 'lodash/debounce';
import React, { useCallback, useEffect, useMemo, useState } from 'react';

type Hero = Database['public']['CompositeTypes']['hero'];

const DEBOUNCE_TIME = 50; // ms

const ChampionsPool = React.memo(({ className }: { className?: string }) => {
  const { room } = useRoomStore();
  const { currentTeam } = useTeams();
  const { updateTeam, isSpectator } = useTeamStore();
  const currentHero = useCurrentHero();
  const canInteract =
    !isSpectator &&
    currentTeam?.can_select &&
    currentTeam?.is_turn &&
    room?.status !== 'planning';
  const [hoveredHero, setHoveredHero] = useState<string | null>(null);

  const opacity =
    (currentTeam?.is_turn || isSpectator) && room?.status !== 'planning'
      ? 1
      : 0.8;

  if (!room) {
    throw new Error('Room is not initialized');
  }

  const debouncedSetHoveredHero = useMemo(
    () =>
      debounce(
        (heroID: string | null) => setHoveredHero(heroID),
        DEBOUNCE_TIME
      ),
    []
  );

  useEffect(() => {
    if (!canInteract) {
      setHoveredHero(null);
    }
  }, [canInteract]);

  const handleHoveredHero = useCallback(
    async (heroID: string | null) => {
      if (!canInteract && room.status !== 'planning' && !isSpectator) return;
      debouncedSetHoveredHero(heroID);
    },
    [canInteract, debouncedSetHoveredHero, room.status, isSpectator]
  );

  const debouncedHandleClickedHero = useMemo(
    () =>
      debounce((hero: Hero) => {
        if (!canInteract) return;
        const updateArray =
          room.status === 'ban' ? 'heroes_ban' : 'heroes_selected';
        const currentArray = currentTeam[updateArray] as Hero[];

        const firstEmptyIndex = currentArray.findIndex(
          (item) => !item.selected
        );
        if (firstEmptyIndex !== -1) {
          const updatedArray = [...currentArray];
          updatedArray[firstEmptyIndex] = { ...hero, selected: false };

          updateTeam(currentTeam.id, {
            [updateArray]: updatedArray,
          });
        }
      }, DEBOUNCE_TIME),
    [canInteract, currentTeam, updateTeam, room.status]
  );

  return (
    <motion.div
      animate={{ opacity }}
      className={clsx('relative grid grid-cols-10 gap-2', className)}
    >
      {(room.heroes_pool as Hero[]).map((hero, index) => {
        const isSelected = hero.id === currentHero?.id && currentTeam?.is_turn;
        const isHovered = hero.id === hoveredHero;
        return (
          <motion.div
            key={hero.id}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{
              duration: 0.4,
              delay: 0.01 * index,
              defaultTransition,
            }}
            className={clsx('relative overflow-hidden', {
              'pointer-events-none grayscale': hero.selected,
              'cursor-pointer': canInteract || isSpectator,
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
                transition={defaultTransition}
                className="absolute left-0 top-0 z-20 h-full w-full bg-gray-900 bg-opacity-70"
              >
                <p className="flex h-full w-full items-center justify-center text-center text-xs font-bold">
                  {hero.name}
                </p>
              </motion.div>
            )}
            {isSelected && !isSpectator && (
              <motion.div
                className={clsx(
                  'absolute left-0 top-0 z-50 h-full w-full overflow-hidden bg-gradient-to-t',
                  {
                    'glow-red border-2 border-red-700 from-red to-transparent':
                      room.status === 'ban',
                    'border border-yellow from-yellow-transparent to-transparent':
                      room.status === 'select',
                  }
                )}
              >
                <p className="flex h-full w-full items-center justify-center text-center text-xs font-semibold">
                  {hero.name}
                </p>
              </motion.div>
            )}
            <motion.div
              animate={{
                scale: isHovered && !isSelected ? 1.2 : 1,
              }}
              transition={defaultTransition}
              className="relative overflow-hidden"
            >
              {hero.id && (
                <ExtendedImage
                  alt={hero.id}
                  width={380}
                  height={380}
                  priority
                  type="tiles"
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
