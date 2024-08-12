import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/components/ui/tooltip';
import defaultTransition from '@/app/lib/animationConfig';
import { Database } from '@/app/types/supabase';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, CopyIcon, X } from 'lucide-react';
import Link from 'next/link';
import React, { useCallback, useState } from 'react';

type Room = Database['public']['Tables']['rooms']['Row'];

type TeamType = 'blue' | 'red' | 'spectator';

type Team = {
  id: number;
  name: string;
  color: TeamType;
  borderColor: string;
  btnText: string;
};

type SpectatorTeam = Omit<Team, 'id'> & { color: 'spectator' };

type DisplayProps = {
  team: Team | SpectatorTeam;
  roomId: number;
};

type RoomDisplayProps = {
  room: Room;
  blueTeam: Team;
  redTeam: Team;
  resetRoom: (room: Room | null) => void;
};

const copyToClipboard = async (text: string): Promise<void> => {
  try {
    await navigator.clipboard.writeText(text);
    console.log('Copied to clipboard successfully!');
  } catch (err) {
    console.error('Could not copy text: ', err);
    throw new Error('Could not copy text');
  }
};

const CopyButton: React.FC<{ link: string }> = ({ link }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = useCallback(() => {
    copyToClipboard(`${window.location.href}${link}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }, [link]);

  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger
          className="bg-white p-2.5 text-black"
          onMouseLeave={() => setCopied(false)}
          onClick={handleCopyClick}
        >
          {copied ? (
            <CheckIcon className="h-4 w-4 text-red-300" color="black" />
          ) : (
            <CopyIcon className="h-4 w-4" />
          )}
        </TooltipTrigger>
        <TooltipContent>
          <p>{"Copier l'URL"}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

const getTeamPath = (roomId: number, team: Team | SpectatorTeam): string => {
  if (team.color === 'spectator') {
    return `/room/${roomId}/spectator`;
  }
  return `/room/${roomId}/${team.id}`;
};

const Display: React.FC<DisplayProps> = ({ team, roomId }) => {
  const path = getTeamPath(roomId, team);
  const fullLink = `${window.location.origin}${path}`;

  const handleInputClick = useCallback(
    (event: React.MouseEvent<HTMLInputElement>) => {
      event.currentTarget.select();
      copyToClipboard(fullLink);
    },
    [fullLink]
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={defaultTransition}
    >
      <div className="mb-1 flex items-center gap-1">
        <div
          className={clsx('h-2 w-2', {
            'bg-blue': team.color === 'blue',
            'bg-red': team.color === 'red',
            'bg-[#353535]': team.color === 'spectator',
          })}
        />
        <label className="text-sm font-normal">{team.name}</label>
      </div>
      <div className="flex flex-row items-center gap-2">
        <Input
          readOnly
          value={fullLink}
          className="w-72 text-sm font-normal"
          onClick={handleInputClick}
        />
        <Link href={path} target="_blank" passHref>
          <Button size={'sm'}>{team.btnText}</Button>
        </Link>
        <CopyButton link={path} />
      </div>
    </motion.div>
  );
};

export const RoomDisplay: React.FC<RoomDisplayProps> = ({
  room,
  blueTeam,
  redTeam,
  resetRoom,
}) => {
  const spectatorTeam: SpectatorTeam = {
    name: 'Spectateur',
    color: 'spectator',
    borderColor: 'border-gray-500',
    btnText: 'Rejoindre',
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
        className="border bg-black bg-opacity-20 p-6"
      >
        <div className="flex items-start justify-between">
          <div className="mb-4 text-left">
            <h1 className="text-xl font-bold">Chambre générée</h1>
            <p className="text-xs font-normal opacity-50">
              {'Rejoignez une chambre associée à votre équipe'}
            </p>
          </div>
          <Button
            variant={'outline'}
            size={'sm'}
            onClick={() => {
              resetRoom(null);
            }}
          >
            <X size={16} className="cursor-pointer" />
          </Button>
        </div>
        <div className="flex w-full flex-col justify-center gap-4">
          <Display team={blueTeam} roomId={room.id} />
          <Display team={redTeam} roomId={room.id} />
          <Display team={spectatorTeam} roomId={room.id} />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
