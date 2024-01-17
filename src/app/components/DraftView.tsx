import ConfirmButton from '@/app/components/common/ConfirmButton';
import TeamBans from '@/app/components/team/TeamBans';
import TeamPicks from '@/app/components/team/TeamPicks';
import useTeams from '@/app/hooks/useTeams';
import { defaultTransition } from '@/app/lib/animationConfig';
import { motion } from 'framer-motion';

const RoomInfo = () => {
  const { redTeam, blueTeam } = useTeams();

  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }} // start at half the size
        animate={{ opacity: 1, y: 0 }} // animate to full size
        transition={{ duration: 0.3, defaultTransition, delay: 0.25 }}
        className="w-full"
      >
        <div className="flex h-full flex-col justify-evenly gap-4 rounded-md border border-[#8f8f8f] border-opacity-5 bg-neutral-950 bg-opacity-40 px-5 pb-5 pt-5">
          <div className="grid w-full grid-cols-3 items-center">
            <TeamBans team={blueTeam} />
            <ConfirmButton />
            <TeamBans team={redTeam} />
          </div>
          <div className="grid h-full w-full grid-cols-2 gap-12">
            <TeamPicks team={blueTeam} />
            <TeamPicks team={redTeam} />
          </div>
        </div>
      </motion.div>
    </>
  );
};

export default RoomInfo;
