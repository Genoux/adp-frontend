"use client";

import { useEffect, useState } from "react";
import LoadingCircle from "@/app/components/common/LoadingCircle";
import { RoomDisplay } from "./components/RoomDisplay";
import { RoomCreationForm } from "./components/RoomCreationForm";

interface Room {
  id: number;
  name: string;
  blue: Team;
  red: Team;
  status: string;
  [key: string]: any;
}


interface BlueTeam {
  id: number;
  name: string;
  color: string;
}

interface RedTeam {
  id: number;
  name: string;
  color: string;
}

interface Team {
  id: number;
  name: string;
  borderColor: string;
  color: string;
  btnText: string;
}

function Home() {
  const [room, setRoom] = useState<Room | null>(null);
  const [redTeam, setRedTeam] = useState<Team | null>(null);
  const [blueTeam, setBlueTeam] = useState<Team | null>(null);

  const [copyLink, setCopyLink] = useState<{ [key: string]: boolean }>({});
  const [loading, setLoading] = useState(false);

  const mapToBlueTeamStructure = (blueTeam: BlueTeam): Team => ({
    ...blueTeam,
    borderColor: 'border-blue border-t-4',
    color: blueTeam.color,
    btnText: 'Rejoindre Bleue'
  });

  const mapToRedTeamStructure = (redTeam: RedTeam): Team => ({
    ...redTeam,
    borderColor: 'border-red border-t-4',
    color: redTeam.color,
    btnText: 'Rejoindre Rouge'
  });

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
    console.log("createRoomLogic - data:", data);

    //setRoom(data.value.room); // Update the room state with the fetched room ID
    const mappedBlueTeam = mapToBlueTeamStructure(data.blue);
    setBlueTeam(mappedBlueTeam);

    const mappedRedTeam = mapToRedTeamStructure(data.red);
    setRedTeam(mappedRedTeam);

    const modifiedRoom = {
      ...data.room,
      blue: mapToBlueTeamStructure(data.blue),
      red: mapToRedTeamStructure(data.red)
    };

    setRoom(modifiedRoom);

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <LoadingCircle />
      </div>
    );
  }

  return (
    <>
      <main className="p-24 h-screen flex items-center justify-center">
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

