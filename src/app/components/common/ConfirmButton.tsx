// ConfirmButton.tsx
import LoadingCircle from '@/app/components/common/LoadingCircle';
import { Button } from '@/app/components/ui/button';
import { useCanSelect } from '@/app/context/CanSelectContext';
import SocketContext from '@/app/context/SocketContext';
import useEnsureContext from '@/app/hooks/useEnsureContext';
import useTeams from '@/app/hooks/useTeams';
import { roomStore } from '@/app/stores/roomStore';
import { AnimatePresence, motion } from 'framer-motion';
import { View } from 'lucide-react';
import React, { useEffect } from 'react';

const ConfirmButton = () => {
  const socket = useEnsureContext(SocketContext);
  const { canSelect, setCanSelect } = useCanSelect();

  const { room } = roomStore((state) => ({
    room: state.room,
    error: state.error,
    isLoading: state.isLoading,
  }));

  const { currentTeam: team, otherTeam } = useTeams();

    
  useEffect(() => {
    const handleButton = () => {
      console.log('TIMER_FALSE');
      setCanSelect(false);
    };
    socket.on('TIMER_FALSE', handleButton);

    return () => {
      socket.off('TIMER_FALSE', handleButton);
    };
  }, [setCanSelect, socket]);

  useEffect(() => {
    setCanSelect(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!team)
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <View size={21} />
        <p className="text-center uppercase">spectateur</p>
      </div>
    );
  const currentTeam = team.isturn ? team : otherTeam;

  const isBanPhase = room?.status === 'ban';

  const buttonText = team.isturn
    ? isBanPhase
      ? 'Confirmer le Ban'
      : 'Confirmer la Selection'
    : `C'est à l'équipe ${otherTeam?.color} de ${
        isBanPhase ? 'bannir' : 'choisir'
    }`;


  const handleConfirmSelection = async () => {
    if (socket) {
      setCanSelect(false);
      socket?.emit('STOP_TIMER', { roomid: room?.id });

      socket.emit('SELECT_CHAMPION', {
        teamid: team?.id,
        roomid: room?.id,
        selectedChampion: currentTeam?.clicked_hero,
      });
    }
  };

  return (
    <div className="flex w-full justify-center">
      {team.isturn ? (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0 }} // start at half the size
            animate={{ opacity: 1 }} // animate to full size
            transition={{ duration: 1 }}
            exit={{ opacity: 0, transition: { duration: 1 } }}
          >
            <Button
              size="default"
              onClick={handleConfirmSelection}
              className="w-64"
              disabled={
                !currentTeam?.clicked_hero || !canSelect || !team.isturn
              }
            >
              {!canSelect ? (
                <LoadingCircle color="black" size="w-4 h-4" />
              ) : (
                <>{buttonText}</>
              )}
            </Button>
          </motion.div>
        </AnimatePresence>
      ) : (
        <div className="flex w-full flex-col items-center justify-center">
          <p className="text-sm  opacity-80">Ce n’est pas votre tour</p>
          <p className="text-md px-12 text-center font-medium">
            {`En attente de l'autre équipe`}
            <div className="sending-animation ">
              <span className="sending-animation-dot">.</span>
              <span className="sending-animation-dot">.</span>
              <span className="sending-animation-dot">.</span>
            </div>
          </p>
        </div>
      )}
    </div>
  );
};

export default ConfirmButton;
