"use client";

import { useState } from "react";
import Link from "next/link";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";

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

  const [formData, setFormData] = useState({
    blueTeamName: "",
    redTeamName: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const createRoom = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    // Check if any of the input fields are empty
    if (!formData.blueTeamName || !formData.redTeamName) {
      alert("Please fill in all the fields.");
      return; // Stop form submission
    }

    setLoading(true);

    const response1 = await fetch(`/api/generateroom/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response1.json();

    setRoom(data.value.room); // Update the room state with the fetched room ID
    setBlueTeam(data.value.blue);
    setRedTeam(data.value.red);

    setLoading(false);
  };

  if (loading)
    return (
      <div className="flex min-h-screen flex-col items-center justify-between p-24">
        Loading...
      </div>
    );

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      {room ? (
          <div>
          <p>Name: {room.name}</p>
          {room.timer}
          
            <p>
              Blue:
              <Link href={`/room/${room.id}/${blueTeam?.id}`} target="_blank">
              {blueTeam?.name}
              </Link>
            </p>
            <p>
              Red:
              <Link href={`/room/${room.id}/${redTeam?.id}`} target="_blank">
                {redTeam?.name}
              </Link>
            </p>
          </div>
      ) : (
        <div className="flex flex-col gap-6">
          <div className="flex flex-col">
            Blue team name:
            <Input
              type="text"
              name="blueTeamName"
              onChange={handleInputChange}
              value={formData.blueTeamName}
            />
          </div>
          <div className="flex flex-col">
            Red team name:
            <Input
              type="text"
              name="redTeamName"
              value={formData.redTeamName}
              onChange={handleInputChange}
            />
          </div>
          <Button
            variant={"outline"}
            onClick={createRoom}
            disabled={!formData.blueTeamName || !formData.redTeamName}
            className={
              !formData.blueTeamName || !formData.redTeamName
                ? "opacity-10"
                : ""
            }>
            Create room
          </Button>
        </div>
      )}
    </main>
  );
}

export default Home;
