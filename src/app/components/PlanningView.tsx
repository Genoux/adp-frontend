import { roomStore } from "@/app/stores/roomStore";
import ChampionsPool from "@/app/components/common/ChampionsPool";
import Timer from "@/app/components/common/RoomTimer";

const WaitingView = () => {
  const { room } = roomStore();

  if (!room) {
    return null;
  }

  return (
    <>
      <div className="text-center mb-6 mt-6">
        <h1 className="text-2xl font-bold mb-1">Phase de planification</h1>
        <p>{"Analyse de la sélection de champions"}</p>

     </div>
    <Timer className="mb-12" />
    <ChampionsPool />
    </>
    );
};

export default WaitingView;
