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

const CopyButton: React.FC<{ link: string }> = ({ link }) => {
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
  );
};

const TeamDisplay: React.FC<{ team: Team; roomId: number }> = ({
  team,
  roomId,
}) => {
  const link = `room/${roomId}/${team.id}`;

  return (
    <div
      className={clsx(
        team.borderColor,
        'flex w-full flex-col items-center justify-between rounded-md border border-b-white border-l-white border-r-white border-opacity-10 p-12 transition-all ease-in-out hover:bg-opacity-10',
        {
          'bg-blue-500 bg-opacity-5': team.color === 'blue',
          'bg-red-500 bg-opacity-5': team.color === 'red',
        }
      )}
    >
      <h1 className="mb-4 text-4xl font-medium uppercase">{team.name}</h1>
      <div className="flex flex-row items-center justify-center gap-2">
        <Link href={`/${link}`} passHref target="_blank">
          <Button
            size="lg"
            className="rounded-sm bg-yellow text-sm font-bold uppercase text-yellow-text hover:bg-yellow-hover"
          >
            {team.btnText}
          </Button>
        </Link>
        <CopyButton link={link} />
      </div>
    </div>
  );
};

export const RoomDisplay: React.FC<RoomDisplayProps> = ({
  room,
  blueTeam,
  redTeam,
}) => {
  const link = `room/${room.id}/spectator`;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: [0.4, 0.0, 0.2, 1] }}
        key="home-page"
      >
        <div className="mb-6 flex w-full flex-row justify-center gap-6">
          <TeamDisplay team={blueTeam} roomId={room.id} />
          <TeamDisplay team={redTeam} roomId={room.id} />
        </div>
        <div className="flex flex-col items-center gap-2 rounded-md border border-t-4 border-white border-opacity-10 bg-black bg-opacity-20 py-10 align-middle">
          <h1 className="mb-4 text-4xl font-medium uppercase">Spectateur</h1>
          <div className="flex gap-2 align-middle">
            <Link href={`/${link}`} passHref target="_blank">
              <Button
                size="lg"
                className="rounded-sm bg-yellow text-sm font-bold uppercase text-yellow-text hover:bg-yellow-hover"
              >
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
