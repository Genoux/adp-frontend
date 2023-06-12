import { roomStore } from "@/app/stores/roomStore";
import HeroGrid from "./HeroGrid";
import useFetchTeam from "@/app/hooks/useFetchTeam";
interface FinishViewProps {
  roomid: string;
}

const FinishView: React.FC<FinishViewProps> = ({ roomid }) => {
  const { rooms } = roomStore();
  const room = rooms[roomid];
  
  const { data: blue } = useFetchTeam(room.blue);
  const { data: red } = useFetchTeam(room.red);

  return (
    <div>
      <h1>Room Finished</h1>
      <div className="grid grid-cols-2 gap-12">
        <HeroGrid team={blue} color="blue" useTiles={false} />
        <HeroGrid team={red} color="red" useTiles={false} />
      </div>
      <p>The room {room ? room.name : roomid} has finished.</p>
    </div>
  );
};

export default FinishView;
