import { useContext } from "react";
import supabase from "../services/supabase";
import SocketContext from "../context/SocketContext";
import { Button } from "@/app/components/ui/button";
import useFetchTeam from '@/app/hooks/useFetchTeam'; // Import your custom hook

interface ReadyRoomProps {
  teamid: string;
  roomid: string;
}

const ReadyView: React.FC<ReadyRoomProps> = ({ teamid, roomid }) => {
  const socket = useContext(SocketContext);
  const { data: team, error, isLoading } = useFetchTeam(teamid);

  const handleReadyClick = async () => {
    const { data, error } = await supabase
      .from("teams")
      .update({ ready: true })
      .select("*, room(*)")
      .eq("id", teamid)
      .single();

    if (data && !error) {
      socket?.emit("TEAM_READY", { roomid, teamid });
    }
  };

  if (isLoading) {
    return <p>Loading...</p>;
  }

  if (!team) {
    return <p>Team not found</p>;
  }

  if (error) {
    return <p>Error: {error.message}</p>;
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
        <Button onClick={handleReadyClick} disabled={team.ready}>
          READY
        </Button>
      )}
    </div>
  );
};

export default ReadyView;
