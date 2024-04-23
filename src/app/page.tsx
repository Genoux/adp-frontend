'use client';

import LoadingCircle from '@/app/components/common/LoadingCircle';
import { defaultTransition } from '@/app/lib/animationConfig';
import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';
import { RoomCreationForm } from './components/RoomCreationForm';
import { RoomDisplay } from './components/RoomDisplay';
import { BedDouble } from 'lucide-react';
import Link from 'next/link';

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

  const appMode = process.env.NEXT_PUBLIC_APP_MODE;

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
        parallaxRef.current.style.transform = `translate(${xPos * -20.0}px, ${yPos * -20.0
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
      <main className="flex h-full flex-col items-center justify-start">
        {appMode === 'false' ? (
          <div className='flex flex-col h-full justify-center items-center gap-2 animate-pulse'>
            <BedDouble className='w-6 h-6' />
            <h1 className='font-semibold text-2xl'>Zzzzzz</h1>
          </div>
        ) : (
          <>
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={defaultTransition}
            >
              <div className='mx-auto flex max-w-[980px] flex-col items-center gap-2  md:py-12 md:pb-8 lg:py-24 lg:pb-16'>

                <Link className="inline-flex items-center rounded-lg bg-muted px-3 py-1 text-sm font-medium gap-2" href="http://tournoishaq.ca/" target='_blank'><svg width="12" height="17" viewBox="0 0 12 17" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11.8924 7.76912C11.7104 7.02042 11.2856 6.35166 10.5512 6.01882C10.3891 5.94579 10.0634 5.89199 9.84904 5.86431C9.71691 5.84663 9.60245 5.76362 9.54484 5.64447L6.83156 0C6.83156 0 3.54599 11.5941 0.7582 5.65293C0.7582 5.65293 -1.21223 9.3211 1.19991 10.757C1.36123 10.8531 1.73535 10.9915 2.22622 11.0291C3.41155 8.01279 5.97349 5.86201 8.96408 5.95656C8.76588 6.01498 8.57307 6.08877 8.38332 6.16948C6.37602 7.02273 4.88879 8.77456 4.40022 10.923C3.92855 12.9954 4.49548 15.23 5.7607 16.918C4.96485 14.2338 8.27654 6.22867 11.3754 11.033C11.3754 11.033 11.8517 9.7923 11.9001 9.57861C12.0292 9.00978 12.0392 8.36332 11.8947 7.76835H11.8932L11.8924 7.76912Z" fill="white" />
                </svg>
                  Tournois HAQ</Link>
                <h1 className="text-center text-5xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">Aram Draft Pick <span className='text-xs tracking-normal'>v1.2</span></h1>
                <span className="max-w-[750px] text-center text-sm text-muted-foreground md:text-xl">Système de Pick & Ban Personnalisé pour ARAM avec 30 Champions Partagés</span>
              </div>

            </motion.div>
            {loading ? (
              // Show loading circle when loading is true
              <div className="flex flex-col items-center justify-center">
                <LoadingCircle />
              </div>
            ) : room && blueTeam && redTeam ? (
              <RoomDisplay room={room} blueTeam={blueTeam} redTeam={redTeam} />
            ) : (
              <RoomCreationForm onCreate={createRoomLogic} />
            )}

          </>
        )}

      </main>
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ defaultTransition, delay: 0.2 }}
      >
        <footer>
          <p className="text-center text-sm leading-loose text-muted-foreground md:text-left p-16 flex justify-center">All Rights Reserved © 2024 Howling Abyss Quebec</p>
        </footer>

      </motion.div>
    </>
  );
}

export default Home;
