import { useContext, useState, useEffect } from "react"; // Import useContext and useEffect
import supabase from "../services/supabase";
import SocketContext from "../context/SocketContext"; // Import your SocketContext
import { Button } from "@/app/components/ui/button";

interface ReadyRoomProps {
  teamid: string;
  roomid: string;
}

const ReadyView: React.FC<ReadyRoomProps> = ({ teamid, roomid }) => {
  const socket = useContext(SocketContext); // Get socket from context
  const [ready, setReady] = useState<boolean>(false);

  // This hook will run once when the component mounts
  useEffect(() => {
    const fetchTeamData = async () => {
      const { data, error } = await supabase
        .from("teams")
        .select("ready")
        .eq("id", teamid)
        .single();

      if (data && !error) {
        setReady(data.ready);
      }
    };

    fetchTeamData();
  }, [teamid]); // Dependent on teamid

  const handleReadyClick = async () => {
    const { data, error } = await supabase
      .from("teams")
      .update({ ready: true })
      .select("*, room(*)")
      .eq("id", teamid)
      .single();

    if (data && !error) {
      setReady(true);
    }

    socket?.emit("TEAM_READY", { roomid, teamid });
  };

  return (
    <div className="flex items-center justify-center h-full">
      {ready ? (
        <div>
          <span className="pr-0.5">Waiting for other team</span>
          <div className="sending-animation">
            <span className="sending-animation-dot">.</span>
            <span className="sending-animation-dot">.</span>
            <span className="sending-animation-dot">.</span>
          </div>
        </div>
      ) : (
        <Button onClick={handleReadyClick} disabled={ready}>
          READY
        </Button>
      )}
    </div>
  );
};

export default ReadyView;
