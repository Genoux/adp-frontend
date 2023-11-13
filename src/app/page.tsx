'use client';

import { useState } from "react";
import LoadingCircle from "@/app/components/common/LoadingCircle";
import { RoomDisplay } from "./components/RoomDisplay";
import { RoomCreationForm } from "./components/RoomCreationForm";
import Link from "next/link";
import Image from "next/image";
import { defaultTransition } from '@/app/lib/animationConfig'
import { motion } from "framer-motion";

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
  const [loading, setLoading] = useState(false);

  const mapToBlueTeamStructure = (blueTeam: BlueTeam): Team => ({
    ...blueTeam,
    borderColor: 'border-blue border-t-4',
    color: blueTeam.color,
    btnText: 'Rejoindre',
  });

  const mapToRedTeamStructure = (redTeam: RedTeam): Team => ({
    ...redTeam,
    borderColor: 'border-red border-t-4',
    color: redTeam.color,
    btnText: 'Rejoindre',
  });

  const createRoomLogic = async (blueTeamName: string, redTeamName: string) => {
    if (!blueTeamName || !redTeamName) {
      alert('Please fill in all the fields.');
      return;
    }

    setLoading(true);

    const response1 = await fetch(`/api/generateroom/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ blueTeamName, redTeamName }),
    });

    const data = await response1.json();
    const mappedBlueTeam = mapToBlueTeamStructure(data.blue);
    setBlueTeam(mappedBlueTeam);

    const mappedRedTeam = mapToRedTeamStructure(data.red);
    setRedTeam(mappedRedTeam);

    const modifiedRoom = {
      ...data.room,
      blue: mapToBlueTeamStructure(data.blue),
      red: mapToRedTeamStructure(data.red),
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
      <main className="flex flex-col h-screen items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={defaultTransition}
          className="text-center justify-end items-end mx-auto flex flex-col"
        >
          <Image
            src='home-logo.svg'
            width={268}
            height={0} alt={""} />
        </motion.div>
        {room && blueTeam && redTeam ? (
          <RoomDisplay room={room} blueTeam={blueTeam} redTeam={redTeam} />
        ) : (
          <RoomCreationForm onCreate={createRoomLogic} />
        )}
        <footer className="w-full bottom-0 pt-24 pb-6">
          <div className="container flex justify-center gap-24 text-xs">
            <Link className="hover:underline underline-offset-4" href="https://www.tournoishaq.ca/" target="_blank">Tournoishaq.ca</Link>
            <p>All right reserved © 2023</p>
            <p>Beta v0.3.0</p>
          </div>
        </footer>
      </main>
    </>
  );
}

export default Home;
