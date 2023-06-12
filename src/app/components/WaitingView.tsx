import { FC } from 'react';
import { roomStore } from "@/app/stores/roomStore";
import Image from "next/image";

interface WaitingRoomProps {
  roomid: any; // Replace with your specific type
}

const ReadyView: FC<WaitingRoomProps> = ({roomid}) => {
  const { rooms } = roomStore();
  const  room  = rooms[roomid]

  return (
    <div>
         <main>
        <p>{room.cycle.toString()}</p>
        <div className="grid grid-cols-6">
        {room.heroes_pool.map((hero: any, index: number) => (
          <div
            key={index}>
            <Image
              src={`/images/champions/tiles/${hero.name
                .replace(/\s/g, "")
                .toLowerCase()}.jpg`}
              alt={hero.name}
              width={60}
              height={60}
            />
            <pre>{hero.name}</pre>
          </div>
        ))}
        </div>
      </main>
    </div>
  );
};

export default ReadyView;