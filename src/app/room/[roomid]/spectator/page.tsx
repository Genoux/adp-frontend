'use client';

import { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import useSocket from '@/app/hooks/useSocket';
import useRoomStore from '@/app/stores/roomStore';
import useTeamStore from '@/app/stores/teamStore';
import defaultTransition from '@/app/lib/animationConfig';
import LoadingScreen from '@/app/components/common/LoadingScreen';
import NoticeBanner from '@/app/components/common/NoticeBanner';
import RoomStatusBar from '@/app/components/common/RoomStatusBar';
import StateControllerButtons from '@/app/components/common/StateControllerButtons';
import LobbyView from '@/app/components/LobbyView';
import PlanningView from '@/app/components/PlanningView';
import FinishView from '@/app/components/FinishView';
import SelectionsView from '@/app/components/SelectionsView';
import DraftView from '@/app/components/DraftView';
import clsx from 'clsx';
import ExtendedImage from '@/app/components/common/ExtendedImage';

import { Database } from '@/app/types/supabase';

type Hero = Database["public"]["CompositeTypes"]["hero"];
type Room = Database["public"]["Tables"]["rooms"]["Row"];

type RoomProps = {
  params: {
    roomid: string;
    teamid: string;
  };
};

const Preload = ({ champions }: { champions: Hero[] }) => (
  <>
    {champions.map((champ) => (
      <ExtendedImage
        key={champ.id}
        rel="preload"
        src={champ.id || ''}
        alt={champ.id || ''}
        type='splash'
        width={1380}
        height={1380}
        className='hidden invisible'
      />
    ))}
  </>
);

const useRoomInitialization = (roomIDNumber: number, teamIDNumber: number) => {
  const { isConnected } = useSocket(roomIDNumber);
  const { fetchTeams, setCurrentTeamID } = useTeamStore();
  const { fetchRoom, room } = useRoomStore();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const initializeRoom = async () => {
      setCurrentTeamID(teamIDNumber);
      await Promise.all([
        fetchTeams(roomIDNumber),
        fetchRoom(roomIDNumber)
      ]);
      setIsInitialLoading(false);
    };

    initializeRoom();
  }, [fetchRoom, fetchTeams, roomIDNumber, setCurrentTeamID, teamIDNumber]);

  return { isConnected, isInitialLoading, room };
};

const Room = ({ params: { roomid, teamid } }: RoomProps) => {
  const roomIDNumber = parseInt(roomid, 10);
  const teamIDNumber = parseInt(teamid, 10);
  const { isConnected, isInitialLoading, room } = useRoomInitialization(roomIDNumber, teamIDNumber);

  if (isInitialLoading || !isConnected) {
    return <LoadingScreen />;
  }

  if (!room) {
    throw new Error(`Room ${roomIDNumber} not found`);
  }

  const renderContent = () => {
    switch (room.status) {
      case 'waiting':
        return <LobbyView />;
      case 'planning':
        return (
          <>
            <PlanningView />
            <NoticeBanner className='mt-6' message="Si l'un de vos joueurs ne dispose pas du champion requis, veuillez en informer les administrateurs" />
          </>
        );
      case 'done':
        return <FinishView />;
      case 'select':
        return <SelectionsView />;
      case 'ban':
        return (
          <div className="mx-auto flex h-screen min-h-[768px] w-full min-w-screen max-w-screen flex-col justify-between overflow-hidden">
            <RoomStatusBar className="z-90 fixed left-0 top-0" />
            <section className="flex h-full flex-col gap-4 py-4">
              <div className="h-16"></div>
              <div className="z-10 flex h-full flex-col justify-between px-4 gap-4">
                <SelectionsView />
                <DraftView />
              </div>
            </section>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <main>
      <Preload champions={room.heroes_pool as Hero[]} />
      {process.env.NODE_ENV === 'development' && <StateControllerButtons roomID={roomIDNumber} />}
      <AnimatePresence mode='wait'>
        <motion.div
          key={room.status}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={defaultTransition}
          className={clsx('h-screen', {
            'flex flex-col': room.status === 'select' || room.status === 'ban',
            'flex flex-col justify-center': room.status === 'planning',
          })}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>
    </main>
  );
};

export default Room;