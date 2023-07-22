import { useEffect, useState } from "react";
import supabase from "@/app/services/supabase";
import TeamPicks from "@/app/components/TeamPicks";
import TeamBans from "@/app/components/TeamBans";
import CircleLoader from "./LoadingCircle";

interface Team {
  [key: string]: any;
}

interface RoomInfoProps {
  roomid: string;
}

const RoomInfo: React.FC<RoomInfoProps> = ({ roomid }) => {
  const [roomData, setRoomData] = useState<{ blue: Team; red: Team } | null>(
    null
  );
  const [blue, setBlue] = useState<Team | {}>({});
  const [red, setRed] = useState<Team | {}>({});

  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const getRoom = async () => {
      const { data: roomTeam, error } = await supabase
        .from("rooms")
        .select("*, blue(*), red(*)")
        .eq("id", roomid)
        .single();

      setBlue(roomTeam.blue);
      setRed(roomTeam.red);

      if (error) {
        setError(error);
      } else {
        setRoomData({
          blue: roomTeam.blue,
          red: roomTeam.red,
        });
      }
    };

    getRoom();
  }, [roomid]);

  useEffect(() => {
    const colorToSetMethod: { [key: string]: (team: Team | {}) => void } = {
      blue: setBlue,
      red: setRed,
    };
    const channel = supabase.channel(roomid);
    channel
      .on(
        "postgres_changes",
        {
          event: "UPDATE",
          schema: "public",
          table: "teams",
          filter: `room=eq.${roomid}`,
        },
        (payload) => {
          const { new: team } = payload;
          (colorToSetMethod[team.color] || (() => {}))(team);
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [roomid]);

  if (error) {
    return <div>Error fetching room data: {error.message}</div>;
  }

  if (!roomData) {
    return <CircleLoader />;
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 mb-12 h-64 gap-6 justify-center">
        <div>
          <TeamBans team={blue} color="blue" />
          <TeamPicks team={blue} color="blue" />
        </div>
        <div className="relative">
          <TeamBans team={red} color="red" />
          <TeamPicks team={red} color="red" />
        </div>
      </div>
    </>
  );
};

export default RoomInfo;
