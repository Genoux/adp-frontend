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
  console.log("Spectator - blueTeam:", blueTeam);
  console.log("Spectator - redTeam:", redTeam);

  const [selectedChampion, setSelectedChampion] = useState<string>("");
  const [canSelect, setCanSelect] = useState(true);
  const [clickedHero, setClickedHero] = useState<string | null>(null);
  const [currentImage, setCurrentImage] = useState<string | null>(null);
  const [currentTeam, setCurrentTeam] = useState<any | null>(null);

  const widthVariants = {
    notTurn: { width: "6px" },
    isTurn: { width: "125px" }
  };


  useEffect(() => {
    fetchTeams(roomid);
    fetchRoom(roomid);
  }, []);

  useEffect(() => {
    if (teams) {
      console.log("useEffect - teams:", teams);
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

  return (
    <SocketContext.Provider value={socket}>
      <div
        className={`absolute ${currentTeam?.color === 'blue' ? 'left-0' : 'right-0'} top-0 w-3/12 h-full -z-10`}
      >
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
   
        <ChampionsPool selectedChampion={selectedChampion} />
        <div className="flex flex-col justify-center mt-6">
          <div className="flex flex-row justify-between w-full gap-80">
            <TeamBans team={blueTeam} applyHeightVariants={false} />
            <TeamBans team={redTeam} applyHeightVariants={false} />
          </div>

          <div className="flex flex-row justify-between w-full h-full gap-12 mt-2">
            <TeamPicks team={blueTeam} applyHeightVariants={false} />
            <TeamPicks team={redTeam} applyHeightVariants={false} />
          </div>
        </div>
      </div>
    </SocketContext.Provider>
  );
};


export default Spectator;
