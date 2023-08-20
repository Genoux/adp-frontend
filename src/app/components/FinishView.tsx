import TeamPicks from "./team/TeamPicks";
import { teamStore } from "@/app/stores/teamStore";
import useTeams from "@/app/hooks/useTeams";
import { defaultTransition } from '@/app/lib/animationConfig'
import { motion } from "framer-motion";

const FinishView = () => {
  let { blue, red } = useTeams(teamStore);

  return (

    <div className="px-6 lg:px-12">
      <motion.div
        initial={{ y: "-10px", opacity: 0 }}  // start at half the size
        animate={{ y: "0px", opacity: 1 }}    // animate to full size
        transition={defaultTransition}
        className="mb-6 text-center"
      >
        <h1 className="text-4xl font-bold">{"Draft terminé!"}</h1>
        <p className="font-medium text-md mt-2">Voici les selections de chaque équipe</p>
      </motion.div>
      <div className="grid grid-row-2 lg:grid-cols-2 gap-12 w-full">
        <motion.div
          initial={{ left: '-120px', opacity: 0 }}
          animate={{ left: '0%', opacity: 1 }}
          transition={defaultTransition}
          className="relative"
        >
          <h1 className={`text-2xl py-1 uppercase mb-4 rounded-sm text-center bg-${blue.color}`}> {blue.name}</h1>
          <div className="h-96">
            <TeamPicks team={blue} />
          </div>
        </motion.div>
        <motion.div
          initial={{ left: '120px', opacity: 0 }}
          animate={{ left: '0%', opacity: 1 }}
          transition={defaultTransition}
          className="relative"
        >
          <h1 className={`text-2xl py-1 uppercase mb-4 rounded-sm text-center bg-${red.color}`}> {red.name}</h1>
          <div className="h-96">
            <TeamPicks team={red} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FinishView;
