'use client';

import { useEffect, useState, useMemo } from 'react';
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
import { Database } from '@/app/types/supabase';
import ExtendedImage from '@/app/components/common/ExtendedImage';
import ErrorBoundary from '@/app/components/ErrorBoundary';
import { notFound } from 'next/navigation';

type Hero = Database["public"]["CompositeTypes"]["hero"];
type RoomProps = { params: { roomid: string; teamid: string; }; };

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

const useRoomInitialization = (roomID: number, teamID: number) => {
  const { isConnected } = useSocket(roomID);
  const { fetchTeams, setCurrentTeamID, teams, currentTeamID } = useTeamStore();
  const { fetchRoom, room } = useRoomStore();
  const [error, setError] = useState<Error | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const initializeRoom = async () => {
      try {
        await Promise.all([
          fetchTeams(roomID),
          fetchRoom(roomID),
          setCurrentTeamID(teamID)
        ]);
      } catch (err) {
        console.error("Error initializing room:", err);
        setError(err instanceof Error ? err : new Error('An error occurred during initialization'));
      } finally {
        setIsInitialLoading(false);
      }
    };

    initializeRoom();
  }, [fetchRoom, fetchTeams, roomID, setCurrentTeamID, teamID]);

  return { isConnected, isInitialLoading, room, teams, currentTeamID, error };
};

const viewComponents = {
  waiting: LobbyView,
  planning: PlanningView,
  done: FinishView,
  draft: () => (
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
  ),
};

export default function Room({ params: { roomid, teamid } }: RoomProps) {
  const roomID = parseInt(roomid, 10);
  const teamID = parseInt(teamid, 10);

  const { isConnected, isInitialLoading, room, teams, currentTeamID, error } = useRoomInitialization(roomID, teamID);
  const { socket } = useSocket(roomID);

  const currentTeam = useMemo(() => teams.find(team => team.id === currentTeamID), [teams, currentTeamID]);

  const animationKey = useMemo(() => {
    return ['ban', 'select'].includes(room?.status || '') ? 'draft' : room?.status || 'initial';
  }, [room?.status]);

  useEffect(() => {
    if (isConnected && currentTeam && socket) {
      socket.emit('joinTeam', { teamId: currentTeam.id });
    }
  }, [isConnected, currentTeam, socket]);

  useEffect(() => {
    if (!isInitialLoading && (!room || !currentTeam)) {
      socket?.disconnect();
      notFound();
    }
  }, [isInitialLoading, room, currentTeam, socket]);

  if (isInitialLoading) return <LoadingScreen />;
  if (error) return <div>Error: {error.message}</div>;
  if (!room || !currentTeam) {
    socket?.disconnect();
    notFound();
  }

  const ViewComponent = viewComponents[(['ban', 'select'].includes(room.status) ? 'draft' : room.status) as keyof typeof viewComponents];

  return (
    <ErrorBoundary fallback={<div>Something went wrong</div>}>
      <main>
        <Preload champions={room.heroes_pool as Hero[]} />
        {process.env.NODE_ENV === 'development' && <StateControllerButtons roomID={roomID} />}
        <AnimatePresence mode='wait'>
          <motion.div
            key={animationKey}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ defaultTransition }}
            className={clsx('h-screen', {
              'flex flex-col': ['select', 'ban'].includes(room.status),
              'flex flex-col justify-center': room.status === 'planning',
            })}
          >
            {ViewComponent && <ViewComponent />}
            {room.status === 'planning' && (
              <NoticeBanner className='mt-6' message="Si l'un de vos joueurs ne dispose pas du champion requis, veuillez en informer les administrateurs" />
            )}
          </motion.div>
        </AnimatePresence>
      </main>
    </ErrorBoundary>
  );
}