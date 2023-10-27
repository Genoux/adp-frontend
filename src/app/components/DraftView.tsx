import TeamPicks from "@/app/components/team/TeamPicks";
import TeamBans from "@/app/components/team/TeamBans";
import useTeams from "@/app/hooks/useTeams";
import { motion } from 'framer-motion';
import { defaultTransition } from '@/app/lib/animationConfig'

interface Draft {
  applyHeightVariants?: boolean;
}

const RoomInfo = ({ applyHeightVariants } : Draft) => {
  const { redTeam, blueTeam } = useTeams();

  return (
    <>
      <motion.div
       initial={{ opacity:.5 }}  // start at half the size
        animate={{opacity: 1 }}    // animate to full size
        transition={defaultTransition}
        className={`-z-10 relative ${applyHeightVariants ? '-translate-y-12' : 'translate-y-1'}`}
      >
        <div className="flex flex-col justify-center">
          <div className="flex flex-row justify-between w-full gap-80">
            <TeamBans team={blueTeam} applyHeightVariants={applyHeightVariants} />
            <TeamBans team={redTeam} applyHeightVariants={applyHeightVariants} />
          </div>
          <div className="flex flex-row justify-between w-full h-full gap-12 mt-2">
            <TeamPicks team={blueTeam} applyHeightVariants={applyHeightVariants} />
            <TeamPicks team={redTeam} applyHeightVariants={applyHeightVariants} />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default RoomInfo;
