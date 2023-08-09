import TeamPicks from "./team/TeamPicks";
import { teamStore } from "@/app/stores/teamStore";
import useTeams from "@/app/hooks/useTeams";
import { ReactElement, JSXElementConstructor, ReactFragment, ReactPortal, PromiseLikeOfReactNode, Key } from "react";
import { AnimatePresence, motion } from "framer-motion";

const FinishView = () => {
  let { blue, red } = useTeams(teamStore);

  return (
    <div className="text-center">
      <h1 className="my-12 text-3xl font-medium">The room has finished</h1>
      <div className="flex flex-row gap-12 h-96 min-h-[500px] w-full">
        <motion.div
          initial={{ left: '-120px' }}
          animate={{ left: '0%' }}
          transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1], delay: 0.2 }}
          style={{ position: 'relative', flexGrow: 1 }}
        >
          <h1 className={`text-2xl mb-4 bg-${blue.color}`}> {blue.name}</h1>
          <TeamPicks team={blue} />
        </motion.div>
        <motion.div
          initial={{ left: '120px' }}
          animate={{ left: '0%' }}
          transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1], delay: 0.2 }}
          style={{ position: 'relative', flexGrow: 1 }}
        >
          <h1 className={`text-2xl mb-4 bg-${red.color}`}> {red.name}</h1>
          <TeamPicks team={red} />
        </motion.div>
      </div>
    </div>
  );
};

export default FinishView;
