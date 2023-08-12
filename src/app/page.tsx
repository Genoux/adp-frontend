"use client";

import { useState } from "react";
import LoadingCircle from "@/app/components/common/LoadingCircle";
import { RoomDisplay } from "./components/RoomDisplay";
import { RoomCreationForm } from "./components/RoomCreationForm";

interface Room {
  id: number;
  name: string;
  blue: { id: number; name: string };
  red: { id: number; name: string };
  status: string;
  [key: string]: any;
}

interface BlueTeam {
  id: number;
  name: string;
}

interface RedTeam {
  id: number;
  name: string;
}

function Home() {
  const [room, setRoom] = useState<Room | null>(null);
  const [redTeam, setRedTeam] = useState<RedTeam | null>(null);
  const [blueTeam, setBlueTeam] = useState<BlueTeam | null>(null);
  const [copyLink, setCopyLink] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(false);

  const createRoomLogic = async (blueTeamName: string, redTeamName: string) => {
    if (!blueTeamName || !redTeamName) {
      alert("Please fill in all the fields.");
      return; // Stop form submission
    }

    setLoading(true);

    const response1 = await fetch(`/api/generateroom/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ blueTeamName, redTeamName }),
    });

    const data = await response1.json();

    setRoom(data.value.room); // Update the room state with the fetched room ID
    setBlueTeam(data.value.blue);
    setRedTeam(data.value.red);

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <LoadingCircle />
      </div>
    );
  }

  return (
    <>
      <main className="flex h-screen flex-col items-center justify-center">
        {room && blueTeam && redTeam ? (
          <RoomDisplay room={room} blueTeam={blueTeam} redTeam={redTeam} copyLink={copyLink} setCopyLink={setCopyLink} />
        ) : (
          <RoomCreationForm onCreate={createRoomLogic} />
        )}
      </main>
    </>
  );
}

export default Home;

