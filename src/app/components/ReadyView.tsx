import supabase from "@/app/services/supabase";
import { useContext } from "react";
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


  const { current: currentTeam } = useTeams(teamStore);

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
    <div className="flex items-center justify-center h-full">
      {currentTeam.ready ? (
        <div>
          <span className="pr-0.5">Waiting for other team</span>
          <div className="sending-animation">
            <span className="sending-animation-dot">.</span>
            <span className="sending-animation-dot">.</span>
            <span className="sending-animation-dot">.</span>
          </div>
        </div>
      ) : (
        <Button onClick={handleReadyClick}>READY</Button>
      )}
    </div>
  );
};

export default ReadyView;
