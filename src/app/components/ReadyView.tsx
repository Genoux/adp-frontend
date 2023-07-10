import { useContext } from "react";
import supabase from "@/app/services/supabase";
import SocketContext from "@/app/context/SocketContext";
import TeamContext from "@/app/context/TeamContext";
import { Button } from "@/app/components/ui/button";
import useFetchTeam from '@/app/hooks/useFetchTeam'; // Import your custom hook

interface ReadyRoomProps {
  roomid: string;
}

const ReadyView: React.FC<ReadyRoomProps> = ({ roomid }) => {
  const socket = useContext(SocketContext);
  const team = useContext(TeamContext);

  if(!team) return null;

  const handleReadyClick = async () => {
    const { data, error } = await supabase
      .from("teams")
      .update({ ready: true })
      .select("*, room(*)")
      .eq("id", team.id)
      .single();

    if (data && !error) {
      socket?.emit("TEAM_READY", { roomid, teamid: team.id });
    }
  };


  if (!team) {
    return <p>Team not found</p>;
  }

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
        <Button onClick={handleReadyClick}>
          READY
        </Button>
      )}
    </div>
  );
};

export default ReadyView;
