import useTeams from '@/app/hooks/useTeams';
import { defaultTransition } from '@/app/lib/animationConfig';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Key } from 'react';

interface Hero {
  name: string;
  id: string;
  selected: boolean;
}

interface Team {
  [key: string]: any;
}

const HeroDisplay = ({ hero }: { hero: Hero }) => (
  <div className="relative h-full rounded overflow-hidden">
    <h1 className="absolute over text-center left-0 top-0 flex h-full w-full items-end justify-center bg-black bg-opacity-20 bg-gradient-to-t from-[#000000f5] via-transparent pb-12">
      {hero.name}
    </h1>
    <Image
      className="h-full overflow-hidden object-cover"
      width={1024}
      height={1024}
      src={hero.id ? `/images/champions/splash/${hero.id.toLowerCase().replace(/\s+/g, '').replace(/[\W_]+/g, '')}.jpg` : ''}
      alt={''}
    />
  </div>
);

const TeamDisplay = ({ team, teamColor,position }: { team: Team, teamColor: string, position: string }) => (
  <div className={`flex flex-col items-${position}`}>
    <div className={`bg-${teamColor}-500 bg-opacity-25 border border-${teamColor} rounded-full w-fit flex items-center px-2 h-7 gap-2`}>
      <div className={`text-sm font-medium h-2.5 w-2.5 rounded-full bg-${teamColor}`}></div>
      {team.name}
    </div>
    <div className="flex h-96 gap-2 mt-6">
      {team.heroes_selected.map((hero: Hero, index: Key | null | undefined) => (
        <HeroDisplay key={index} hero={hero} />
      ))}
    </div>
  </div>
);

export const FinishView = () => {
  const { redTeam, blueTeam } = useTeams();

  if (!redTeam || !blueTeam) return null;

  return (
    <div className="flex mt-24 flex-col items-center justify-center gap-12">
      <motion.div
        initial={{ y: '-10px', opacity: 0 }}
        animate={{ y: '0px', opacity: 1 }}
        transition={defaultTransition}
        className="text-center"
      >
        <h1 className="text-4xl font-bold">{'Draft terminé'}</h1>
      </motion.div>
      <div className="flex w-full items-center gap-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={defaultTransition}
        >
        <TeamDisplay team={blueTeam} teamColor="blue" position='start' />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={defaultTransition}
        >
          <p className="text-lg font-bold">VS</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={defaultTransition}
        >
        <TeamDisplay team={redTeam} teamColor="red" position='end' />
        </motion.div>
      </div>
    </div>
  );
};

export default FinishView;
