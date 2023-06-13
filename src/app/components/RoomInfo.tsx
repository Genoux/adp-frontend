import { useEffect, useState } from 'react';
import supabase from '@/app/services/supabase';
import { roomStore } from '@/app/stores/roomStore';
import HeroGrid from './HeroGrid';

interface Team {
  [key: string]: any;
}

interface RoomInfoProps {
  roomid: string;
}

const RoomInfo: React.FC<RoomInfoProps> = ({ roomid }) => {
  const [roomData, setRoomData] = useState<{blue: Team, red: Team} | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const { rooms } = roomStore();
  const room = rooms[roomid]

  useEffect(() => {
    const getRoom = async () => {
      const { data: roomTead, error } = await supabase
        .from('rooms')
        .select('blue(*), red(*)')
        .eq('id', roomid)
        .single();

      if (error) {
        setError(error);
      } else {
        setRoomData({
          blue: roomTead.blue,
          red: roomTead.red
        });
      }
    };

    getRoom();
  }, [roomid]);

  useEffect(() => {
    const channel = supabase.channel(roomid);

    const subscription = channel.on('postgres_changes', {
      event: 'UPDATE',
      schema: 'public',
      table: 'teams',
      filter: `room=eq.${roomid}`
    }, (payload) => {
      const { new: team } = payload;
  
      if (team.color === 'blue') {
        setRoomData(oldData => oldData ? ({ ...oldData, blue: team }) : { blue: team, red: {} });
      } else {
        setRoomData(oldData => oldData ? ({ ...oldData, red: team }) : { blue: {}, red: team });
      }
    }).subscribe();

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
      <p>{room.cycle}</p>
      <p>{room.name}</p>
      <h1>Room ID: {room.id}</h1>
      <div className="flex my-24 gap-12 justify-center">
        <div>
          <h2>Blue Team Selected Heroes:</h2>
          <HeroGrid team={roomData.blue} color="blue" useTiles={true} />
        </div>
        <div>
          <h2>Red Team Selected Heroes:</h2>
          <HeroGrid team={roomData.red} color="red" useTiles={true} />
        </div>
      </div>
    </>
  );
};

export default RoomInfo;
