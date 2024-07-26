'use client';

import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Logo } from 'haq-assets';
import { BedDouble } from 'lucide-react';
import Link from 'next/link';
import { useToast } from "@/app/components/ui/use-toast";
import { Database } from '@/app/types/supabase';
import LoadingCircle from '@/app/components/common/LoadingCircle';
import { RoomCreationForm } from '@/app/components/RoomCreationForm';
import { RoomDisplay } from '@/app/components/RoomDisplay';
import NoticeBanner from '@/app/components/common/NoticeBanner';
import defaultTransition from '@/app/lib/animationConfig';
import { appVersion } from '@/app/utils/version';

type Room = Database['public']['Tables']['rooms']['Row'] & {
  blue: Team;
  red: Team;
  heroes_pool: { id: number; name: string; imageUrl: string }[];
};

type Team = {
  id: number;
  name: string;
  color: 'blue' | 'red';
  borderColor: string;
  btnText: string;
};

type TeamsName = {
  blueTeamName: string;
  redTeamName: string;
};

const mapTeamStructure = (team: Omit<Team, 'borderColor' | 'btnText'>, borderColor: string): Team => ({
  ...team,
  borderColor: `border-${borderColor} border-t-4`,
  btnText: 'Rejoindre',
});

function Home() {
  const [room, setRoom] = useState<Room | null>(null);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();
  const appState = process.env.NEXT_PUBLIC_APP_STATE;
  const appMode = process.env.NEXT_PUBLIC_APP_MODE;

  const createRoom = async (data: TeamsName) => {
    setLoading(true);
    try {
      const response = await fetch('/api/generateroom/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      const { room, blue, red } = await response.json();

      if (room.error) throw new Error(room.error);

      const mappedBlueTeam = mapTeamStructure(blue, 'blue');
      const mappedRedTeam = mapTeamStructure(red, 'red');

      setRoom({ ...room, blue: mappedBlueTeam, red: mappedRedTeam });
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "Something went wrong. Please try again later.",
      });
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => {
    if (loading) {
      return (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={defaultTransition}
        >
          <LoadingCircle />
        </motion.div>
      );
    }

    if (room) {
      return (
        <div className="w-full flex flex-col gap-6">
          <RoomDisplay resetRoom={() => setRoom(null)} room={room} blueTeam={room.blue} redTeam={room.red} />
        </div>
      );
    }

    return (
      <div className='flex flex-col gap-6 justify-start items-center'>
        <RoomCreationForm submit={createRoom} />
        {appMode === 'tournament' && (
          <NoticeBanner message="Si votre équipe n'apparaît pas dans la liste, veuillez contacter un administrateur" />
        )}
      </div>
    );
  };

  if (appState === 'false') {
    return (
      <div className="flex h-full animate-pulse flex-col items-center justify-center gap-2">
        <BedDouble className="h-6 w-6" />
        <h1 className="text-2xl font-semibold">Zzzzzz</h1>
      </div>
    );
  }

  return (
    <main className="h-screen flex items-center justify-center">
      <AnimatePresence mode='wait'>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ defaultTransition, delay: 0.2 }}
          className="min-w-[450px]"
        >
          <div className="flex flex-col items-center justify-center">
            <Link
              className="transition-all mb-4 inline-flex items-center gap-1 bg-black border hover:bg-white hover:bg-opacity-10 py-1 pl-2 pr-3 text-sm font-normal rounded-full"
              href="http://tournoishaq.ca/"
              target="_blank"
            >
              <Logo size={18} />
              Tournois HAQ
            </Link>
            <div className="flex flex-col gap-2 items-center">
              <h1 className="text-center text-5xl font-bold tracking-tighter flex justify-end">
                Aram Draft Pick
                <p className="text-xs tracking-normal">v{appVersion}</p>
              </h1>
              <span className="text-center text-xs text-muted-foreground">
                Système de Pick & Ban Personnalisé pour ARAM avec 30 Champions Partagés
              </span>
            </div>
          </div>
          <div className='min-h-[400px] flex flex-col items-center justify-center' >
            {renderContent()}
          </div>
        </motion.div>
      </AnimatePresence>
    </main>
  );
}

export default Home;