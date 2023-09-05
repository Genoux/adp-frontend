import TeamPicks from "./team/TeamPicks";
import { teamStore } from "@/app/stores/teamStore";
import useTeams from "@/app/hooks/useTeams";
import { defaultTransition } from '@/app/lib/animationConfig'
import { motion } from "framer-motion";
import { useEffect } from "react";

const FinishView = () => {
  let { blue, red } = useTeams(teamStore);

  // useEffect(() => {
  //   const sendDataToDiscord = async () => {
  //     await fetch(`/api/sendToDiscord/`, {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //       },
  //       body: JSON.stringify({ blue, red }),
  //     });
  //   };
  
  //   sendDataToDiscord();
  // }, []);  // Remember to include dependency array if required
  
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
          initial={{ left: '-120px', opacity: 0 }}
          animate={{ left: '0%', opacity: 1 }}
          transition={defaultTransition}
          className="relative"
        >
          <h1 className={`text-xl py-1 w-fit px-8 uppercase mb-6 rounded-full text-center bg-${blue.color}`}> {blue.name}</h1>
          <div className="border-t border-white border-opacity-40 pt-6">
            <TeamPicks team={blue} />
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
          initial={{ left: '120px', opacity: 0 }}
          animate={{ left: '0%', opacity: 1 }}
          transition={defaultTransition}
          className="relative"
        >
          <h1 className={`text-xl py-1 w-fit px-8 uppercase mb-6 rounded-full text-center ml-auto bg-${red.color}`}> {red.name}</h1>
          <div className="border-t border-white border-opacity-40 pt-6">
            <TeamPicks team={red} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FinishView;
