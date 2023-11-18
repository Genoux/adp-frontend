import TeamPicks from "@/app/components/team/TeamPicks";
import TeamBans from "@/app/components/team/TeamBans";
import { teamStore } from "@/app/stores/teamStore";
import useTeams from "@/app/hooks/useTeams";
import { motion } from 'framer-motion';
import { defaultTransition } from '@/app/lib/animationConfig'
import ConfirmButton from '@/app/components/common/ConfirmButton';

const RoomInfo = () => {
  const { blue, red } = useTeams(teamStore);

  return (
    <>
      <motion.div
        initial={{ opacity: .5 }}  // start at half the size
        animate={{ opacity: 1 }}    // animate to full size
        transition={defaultTransition}>
        <div className="flex flex-col justify-center gap-4 mt-6">
          <div className="grid grid-cols-3 w-full items-center">
            <TeamBans team={blue} />
            <ConfirmButton />
            <TeamBans team={red} />
          </div>
          <div className="flex flex-row justify-between w-full h-full gap-12">
            <TeamPicks team={blue} />
            <TeamPicks team={red} />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default RoomInfo;
