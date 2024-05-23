import ImageHash from '@/app/components/common/ImageHash';
import { useBlurHash } from '@/app/context/BlurHashContext';
import { defaultTransition } from '@/app/lib/animationConfig';
import { roomStore } from '@/app/stores/roomStore';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import React, { useState } from 'react';

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

interface StaticChampionsListProps {
  hero: Hero;
  blurHashes: BlurHashes;
}

const StaticChampionsList = ({
  hero,
  blurHashes,
}: StaticChampionsListProps) => {
  const imageName = hero.id
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[\W_]+/g, '');
  const blurHash = blurHashes[imageName];
  const [isHovered, setIsHovered] = useState(false);

  return (
    <AnimatePresence>
      <motion.div
        transition={defaultTransition}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
      >
        <div
          className={clsx('relative z-10 overflow-hidden', {
            grayscale: hero.selected,
            'pointer-events-none': hero.selected,
          })}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{
              opacity: isHovered ? 1 : 0,
            }}
            transition={{ duration: 0.1, defaultTransition }}
            className="absolute left-0 top-0 z-50 h-full w-full bg-gray-900 bg-opacity-80"
          >
            <p className="flex h-full items-center justify-center text-xs font-bold">
              {hero.name}
            </p>
          </motion.div>

          <motion.div
            animate={{
              scale: isHovered ? 1.2 : 1,
            }}
            transition={{ duration: 0.1, defaultTransition }}
            className="relative z-10 overflow-hidden"
          >
            <ImageHash
              alt={hero.name}
              blurhash={blurHash}
              width={200}
              height={200}
              quality={80}
              src={`/images/champions/tiles/${imageName}.webp`}
            />
          </motion.div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

const ChampionsPool: React.FC<ChampionsPoolProps> = ({
  team,
  handleClickedHero = () => {},
  className = '',
}) => {
  const { room } = roomStore();
  const blurHashes: BlurHashes = useBlurHash();
  const [selectedHero, setSelectedHero] = useState<string | null>(null);
  const [hoveredHero, setHoveredHero] = useState<string | null>(null); // State to track hovered hero

  const handleClickHero = (hero: Hero) => {
    if (!team?.isturn || !team.canSelect) return;
    if (room?.status !== 'select' && room?.status !== 'ban') return;
    if (hero.selected) return;
    if (selectedHero === hero.name) return;
    setSelectedHero(hero.name);
    handleClickedHero(hero);
  };

  if (!room?.heroes_pool || !Array.isArray(room.heroes_pool)) return null;

  return (
    <motion.div
      animate={{
        opacity: !team?.isturn && room?.status !== 'planning' ? 1 : 1,
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
        if (!team?.isturn || room?.status === 'planning')
          return (
            <React.Fragment key={index}>
              <StaticChampionsList hero={hero} blurHashes={blurHashes} />
            </React.Fragment>
          );
        return (
          <AnimatePresence key={index}>
            <motion.div
              className={clsx('relative z-10 overflow-hidden', {
                'pointer-events-none grayscale': hero.selected,
                'cursor-pointer': !hero.selected,
                'glow-yellow z-50 border border-yellow bg-transparent':
                  isSelected && room.status === 'select',
                'glow-red border-2 border-red-700 bg-opacity-20 p-0.5':
                  isSelected && room.status === 'ban',
              })}
              onClick={() => handleClickHero(hero)}
              onHoverStart={() => setHoveredHero(hero.name)} // Set hovered hero on hover start
              onHoverEnd={() => setHoveredHero(null)} // Clear hovered hero on hover end
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
                  scale: isHovered && !isSelected && team.isturn ? 1.2 : 1,
                }}
                transition={{ duration: 0.1, defaultTransition }}
                className="relative z-10 overflow-hidden"
              >
                <ImageHash
                  alt={hero.name}
                  blurhash={blurHash}
                  width={200}
                  height={200}
                  quality={80}
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

export default ChampionsPool;
