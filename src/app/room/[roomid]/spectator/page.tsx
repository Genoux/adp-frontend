'use client';
import SelectionsView from '@/app/components/SelectionsView';
import RoomStatusBar from '@/app/components/common/RoomStatusBar';
import DraftView from '@/app/components/DraftView';
import FinishView from '@/app/components/FinishView';
import Planningview from '@/app/components/PlanningView';
import useSocket from '@/app/hooks/useSocket';
import useRoomStore from '@/app/stores/roomStore';
import useTeamStore from '@/app/stores/teamStore';
import { Eye } from 'lucide-react';
import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import defaultTransition from '@/app/lib/animationConfig';
import AnimatedDot from '@/app/components/common/AnimatedDot';
import LoadingScreen from '@/app/components/common/LoadingScreen';

type SpectatorProps = {
  params: {
    roomID: string;
  };
};

const Spectator = ({ params: { roomID } }: SpectatorProps) => {
  const roomIDNumber = parseInt(roomID, 10);
  const { isConnected } = useSocket(roomIDNumber);
  const { fetchTeams, isLoading: isLoadingTeams } = useTeamStore();
  const { room, fetchRoom, isLoading: isLoadingRooms } = useRoomStore();

  useEffect(() => {
    fetchRoom(roomIDNumber);
    fetchTeams(roomIDNumber);
  }, [fetchRoom, fetchTeams, roomIDNumber]);

  if (isLoadingTeams || isLoadingRooms || !isConnected) {
    return <LoadingScreen />;
  }

  if (!room) {
    throw new Error(`Room ${roomIDNumber} not found`);
  }
  const renderContent = () => {
    switch (room?.status) {
      case 'waiting':
        return (
          <div className="mx-auto flex h-screen min-h-[768px] w-full min-w-screen max-w-screen flex-col items-center justify-center overflow-hidden">
            <Eye size={40} className="mb-4" />
            <h1 className="text-2xl font-bold">Vous êtes spectateur</h1>
            <div className="opacity-50">
              <span className="pr-0.5 text-base flex gap-1">{`En attende des équipes`} <AnimatedDot /></span>
            </div>
          </div>
        );
      case 'planning':
        return <Planningview />;
      case 'done':
        return <FinishView />;
      default:
        return (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ defaultTransition, duration: 0.8, delay: 0.3 }}
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
          </>
        );
    }
  };

  return (
    renderContent()
  );
};

export default Spectator;
