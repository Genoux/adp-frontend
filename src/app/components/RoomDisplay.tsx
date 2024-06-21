import { Button } from '@/app/components/ui/button';
import { Input } from '@/app/components/ui/input';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/app/components/ui/tooltip';
import { defaultTransition } from '@/app/lib/animationConfig';
import clsx from 'clsx';
import { AnimatePresence, motion } from 'framer-motion';
import { CheckIcon, CopyIcon } from 'lucide-react';
import Link from 'next/link';
import { useState } from 'react';

interface RoomDisplayProps {
  [key: string]: any;
}

const copyToClipboard = (link: string) => {
  const copy = window.location.href + link;

  navigator.clipboard
    .writeText(copy)
    .then(() => {
      console.log('Copied to clipboard successfully!');
    })
    .catch((err) => {
      console.error('Could not copy text: ', err);
      throw new Error('Could not copy text');
    });

  return { message: 'Copied to clipboard' };
};

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
        <TooltipTrigger
          className="bg-white text-black p-2.5"
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

interface Team {
  id?: number;
  name?: string;
  color?: 'blue' | 'red' | 'spectator';
  btnText?: string;
}

interface DisplayProps {
  team: Team;
  roomId?: number;
  isSpectator?: boolean;
}

const Display: React.FC<DisplayProps> = ({
  team,
  roomId,
  isSpectator = false,
}) => {
  const link = isSpectator
    ? `room/${roomId}/spectator`
    : `room/${roomId}/${team.id}`;

  const handleInputClick = (event: any) => {
    event.target.select();
    copyToClipboard(link);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, defaultTransition }}
    >
      <div className="mb-1 flex items-center gap-1">
        <div
          className={clsx('h-2 w-2', {
            'bg-blue': team.color === 'blue',
            'bg-red': team.color === 'red',
            'bg-[#353535]': isSpectator,
          })}
        ></div>
        <label>{isSpectator ? 'Spectateur' : team.name}</label>
      </div>
      <div className="flex flex-row items-center gap-2">
        <Input
          readOnly
          value={`${window.location.origin}/${link}`}
          onClick={handleInputClick}
        />
        <Link href={`/${link}`} target="_blank" passHref>
          <Button size={'sm'}>
            {isSpectator ? 'Rejoindre' : team.btnText}
          </Button>
        </Link>
        <CopyButton link={link} />
      </div>
    </motion.div>
  );
};

export const RoomDisplay: React.FC<RoomDisplayProps> = ({
  room,
  blueTeam,
  redTeam,
}) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
        className="border bg-black bg-opacity-20 p-6"
      >
        <div className="mb-4 text-left">
          <h1 className="text-2xl font-bold">Chambre générée</h1>
          <p className="text-sm font-normal opacity-50">
            {'Rejoignez une chambre associée à votre équipe'}
          </p>
        </div>
        <div className="flex w-full flex-col justify-center gap-6">
          <Display team={blueTeam} roomId={room.id} />
          <Display team={redTeam} roomId={room.id} />
          <Display team={{ color: 'spectator' }} roomId={room.id} isSpectator />
        </div>
      </motion.div>
    </AnimatePresence>
  );
};
