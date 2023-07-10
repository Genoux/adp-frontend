import React, { useState } from 'react';
import { Database } from '@/app/types/supabase';
import Image from 'next/image';
import clsx from 'clsx';

interface Hero {
  name: string;
  selected: boolean;
}

interface HeroPoolProps {
  team: Database["public"]["Tables"]["teams"]["Row"];
  selectedChampion: string;
  canSelect: boolean;
  handleClickedHero: (hero: Hero) => void;
  setHoverIndex: (index: number) => void;
  hoverIndex: number;
}

const HeroPool: React.FC<HeroPoolProps> = ({
  team,
  selectedChampion,
  canSelect,
  handleClickedHero,
  setHoverIndex,
  hoverIndex,
}) => {
  const getImageSrc = (hero: Hero, splash: boolean) => {
    return splash
      ? `/images/champions/splash/${hero.name.replace(/\s/g, '').toLowerCase()}.jpg`
      : `/images/champions/tiles/${hero.name.replace(/\s/g, '').toLowerCase()}.jpg`;
  };

  if(!team.heroes_pool || !Array.isArray(team.heroes_pool)) return null;

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-6 lg:grid-cols-12 gap-3 cursor-pointer">
        {(team.heroes_pool as unknown as Hero[]).map((hero: Hero, index: number) => {
          const isActive = hoverIndex === index || hero.name === selectedChampion;
          return (
            <div
              key={index}
              className={clsx('', {
                'bg-gray-800': isActive,
                'opacity-40 pointer-events-none': hero.selected || !team.isTurn,
                'border-2 z-50 border-white hero-selected': hero.name === selectedChampion,
              })}
              onClick={() => {
                if (canSelect && !hero.selected) {
                  handleClickedHero(hero);
                }
              }}
              onMouseEnter={() => {
                if (!hero.selected) {
                  setHoverIndex(index);
                }
              }}
              onMouseLeave={() => {
                if (!hero.selected) {
                  setHoverIndex(-1);
                }
              }}>
              <div className="relative overflow-hidden">
                <Image
                  src={getImageSrc(hero, false)}
                  alt={hero.name}
                  sizes="100vw"
                  width={0}
                  height={0}
                  style={{ width: '100%', height: 'auto' }}
                  className="mx-auto"
                />

                <div className="flex items-center justify-center my-auto overflow-hidden">
                  <p
                    className={`font-bold text-sm hero-name text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
                      isActive ? 'z-50 animated-text-hover animated-text-visible' : 'hidden'
                    }`}>
                    {hero.name}
                  </p>
                  <div
                    className={`${
                      isActive
                        ? 'bg-gradient-to-t absolute z-10 from-black to-transparent bg-clip-content w-full h-full top-0 left-0'
                        : ''
                    }`}></div>
                  <Image
                    src={getImageSrc(hero, true)}
                    alt={hero.name}
                    width={800}
                    height={800}
                    className={`mx-auto rounded splash-image ${isActive ? 'splash-image-hover' : ''}`}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default HeroPool;