import TeamName from '@/app/components/common/TeamName';
import useTeams from '@/app/hooks/useTeams';
import { defaultTransition } from '@/app/lib/animationConfig';
import { motion } from 'framer-motion';
import Image from 'next/image';

interface Hero {
  name: string;
  id: string;
  selected: boolean;
}

interface Team {
  [key: string]: any;
}

const HeroDisplay = ({ hero, animationDelay }: { hero: Hero, animationDelay: number }) => (
  <div className="relative h-full overflow-hidden rounded">
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ defaultTransition, delay: animationDelay, duration: .25 }}
      className="absolute z-50 left-0 top-0 flex h-full w-full items-end justify-center bg-black bg-opacity-20 bg-gradient-to-t from-[#000000f5] via-transparent pb-12 text-center">
      {hero.name}

    </motion.div>
    <motion.div
      initial={{ opacity: 0, scale: 1.2 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ defaultTransition, delay: animationDelay, duration: .25 }}
      className='h-full'
    >


      <Image
        className="h-full overflow-hidden object-cover"
        width={500}
        height={500}
        quality={80}
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
    </motion.div>
  </div>
);

const TeamDisplay = ({
  team,
  position,
  reverseAnimation = false,
}: {
  team: Team;
  teamColor: string;
  position: string;
  reverseAnimation?: boolean;
}) => (
  <div className={`flex flex-col items-${position}`}>
    <TeamName name={team.name} color={team.color} />
    <div className="mt-6 flex h-96 gap-2">
      {team.heroes_selected.map((hero: Hero, index: number) => {
        // Calculate delay based on whether the animation is reversed
        const animationDelay = reverseAnimation
          ? 0.5 + (team.heroes_selected.length - 1 - index) * 0.1
          : 0.5 + index * 0.1;

        return <HeroDisplay key={index} hero={hero} animationDelay={animationDelay} />;
      })}
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
      transition={{ defaultTransition, delay: 0.5 }}
      className="mt-10 flex flex-col items-center justify-center px-24"
    >
      <motion.div className="text-center">
        <h1 className="text-4xl font-bold">{'Draft terminé'}</h1>
      </motion.div>
      <div className="flex w-full items-center gap-6">
        <motion.div>
          <TeamDisplay team={blueTeam} teamColor="blue" position="start" />
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ defaultTransition, delay: 1 }}
        >
          <p className="text-lg font-bold">VS</p>
        </motion.div>

        <motion.div>
          <TeamDisplay team={redTeam} teamColor="red" position="end" reverseAnimation={true} />
        </motion.div>
      </div>
    </motion.div>
  );
};

export default FinishView;
