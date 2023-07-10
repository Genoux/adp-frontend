import { useEffect, useState } from "react";
import supabase from "@/app/services/supabase";
import { roomStore } from "@/app/stores/roomStore";
import TeamPicks from "@/app/components/TeamPicks";

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
  const { rooms } = roomStore();
  const room = rooms[roomid];

  useEffect(() => {
    const getRoom = async () => {
      const { data: roomTead, error } = await supabase
        .from("rooms")
        .select("*")
        .eq("id", roomid)
        .single();

      const { data: blue } = await supabase
        .from("teams")
        .select("*")
        .eq("id", roomTead.blue)
        .single();

      setBlue(blue);

      const { data: red } = await supabase
        .from("teams")
        .select("*")
        .eq("id", roomTead.red)
        .single();

      setRed(red);

      if (error) {
        setError(error);
      } else {
        setRoomData({
          blue: blue,
          red: red,
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
      // Unsubscribe from room updates when component unmounts
      channel.unsubscribe();
    };
  }, [roomid]);

  if (error) {
    return <div>Error fetching room data: {error.message}</div>;
  }

  if (!roomData) {
    return <p>Loading...</p>;
  }

  if (!room?.ready) {
    return <p>Waiting for players to ready up...</p>;
  }

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-2 mb-12 h-64 gap-6 justify-center">
        <div>
          <TeamPicks team={blue} color="blue" />
        </div>
        <div className="relative">
          <TeamPicks team={red} color="red" />
        </div>
      </div>
    </>
  );
};

export default RoomInfo;
