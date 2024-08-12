'use client';

import AnimatedDot from '@/app/components/common/AnimatedDot';
import LoadingScreen from '@/app/components/common/LoadingScreen';
import NoticeBanner from '@/app/components/common/NoticeBanner';
import RoomStatusBar from '@/app/components/common/RoomStatusBar';
import StateControllerButtons from '@/app/components/common/StateControllerButtons';
import DraftView from '@/app/components/DraftView';
import FinishView from '@/app/components/FinishView';
import PlanningView from '@/app/components/PlanningView';
import SelectionsView from '@/app/components/SelectionsView';
import useSocket from '@/app/hooks/useSocket';
import useTeams from '@/app/hooks/useTeams';
import defaultTransition from '@/app/lib/animationConfig';
import useRoomStore from '@/app/stores/roomStore';
import useTeamStore from '@/app/stores/teamStore';
import { Database } from '@/app/types/supabase';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { notFound } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';

type Room = Database['public']['Tables']['rooms']['Row'];

type RoomProps = {
  params: {
    roomid: string;
    teamid?: string;
  };
};

const useRoomInitialization = (roomID: number, teamID: number | null) => {
  const { isConnected } = useSocket(roomID);
  const { fetchTeams, setCurrentTeamID, setIsSpectator, teams, currentTeamID } =
    useTeamStore();
  const { fetchRoom, room } = useRoomStore();
  const [error, setError] = useState<Error | null>(null);
  const [isInitialLoading, setIsInitialLoading] = useState(true);

  useEffect(() => {
    const initializeRoom = async () => {
      try {
        if (teamID === null) {
          setIsSpectator(true);
        } else {
          await setCurrentTeamID(teamID);
          setIsSpectator(false);
        }
        await Promise.all([fetchTeams(roomID), fetchRoom(roomID)]);
      } catch (err) {
        console.error('Error initializing room:', err);
        setError(
          err instanceof Error
            ? err
            : new Error('An error occurred during initialization')
        );
      } finally {
        setIsInitialLoading(false);
      }
    };

    initializeRoom();
  }, [fetchRoom, fetchTeams, roomID, setCurrentTeamID, setIsSpectator, teamID]);

  return { isConnected, isInitialLoading, room, teams, currentTeamID, error };
};

const viewComponents = {
  waiting: () => (
    <div className="flex h-screen items-center justify-center gap-1">
      <p className="text-base">{'En attente des deux équipes'}</p>
      <AnimatedDot />
    </div>
  ),
  planning: PlanningView,
  done: FinishView,
  draft: () => (
    <div className="mx-auto flex h-screen min-h-[768px] w-full min-w-screen max-w-screen flex-col justify-between overflow-hidden">
      <RoomStatusBar className="z-90 fixed left-0 top-0" />
      <section className="flex h-full flex-col gap-4 py-4">
        <div className="h-16"></div>
        <div className="z-10 flex h-full flex-col justify-between gap-4 px-4">
          <SelectionsView />
          <DraftView />
        </div>
      </section>
    </div>
  ),
};

const Room = ({ params: { roomid, teamid } }: RoomProps) => {
  const roomID = parseInt(roomid, 10);
  const teamID = teamid ? parseInt(teamid, 10) : null;
  const { isConnected, isInitialLoading, room, error } = useRoomInitialization(
    roomID,
    teamID
  );
  const { socket } = useSocket(roomID);
  const { redTeam, blueTeam, currentTeam } = useTeams();
  const { isSpectator } = useTeamStore();

  const animationKey = useMemo(() => {
    return ['ban', 'select'].includes(room?.status || '')
      ? 'draft'
      : room?.status || 'initial';
  }, [room?.status]);

  useEffect(() => {
    if (isConnected && currentTeam && socket && !isSpectator) {
      socket.emit('joinTeam', { teamId: currentTeam.id });
    }
  }, [isConnected, currentTeam, socket, isSpectator]);

  useEffect(() => {
    if (!isInitialLoading && !room) {
      socket?.disconnect();
      notFound();
    }
  }, [isInitialLoading, room, socket]);

  if (isInitialLoading) return <LoadingScreen />;
  if (error) return <div>Error: {error.message}</div>;
  if (!room) {
    socket?.disconnect();
    notFound();
  }

  const ViewComponent =
    viewComponents[
      (['ban', 'select'].includes(room.status)
        ? 'draft'
        : room.status) as keyof typeof viewComponents
    ];

  return (
    <main>
      {process.env.NODE_ENV === 'development' && (
        <StateControllerButtons roomID={roomID} />
      )}
      <AnimatePresence mode="wait">
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
          {room.status === 'planning' && isSpectator && (
            <NoticeBanner
              className="mt-6"
              message={
                <>
                  Vous êtes spectateur de{' '}
                  <span className="font-bold uppercase">{blueTeam?.name}</span>
                  {' vs '}
                  <span className="font-bold uppercase">{redTeam?.name}</span>
                </>
              }
            />
          )}
          {room.status === 'planning' && !isSpectator && (
            <NoticeBanner
              className="mt-6"
              message="Si l'un de vos joueurs ne dispose pas du champion requis, veuillez en informer les administrateurs"
            />
          )}
        </motion.div>
      </AnimatePresence>
    </main>
  );
};

export default Room;
