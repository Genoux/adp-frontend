import useTeams from '@/app/hooks/useTeams';
import { defaultTransition } from '@/app/lib/animationConfig';
import { motion } from 'framer-motion';
import Image from 'next/image';
import { Key } from 'react';
import TeamName from '@/app/components/common/TeamName'
interface Hero {
  name: string;
  id: string;
  selected: boolean;
}

interface Team {
  [key: string]: any;
}

const HeroDisplay = ({ hero }: { hero: Hero }) => (
  <div className="relative h-full overflow-hidden rounded">
    <h1 className="absolute left-0 top-0 flex h-full w-full items-end justify-center bg-black bg-opacity-20 bg-gradient-to-t from-[#000000f5] via-transparent pb-12 text-center">
      {hero.name}
    </h1>
    <Image
      className="h-full overflow-hidden object-cover"
      width={1024}
      height={1024}
      src={
        hero.id
          ? `/images/champions/splash/${hero.id
            .toLowerCase()
            .replace(/\s+/g, '')
            .replace(/[\W_]+/g, '')}.jpg`
          : ''
      }
      alt={''}
    />
  </div>
);

const TeamDisplay = ({
  team,
  teamColor,
  position,
}: {
  team: Team;
  teamColor: string;
  position: string;
}) => (
  <div className={`flex flex-col items-${position}`}>
    <TeamName name={team.name} color={team.color} />
    <div className="mt-6 flex h-96 gap-2">
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
    <motion.div
    initial={{ y: -10, opacity: 0 }}
    animate={{ y: 0, opacity: 1 }}
    transition={{defaultTransition, delay: .5}}
      className="mt-10 px-24 flex flex-col items-center justify-center gap-6">
      <motion.div
        className="text-center"
      >
        <h1 className="text-4xl font-bold">{'Draft terminé'}</h1>
      </motion.div>
      <div className="flex w-full items-center gap-6">
        <motion.div
        >
          <TeamDisplay team={blueTeam} teamColor="blue" position="start" />
        </motion.div>

        <motion.div
        >
          <p className="text-lg font-bold">VS</p>
        </motion.div>

        <motion.div
        >
          <TeamDisplay team={redTeam} teamColor="red" position="end" />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FinishView;
