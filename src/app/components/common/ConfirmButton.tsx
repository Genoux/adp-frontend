// ConfirmButton.tsx
import LoadingCircle from '@/app/components/common/LoadingCircle';
import { Button } from '@/app/components/ui/button';
import SocketContext from '@/app/context/SocketContext';
import useEnsureContext from '@/app/hooks/useEnsureContext';
import useTeams from '@/app/hooks/useTeams';
import { roomStore } from '@/app/stores/roomStore';
import { motion } from 'framer-motion';
import { View } from 'lucide-react';

const ConfirmButton = () => {
  const socket = useEnsureContext(SocketContext);
  const { room, isLoading } = roomStore();
  const { currentTeam: team, otherTeam } = useTeams();


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
    if (socket) {
      socket.emit('SELECT_CHAMPION', {
        teamid: team?.id,
        roomid: room?.id,
        selectedChampion: currentTeam?.clicked_hero,
      });
    }
  };

  return (
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
            disabled={!currentTeam?.clicked_hero || !team.canSelect}
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
          <div className="text-md px-12 text-center font-medium">
            {`En attente de l'autre équipe`}
            <div className="sending-animation ">
              <span className="sending-animation-dot">.</span>
              <span className="sending-animation-dot">.</span>
              <span className="sending-animation-dot">.</span>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ConfirmButton;
