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
import NoticeBanner from '@/app/components/common/NoticeBanner';
import { useToast } from "@/app/components/ui/use-toast"

type Room = {
  id: number;
  name: string;
  blue: Team;
  red: Team;
  status: string;
  heroes_pool: { id: number; name: string; imageUrl: string }[];
  [key: string]: any;
}

type BlueTeam = {
  id: number;
  name: string;
  color: string;
}

type RedTeam = {
  id: number;
  name: string;
  color: string;
}

type Team = {
  id: number;
  name: string;
  borderColor: string;
  color: string;
  btnText: string;
}
type TeamsName = {
  blueTeamName: string;
  redTeamName: string;
}

function Home() {
  const [room, setRoom] = useState<Room | null>(null);
  const [redTeam, setRedTeam] = useState<Team | null>(null);
  const [blueTeam, setBlueTeam] = useState<Team | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast()
  const appState = process.env.NEXT_PUBLIC_APP_STATE;
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
    setLoading(true);
    try {
      const response = await fetch(`/api/generateroom/`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const { room, blue, red } = await response.json();

      if (room.error) {
        throw new Error(room.error);
      }

      const mappedBlueTeam = mapTeamStructure(blue, 'blue');
      const mappedRedTeam = mapTeamStructure(red, 'red');

      setBlueTeam(mappedBlueTeam);
      setRedTeam(mappedRedTeam);
      setRoom({ ...room, blue: mappedBlueTeam, red: mappedRedTeam });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Something went wrong. Please try again later.",
      })
      console.error('Failed to create room!:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence mode='wait'>
      <main className="h-screen flex items-center justify-center" style={{ height: 'calc(100vh - 126px)' }}>
        {appState === 'false' ? (
          <div className="flex h-full animate-pulse flex-col items-center justify-center gap-2">
            <BedDouble className="h-6 w-6" />
            <h1 className="text-2xl font-semibold">Zzzzzz</h1>
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ defaultTransition, delay: 0.2 }}
            className="mx-auto flex flex-col items-center justify-center gap-8"
          >
            <div className="flex flex-col items-center justify-center">
              <Link
                className="mb-4 inline-flex items-center gap-1 bg-muted py-1 pl-2 pr-3 text-sm font-normal rounded-full"
                href="http://tournoishaq.ca/"
                target="_blank"
              >
                <Logo size={18} />
                Tournois HAQ
              </Link>
              <h1 className="text-center text-6xl font-bold tracking-tighter flex justify-end">
                Aram Draft Pick
                <p className="text-xs tracking-normal">v{appVersion}</p>
              </h1>
              <span className="text-center text-sm text-muted-foreground">
                Système de Pick & Ban Personnalisé pour ARAM avec 30 Champions Partagés
              </span>
            </div>
            {loading ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={defaultTransition}
                className="flex h-[402px] w-full flex-col items-center justify-center"
              >
                <LoadingCircle />
              </motion.div>
            ) : room && blueTeam && redTeam ? (
              <div className="h-[402px] flex flex-col gap-2">
                <motion.div
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ defaultTransition, delay: 0.5 }}
                  onClick={() => {
                    setRoom(null);
                  }}
                  className="flex w-fit cursor-pointer border p-1 hover:-translate-x-1 hover:bg-white hover:bg-opacity-5"
                >
                  <ArrowLeft size={18} />
                </motion.div>
                <RoomDisplay room={room} blueTeam={blueTeam} redTeam={redTeam} />
              </div>
            ) : (
              <div className='h-[402px] flex flex-col gap-6 justify-start items-center'>
                <RoomCreationForm submit={(data: TeamsName) => createRoom(data as TeamsName)} />
                {appMode === 'tournament' && (
                  <NoticeBanner message="Si votre équipe n'apparaît pas dans la liste, veuillez contacter un administrateur" />
                )}
              </div>
            )}
          </motion.div>
        )}
      </main>
    </AnimatePresence>
  );
}

export default Home;
