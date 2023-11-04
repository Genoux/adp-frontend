import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { motion } from 'framer-motion';
import clsx from "clsx";
import { roomStore } from "@/app/stores/roomStore";
import { Database } from "@/app/types/supabase";

interface Hero {
  name: string;
  id: string;
  selected: boolean;
  clicked_hero: boolean;
}

interface HeroPoolProps {
  team?: Database["public"]["Tables"]["teams"]["Row"];
  selectedChampion?: string;
  canSelect?: boolean;
  canHoverToShowName?: boolean;
  handleClickedHero?: (hero: Hero) => void;
}

const ChampionsPool: React.FC<HeroPoolProps> = ({
  team,
  selectedChampion,
  canSelect = false,
  canHoverToShowName = false,
  handleClickedHero = () => { },
}) => {
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [mouseDown, setMouseDown] = useState<number | null>(null);
  const { room } = roomStore();

  const setHoverState = useCallback((index: number) => {
    setHoverIndex(index);
  }, []);

  useEffect(() => {
    if (!canSelect && room?.status !== 'planning') {
      setHoverState(-1);
      setMouseDown(null);
    }
  }, [canSelect, room?.status, setHoverState]);

  if (!room?.heroes_pool || !Array.isArray(room.heroes_pool)) return null;

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-10 px-24 gap-2">
        {(room.heroes_pool as unknown as Hero[]).map((hero: Hero, index: number) => {
          const isActive = hoverIndex === index || hero.name === selectedChampion && team?.isturn;
          const isturnAvailable = team ? team.isturn : true;
          const shouldFade = hero.selected || (team && !isturnAvailable);
          const showNameOnHover = canHoverToShowName && isActive;

          return (
            <motion.div
              initial={{ opacity: 1 }}
              animate={{ opacity: shouldFade ? 0.7 : 1 }}
              transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
              key={index}
              className={clsx("rounded-xl", {
                "bg-gray-800": isActive,
                "grayscale": hero.selected,
                "pointer-events-none": hero.selected || !isturnAvailable,
                "z-50 border-2 border-opacity-100 border-yellow overflow-hidden p-1 bg-transparent glow-yellow": hero.name === selectedChampion && team?.isturn,
              })}
              onMouseDown={() => {
                if (room?.status === "planning") return;
                setMouseDown(index);
              }}
              onMouseUp={() => setMouseDown(null)}
              onClick={canSelect ? () => handleClickedHero(hero) : undefined}
              onMouseEnter={() => {
                if (!canSelect && room?.status !== 'planning') return
                setHoverIndex(index);
              }}
              onMouseLeave={() => {
                if (!hero.selected) setHoverIndex(-1);
              }}
            >
              <div className="relative overflow-hidden rounded-md cursor-pointer">
                <Image
                  src={`/images/champions/tiles/${hero.name.toLowerCase().replace(/\s+/g, '')}.jpg`}
                  alt={hero.name}
                  sizes="100vw"
                  width={500}
                  height={500}
                />
                <div className="flex items-center justify-center my-auto overflow-hidden">
                  <p
                    className={clsx("font-bold text-sm text-center hero-name text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2", {
                      "z-50 animated-text-hover animated-text-visible": showNameOnHover,
                      "hidden": !showNameOnHover,
                    })}
                  >
                    {hero.name}
                  </p>
                  <div
                    className={clsx("absolute z-10 bg-clip-content w-full h-full top-0 left-0", {
                      "bg-gradient-to-t from-yellow to-transparent opacity-50": showNameOnHover,
                    })}
                  ></div>
                  <Image
                    src={`/images/champions/tiles/${hero.id.toLowerCase().replace(/\s+/g, '').replace(/[\W_]+/g, '')}.jpg`}
                    alt={hero.name}
                    width={800}
                    height={800}
                    className={clsx("mx-auto splash-image", {
                      "splash-image-hover": showNameOnHover,
                    })}
                  />
                  <div className="flex items-center justify-center my-auto overflow-hidden">
                    <p
                      className={`font-bold text-sm text-center hero-name text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${isActive
                        ? "z-50 animated-text-hover animated-text-visible"
                        : "hidden"
                        }`}>
                      {hero.name}
                    </p>
                    <div
                      className={`${isActive
                        ? "bg-gradient-to-t absolute z-10 from-yellow to-transparent opacity-50 bg-clip-content w-full h-full top-0 left-0"
                        : ""
                        }`}></div>
                    <Image
                      src={`/images/champions/splash/${hero.id.toLowerCase().replace(/\s+/g, '').replace(/[\W_]+/g, '')}.jpg`}
                      alt={hero.name}
                      width={800}
                      height={800}
                      className={`mx-auto splash-image ${isActive ? "splash-image-hover" : ""
                        }`}
                    />
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default ChampionsPool;
