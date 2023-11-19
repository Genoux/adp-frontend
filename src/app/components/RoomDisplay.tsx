import React, { useState } from 'react';
import { CopyIcon, CheckIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/app/components/ui/tooltip";
import copyToClipboard from "@/app/utils/copyToClipboard";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import clsx from 'clsx';

interface Team {
  id: number;
  name: string;
  borderColor: string;
  color: string;
  btnText: string;
}

interface RoomDisplayProps {
  room: {
    id: number;
    name: string;
    blue: Team;
    red: Team;
    status: string;
    [key: string]: any;
  };
  blueTeam: Team;
  redTeam: Team;
}

const CopyButton: React.FC<{ link: string; }> = ({ link }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    copyToClipboard(link);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger>
          <div
            className="bg-transparent text-yellow hover:opacity-90 border-yellow border rounded-sm p-3"
            onMouseLeave={() => setCopied(false)}
            onClick={handleCopyClick}
          >
            {copied ? (
              <CheckIcon className="w-4 h-4" />
            ) : (
              <CopyIcon className="w-4 h-4" />
            )}
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p>{"Copier l'URL"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const TeamDisplay: React.FC<{ team: Team; roomId: number; }> = ({ team, roomId }) => {
  const link = `room/${roomId}/${team.id}`;
  
  return (
    <div className={clsx(
      team.borderColor,
      'hover:bg-opacity-10 border border-l-white border-b-white border-r-white border-opacity-10 rounded-md flex flex-col items-center justify-between w-full p-12 transition-all ease-in-out',
      { 'bg-blue-500 bg-opacity-5': team.color === 'blue', 'bg-red-500 bg-opacity-5': team.color === 'red' }
    )}>
      <h1 className="text-4xl font-medium mb-4 uppercase">{team.name}</h1>
      <div className="flex flex-row justify-center items-center gap-2">
        <Link href={`/${link}`} passHref target='_blank'>
          <Button size="lg" className="bg-yellow hover:bg-yellow-hover text-sm uppercase text-yellow-text rounded-sm font-bold">
            {team.btnText}
          </Button>
        </Link>
        <CopyButton link={link} />
      </div>
    </div>
  );
};

export const RoomDisplay: React.FC<RoomDisplayProps> = ({ room, blueTeam, redTeam }) => {
  const link = `room/${room.id}/spectator`;
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
        key="home-page"
      >
        <div className="flex flex-row w-full justify-center gap-6 mb-6">
          <TeamDisplay team={blueTeam} roomId={room.id} />
          <TeamDisplay team={redTeam} roomId={room.id} />
        </div>
        <div className='flex flex-col items-center py-10 align-middle gap-2 border-t-4 bg-black bg-opacity-20 border border-white border-opacity-10 rounded-md'>
        <h1 className="text-4xl font-medium mb-4 uppercase">Spectateur</h1>
          <div className='flex align-middle gap-2'>
          <Link href={`/${link}`} passHref target='_blank'>
            <Button size="lg" className="bg-yellow hover:bg-yellow-hover text-sm uppercase text-yellow-text rounded-sm font-bold">
              Rejoindre
            </Button>
          </Link>
          <CopyButton link={link} />
         </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
