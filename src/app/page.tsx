"use client";

import { useState } from "react";
import Link from "next/link";

interface Room {
  id: number;
  name: string;
  blue: {id: number, name: string};
  red: {id: number, name: string};
  status: string;
  [key: string]: any;
}

function Home() {
  const [roomData, setRoomData] = useState<Room[] | null>(null);
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

  const createRoom = async (event: { preventDefault: () => void; }) => {
    setLoading(true);
    event.preventDefault();

    // Check if any of the input fields are empty
    if (!formData.blueTeamName || !formData.redTeamName) {
      alert('Please fill in all the fields.');
      return; // Stop form submission
    }
    console.log(formData);
    const response1 = await fetch(`/api/generateroom/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response1.json();
    console.log("createRoom - data:", data);

    setRoomData(data.room); // Update the room state with the fetched room ID
    setLoading(false);
  };

  if(loading) return <div className="flex min-h-screen flex-col items-center justify-between p-24">Loading...</div>

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
        {roomData ? (
          roomData.map((room, index) => (
            <div key={index}>
              <p>ID: {room.id}</p>
              <p>Name: {room.name}</p>
              <p>
                Blue:
                <Link href={`/room/${room.id}/${room.blue.id}`} target="_blank">
                  {room.blue.name}
                </Link>
              </p>
              <p>
                Red:
                <Link href={`/room/${room.id}/${room.red.id}`} target="_blank">
                  {room.red.name}
                </Link>
              </p>
              <p>Status: {room.status}</p>
            </div>
          ))
        ) : (
          <div className="flex flex-col gap-6">
            <div className="flex flex-col">
              Blue team name:
              <input
                className="text-black"
                type="text"
                name="blueTeamName"
                value={formData.blueTeamName}
                onChange={handleInputChange}
              />
            </div>
            <div className="flex flex-col">
              Red team name:
              <input
                className="text-black"
                type="text"
                name="redTeamName"
                value={formData.redTeamName}
                onChange={handleInputChange}
              />
            </div>
            <button onClick={createRoom}>Create room</button>
          </div>
        )}
    </main>
  );
}

export default Home;
