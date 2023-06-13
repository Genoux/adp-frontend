import { useContext, useState, useEffect } from "react"; // Import useContext and useEffect
import supabase from "../services/supabase";
import SocketContext from "../contexts/SocketContext"; // Import your SocketContext

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
    <div>
      <button onClick={handleReadyClick} disabled={ready}>
        {ready ? "Waiting for other team..." : "READY"}
      </button>
    </div>
  );
};

export default ReadyView;
