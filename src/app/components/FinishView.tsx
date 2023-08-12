import TeamPicks from "./team/TeamPicks";
import { teamStore } from "@/app/stores/teamStore";
import useTeams from "@/app/hooks/useTeams";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode, Key } from "react";
import { AnimatePresence, motion } from "framer-motion";

const FinishView = () => {
  let { blue, red } = useTeams(teamStore);

  return (
    <div className="text-center">
      <div className="my-6">
        <h1 className="text-3xl font-medium">{"Draft terminé!"}</h1>
        <p>Voici les selections de chaque équipe</p>
      </div>
      <div className="grid grid-cols-2 gap-6 h-96 min-h-[500px] w-full">
        <motion.div
          initial={{ left: '-120px' }}
          animate={{ left: '0%' }}
          transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1], delay: 0.2 }}
          style={{ position: 'relative', flexGrow: 1 }}
        >
          <h1 className={`text-2xl mb-4 rounded-sm bg-${blue.color}`}> {blue.name}</h1>
          <TeamPicks team={blue} />
        </motion.div>
        <motion.div
          initial={{ left: '120px' }}
          animate={{ left: '0%' }}
          transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1], delay: 0.2 }}
          style={{ position: 'relative', flexGrow: 1 }}
        >
          <h1 className={`text-2xl rounded-sm mb-4 bg-${red.color}`}> {red.name}</h1>
          <TeamPicks team={red} />
        </motion.div>
      </div>
    </div>
  );
};

export default FinishView;
