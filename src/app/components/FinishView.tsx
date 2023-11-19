import useTeams from '@/app/hooks/useTeams';
import { defaultTransition } from '@/app/lib/animationConfig';
import { teamStore } from '@/app/stores/teamStore';
import { motion } from 'framer-motion';
import { useEffect } from 'react';
import TeamPicks from './team/TeamPicks';

const FinishView = () => {
  let { blue, red } = useTeams(teamStore);

  return (
    <div className="px-6 lg:px-12">
      <motion.div
        initial={{ y: '-10px', opacity: 0 }} // start at half the size
        animate={{ y: '0px', opacity: 1 }} // animate to full size
        transition={defaultTransition}
        className="text-center"
      >
        <h1 className="mt-12 text-4xl font-bold">{'Draft terminé!'}</h1>
      </motion.div>
      <div className="grid w-full  grid-cols-2 gap-12">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          transition={defaultTransition}
          className="absolute left-0 top-0 h-full w-1/2 bg-gradient-to-r from-blue to-transparent opacity-25"
        ></motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={defaultTransition}
          className="relative"
        >
          <h1
            className={`mb-6 w-fit rounded-full px-8 py-1 text-center text-xl uppercase bg-${blue.color}`}
          >
            {' '}
            {blue.name}
          </h1>
          <div className="border-t border-white border-opacity-40 pt-6">
            <TeamPicks team={blue} />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.25 }}
          transition={defaultTransition}
          className="absolute right-0 top-0 h-full w-1/2 bg-gradient-to-r from-transparent to-red opacity-25"
        ></motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={defaultTransition}
          className="relative"
        >
          <h1
            className={`mb-6 ml-auto w-fit rounded-full px-8 py-1 text-center text-xl uppercase bg-${red.color}`}
          >
            {' '}
            {red.name}
          </h1>
          <div className="border-t border-white border-opacity-40 pt-6">
            <TeamPicks team={red} />
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default FinishView;
