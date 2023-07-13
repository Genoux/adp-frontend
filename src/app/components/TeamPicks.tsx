import { Database } from "../types/supabase";
import { roomStore } from "@/app/stores/roomStore";

import RoomContext from '@/app/context/RoomContext';
import useEnsureContext from "@/app/hooks/useEnsureContext";
import { useContext } from "react";

interface Team {
  [key: string]: any;
}

interface Hero {
  name: string;
  selected: boolean;
}

const TeamPicks = ({ team }: Team) => {
  
 // const { rooms } = roomStore();
  //const room = rooms[team.room];

  const room  = useEnsureContext(RoomContext);

  return (
    <>
      <div
        className={`grid grid-cols-5 gap-2 mt-6 h-full w-full ${
          team.isTurn || room.status === 'done' ? `opacity-100` : "opacity-30"
        }`}>
        {((team.heroes_selected as unknown) as Hero[]).map((hero: Hero, index: number) => (
          <div
            key={index}
            className={`h-full w-full overflow-hidden relative ${
              hero.name ? "" : "border border-white border-opacity-10"
            }`}>
            {hero.name && (
              <div>
                <p className="absolute z-50 w-full h-full flex justify-center items-end pb-6 font-medium">
                  {hero.name}
                </p>
                <div className="absolute top-0 left-0 h-full w-full bg-gradient-to-t from-black via-transparent to-transparent bg-clip-content z-40"></div>
                <div
                  className="absolute top-0 left-0 w-full h-full bg-cover bg-center"
                  style={{
                    backgroundImage: `url('/images/champions/splash/${hero.name
                      .replace(/\s/g, "")
                      .toLowerCase()}.jpg')`,
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </>
  );
};

export default TeamPicks;
