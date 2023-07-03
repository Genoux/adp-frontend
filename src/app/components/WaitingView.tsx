import { FC, useEffect, useState } from "react";
import { roomStore } from "@/app/stores/roomStore";
import Image from "next/image";
import { Blurhash } from "react-blurhash";

interface WaitingRoomProps {
  roomid: any; // Replace with your specific type
}

const WaitingView: FC<WaitingRoomProps> = ({ roomid }) => {
  const { rooms } = roomStore();
  const room = rooms[roomid];

  const [hoverIndex, setHoverIndex] = useState(-1);
  const [hashes, setHashes] = useState({} as any);

  const getImageSrc = (hero: any, isSplash: boolean) => {
    const heroName = hero.name.replace(/\s/g, "").toLowerCase();
    return `/images/champions/${isSplash ? "splash" : "tiles"}/${heroName}.jpg`;
  };

  // useEffect(() => {
  //   fetch("/images/hash.json")
  //     .then((response) => response.json())
  //     .then((data) => {
  //       setHashes(data);
  //     })
  //     .catch((error) => {
  //       console.error("Error fetching output.json:", error);
  //     });
  // }, []);

  const getBlurhash = (hero: any) => {
    const heroName = hero.name.replace(/\s/g, "");
    console.log("getBlurhash - heroName:", heroName);
    return hashes[heroName] || "";
  };

  return (
    <div>
      <main>
        <div className="grid grid-cols-6 lg:grid-cols-10 gap-3 cursor-pointer">
          {room.heroes_pool.map((hero: any, index: number) => (
            <div
              key={index}
              onMouseEnter={() => setHoverIndex(index)}
              onMouseLeave={() => setHoverIndex(-1)}
              className="relative">
              <Image
                src={getImageSrc(hero, false)}
                alt={hero.name}
                width={80}
                height={80}
                className={`mx-auto rounded mb-1 hero-image ${
                  hoverIndex === index ? "hidden" : ""
                }`}
              />

              <div className="flex items-center justify-center my-auto over">
                <Image
                  src={getImageSrc(hero, true)}
                  alt={hero.name}
                  width={440}
                  height={290}
                  className={`mx-auto rounded splash-image ${
                    hoverIndex === index ? "splash-image-hover" : ""
                  }`}
                />
                <p
                  className={`font-bold text-md hero-name text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
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
