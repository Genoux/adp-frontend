'use client'

import LoadingCircle from '@/app/components/common/LoadingCircle';
import { defaultTransition } from '@/app/lib/animationConfig';
import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { RoomCreationForm } from '@/app/components/RoomCreationForm';
import { RoomDisplay } from '@/app/components/RoomDisplay';
import { BedDouble, ArrowLeft } from 'lucide-react';
import { appVersion } from '@/app/utils/version';
import Link from 'next/link';
import { Logo } from 'haq-assets'

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
interface TeamsName {
  blueTeamName: string;
  redTeamName: string;
}

function Home() {
  const [room, setRoom] = useState<Room | null>(null);
  const [redTeam, setRedTeam] = useState<Team | null>(null);
  const [blueTeam, setBlueTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(false);
  const appMode = process.env.NEXT_PUBLIC_APP_MODE;

  const mapTeamStructure = (team: BlueTeam | RedTeam, borderColor: string): Team => ({
    ...team,
    borderColor: `border-${borderColor} border-t-4`,
    color: team.color,
    btnText: 'Rejoindre',
  });

  const createRoom = async (data: TeamsName) => {
    console.log("createRoom - data:", data);
    setLoading(true);
    try {
      const response = await fetch(`/api/generateroom/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const { room, blue, red } = await response.json();
      if (room.error) {
        console.error(room.error);
        return;
      }

      const mappedBlueTeam = mapTeamStructure(blue, 'blue');
      const mappedRedTeam = mapTeamStructure(red, 'red');

      setBlueTeam(mappedBlueTeam);
      setRedTeam(mappedRedTeam);
      setRoom({ ...room, blue: mappedBlueTeam, red: mappedRedTeam });
    } catch (error) {
      console.error('Failed to create room:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex h-full flex-col items-center justify-start">
      {appMode === 'false' ? (
        <div className='flex flex-col h-full justify-center items-center gap-2 animate-pulse'>
          <BedDouble className='w-6 h-6' />
          <h1 className='font-semibold text-2xl'>Zzzzzz</h1>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={defaultTransition}
            className='flex flex-col items-center mx-auto justify-center max-w-[980px] gap-12 mt-12'
          >
            <div className='flex flex-col items-center justify-center'>
              <Link className="inline-flex items-center bg-muted pl-2 pr-3 py-1 text-sm font-bold gap-1 mb-4" href="http://tournoishaq.ca/" target='_blank'>
                  <Logo size={18} />
                Tournois HAQ</Link>
              <h1 className="text-center text-5xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">Aram Draft Pick <span className='text-xs tracking-normal'>v{appVersion}</span></h1>
              <span className="max-w-[750px] text-center text-sm text-muted-foreground md:text-xl">Système de Pick & Ban Personnalisé pour ARAM avec 30 Champions Partagés</span>
            </div>

            {loading ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={defaultTransition}
                className="flex flex-col items-center justify-center h-[440px]">
                <LoadingCircle />
              </motion.div>
            ) : room && blueTeam && redTeam ? (
              <div className='flex flex-col gap-2'>
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ defaultTransition, delay: 0.5 }}
                  onClick={() => { setRoom(null) }} className='cursor-pointer border p-1 flex w-fit  hover:bg-white hover:bg-opacity-5 hover:-translate-x-1'><ArrowLeft size={18} /></motion.div>
                <RoomDisplay room={room} blueTeam={blueTeam} redTeam={redTeam} />
              </div>
            ) : (
              <>
                <RoomCreationForm submit={(data: TeamsName) => createRoom(data as TeamsName)} />

              </>
            )}


          </motion.div>
        </AnimatePresence>
      )}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ defaultTransition, delay: 0.2 }}
        className='py-16'
      >
        <footer className="text-sm leading-loose text-muted-foreground  w-full ">
          <p className='text-center'>All Rights Reserved © 2024 Howling Abyss Quebec</p>
        </footer>

      </motion.div>

    </main>

  );
}

export default Home;
