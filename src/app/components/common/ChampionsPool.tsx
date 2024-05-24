import ImageHash from '@/app/components/common/ImageHash';
import { useBlurHash } from '@/app/context/BlurHashContext';
import { defaultTransition } from '@/app/lib/animationConfig';
import { roomStore } from '@/app/stores/roomStore';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState, useCallback } from 'react';

interface Hero {
  id: string;
  name: string;
  selected: boolean;
}

interface Team {
  [key: string]: any;
}

interface BlurHashes {
  [key: string]: string;
}

interface ChampionsPoolProps {
  team?: Team;
  selectedChampion?: string | null;
  handleClickedHero?: (hero: Hero) => void;
  className?: string;
}

const ChampionsPool: React.FC<ChampionsPoolProps> = ({
  team,
  handleClickedHero = () => {},
  className = '',
}) => {
  const { room } = roomStore();
  const blurHashes: BlurHashes = useBlurHash();
  const [selectedHero, setSelectedHero] = useState<string | null>(null);
  const [hoveredHero, setHoveredHero] = useState<string | null>(null); // State to track hovered hero

  const handleClickHero = useCallback((hero: Hero) => {
    if (!team?.isturn || !team.canSelect) return;
    if (room?.status !== 'select' && room?.status !== 'ban') return;
    if (hero.selected) return;
    if (selectedHero === hero.name) return;
    setSelectedHero(hero.name);
    handleClickedHero(hero);
  }, [team, room, selectedHero, handleClickedHero]);

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
        opacity: !team?.isturn && room?.status !== 'planning' ? 0.8 : 1,
      }}
      className={clsx(
        'relative z-0 grid grid-cols-10 gap-2', className
      )}
    >
      {room.heroes_pool.map((hero: Hero, index: number) => {
        const isSelected = hero.name === team?.clicked_hero;
        const isHovered = hero.name === hoveredHero;
        const imageName = hero.id
          .toLowerCase()
          .replace(/\s+/g, '')
          .replace(/[\W_]+/g, '');
        const blurHash = blurHashes[imageName];

        return (
          <AnimatePresence key={index}>
            <motion.div
              className={clsx('relative z-10 overflow-hidden', {
                'pointer-events-none grayscale': hero.selected,
                'cursor-pointer': !hero.selected && team?.isturn,
                'glow-yellow z-50 border border-yellow bg-transparent':
                  isSelected && room.status === 'select',
                'glow-red border-2 border-red-700 bg-opacity-20 p-0.5':
                  isSelected && room.status === 'ban',
              })}
              onClick={team?.isturn ? () => handleClickHero(hero) : undefined}
              onHoverStart={() => handleHoverStart(hero.name)}
              onHoverEnd={handleHoverEnd}
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
                <div
                  className={clsx(
                    'absolute left-0 top-0 z-50 h-full w-full overflow-hidden bg-gradient-to-t',
                    {
                      'from-red to-transparent':
                        isSelected && room.status === 'ban',
                      'from-yellow-transparent to-transparent':
                        isSelected && room.status === 'select',
                    }
                  )}
                >
                  <p className="flex h-full items-center justify-center text-xs font-bold">
                    {hero.name}
                  </p>
                </div>
              )}
              <motion.div
                animate={{
                  scale: isHovered && !isSelected ? 1.2 : 1,
                }}
                transition={{ duration: 0.1, defaultTransition }}
                className="relative z-10 overflow-hidden"
              >
                <ImageHash
                  alt={hero.name}
                  blurhash={blurHash}
                  width={150}
                  height={150}
                  quality={50}
                  src={`/images/champions/tiles/${imageName}.webp`}
                />
              </motion.div>
            </motion.div>
          </AnimatePresence>
        );
      })}
    </motion.div>
  );
};

ChampionsPool.displayName = 'ChampionsPool';

export default ChampionsPool;
