"use client";

import { useState } from "react";
import Link from "next/link";

interface Room {
  id: number;
  name: string;
  blue: number;
  red: number;
  status: string;
  [key: string]: any;
}

function Home() {
  const [roomData, setRoomData] = useState<Room[] | null>(null);

  const createRoom = async () => {
    const response1 = await fetch(`/api/generateroom/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    const data = await response1.json();

    setRoomData(data.room); // Update the room state with the fetched room ID
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div>
        {roomData ? (
          roomData.map((room, index) => (
            <div key={index}>
              <p>ID: {room.id}</p>
              <p>Name: {room.name}</p>
              <p>
                Blue:
                <Link href={`/room/${room.id}/${room.blue}`} target="_blank">
                  {room.blue}
                </Link>
              </p>
              <p>
                Red:
                <Link href={`/room/${room.id}/${room.red}`} target="_blank">
                  {room.red}
                </Link>
              </p>
              <p>Status: {room.status}</p>
            </div>
          ))
        ) : (
          <button onClick={createRoom}>Click me</button>
        )}
      </div>
    </main>
  );
}

export default Home;
