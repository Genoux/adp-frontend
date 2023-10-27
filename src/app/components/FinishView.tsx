import TeamPicks from "./team/TeamPicks";
import useTeams from "@/app/hooks/useTeams";
import { defaultTransition } from '@/app/lib/animationConfig'
import { motion } from "framer-motion";
import { useEffect } from "react";

const FinishView = () => {
  const { redTeam, blueTeam } = useTeams();

  if(!redTeam || !blueTeam) return null;
  
  return (
    <div className="px-6 lg:px-12">
      <motion.div
        initial={{ y: "-10px", opacity: 0 }}  // start at half the size
        animate={{ y: "0px", opacity: 1 }}    // animate to full size
        transition={defaultTransition}
        className="text-center"
      >
        <h1 className="text-4xl font-bold mt-12">{"Draft terminé!"}</h1>
      </motion.div>
      <div className="grid grid-cols-2  gap-12 w-full">
        <motion.div
           initial={{opacity: 0 }}
           animate={{ opacity: .25 }}
           transition={defaultTransition}
          className="bg-gradient-to-r from-blue to-transparent absolute left-0 top-0 h-full w-1/2 opacity-25"></motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={defaultTransition}
          className="relative"
        >
          <h1 className={`text-xl py-1 w-fit px-8 uppercase mb-6 rounded-full text-center bg-${blueTeam.color}`}> {blueTeam.name}</h1>
          <div className="border-t border-white border-opacity-40 pt-6">
            <TeamPicks team={blueTeam} />
          </div>
        </motion.div>

        
        <motion.div
          initial={{opacity: 0 }}
          animate={{ opacity: .25 }}
          transition={defaultTransition}
          className="bg-gradient-to-r from-transparent to-red absolute right-0 top-0 h-full w-1/2 opacity-25"
        >
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={defaultTransition}
          className="relative"
        >
          <h1 className={`text-xl py-1 w-fit px-8 uppercase mb-6 rounded-full text-center ml-auto bg-${redTeam.color}`}> {redTeam.name}</h1>
          <div className="border-t border-white border-opacity-40 pt-6">
            <TeamPicks team={redTeam} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FinishView;
