import { useEffect, useState } from "react";
import supabase from "@/app/services/supabase";

interface RoomInfoProps {
  roomid: any; // Replace with your specific type
}

const RoomInfo: React.FC<RoomInfoProps> = ({ roomid }) => {
  console.log("roomid:", roomid);
  const [room, setRoom] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const getRoom = async () => {
      const { data: roomData, error } = await supabase
        .from("rooms")
        .select("*, blue(*), red(*)")
        .eq("id", roomid)
        .single();

      if (error) {
        console.error("Error fetching room data:", error);
      } else {
        console.log("setData - roomData:", roomData);
        setRoom(roomData);
        setLoading(false);
      }
    };

    if (roomid) {
      getRoom();
    }
  }, [roomid]);

  return (
    <div>
      {room && (
        <>
          <p>{room?.cycle}</p>
          <h1>Room ID: {room?.id}</h1>
          <div className="flex my-24 gap-12 justify-center">
            <div>
              <h2>Blue Team Selected Heroes:</h2>
              <div className="grid grid-cols-5 gap-4 mt-6">
                {room?.blue?.heroes_selected?.map(
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
              <div className="grid grid-cols-5 gap-4 mt-6">
                {room?.red?.heroes_selected?.map((hero: any, index: number) => (
                  <div key={index} className="border p-4">
                    <pre>Name: {hero.name}</pre>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default RoomInfo;
