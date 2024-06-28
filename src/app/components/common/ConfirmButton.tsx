//TODO: Fix glitch loading when confirming selection

import React, { useCallback, useMemo } from 'react';
import { motion } from 'framer-motion';
import { View } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import LoadingCircle from '@/app/components/common/LoadingCircle';
import AnimatedDot from '@/app/components/common/AnimatedDot';
import useSocket from '@/app/hooks/useSocket';
import useTeams from '@/app/hooks/useTeams';
import useRoomStore from '@/app/stores/roomStore';
import useCurrentHero from '@/app/hooks/useCurrentHero';
import { supabase } from '@/app/lib/supabase/client';
import debounce from 'lodash/debounce';

const DEBOUNCE_TIME = 300; // ms

const ConfirmButton: React.FC = () => {
  const { socket } = useSocket();
  const { room, isLoading } = useRoomStore();
  const { currentTeam } = useTeams();
  const currentHero = useCurrentHero();

  const handleConfirmSelection = useCallback(async () => {
    if (!currentTeam?.can_select) return;
    try {
      const { data, error } = await supabase
        .from('teams')
        .update({ can_select: false })
        .eq('id', currentTeam?.id)
        .select('*');
      if (error) throw error;
      if (data) {
        socket?.emit('SELECT_CHAMPION', {
          roomid: room?.id,
        });
      }
    } catch (error) {
      console.error('Error confirming selection:', error);
    }
  }, [currentTeam, room, socket]);

  const debouncedHandleConfirmSelection = useMemo(
    () => debounce(handleConfirmSelection, DEBOUNCE_TIME, { leading: true, trailing: false }),
    [handleConfirmSelection]
  );

  if (isLoading || !socket) return <div>Loading...</div>;
  if (!currentTeam)
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <View size={21} />
        <p className="text-center uppercase">spectateur</p>
      </div>
    );

  const buttonText = room?.status === 'ban' ? 'Confirmer le Ban' : 'Confirmer la Selection';


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
      {currentTeam.is_turn ? (
        <Button
          size="lg"
          onClick={debouncedHandleConfirmSelection}
          className="w-64"
          disabled={currentHero?.id === null && !currentTeam?.can_select}
        >
          {buttonText}
        </Button>
      ) : (
        <TurnWaitingState />
      )}
    </motion.div>
  );
};

export default ConfirmButton;