import React, { useEffect, useState, useCallback } from 'react';
import ChampionsPool from '@/app/components/common/ChampionsPool';
import useTeams from '@/app/hooks/useTeams';
import { defaultTransition } from '@/app/lib/animationConfig';
import { roomStore } from '@/app/stores/roomStore';
import { AnimatePresence, motion } from 'framer-motion';
import ExtendedImage from '@/app/components/common/ExtendedImage';

type SelectionViewProps = {
  className?: string;
};

const SelectionView: React.FC<SelectionViewProps> = ({ className }) => {
  const [currentImageBlue, setCurrentImageBlue] = useState<string>('');
  const [currentImageRed, setCurrentImageRed] = useState<string>('');

  const { room, isLoading } = roomStore((state) => ({
    room: state.room,
    isLoading: state.isLoading,
  }));

  const { currentTeam, blueTeam, redTeam } = useTeams();

  const updateImage = useCallback((hero: string | unknown, setCurrentImage: React.Dispatch<React.SetStateAction<string>>) => {
    if (hero) {
      setCurrentImage(hero as string);
    }
  }, []);

  useEffect(() => {
    updateImage(blueTeam?.clicked_hero, setCurrentImageBlue);
    updateImage(redTeam?.clicked_hero, setCurrentImageRed);
  }, [blueTeam, redTeam, updateImage]);

  if (isLoading) return <div>Loading...</div>;
  if (!currentTeam) return <div>Team not found</div>;

  return (
    <>
      {room?.status === 'ban' && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.1 }}
          exit="exit"
          transition={{ delay: 0.2, duration: 1, ease: 'linear' }}
          className="fixed left-0 top-0 -z-50 h-full w-full bg-red-900 opacity-50"
        />
      )}
      <AnimatePresence>
        <ImageComponent
          key={`blue-${currentImageBlue}`}
          image={currentImageBlue}
          position="left"
        />
        <ImageComponent
          key={`red-${currentImageRed}`}
          image={currentImageRed}
          position="right"
        />
      </AnimatePresence>
      <motion.div
        initial={{ opacity: 1 }}
        animate={{ opacity: 1 }}
        transition={{ defaultTransition, duration: 0.2 }}
        className={className}
      >
        <ChampionsPool
          className='px-0 xl:px-24'
          team={currentTeam}
        />
      </motion.div>
    </>
  );
};

const ImageComponent: React.FC<{ image: string; position: 'left' | 'right' }> = React.memo(({ image, position }) => (
  <AnimatePresence mode='wait'>
    <motion.div
      className={`fixed top-0 -z-10 h-full w-3/12 ${position === 'left' ? 'left-0' : 'right-0'}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ defaultTransition, delay: 0, duration: 0.3 }}
    >
      {image && (
        <ExtendedImage
          src={image}
          type='centered'
          fill
          className={`h-full w-full object-cover object-center opacity-50 ${position === 'left' ? 'fade-gradient-left' : 'fade-gradient-right'}`}
          alt={image}
        />
      )}
    </motion.div>
  </AnimatePresence>
));

SelectionView.displayName = 'SelectionView';
ImageComponent.displayName = 'ImageComponent';

export default React.memo(SelectionView);
