'use client';

import LoadingCircle from '@/app/components/common/LoadingCircle';
import { defaultTransition } from '@/app/lib/animationConfig';
import { motion } from 'framer-motion';
import { default as NextImage } from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { RoomCreationForm } from './components/RoomCreationForm';
import { RoomDisplay } from './components/RoomDisplay';

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

    setTimeout(() => {
      setLoading(false);
    }, 2000);
  };

  const parallaxRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX: x, clientY: y } = e;
      const { innerWidth: width, innerHeight: height } = window;

      const xPos = x / width - 0.5;
      const yPos = y / height - 0.5;

      if (parallaxRef.current) {
        parallaxRef.current.style.transform = `translate(${xPos * -20.0}px, ${
          yPos * -20.0
        }px)`;
      }
    };

    window.addEventListener('mousemove', handleMouseMove);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <>
      <main className="mb-12 flex h-full flex-col items-center justify-start gap-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={defaultTransition}
          className="mx-auto mt-12 flex flex-col items-end justify-end text-center"
        >
          <NextImage
            src="home-logo.svg"
            width={368}
            height={0}
            alt={'Tournois Haq'}
          />
        </motion.div>
        {loading ? (
          // Show loading circle when loading is true
          <div className="flex h-1/2 flex-col items-center justify-center">
            <LoadingCircle />
          </div>
        ) : room && blueTeam && redTeam ? (
          <RoomDisplay room={room} blueTeam={blueTeam} redTeam={redTeam} />
        ) : (
          <RoomCreationForm onCreate={createRoomLogic} />
        )}
      </main>
    </>
  );
}

export default Home;
