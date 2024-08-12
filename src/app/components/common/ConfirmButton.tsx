import React, { useCallback, useMemo } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Eye } from 'lucide-react';
import { Button } from '@/app/components/ui/button';
import AnimatedDot from '@/app/components/common/AnimatedDot';
import useSocket from '@/app/hooks/useSocket';
import useTeams from '@/app/hooks/useTeams';
import useRoomStore from '@/app/stores/roomStore';
import useTeamStore from '@/app/stores/teamStore';
import useCurrentHero from '@/app/hooks/useCurrentHero';
import { supabase } from '@/app/lib/supabase/client';
import debounce from 'lodash/debounce';
import defaultTransition from '@/app/lib/animationConfig';

const DEBOUNCE_TIME = 300;

const ConfirmButton: React.FC = () => {
  const { socket } = useSocket();
  const { room, isLoading } = useRoomStore();
  const { isSpectator } = useTeamStore();
  const { currentTeam } = useTeams();
  const currentHero = useCurrentHero();

  const handleConfirmSelection = useCallback(async () => {
    if (!currentTeam?.can_select || !room) return;
    try {
      const { data, error } = await supabase
        .from('teams')
        .update({ can_select: false })
        .eq('id', currentTeam.id)
        .select('*');
      if (error) throw error;
      if (data) {
        socket?.emit('SELECT_CHAMPION', { roomid: room.id });
      }
    } catch (error) {
      console.error('Error confirming selection:', error);
    }
  }, [currentTeam, room, socket]);

  const debouncedHandleConfirmSelection = useMemo(
    () => debounce(handleConfirmSelection, DEBOUNCE_TIME, { leading: true, trailing: false }),
    [handleConfirmSelection]
  );

  if (!room?.ready || isLoading || !socket) return null;

  if (isSpectator) {
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <Eye size={21} />
        <p className="text-center uppercase">spectateur</p>
      </div>
    );
  }

  const buttonText = room.status === 'ban' ? 'Confirmer le Ban' : 'Confirmer la Selection';
  const isCurrentTurn = currentTeam?.is_turn && !isSpectator;
  const isButtonDisabled = currentHero?.id === null || !currentTeam?.can_select;

  return (
    <AnimatePresence mode='wait'>
      <motion.div
        initial={{ y: 2, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={defaultTransition}
        className="flex w-full justify-center"
      >
        {room.cycle < 17 && (
          isCurrentTurn ? (
            <Button
              size="lg"
              onClick={debouncedHandleConfirmSelection}
              className="w-64"
              variant={isButtonDisabled ? 'outline' : 'default'}
              disabled={isButtonDisabled}
            >
              {!currentTeam?.can_select ? <AnimatedDot /> : buttonText}
            </Button>
          ) : (
            <div className="flex w-full flex-col items-center justify-center">
              <p className="text-sm opacity-80">{`Ce n'est pas votre tour`}</p>
              <div className="text-md px-12 text-center font-medium flex gap-0.5">
                <p className="whitespace-nowrap">{`En attente de l'autre équipe`}</p>
                <AnimatedDot />
              </div>
            </div>
          )
        )}
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmButton;