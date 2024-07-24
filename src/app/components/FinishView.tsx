import useTeams from '@/app/hooks/useTeams';
import defaultTransition from '@/app/lib/animationConfig';
import { AnimatePresence, motion } from 'framer-motion';
import ExtendedImage from '@/app/components/common/ExtendedImage';
import { useEffect, useState } from 'react';
import { Database } from '@/app/types/supabase';
import TeamName from '@/app/components/common/TeamName';

type Team = Database["public"]["Tables"]["teams"]["Row"];
type Hero = Database["public"]["CompositeTypes"]["hero"];

type HeroDisplayProps = {
  hero: Hero;
  animationDelay: number;
}

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
    <div className="absolute left-0 bottom-0 z-50 flex pb-6 h-full w-full items-end justify-center bg-gradient-to-t from-[#00000096] via-transparent to-[#0000004d] text-center">
      <p className="text-sm xl:text-md font-bold uppercase">{hero.name}</p>
    </div>
    <div key={hero.id} className='w-full overflow-hidden relative' style={{ height: 'calc(100vh - 140px)', maxHeight: '50px', minHeight: '450px' }}>
      {hero.id && (
        <ExtendedImage
          src={hero.id}
          alt={hero.id}
          type='centered'
          fill
          style={{ objectFit: 'cover' }}
          className='w-full'
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
  reverseAnimation,
}: TeamDisplayProps) => {
  const heroes = reverseAnimation ? [...team.heroes_selected as Hero[]].reverse() : team.heroes_selected;
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
      className='w-full gap-2 flex flex-col border p-4 bg-zinc-800 bg-opacity-10'>
      <motion.div
        className={`${direction} flex`}
      >
        <TeamName name={team.name} color={team.color} />
      </motion.div>
      <div className={`flex gap-2 ${reverseAnimation ? 'flex-row-reverse' : ''}`}>
        {(heroes as Hero[]).map((hero, index) => (
          <HeroDisplay key={index} hero={hero} animationDelay={2 + index * 0.3} />
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
    <div className="mx-auto flex flex-col items-center justify-center h-screen px-8">
      <AnimatePresence mode='wait'>
        {showTitle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ defaultTransition, duration: 0.5, delay: .5 }}
            exit={{ opacity: 0 }}
            className="absolute left-0 top-0 flex h-full w-full items-center justify-center text-center"
          >
            <h1 className="text-3xl font-bold uppercase">Draft terminé</h1>
          </motion.div>
        )}
      </AnimatePresence>
      {showTeams && (
        <div className="flex w-full flex-grow h-full items-center justify-center gap-4">

          <div className="w-full flex flex-col gap-4 relative">
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
          <div className="w-full flex flex-col gap-4 relative">
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
