//TODO: Fix error fetching room Error fetching room: 
//Object { code: "22P02", details: null, hint: null, message: 'invalid input syntax for type bigint: "NaN"' }

'use client';
import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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

type RoomProps = {
  params: {
    roomID: string;
    teamID: string;
  };
};

const DraftingView = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    transition={{ defaultTransition, duration: 0.3, delay: 0.5 }}
    className="mx-auto flex h-screen min-h-[768px] w-full min-w-screen max-w-screen flex-col justify-between overflow-hidden">
    <RoomStatusBar className="z-90 fixed left-0 top-0" />
    <section className="flex h-full flex-col gap-4 py-4">
      <div className="h-16"></div>
      <div className="z-10 flex h-full flex-col justify-between px-4 gap-4">
        <SelectionsView />
        <DraftView />
      </div>
    </section>
  </motion.div>
);

const viewComponents = {
  waiting: LobbyView,
  planning: PlanningView,
  done: FinishView,
  select: DraftingView,
  ban: DraftingView,
};

export default function Room({ params: { roomID, teamID } }: RoomProps) {
  const roomIDNumber = parseInt(roomID, 10);
  const teamIDNumber = parseInt(teamID, 10);
  const { isConnected } = useSocket(roomIDNumber);
  const { fetchTeams, setCurrentTeamID } = useTeamStore();
  const { fetchRoom, room } = useRoomStore();
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const initializeRoom = async () => {
      setCurrentTeamID(teamIDNumber);
      await Promise.all([
        await fetchTeams(roomIDNumber),
        await fetchRoom(roomIDNumber)
      ]);
      setIsInitialLoading(false);
    };

    initializeRoom();
  }, [fetchRoom, fetchTeams, roomIDNumber, setCurrentTeamID, teamIDNumber]);

  if (isInitialLoading || !isConnected) {
    return <LoadingScreen />;
  }

  if (!room) {
    throw new Error(`Room ${roomIDNumber} not found`);
  }

  const ViewComponent = viewComponents[room.status as keyof typeof viewComponents];

  return (
    <main>
      {process.env.NODE_ENV === 'development' && <StateControllerButtons roomID={roomIDNumber} />}
      <div className={clsx('h-screen', {
          'flex flex-col': room.status === 'select' || room.status === 'ban',
          'flex flex-col h-1/2 pt-4': room.status === 'planning',
        })}
      >
        {ViewComponent && <ViewComponent />}
        {room.status === 'planning' && (
          <NoticeBanner className='mt-4' message="Si l'un de vos joueurs ne dispose pas du champion requis, veuillez en informer les administrateurs" />
        )}
      </div>
    </main>
  );
}