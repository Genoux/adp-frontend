// ConfirmButton.tsx
import LoadingCircle from '@/app/components/common/LoadingCircle';
import { Button } from '@/app/components/ui/button';
import useSocket from '@/app/hooks/useSocket';
import useTeams from '@/app/hooks/useTeams';
import useRoomStore from '@/app/stores/roomStore';
import { motion } from 'framer-motion';
import { View } from 'lucide-react';
import { useEffect, useState } from 'react';
import { PostgrestError } from '@supabase/supabase-js';
import { Bug } from 'lucide-react';
import AnimatedDot from '@/app/components/common/AnimatedDot';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/app/components/ui/alert-dialog"
import { supabase } from '@/app/lib/supabase/client';

const ConfirmButton = () => {
  const { socket } = useSocket()
  const { room, isLoading } = useRoomStore();
  const { currentTeam: team, otherTeam } = useTeams();
  const [err, setErr] = useState(false);
  const [errMessage, setErrMessage] = useState<PostgrestError>();
  const [button, setButton] = useState(false);

  useEffect(() => {
    if (socket) {
      socket.on('err', (data) => {
        setErrMessage(data);
        setErr(true);
      });
    }
  }, [socket]);

  useEffect(() => {
   if(!team?.canSelect || team.clicked_hero === null){
     setButton(false);
   }else {
     setButton(true);
   }
  }, [team])

  if (isLoading) return <div>Loading...</div>;

  if (!team)
    return (
      <div className="flex flex-col items-center justify-center gap-2">
        <View size={21} />
        <p className="text-center uppercase">spectateur</p>
      </div>
    );
  const currentTeam = team.isturn ? team : otherTeam;
  const buttonText = room?.status === 'ban' ? 'Confirmer le Ban' : 'Confirmer la Selection'

  const handleConfirmSelection = async () => {
    setButton(false);

    await supabase.from('teams').update({
      canSelect: false,
    }).eq('id', team?.id);

    if (socket) {
      socket.emit('SELECT_CHAMPION', {
        teamid: team?.id,
        roomid: room?.id,
        selectedChampion: currentTeam?.clicked_hero,
      });
    }
  };

  return (
    <>
      <AlertDialog open={err}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className='flex gap-2'><Bug /> Une erreur est survenue du côté serveur.</AlertDialogTitle>
            <AlertDialogDescription>
              Veuillez recharger la page et réessayer. Si le problème persiste, veuillez contacter un administrateur.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <pre>ERR: {errMessage?.code}</pre>
          <AlertDialogFooter>
            <AlertDialogAction onClick={() => {
              window.location.reload()
              setErr(false);
            }}>Refresh</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
      <motion.div
        initial={{ opacity: 0 }} // start at half the size
        animate={{ opacity: 1 }} // animate to full size
        transition={{ duration: 0.15, delay: 0.2 }}
        className="flex w-full justify-center"
      >
        {team.isturn ? (
          <div>
            <Button
              size="lg"
              onClick={handleConfirmSelection}
              className="w-64"
              disabled={!button}
            >
              {!team.canSelect ? (
                <LoadingCircle color="black" size="w-4 h-4" />
              ) : (
                <>{buttonText}</>
              )}
            </Button>
          </div>
        ) : (
          <div className="flex w-full flex-col items-center justify-center">
            <p className="text-sm opacity-80">Ce n’est pas votre tour</p>
            <div className="text-md px-12 text-center font-medium flex gap-0.5">
              <p className='whitespace-nowrap'>{`En attente de l'autre équipe`}</p>
              <AnimatedDot />
            </div>
          </div>
        )}
      </motion.div>
    </>
  );
};

export default ConfirmButton;
