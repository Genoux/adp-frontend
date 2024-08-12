import ExtendedImage from '@/app/components/common/ExtendedImage';
import TeamName from '@/app/components/common/TeamName';
import useTeams from '@/app/hooks/useTeams';
import defaultTransition from '@/app/lib/animationConfig';
import { Database } from '@/app/types/supabase';
import { AnimatePresence, motion } from 'framer-motion';
import { useEffect, useState } from 'react';

type Team = Database['public']['Tables']['teams']['Row'];
type Hero = Database['public']['CompositeTypes']['hero'];

type HeroDisplayProps = {
  hero: Hero;
  animationDelay: number;
};

const HeroDisplay = ({ hero, animationDelay }: HeroDisplayProps) => (
  <motion.div
    initial={{ opacity: 0, y: -10 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{
      defaultTransition,
      delay: animationDelay,
      duration: 0.3,
      ease: [0.34, 1.56, 0.64, 1],
    }}
    className="relative h-full w-full overflow-hidden"
  >
    <div className="absolute bottom-0 left-0 z-50 flex h-full w-full items-end justify-center bg-gradient-to-t from-[#00000096] via-transparent to-[#0000004d] pb-6 text-center">
      <p className="xl:text-md text-sm font-bold uppercase">{hero.name}</p>
    </div>
    <div
      key={hero.id}
      className="relative w-full overflow-hidden"
      style={{
        height: 'calc(100vh - 140px)',
        maxHeight: '50px',
        minHeight: '450px',
      }}
    >
      {hero.id && (
        <ExtendedImage
          src={hero.id}
          alt={hero.id}
          type="centered"
          params='w_500,h_720,c_1,q_60'
          style={{ objectFit: 'cover', width: '100%', height: '100%' }}
          className="w-full"
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

const TeamDisplay = ({ team, reverseAnimation }: TeamDisplayProps) => {
  const heroes = reverseAnimation
    ? [...(team.heroes_selected as Hero[])].reverse()
    : team.heroes_selected;
  const direction = reverseAnimation ? 'justify-end' : 'justify-start';
  return (
    <motion.div
      initial={{ opacity: 0, x: reverseAnimation ? 50 : -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{
        defaultTransition,
        delay: 1.8,
        ease: [0.34, 1.2, 0.34, 1],
        duration: 0.8,
      }}
      className="flex w-full flex-col gap-2 border bg-zinc-800 bg-opacity-10 p-4"
    >
      <motion.div className={`${direction} flex`}>
        <TeamName name={team.name} color={team.color} />
      </motion.div>
      <div
        className={`flex gap-2 ${reverseAnimation ? 'flex-row-reverse' : ''}`}
      >
        {(heroes as Hero[]).map((hero, index) => (
          <HeroDisplay
            key={index}
            hero={hero}
            animationDelay={2 + index * 0.3}
          />
        ))}
      </div>
    </motion.div>
  );
};

const FinishView: React.FC = () => {
  const { redTeam, blueTeam } = useTeams();
  const [showTeams, setShowTeams] = useState<boolean>(false);
  const [showTitle, setShowTitle] = useState(true);

  useEffect(() => {
    if (showTitle) {
      setTimeout(() => {
        setShowTitle(false);
        setShowTeams(true);
      }, 1000);
    }
  }, [showTitle]);

  if (!redTeam || !blueTeam) return null;

  return (
    <div className="mx-auto flex h-screen flex-col items-center justify-center px-8">
      <AnimatePresence mode="wait">
        {showTitle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ defaultTransition, duration: 0.5, delay: 0.5 }}
            exit={{ opacity: 0 }}
            className="absolute left-0 top-0 flex h-full w-full items-center justify-center text-center"
          >
            <h1 className="text-3xl font-bold uppercase">Draft terminé</h1>
          </motion.div>
        )}
      </AnimatePresence>
      {showTeams && (
        <div className="flex h-full w-full flex-grow items-center justify-center gap-4">
          <div className="relative flex w-full flex-col gap-4">
            <TeamDisplay team={blueTeam} position="start" />
          </div>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ defaultTransition, delay: 2, duration: 1 }}
            className="text-2xl font-black uppercase"
          >
            VS
          </motion.div>
          <div className="relative flex w-full flex-col gap-4">
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
