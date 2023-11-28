import ChampionsPool from '@/app/components/common/ChampionsPool';
import Timer from '@/app/components/common/RoomTimer';
import { defaultTransition } from '@/app/lib/animationConfig';
import { roomStore } from '@/app/stores/roomStore';
import { motion } from 'framer-motion';
import NoticeBanner from './common/NoticeBanner';

export const WaitingView = () => {
  const { room } = roomStore();

  if (!room) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={defaultTransition}
      className="flex flex-col items-center justify-start h-full gap-10 mt-12"
    >
      <div className='flex flex-col gap-4 items-center'>
        <Timer className='w-full' />
        <div className='text-center'>
          <h1 className="text-3xl font-bold">Phase de planification</h1>
          <p className="text-base text-[#737373]">{'Analyse de la sélection de champions'}</p>
        </div>
      </div>
      <motion.div
        initial={{ y: 10, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={defaultTransition}
      >
          <ChampionsPool />
      </motion.div>
      <NoticeBanner message="Si l'un de vos joueurs ne dispose pas du champion requis, veuillez informer les administrateurs." />

    </motion.div>
  );
};

export default WaitingView;
