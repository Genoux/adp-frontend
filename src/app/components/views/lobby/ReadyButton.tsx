import AnimatedDot from '@/app/components/common/AnimatedDot';
import LoadingCircle from '@/app/components/common/LoadingCircle';
import { Button } from '@/app/components/ui/button';
import { useToast } from '@/app/components/ui/use-toast';
import useSocket from '@/app/hooks/useSocket';
import defaultTransition from '@/app/lib/animationConfig';
import { supabase } from '@/app/lib/supabase/client';
import { Database } from '@/app/types/supabase';
import clsx from 'clsx';
import { motion } from 'framer-motion';
import React, { useCallback, useState } from 'react';

type Team = Database['public']['Tables']['teams']['Row'];

type ReadyButtonProps = {
  currentTeam: Team;
  otherTeam: Team;
};

const ReadyButton: React.FC<ReadyButtonProps> = ({
  currentTeam,
  otherTeam,
}) => {
  const [clicked, setClicked] = useState<boolean>(currentTeam.ready);
  const { socket } = useSocket();
  const { toast } = useToast();

  const handleReadyClick = useCallback(async () => {
    setClicked(true);

    if (!currentTeam || currentTeam.id === undefined) {
      throw new Error('Current team or team ID is undefined');
    }

    try {
      const { data, error } = await supabase
        .from('teams')
        .update({ ready: true })
        .eq('id', currentTeam.id)
        .select('*')
        .single();

      if (data && !error) {
        socket!.emit('TEAM_READY', {
          roomid: data.room_id,
          teamid: currentTeam.id,
        });
        return;
      }

      throw new Error('Error setting ready phase', (error as any).message);
    } catch (error) {
      toast({
        title: 'Erreur (code: 500)',
        description:
          'Une erreur est survenue lors de la confirmation, veuillez réessayer plus tard ou contacter un administrateur',
        variant: 'destructive',
      });
      setClicked(false);
    }
  }, [currentTeam, socket, toast]);

  if (currentTeam.ready && !otherTeam.ready) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={defaultTransition}
        className={clsx('flex gap-1 text-base justify-center h-full')}
      >
        {"En attente de l'autre équipe"}
        <AnimatedDot />
      </motion.div>
    );
  }

  if (clicked) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={defaultTransition}
        className="flex w-full items-center justify-center"
      >
        <LoadingCircle size="h-3 w-3" />
      </motion.div>
    );
  }

  return (
    <Button
      size="lg"
      className="w-full"
      onClick={handleReadyClick}
      variant="default"
    >
      Confirmer prêt
    </Button>
  );
};

export default ReadyButton;
