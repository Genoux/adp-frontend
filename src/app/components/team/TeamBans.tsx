import { motion } from 'framer-motion';
import { useEffect, useState, useMemo } from 'react';
import useTeams from '@/app/hooks/useTeams';
import useRoomStore from '@/app/stores/roomStore';
import ExtendedImage from '@/app/components/common/ExtendedImage';

type Hero = {
  id: string | null;
  name: string;
  selected: boolean;
};

type Team = {
  isturn: boolean;
  canSelect: boolean;
  heroes_ban: Hero[];
  clicked_hero?: string;
};

const TeamBans = ({ team }: { team: Team }) => {
  const { room } = useRoomStore();
  const { currentTeam } = useTeams();
  const [currentIndex, setCurrentIndex] = useState<number | null>(null);

  useEffect(() => {
    if (room?.status !== 'ban') return;
    setCurrentIndex(team.isturn && team.canSelect
      ? team.heroes_ban.findIndex(hero => !hero.selected)
      : null
    );
  }, [room?.status, team.isturn, team.canSelect, team.heroes_ban]);

  const opacity = useMemo(() => 
    currentTeam?.isturn || currentTeam === undefined ? 1 : 0.8,
  [currentTeam]);

  return (
    <motion.div className="flex h-full w-full gap-2" animate={{ opacity }}>
      {team.heroes_ban.map((hero, index) => (
        <HeroBanSlot
          key={`${index}-${hero.id}`}
          hero={hero}
          index={index}
          isCurrentSlot={index === currentIndex}
          isTurn={team.isturn}
        />
      ))}
    </motion.div>
  );
};

const HeroBanSlot = ({ hero, index, isCurrentSlot, isTurn }: {
  hero: Hero;
  index: number;
  isCurrentSlot: boolean;
  isTurn: boolean;
}) => {
  const showImage = hero.id !== null;
  const showX = hero.id === null && hero.selected === true;

  return (
    <motion.div
      className={`relative h-full w-full overflow-hidden border ${
        isCurrentSlot && isTurn ? 'border-red' : 'border-white border-opacity-5'
      } bg-black bg-opacity-20`}
    >
      {isCurrentSlot && isTurn && <BorderAnimation />}
      {showImage ? (
        <HeroImage hero={hero} isCurrentSlot={isCurrentSlot} />
      ) : showX ? (
        <EmptySelectedSlot />
      ) : null}
    </motion.div>
  );
};

const BorderAnimation = () => (
  <motion.div
    className="glow-red-10 absolute inset-0 z-10 border border-red bg-opacity-10 bg-gradient-to-t from-red to-transparent"
    animate={{ opacity: [0.5, 1] }}
    transition={{
      duration: 1,
      repeat: Infinity,
      repeatType: 'reverse',
    }}
  />
);

const HeroImage = ({ hero, isCurrentSlot }: { hero: Hero; isCurrentSlot: boolean }) => (
  <>
    <motion.div
      className="h-full w-full grayscale"
      initial={{ scale: 1.25 }}
      animate={{ scale: isCurrentSlot ? 1.25 : 1 }}
      transition={{ duration: 0.4, ease: [1, -0.6, 0.3, 1.2] }}
    >
      <ExtendedImage
        alt={hero.name}
        type="tiles"
        src={hero.id!}
        style={{ objectPosition: 'center', objectFit: 'cover' }}
        fill
      />
    </motion.div>
    <p className='z-20 text-sm absolute bottom-0 items-end left-0 h-full w-full flex justify-center pb-4'>
      {hero.name}
    </p>
  </>
);

const EmptySelectedSlot = () => (
  <div className="bg-zinc-900 bg-opacity-10 h-full w-full flex justify-center items-center">
    <svg
      width="32"
      height="33"
      viewBox="0 0 32 33"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M31.3943 4.03759C32.2019 3.23022 32.2019 1.9212 31.3943 1.11383C30.5871 0.306458 29.278 0.306458 28.4708 1.11383L16 13.5846L3.52932 1.11383C2.72191 0.306458 1.4129 0.306458 0.605528 1.11383C-0.201843 1.9212 -0.201843 3.23022 0.605528 4.03759L13.0762 16.5083L0.605528 28.979C-0.201843 29.7866 -0.201843 31.0954 0.605528 31.9029C1.4129 32.7101 2.72191 32.7101 3.52932 31.9029L16 19.4321L28.4708 31.9029C29.278 32.7101 30.5871 32.7101 31.3943 31.9029C32.2019 31.0954 32.2019 29.7866 31.3943 28.979L18.9238 16.5083L31.3943 4.03759Z"
        fill="#232328"
      />
    </svg>
  </div>
);

export default TeamBans;