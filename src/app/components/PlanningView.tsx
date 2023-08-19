import { roomStore } from "@/app/stores/roomStore";
import ChampionsPool from "@/app/components/common/ChampionsPool";
import Timer from "@/app/components/common/RoomTimer";
import { motion } from "framer-motion";

const WaitingView = () => {
  const { room } = roomStore();

  if (!room) {
    return null;
  }


  return (
    <>

    
        <div className="flex flex-col items-center mb-6">
          <Timer />
          <p className="mt-2">{"Analyse de la sélection de champions"}</p>
        </div> 


      
      <div className="scale-105">
        <ChampionsPool />
      </div>
      <div className="text-center mb-6 mt-4">
        <h1 className="text-2xl font-bold mb-1">Phase de planification</h1>
        <p>{"Analyse de la sélection de champions"}</p>
      </div>
    </>
  );
};

export default WaitingView;
