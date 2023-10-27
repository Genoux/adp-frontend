"use client";

import React, { useEffect } from 'react';
import { Database } from "@/app/types/supabase";
import { roomStore } from "@/app/stores/roomStore";
import useTeamStore from "@/app/stores/teamStore";
import ChampionsPool from "@/app/components/common/ChampionsPool";
import useTeams from "@/app/hooks/useTeams";
import Timer from "@/app/components/common/RoomTimer";
import useSocket from "@/app/hooks/useSocket";
import SocketContext from "@/app/context/SocketContext";
import LoadingCircle from "@/app/components/common/LoadingCircle";
import TeamPicks from "@/app/components/team/TeamPicks";
import TeamBans from "@/app/components/team/TeamBans";
import Image from "next/image";
import { useState } from "react";
import { motion } from 'framer-motion';
import { truncateString } from "@/app/lib/utils";
import ArrowAnimation from '@/app/components/common/ArrowAnimation';
import FinishView from '@/app/components/FinishView';

import Planningview from "@/app/components/PlanningView";
import DraftView from "@/app/components/DraftView";

interface SpectatorProps {
  params: {
    roomid: string;
  };
}
const Spectator = ({ params }: SpectatorProps) => {
  const roomid = params.roomid;

  const { socket, connectionError } = useSocket(roomid);
  const { teams, fetchTeams, isLoading: loadTeam } = useTeamStore();
  const { room, fetchRoom, isLoading, error: errorRoom, } = roomStore();
  const { redTeam, blueTeam } = useTeams();


  const [selectedChampion, setSelectedChampion] = useState<string>("");
  const [clickedHero, setClickedHero] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentTeam, setCurrentTeam] = useState<any | null>(null);

  const widthVariants = {
    notTurn: { width: "6px" },
    isTurn: { width: "125px" }
  };

  useEffect(() => {
    console.log(room?.status)
  }, [room?.status]);

  useEffect(() => {
    fetchRoom(roomid);
    fetchTeams(roomid);
  }, []);

  useEffect(() => {
    if (teams) {
      const currentTeam = teams.find(team => team.isturn);
      if (currentTeam) {
        setCurrentImage(currentTeam.clicked_hero || "");
        setCurrentTeam(currentTeam);
        setClickedHero(currentTeam.clicked_hero)
        setSelectedChampion(currentTeam.clicked_hero || "");
      }
    }
  }, [teams]);

  if (connectionError) {
    return <div>Error connecting to server</div>;
  }

  if (!socket || isLoading || loadTeam) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        {<LoadingCircle />}
      </div>
    );
  }

  if (room?.status === "waiting") {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="pr-0.5 text-base">{`En attende des équipes`}</span>
        <div className="sending-animation">
          <span className="sending-animation-dot">.</span>
          <span className="sending-animation-dot">.</span>
          <span className="sending-animation-dot">.</span>
        </div>
      </div>
    );
  }

  if (room?.status === "planning") {
    return (
      <SocketContext.Provider value={socket}>
        <div className='flex flex-col items-center justify-center container'>
          <Planningview />
        </div>
      </SocketContext.Provider>
    );
  }

  if (room?.status === "done") {
    return (
      <div className='px-6 lg:px-12'>
        <FinishView />
      </div>
    );
  }

  return (

    <SocketContext.Provider value={socket}>

      {room?.status === 'ban' && (
        <motion.div
          exit="exit"
          initial={{ opacity: 0 }}
          animate={{ opacity: .05 }}
          transition={{
            delay: .2,
            duration: 1,
            ease: "linear"
          }}
          className="absolute h-full w-full bg-red-900 opacity-5 top-0 left-0 -z-50"></motion.div>
      )}

      <div className={`absolute ${currentTeam?.color === 'blue' ? 'left-0' : 'right-0'} top-0 w-3/12 h-full -z-10`}>
        {currentImage && (
          <Image
            src={`/images/champions/splash/${currentImage?.toLowerCase().replace(/\s+/g, '')}.jpg`}
            width={3840}
            height={1440}
            rel="preload"
            className={`w-full h-full object-cover object-center opacity-50 ${currentTeam?.color === 'blue' ? 'fade-gradient-left' : 'fade-gradient-right'}`}
            alt={``}
          />)}
      </div>
      <div className='container'>
        <div className='grid grid-cols-3 items-center justify-center my-3 w-full pb-2'>
          <div className={`flex items-center gap-2 justify-start`}>
            <motion.div
              initial={blueTeam?.isturn ? "isTurn" : "notTurn"}
              animate={blueTeam?.isturn ? "isTurn" : "notTurn"}
              variants={widthVariants}
              className={`h-6 w-1 bg-${blueTeam?.color} rounded-full`}>
            </motion.div>
            <span className="text-2xl mr-2">{truncateString(blueTeam?.name.toUpperCase(), 6)}</span>
            <ArrowAnimation roomStatus={room?.status} teamIsTurn={blueTeam?.isturn} orientation="right" />
          </div>
          <div className="flex flex-col w-full items-center">
            <Timer />
            <p className="font-medium text-xs text-center">
              Vous êtes spectateur de {blueTeam?.name.toUpperCase()} vs {redTeam?.name.toUpperCase()}
            </p>
          </div>
          <div className={`flex items-center gap-2 justify-end`}>
            <ArrowAnimation roomStatus={room?.status} teamIsTurn={redTeam?.isturn} orientation="left" />
            <span className="text-2xl ml-2">{truncateString(redTeam?.name.toUpperCase(), 6)}</span>
            <motion.div
              initial={redTeam?.isturn ? "isTurn" : "notTurn"}
              animate={redTeam?.isturn ? "isTurn" : "notTurn"}
              variants={widthVariants}
              className={`h-6 w-1 bg-${redTeam?.color} rounded-full`}>
            </motion.div>
          </div>
        </div>
        <div className='mb-6'><ChampionsPool selectedChampion={selectedChampion} canHoverToShowName={true} canSelect={true} /></div>
        <DraftView applyHeightVariants={false} />
      </div>
    </SocketContext.Provider>
  );
};


export default Spectator;
