'use client';
import { useEffect } from 'react';
import { motion } from 'framer-motion';
import useSocket from '@/app/hooks/useSocket';
import useRoomStore from '@/app/stores/roomStore';
import useTeamStore from '@/app/stores/teamStore';
import defaultTransition from '@/app/lib/animationConfig';
import ErrorMessage from '@/app/components/common/ErrorMessage';
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
    roomid: string;
    teamid: string;
  };
};
//min-h-[768px] w-full flex-col items-center justify-center
const DraftingView = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ defaultTransition, duration: 1, delay: 1 }}
      className="mx-auto flex h-screen min-h-[768px]  w-full min-w-screen max-w-screen flex-col justify-between overflow-hidden">
      <RoomStatusBar className="z-90 fixed left-0 top-0" />
      <section className="flex h-full flex-col gap-4">
        <div className="h-14"></div>
        <div className="z-10 flex h-full flex-col justify-between gap-4 px-4">
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

export default function Room({ params: { roomid, teamid } }: RoomProps) {
  const { isConnected } = useSocket(roomid, teamid);
  const { fetchTeams, isLoading: isLoadingTeams, error: errorTeams, setCurrentTeamId } = useTeamStore();
  const { fetchRoom, room, isLoading: isLoadingRoom, error: errorRoom } = useRoomStore();

  useEffect(() => {
    setCurrentTeamId(teamid);
    fetchTeams(roomid);
    fetchRoom(roomid);
  }, [fetchRoom, fetchTeams, roomid, setCurrentTeamId, teamid]);

  if (isLoadingTeams || isLoadingRoom || !isConnected) {
    return <LoadingScreen />;
  }

  if (errorTeams || errorRoom) {
    return <ErrorMessage />;
  }

  if (!room) {
    return <ErrorMessage />;
  }

  const ViewComponent = viewComponents[room.status as keyof typeof viewComponents];

  return (
    <main>
      {process.env.NODE_ENV === 'development' && <StateControllerButtons roomid={roomid} />}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={defaultTransition}
          className={clsx('h-screen', {
            'flex flex-col': room.status === 'select' || room.status === 'ban',
            'pt-4': room.status !== 'waiting',
          })}
        >
          {ViewComponent && <ViewComponent />}
          {room.status === 'planning' && (
            <NoticeBanner className='mt-6' message="Si l'un de vos joueurs ne dispose pas du champion requis, veuillez en informer les administrateurs" />
          )}
        </motion.div>
    </main>
  );
}
