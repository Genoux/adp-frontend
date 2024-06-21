import { defaultTransition } from '@/app/lib/animationConfig';
import { roomStore } from '@/app/stores/roomStore';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import React, { useState, useCallback } from 'react';
import { supabase } from '@/app/lib/supabase/client';
import useTeams from '@/app/hooks/useTeams';
import ExtendedImage from '@/app/components/common/ExtendedImage';

interface Hero {
  id: string;
  name: string;
  selected: boolean;
}

interface Team {
  [key: string]: any;
}

interface ChampionsPoolProps {
  team?: Team;
  className?: string;
}

const ChampionsPool: React.FC<ChampionsPoolProps> = React.memo(({
  team,
  className = '',
}) => {
  const { room } = roomStore();
  const { currentTeam } = useTeams();
  const [hoveredHero, setHoveredHero] = useState<string | null>(null); // State to track hovered hero

  const handleClickedHero = useCallback(async (hero: Hero) => {
    if (!team?.isturn || !team.canSelect) return;
    if (room?.status !== 'select' && room?.status !== 'ban') return;
    if (hero.selected) return;

    if (!currentTeam || hero.id === currentTeam.clicked_hero) return;
    await supabase
      .from('teams')
      .update({ clicked_hero: hero.id })
      .eq('id', currentTeam.id);
  }, [team?.isturn, team?.canSelect, room?.status, currentTeam]);

  const handleHoverStart = useCallback((heroName: string) => {
    setHoveredHero(heroName);
  }, []);

  const handleHoverEnd = useCallback(() => {
    setHoveredHero(null);
  }, []);

  if (!room?.heroes_pool || !Array.isArray(room.heroes_pool)) return null;

  return (
    <motion.div
      animate={{
        opacity: team?.isturn || room?.status === 'planning' || team === undefined ? 1 : 0.8,
      }}
      className={clsx(
        'relative grid grid-cols-10 gap-2', className
      )}
    >
      {room.heroes_pool.map((hero: Hero, index: number) => {
        const isSelected = hero.id === team?.clicked_hero;
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
              'pointer-events-none': (!team?.isturn || !team.canSelect) && room?.status !== 'planning',
              'cursor-pointer': !hero.selected && team?.isturn,
            })}
            onClick={team?.isturn ? () => handleClickedHero(hero) : undefined}
            onMouseEnter={() => handleHoverStart(hero.id)}
            onMouseLeave={handleHoverEnd}
          >
            {isHovered && !isSelected && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={defaultTransition}
                className="absolute left-0 top-0 z-20 h-full w-full bg-gray-900 bg-opacity-70"
              >
                <p className="flex h-full items-center justify-center text-xs font-bold">
                  {hero.name}
                </p>
              </motion.div>
            )}
            {isSelected && (
              <motion.div
                className={clsx(
                  'absolute left-0 top-0 z-50 h-full w-full overflow-hidden bg-gradient-to-t',
                  {
                    'from-red to-transparent glow-red  border-red-700 border-2 p-4':
                      isSelected && room.status === 'ban',
                    'from-yellow-transparent to-transparent border-yellow border p-4':
                      isSelected && room.status === 'select',
                  }
                )}
              >
                <p className="flex h-full items-center justify-center text-xs font-bold">
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
