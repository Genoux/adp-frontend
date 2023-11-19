import ConfirmButton from '@/app/components/common/ConfirmButton';
import TeamBans from '@/app/components/team/TeamBans';
import TeamPicks from '@/app/components/team/TeamPicks';
import useTeams from '@/app/hooks/useTeams';
import { defaultTransition } from '@/app/lib/animationConfig';
import { teamStore } from '@/app/stores/teamStore';
import { motion } from 'framer-motion';

const RoomInfo = () => {
  const { blue, red } = useTeams(teamStore);

  return (
    <>
      <motion.div
        initial={{ opacity: 0.5 }} // start at half the size
        animate={{ opacity: 1 }} // animate to full size
        transition={defaultTransition}
      >
        <div className="mt-6 flex h-full flex-col justify-evenly gap-4 rounded-md border border-[#8f8f8f] border-opacity-5 bg-[#0f0f0f3f] p-4">
          <div className="grid w-full grid-cols-3 items-center">
            <TeamBans team={blue} />
            <ConfirmButton />
            <TeamBans team={red} />
          </div>
          <div className="grid h-full w-full grid-cols-2 gap-12">
            <TeamPicks team={blue} />
            <TeamPicks team={red} />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default RoomInfo;
