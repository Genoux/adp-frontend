import TeamPicks from "@/app/components/team/TeamPicks";
import TeamBans from "@/app/components/team/TeamBans";
import { teamStore } from "@/app/stores/teamStore";
import useTeams from "@/app/hooks/useTeams";
import { motion } from 'framer-motion';
import { defaultTransition } from '@/app/lib/animationConfig'

const RoomInfo = () => {
  const { blue, red } = useTeams(teamStore);

  return (
    <>
      <motion.div
       initial={{ opacity:.5 }}  // start at half the size
        animate={{opacity: 1 }}    // animate to full size
        transition={defaultTransition}>
        <div className="flex flex-col justify-center">
          <div className="flex flex-row justify-between w-full gap-80">
            <TeamBans team={blue} />
            <TeamBans team={red} />
          </div>

          <div className="flex flex-row justify-between w-full h-full gap-12 mt-2">
            <TeamPicks team={blue} />
            <TeamPicks team={red} />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default RoomInfo;
