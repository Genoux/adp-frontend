// ConfirmButton.tsx
import React, { use, useEffect } from 'react';
import { Button } from "@/app/components/ui/button";
import LoadingCircle from "@/app/components/common/LoadingCircle";
import SocketContext from "@/app/context/SocketContext";
import useEnsureContext from "@/app/hooks/useEnsureContext";
import { useCanSelect } from '@/app/context/CanSelectContext';
import { roomStore } from "@/app/stores/roomStore";
import { teamStore } from "@/app/stores/teamStore";
import useTeams from "@/app/hooks/useTeams";
import { motion, AnimatePresence } from "framer-motion";

const ConfirmButton = () => {
  const socket = useEnsureContext(SocketContext);
  const { canSelect, setCanSelect } = useCanSelect();

  const { room } = roomStore(state => ({
    room: state.room,
    error: state.error,
    isLoading: state.isLoading
  }));


  const { current: team, other, blue, red } = useTeams(teamStore);
  const currentTeam = team.isturn ? team : other;

  const isBanPhase = room?.status === 'ban';

  const buttonText = team.isturn
    ? isBanPhase
      ? "Confirmer le Ban"
      : "Confirmer la Selection"
    : `C'est à l'équipe ${other.color} de ${isBanPhase ? 'bannir' : 'choisir'}`;

  const handleConfirmSelection = async () => {
    if (socket) {
      setCanSelect(false);
      socket?.emit("STOP_TIMER", { roomid: room?.id });

      socket.emit("SELECT_CHAMPION", {
        teamid: team?.id,
        roomid: room?.id,
        selectedChampion: currentTeam.clicked_hero,
      });
    }
  };

  useEffect(() => {
    setCanSelect(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="flex justify-center">
      {team.isturn ? (
        <AnimatePresence>
        <motion.div
            initial={{ opacity: 0 }}  // start at half the size
            animate={{ opacity: 1 }}    // animate to full size
            transition={{ duration: 1 }}
            exit={{ opacity: 0, transition: { duration: 1 } }}
        >
        <Button
          size="lg"
          className={`bg-yellow hover:bg-yellow-hover text-sm uppercase text-yellow-text rounded-sm font-bold w-64`}
          onClick={handleConfirmSelection}
          disabled={!currentTeam.clicked_hero || !canSelect || !team.isturn}
        >
          {!canSelect ? (<LoadingCircle color="black" />) : (<>{buttonText}</>)}
          </Button>
          </motion.div>
          </AnimatePresence>
      ) : (
          <div className="flex flex-col justify-center items-center w-full">
            <p className="text-sm  opacity-80">Ce n’est pas votre tour</p>
            <p className="text-md text-center font-medium px-12">{`En attente de l'autre équipe`}
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
