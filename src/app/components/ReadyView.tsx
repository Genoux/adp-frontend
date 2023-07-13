import supabase from "@/app/services/supabase";
import SocketContext from "@/app/context/SocketContext";
import RoomContext from "@/app/context/RoomContext";
import TeamContext from "@/app/context/TeamContext";
import { Button } from "@/app/components/ui/button";
import useEnsureContext from "@/app/hooks/useEnsureContext";

const ReadyView = () => {
  const socket = useEnsureContext(SocketContext);
  const team = useEnsureContext(TeamContext);
  const room = useEnsureContext(RoomContext);

  const handleReadyClick = async () => {
    const { data, error } = await supabase
      .from("teams")
      .update({ ready: true })
      .select("*, room(*)")
      .eq("id", team.id)
      .single();

    if (data && !error) {
      socket.emit("TEAM_READY", { roomid: room.id, teamid: team.id });
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      {team.ready ? (
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
