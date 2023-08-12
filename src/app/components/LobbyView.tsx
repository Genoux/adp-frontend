import supabase from "@/app/services/supabase";
import useEnsureContext from "@/app/hooks/useEnsureContext";
import SocketContext from "@/app/context/SocketContext";
import { Button } from "@/app/components/ui/button";
import { roomStore } from "@/app/stores/roomStore";
import { teamStore } from "@/app/stores/teamStore";
import useTeams from "@/app/hooks/useTeams";

const ReadyView = () => {
  const socket = useEnsureContext(SocketContext);

  const { room, error } = roomStore(state => ({
    room: state.room,
    error: state.error,
    isLoading: state.isLoading
  }));

  const { current: currentTeam, other: otherTeam } = useTeams(teamStore);

  if (!room || error) {
    return <div>Room not found</div>;
  }
  const handleReadyClick = async () => {
    const { data, error } = await supabase
      .from("teams")
      .update({ ready: true })
      .select("*, room(*)")
      .eq("id", currentTeam.id)
      .single();

    if (data && !error) {
      socket.emit("TEAM_READY", { roomid: room.id, teamid: currentTeam.id });
    }
  };

  return (
<div className="flex items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-y-hidden text-3xl">
      {currentTeam.ready ? (
        <div>
        <span className="pr-0.5">{`En attende de ${otherTeam.name}`}</span>
          <div className="sending-animation">
            <span className="sending-animation-dot">.</span>
            <span className="sending-animation-dot">.</span>
            <span className="sending-animation-dot">.</span>
          </div>
        </div>
      ) : (
        <Button
          size="lg"
          className={`bg-yellow hover:bg-yellow-hover px-24 text-sm uppercase text-yellow-text rounded-sm font-bold mt-6`}
          onClick={handleReadyClick}
        >
          {"Nous sommes prêt"}
        </Button>
      )}
    </div>
  );
};

export default ReadyView;
