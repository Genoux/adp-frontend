import useTeams from '@/app/hooks/useTeams';
import { defaultTransition } from '@/app/lib/animationConfig';
import { AnimatePresence, motion } from 'framer-motion';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface Hero {
  [key: string]: any;
}

interface Team {
  [key: string]: any;
}

interface HeroDisplayProps {
  hero: Hero;
  animationDelay: number;
}

const HeroDisplay = ({ hero, animationDelay }: HeroDisplayProps) => (
  <motion.div
    initial={{ opacity: 0, scale: 1.2 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{
      defaultTransition,
      delay: animationDelay,
      duration: 0.3,
      ease: [0.34, 1.56, 0.64, 1],
    }}
    className="relative h-full min-h-[150px] w-full overflow-hidden"
  >
    <div className="absolute left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-gradient-to-t from-[#00000096] via-transparent to-[#0000004d] text-center">
      <p className="text-xl font-black uppercase">{hero.name}</p>
    </div>
    <div className="absolute left-0 top-0 h-full w-full">
      {hero.id && (
        <Image
          src={`/images/champions/splash/${hero.id
            .toLowerCase()
            .replace(/\s+/g, '')
            .replace(/[\W_]+/g, '')}.webp`}
          alt={hero.name}
          objectFit='cover'
          layout='fill'
          quality={50}
        />
      )}
    </div>
  </motion.div>
);
interface TeamDisplayProps {
  team: Team;
  position: string;
  reverseAnimation?: boolean;
}

const TeamDisplay = ({
  team,
  position,
  reverseAnimation,
}: TeamDisplayProps) => (
  <div className={`flex flex-col items-${position} w-full px-10`}>
    <motion.div
      initial={{ opacity: 0, x: reverseAnimation ? 100 : -100 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        defaultTransition,
        delay: 2,
        ease: [0.34, 1.56, 0.64, 1],
        duration: 0.2,
      }}
      className="mb-4 text-3xl font-black uppercase"
    >
      {team.name}
    </motion.div>
    {team.heroes_selected.map((hero: Hero, index: number) => (
      <HeroDisplay key={index} hero={hero} animationDelay={0.5 + index * 0.3} />
    ))}
  </div>
);

const FinishView: React.FC = () => {
  const { redTeam, blueTeam } = useTeams();
  const [showTeams, setShowTeams] = useState<boolean>(false);
  const [showTitle, setShowTitle] = useState(true);

  useEffect(() => {
    if (showTitle) {
      setTimeout(() => {
        setShowTitle(false);
        setTimeout(() => {
          setShowTeams(true);
        }, 0);
      }, 2000);
    }
  }, [showTitle]);

  if (!redTeam || !blueTeam) return null;

  if (!redTeam || !blueTeam) return null;

  return (
    <div className="mx-auto flex flex-col items-center justify-center">
      <AnimatePresence mode='wait'>
        {showTitle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ defaultTransition, duration: 1, delay: .5 }}
            exit={{ opacity: 0 }}
            className="absolute left-0 top-0 flex h-full w-full items-center justify-center text-center"
          >
            <h1 className="text-6xl font-black uppercase">Draft terminé</h1>
          </motion.div>
        )}
      </AnimatePresence>
      {showTeams && (
        <div className="flex w-full flex-grow h-full items-center justify-center gap-6 pb-6 pt-6">
          <div className="w-full">
            <motion.div
              initial={{ x: -100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ defaultTransition, delay: 1, duration: 1 }}
              className="fixed left-0 top-0 -z-10 h-full w-1/2 border-l-8 border-blue-600 bg-gradient-to-r from-[#0f9efd15] to-transparent"
            ></motion.div>
            <TeamDisplay team={blueTeam} position="start" />
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ defaultTransition, delay: 2, duration: 0.5 }}
            className="text-5xl font-black uppercase"
          >
            VS
          </motion.div>

          <div className="w-full">
            <motion.div
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ defaultTransition, delay: 2, duration: 0.5 }}
              className="fixed right-0 top-0 -z-10 h-full w-1/2 border-r-8 border-red-600 bg-gradient-to-l from-[#ff22121c] to-transparent"
            ></motion.div>
            <TeamDisplay
              team={redTeam}
              position="end"
              reverseAnimation={true}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default FinishView;
