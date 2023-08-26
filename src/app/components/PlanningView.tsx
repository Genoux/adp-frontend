import { roomStore } from "@/app/stores/roomStore";
import ChampionsPool from "@/app/components/common/ChampionsPool";
import Timer from "@/app/components/common/RoomTimer";
import { motion } from "framer-motion";
import { defaultTransition } from '@/app/lib/animationConfig'

const WaitingView = () => {
  const { room } = roomStore();

  if (!room) {
    return null;
  }


  return (
    <>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={defaultTransition}
        className="text-center mb-8 mt-4">
        <h1 className="text-4xl font-bold mb-1">Phase de planification</h1>
        <p className="mb-4">{"Analyse de la sélection de champions"}</p>
        <Timer />
      </motion.div>

      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={defaultTransition}>
        <div className="scale-105">
          <ChampionsPool />
        </div>
      </motion.div>
    </>
  );
};

export default WaitingView;
