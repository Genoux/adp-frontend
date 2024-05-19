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

const StaticChampionsList = ({ hero, blurHashes }: StaticChampionsListProps) => {

  const imageName = hero.id.toLowerCase().replace(/\s+/g, '').replace(/[\W_]+/g, '');
  const blurHash = blurHashes[imageName];

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: .5 }}
        transition={{ defaultTransition, duration: 0.2 }}
        exit={{ opacity: 0 }}
        className={clsx('overflow-hidden relative z-10 rounded-lg opacity-60', {
          'grayscale': hero.selected,
          'pointer-events-none': hero.selected,
        })}
      >
        <ImageHash
          alt={hero.name}
          blurhash={blurHash}
          width={200}
          height={200}
          quality={80}
          src={`/images/champions/tiles/${imageName}.jpg`}
        />
      </motion.div>
    </AnimatePresence>
  );
}


const ChampionsPool: React.FC<ChampionsPoolProps> = ({
  team,
  handleClickedHero = () => { },
  className = '',
}) => {
  const { room } = roomStore();
  const blurHashes: BlurHashes = useBlurHash();
  const [selectedHero, setSelectedHero] = useState<string | null>(null);
  const [hoveredHero, setHoveredHero] = useState<string | null>(null); // State to track hovered hero

  const handleClickHero = (hero: Hero) => {
    if (!team?.isturn) return;
    if (room?.status !== 'select' && room?.status !== 'ban') return;
    if (hero.selected) return;
    if (selectedHero === hero.name) return;
    setSelectedHero(hero.name);
    handleClickedHero(hero);
  };

  if (!room?.heroes_pool || !Array.isArray(room.heroes_pool)) return null;

  return (
    <div className={`relative -z-10 grid cursor-pointer grid-cols-10 gap-2 ${className}`}>
      {room.heroes_pool.map((hero: Hero, index: number) => {
        const isSelected = hero.name === team?.clicked_hero;
        const isHovered = hero.name === hoveredHero;
        const imageName = hero.id.toLowerCase().replace(/\s+/g, '').replace(/[\W_]+/g, '');
        const blurHash = blurHashes[imageName];
        if (!team?.isturn)
          return (
            <React.Fragment key={index}>
              <StaticChampionsList hero={hero} blurHashes={blurHashes} />
            </React.Fragment>
          );
        return (
          <AnimatePresence
            key={index}
          >
            <motion.div
              initial={{ opacity: 0.5 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ defaultTransition, duration: 0.2 }}
              className={clsx('overflow-hidden relative z-10 rounded-lg', {
                'grayscale': hero.selected,
                'pointer-events-none': hero.selected,
                'glow-yellow z-50 rounded-xl border border-yellow bg-transparent': isSelected && room.status === 'select',
                'glow-red rounded-xl border-2 border-red-700 bg-opacity-20 p-0.5': isSelected && room.status === 'ban',
              })}
              onClick={() => handleClickHero(hero)}
              onHoverStart={() => setHoveredHero(hero.name)} // Set hovered hero on hover start
              onHoverEnd={() => setHoveredHero(null)} // Clear hovered hero on hover end
            >
              <motion.div
                animate={{ scale: isSelected ? 1 : 1 }}
                transition={defaultTransition}
              >
                {(isHovered && !isSelected) && (
                  <motion.div
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={defaultTransition}

                    className="bg-gray-900 bg-opacity-70 absolute top-0 left-0 w-full h-full z-20">
                    <p className='text-xs font-bold flex justify-center items-center h-full'> {hero.name}</p>
                  </motion.div>
                )}
                {(isSelected) && (
                  <motion.div
                    initial={{ opacity: 0, y: 2 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 5 }}
                    transition={{ defaultTransition, duration: 0.15 }}

                    className={clsx('overflow-hidden absolute top-0 left-0 w-full h-full bg-gradient-to-t bg-opacity-20 z-50', {
                      'from-red to-transparent': isSelected && room.status === 'ban',
                      'from-yellow to-transparent': isSelected && room.status === 'select',
                    })}>
                    <p className='text-xs font-bold flex justify-center items-center h-full'> {hero.name}</p>
                  </motion.div>
                )}
                <motion.div
                  animate={{ scale: isHovered && !isSelected && team.isturn ? 1.2 : 1 }}
                  transition={defaultTransition}
                  className='rounded-sm overflow-hidden relative z-10'
                >
                  <ImageHash
                    alt={hero.name}
                    blurhash={blurHash}
                    width={200}
                    height={200}
                    quality={80}
                    src={`/images/champions/tiles/${imageName}.jpg`}
                  />
                </motion.div>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        );
      })}
    </div>
  );
};

export default ChampionsPool;
