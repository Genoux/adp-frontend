'use client';

import LoadingCircle from '@/app/components/common/LoadingCircle';
import { RoomCreationForm } from '@/app/components/RoomCreationForm';
import { RoomDisplay } from '@/app/components/RoomDisplay';
import { defaultTransition } from '@/app/lib/animationConfig';
import { appVersion } from '@/app/utils/version';
import { AnimatePresence, motion } from 'framer-motion';
import { Logo } from 'haq-assets';
import { ArrowLeft, BedDouble } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

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

  const mapTeamStructure = (
    team: BlueTeam | RedTeam,
    borderColor: string
  ): Team => ({
    ...team,
    borderColor: `border-${borderColor} border-t-4`,
    color: team.color,
    btnText: 'Rejoindre',
  });

  const createRoom = async (data: TeamsName) => {
    console.log('createRoom - data:', data);
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
        <div className="flex h-full animate-pulse flex-col items-center justify-center gap-2">
          <BedDouble className="h-6 w-6" />
          <h1 className="text-2xl font-semibold">Zzzzzz</h1>
        </div>
      ) : (
        <AnimatePresence>
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={defaultTransition}
            className="mx-auto mt-12 flex max-w-[980px] flex-col items-center justify-center gap-12"
          >
            <div className="flex flex-col items-center justify-center">
              <Link
                className="mb-4 inline-flex items-center gap-1 bg-muted py-1 pl-2 pr-3 text-sm font-bold rounded-full"
                href="http://tournoishaq.ca/"
                target="_blank"
              >
                <Logo size={18} />
                Tournois HAQ
              </Link>
              <h1 className="text-center text-5xl font-bold leading-tight tracking-tighter md:text-6xl lg:leading-[1.1]">
                Aram Draft Pick{' '}
                <span className="text-xs tracking-normal">v{appVersion}</span>
              </h1>
              <span className="max-w-[750px] text-center text-sm text-muted-foreground md:text-xl">
                Système de Pick & Ban Personnalisé pour ARAM avec 30 Champions
                Partagés
              </span>
            </div>

            {loading ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={defaultTransition}
                className="flex h-[440px] flex-col items-center justify-center"
              >
                <LoadingCircle />
              </motion.div>
            ) : room && blueTeam && redTeam ? (
              <div className="flex flex-col gap-2">
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ defaultTransition, delay: 0.5 }}
                  onClick={() => {
                    setRoom(null);
                  }}
                  className="flex w-fit cursor-pointer border p-1  hover:-translate-x-1 hover:bg-white hover:bg-opacity-5"
                >
                  <ArrowLeft size={18} />
                </motion.div>
                <RoomDisplay
                  room={room}
                  blueTeam={blueTeam}
                  redTeam={redTeam}
                />
              </div>
            ) : (
              <>
                <RoomCreationForm
                  submit={(data: TeamsName) => createRoom(data as TeamsName)}
                />
              </>
            )}
          </motion.div>
        </AnimatePresence>
      )}
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ defaultTransition, delay: 0.2 }}
        className="py-16"
      >
        <footer className="w-full text-sm leading-loose  text-muted-foreground ">
          <p className="text-center">
            All Rights Reserved © 2024 Howling Abyss Quebec
          </p>
        </footer>
      </motion.div>
    </main>
  );
}

export default Home;
