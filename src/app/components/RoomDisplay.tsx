import { Button } from '@/app/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/components/ui/tooltip';
import copyToClipboard from '@/app/utils/copyToClipboard';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, CopyIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface Room {
  id: number;
  name: string;
  blue: Team;
  red: Team;
  status: string;
  [key: string]: any;
}

interface Team {
  id: number;
  name: string;
  borderColor: string;
  color: string;
  btnText: string;
}

interface RoomDisplayProps {
  room: Room;
  blueTeam: Team;
  redTeam: Team;
  copyLink: { [key: string]: boolean };
  setCopyLink: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
}

const TeamDisplay: React.FC<{
  team: Team;
  roomId: number;
  copyLink: { [key: string]: boolean };
  setCopyLink: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
}> = ({ team, roomId, copyLink, setCopyLink }) => {
  const [copied, setCopied] = useState(false);

  const handleCopyClick = () => {
    copyToClipboard(`room/${roomId}/${team.id}`, `${team.id}`, setCopyLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };

  return (
    <>
      <div
        className={clsx(
          team.borderColor,
          'hover:bg-opacity-10',
          'border',
          'border-l-white',
          'border-b-white',
          'border-r-white',
          'border-opacity-10',
          'rounded-sm',
          'flex',
          'flex-col',
          'items-center',
          'justify-between',
          'w-full',
          'p-12',
          'transition-all',
          'ease-in-out',
          {
            'bg-blue-500 bg-opacity-5': team.color === 'blue',
            'bg-red-500 bg-opacity-5': team.color === 'red',
          }
        )}
      >
        <h1 className="mb-4 text-4xl font-medium uppercase">{team.name}</h1>
        <div className="flex flex-row items-center justify-center gap-2">
          <Link href={`/room/${roomId}/${team.id}`} target="_blank">
            <Button
              size="lg"
              className={`rounded-sm bg-yellow text-sm font-bold uppercase text-yellow-text hover:bg-yellow-hover`}
            >
              {team.btnText}
            </Button>
          </Link>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div
                  className="rounded-sm border border-yellow bg-transparent p-3 text-yellow hover:opacity-90"
                  onMouseLeave={() => setCopied(false)}
                  onClick={handleCopyClick}
                >
                  {copied ? (
                    <CheckIcon className="h-4 w-4" />
                  ) : (
                    <CopyIcon className="h-4 w-4" />
                  )}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{"Copier l'URL"}</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>
    </>
  );
};

export const RoomDisplay: React.FC<RoomDisplayProps> = ({
  room,
  blueTeam,
  redTeam,
  copyLink,
  setCopyLink,
}) => (
  <AnimatePresence mode="wait">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
      key="home-page"
    >
      <div className="flex w-full flex-row justify-center gap-6">
        <TeamDisplay
          team={blueTeam}
          roomId={room.id}
          copyLink={copyLink}
          setCopyLink={setCopyLink}
        />
        <TeamDisplay
          team={redTeam}
          roomId={room.id}
          copyLink={copyLink}
          setCopyLink={setCopyLink}
        />
      </div>
    </motion.div>
  </AnimatePresence>
);
