import { useContext, useState } from "react";
import Image from "next/image";
import RoomContext from '@/app/context/RoomContext';
import useEnsureContext from "@/app/hooks/useEnsureContext";

const WaitingView = () => {
  const room = useEnsureContext(RoomContext) as {
    heroes_pool: any[];
  };

  const [hoverIndex, setHoverIndex] = useState(-1);

  const getImageSrc = (hero: any, isSplash: boolean) => {
    const heroName = hero.name.replace(/\s/g, "").toLowerCase();
    return `/images/champions/${isSplash ? "splash" : "tiles"}/${heroName}.jpg`;
  };

  return (
    <div>
      <main>
        <div className="grid grid-cols-6 lg:grid-cols-10 gap-3 cursor-pointer">
          {room?.heroes_pool?.map((hero: any, index: number) => (
            <div
              key={index}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(-1)}
              className="relative overflow-hidden">
              <Image
                src={getImageSrc(hero, false)}
                alt={hero.name}
                sizes="100vw"
                  width={0}
                  height={0}
                  style={{ width: "100%", height: "auto" }}
                  className="mx-auto"
              />

              <div className="flex items-center justify-center my-auto overflow-hidden">
              <div className={`mx-auto rounded splash-image  ${
                    hoverIndex === index ? "splash-image-hover z-10 absolute bg-gradient-to-t from-black  to-transparent bg-clip-content w-full h-full top-0 left-0" : ""
                  }`}></div>
                <Image
                  src={getImageSrc(hero, true)}
                  alt={hero.name}
                  width={440}
                  height={290}
                  className={`mx-auto rounded splash-image  ${
                    hoverIndex === index ? "splash-image-hover " : ""
                  }`}
                />
                <p
                  className={`font-bold text-md hero-name text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  ${
                    hoverIndex === index
                      ? "z-10 animated-text-hover animated-text-visible"
                      : "animated-text"
                  }`}>
                  {hero.name}
                </p>
              </div>
            </div>
          ))}
          </div>
      </main>
    </div>
  );
};

export default WaitingView;
