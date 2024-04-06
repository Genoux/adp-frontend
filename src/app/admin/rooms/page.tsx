"use client";

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { User } from "@supabase/supabase-js";
import Link from "next/link";

interface Team {
  [key: string]: any;
}

interface Room {
  id: number;
  name: string;
  blue: Team;
  red: Team;
  status: string;
  [key: string]: any;
}

export default function Protected() {
  const router = useRouter();
  const supabase = createClientComponentClient();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [rooms, setRooms] = useState([]);

  useEffect(() => {
    async function getUser() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setLoading(false);
    }

    getUser();
  }, []);


  useEffect(() => {
    const getRooms = async () => {
      const { data: rooms, error } = await supabase.from('rooms').select()
      console.log("getRooms - error:", error);
      setRooms(rooms);
    };

    return () => {
      getRooms();
    };
  }, []);


  const handleLogout = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      console.error("Logout error:", error.message);
      return;
    }

    router.refresh();
    setUser(null);
  };

  console.log({ loading, user });

  if (loading) {
    return <h1>Loading...</h1>;
  }

  return (
    <div>
      <h1>{user?.email}</h1>
      <h2>Rooms:</h2>
      <ul>
        {rooms.map((room: Room) => (
          <li key={room.id}>
            <div className="flex gap-4">
              <p>{room.name}</p>
              <p>{room.status}</p>

              <Link href={`/room/${room.id}/spectator`} target="_blank" passHref>
          View
        </Link>
            </div>
          </li>
        ))}
      </ul>
      <p>{"This is a protected page. You should only see this if you're authenticated."}</p>
      <button
        onClick={handleLogout}
        className="w-full p-3 rounded-md bg-red-500 text-white hover:bg-red-600 focus:outline-none"
      >
        Logout
      </button>
    </div>
  );
}
