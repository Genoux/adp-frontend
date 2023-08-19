import { Database } from "@/app/types/supabase";
import Image from "next/image";
import clsx from "clsx";
import { roomStore } from "@/app/stores/roomStore";
import { useState } from "react";

interface Hero {
  name: string;
  selected: boolean;
  clicked_hero: boolean;
}

interface HeroPoolProps {
  team?: Database["public"]["Tables"]["teams"]["Row"];
  selectedChampion?: string; // optional
  canSelect?: boolean; // optional
  handleClickedHero?: (hero: Hero) => void; // optional
  clickedHero?: string | null; // optional
}

const ChampionsPool: React.FC<HeroPoolProps> = ({
  team,
  selectedChampion,
  canSelect,
  handleClickedHero = () => { },
  clickedHero,

}) => {
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [mouseDown, setMouseDown] = useState<number | null>(null);
  const { room } = roomStore();

  if (!room?.heroes_pool || !Array.isArray(room.heroes_pool)) return null;

  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-8 md:grid-cols-6 lg:grid-cols-10 gap-2 cursor-pointer px-24">
        {(room.heroes_pool as unknown as Hero[]).map(
          (hero: Hero, index: number) => {
            const isActive = hoverIndex === index || hero.name === selectedChampion;
            const isturnAvailable = team ? team.isturn : true;
            return (
              <div
              key={index}
              className={clsx("rounded-sm transition duration-75 ease-main", {
                "bg-gray-800": isActive,
                "grayscale": hero.selected,
                "opacity-70": hero.selected || (team && !isturnAvailable),
                "pointer-events-none": (room.status !== "planning" && !canSelect) || hero.selected || (team && !isturnAvailable),
                "scale-95 p-1 border-opacity-0 border-2 bg-transparent": mouseDown === index,
                "z-50 border-2 border-opacity-100 border-yellow hero-selected overflow-hidden p-1 bg-transparent glow-yellow": hero.name === selectedChampion,
              })}
                onMouseDown={() => {
                  if (room?.status === "planning") return;
                  setMouseDown(index);
                }}
                onMouseUp={() => {
                  setMouseDown(null);
                }}
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
                <div className="relative overflow-hidden rounded-sm">
                  <Image
                    src={`/images/champions/tiles/${hero.name.toLowerCase().replace(/\s+/g, '')}.jpg`}
                    alt={hero.name}
                    sizes="100vw"
                    width={500}
                    height={500}
                    className="mx-auto"
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
                      src={`/images/champions/splash/${hero.name.toLowerCase().replace(/\s+/g, '')}.jpg`}
                      alt={hero.name}
                      width={800}
                      height={800}
                      className={`mx-auto splash-image ${isActive ? "splash-image-hover" : ""
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

export default ChampionsPool;
