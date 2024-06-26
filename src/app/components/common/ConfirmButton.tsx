import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { View } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import LoadingCircle from '@/app/components/common/LoadingCircle';
import AnimatedDot from '@/app/components/common/AnimatedDot';
import useSocket from '@/app/hooks/useSocket';
import useTeams from '@/app/hooks/useTeams';
import useTeamStore from '@/app/stores/teamStore';
import useRoomStore from '@/app/stores/roomStore';
import useCurrentHero from '@/app/hooks/useCurrentHero';
import { supabase } from '@/app/lib/supabase/client';

// TODO: Test without teamAction. Might not need if we base the current hero on his selection array
// TODO: FIx glitch loader
// TODO: Fix the bug where a user need to select 2 champ on the second selection the button is still active therefore the user can submit a null champion

const ConfirmButton: React.FC = () => {
  const { socket } = useSocket();
  const { room, isLoading } = useRoomStore();
  const { currentTeam } = useTeams();
  const { setTeamAction, teamAction } = useTeamStore();
  const currentHero = useCurrentHero();

  useEffect(() => {
    if (currentTeam?.canSelect !== undefined) {
      setTeamAction(currentTeam.canSelect);
    }
  }, [currentTeam?.canSelect, setTeamAction]);

  if (isLoading || !socket) return <div>Loading...</div>;

  if (!currentTeam)
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <View size={21} />
        <p className="text-center uppercase">spectateur</p>
      </div>
    );

  const buttonText = room?.status === 'ban' ? 'Confirmer le Ban' : 'Confirmer la Selection';

  const handleConfirmSelection = async () => {
    setTeamAction(false);
    
    await supabase.from('teams').update({ canSelect: false }).eq('id', currentTeam?.id).select('*');

    socket.emit('SELECT_CHAMPION', {
      roomid: room?.id,
    });
  };

  const LoadingState = () => (
    <div className="flex justify-center">
      <LoadingCircle color="white" size="w-4 h-4" />
    </div>
  );

  const TurnWaitingState = () => (
    <div className="flex w-full flex-col items-center justify-center">
      <p className="text-sm opacity-80">{"Ce n'est pas votre tour"}</p>
      <div className="text-md px-12 text-center font-medium flex gap-0.5">
        <p className="whitespace-nowrap">{`En attente de l'autre équipe`}</p>
        <AnimatedDot />
      </div>
    </div>
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.15, delay: 0.2 }}
      className="flex w-full justify-center"
    >
      {currentTeam.ready && (
        currentTeam.isturn ? (
          !currentTeam.canSelect || !teamAction ? (
            <LoadingState />
          ) : (
            <Button
              size="lg"
              onClick={handleConfirmSelection}
              className="w-64"
              disabled={currentHero === null}
            >
              {buttonText}
            </Button>
          )
        ) : (
          <TurnWaitingState />
        )
      )}
    </motion.div>
  );
};

export default ConfirmButton;
