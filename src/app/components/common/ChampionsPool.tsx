import { Database } from "@/app/types/supabase";
import Image from "next/image";
import clsx from "clsx";
import { roomStore } from "@/app/stores/roomStore";
import { useState } from "react";

interface Hero {
  name: string;
  selected: boolean;
}

interface HeroPoolProps {
  team?: Database["public"]["Tables"]["teams"]["Row"];
  selectedChampion?: string; // optional
  canSelect?: boolean; // optional
  handleClickedHero?: (hero: Hero) => void; // optional
}

const HeroPool: React.FC<HeroPoolProps> = ({
  team,
  selectedChampion,
  canSelect,
  handleClickedHero = () => { },

}) => {
  const [hoverIndex, setHoverIndex] = useState(-1);
  const { room } = roomStore();
  console.log("room:", room);

  if (!room?.heroes_pool || !Array.isArray(room.heroes_pool)) return null;

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-8 lg:grid-cols-10 gap-3 cursor-pointer px-24">
        {(room.heroes_pool as unknown as Hero[]).map(
          (hero: Hero, index: number) => {
            const isActive = hoverIndex === index || hero.name === selectedChampion;
            const isTurnAvailable = team ? team.isTurn : true;
            return (
              <div
                key={index}
                className={clsx("", {
                  "bg-gray-800": isActive,
                  "opacity-40 pointer-events-none": hero.selected || (team && !isTurnAvailable),
                  "border-2 z-50 border-white hero-selected": hero.name === selectedChampion,
                })}
                onClick={() => {
                  handleClickedHero(hero);
                }}
                onMouseEnter={() => {
                  setHoverIndex(index);
                }}
                onMouseLeave={() => {
                  if (!hero.selected) {
                    setHoverIndex(-1);
                  }
                }}>
                <div className="relative overflow-hidden">
                  <Image
                    src={`/images/champions/tiles/${hero.name}.jpg`}
                    alt={hero.name}
                    sizes="100vw"
                    width={500}
                    height={500}
                    className="mx-auto"
                  />
                  <div className="flex items-center justify-center my-auto overflow-hidden">
                    <p
                      className={`font-bold text-sm hero-name text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${isActive
                        ? "z-50 animated-text-hover animated-text-visible"
                        : "hidden"
                        }`}>
                      {hero.name}
                    </p>
                    <div
                      className={`${isActive
                        ? "bg-gradient-to-t absolute z-10 from-black to-transparent bg-clip-content w-full h-full top-0 left-0"
                        : ""
                        }`}></div>
                    <Image
                      src={`/images/champions/splash/${hero.name}.jpg`}
                      alt={hero.name}
                      width={800}
                      height={800}
                      className={`mx-auto rounded splash-image ${isActive ? "splash-image-hover" : ""
                        }`}
                    />
                  </div>
                </div>
              </div>
            );
          }
        )}
      </div>
    </div>
  );
};

export default HeroPool;
