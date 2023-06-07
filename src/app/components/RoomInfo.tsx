import { useEffect, useState } from "react";
import supabase from "@/app/services/supabase";
import { roomStore } from "@/app/stores/roomStore";

interface RoomInfoProps {
  roomid: any; // Replace with your specific type
}

interface Team {
  [key: string]: any;
}

const RoomInfo: React.FC<RoomInfoProps> = ({ roomid }) => {
  const [blueTeam, setBlueTeam] = useState<Team | null>(null);
  const [redTeam, setRedTeam] = useState<Team | null>(null);

  const { rooms, setRoom } = roomStore();
  const  room  = rooms[roomid]

  useEffect(() => {
    const getRoom = async () => {
      const { data: roomTead, error } = await supabase
        .from("rooms")
        .select("blue(*), red(*)")
        .eq("id", roomid)
        .single();
  
      if (error) {
        console.error("Error fetching room data:", error);
      } else {
        setBlueTeam(roomTead.blue);
        setRedTeam(roomTead.red);
      }
    };
    getRoom();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  
  
  useEffect(() => {
    const channel = supabase
      .channel(roomid)
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'teams',
          filter: `room=eq.${roomid}`,
        },
        (payload) => {
          const { new: team } = payload;
          team.color === 'blue' ? setBlueTeam(team) : setRedTeam((team));
        }
      ).on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'rooms',
          filter: `id=eq.${roomid}`,
        },
        (payload) => {
          const { new: room } = payload;
          setRoom(roomid, room);
        })
      .subscribe();
  
    return () => {
      // Unsubscribe from room updates when component unmounts
      channel.unsubscribe();
    };
  }, [roomid, setRoom]);


  
  if (!room.ready) {
    return (
      <>
        <pre>room ready: {room.ready.toString()}</pre>
        <p>Waiting for players to ready up...</p>
      </>
    );
  }
  
  return (
        <>
          <p>{room?.cycle}</p>
          <p>{room?.name}</p>
          <h1>Room ID: {room?.id}</h1>
          <div className="flex my-24 gap-12 justify-center">
            <div>
              <h2>Blue Team Selected Heroes:</h2>
              <div className={`grid grid-cols-5 gap-4 mt-6 ${blueTeam?.isTurn ? 'bg-blue-500' : ''}`}>
                {blueTeam?.heroes_selected.map(
                  (hero: any, index: number) => (
                    <div key={index} className="border p-4">
                      <pre>Name: {hero.name}</pre>
                    </div>
                  )
                )}
              </div>
            </div>
            <div>
              <h2>Red Team Selected Heroes:</h2>
              <div className={`grid grid-cols-5 gap-4 mt-6 ${redTeam?.isTurn ? 'bg-red-500' : ''}`}>
                {redTeam?.heroes_selected.map((hero: any, index: number) => (
                  <div key={index} className="border p-4">
                    <pre>Name: {hero.name}</pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
  );
};

export default RoomInfo;
