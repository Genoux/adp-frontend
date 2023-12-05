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
import { Input } from '@/app/components/ui/input';

interface RoomDisplayProps {
  [key: string]: any;
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
            className="text-black bg-white rounded p-3"
            onMouseLeave={() => setCopied(false)}
            onClick={handleCopyClick}
          >
            {copied ? (
              <CheckIcon className="h-4 w-4 text-red-300" color='black' />
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


const Display: React.FC<DisplayProps> = ({ team, roomId, isSpectator = false }) => {
  const link = isSpectator ? `room/${roomId}/spectator` : `room/${roomId}/${team.id}`;

  const handleInputClick = (event: any) => {
    event.target.select();
    copyToClipboard(link);
  };

  return (
    <div>
      <div className="flex gap-1 items-center mb-1">
        <div className={clsx("w-2.5 h-2.5 rounded-full", {
          "bg-blue": team.color === 'blue',
          "bg-red": team.color === 'red',
          "bg-[#353535]": isSpectator
        })}></div>
        <label>{isSpectator ? 'spectateur' : team.name}</label>
      </div>
      <div className="flex flex-row items-center gap-2">
        <Input readOnly className='rounded h-10' value={`${window.location.origin}/${link}`} onClick={handleInputClick} />
        <Link href={`/${link}`} target='_blank' passHref>
          <Button size="default" className="rounded">{isSpectator ? 'Rejoindre' : team.btnText}</Button>
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
  return (
    <AnimatePresence mode="wait">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1] }}
      >
        <div className="text-center border-b border-opacity-25 pb-4 mb-4">
          <h1 className="text-2xl font-bold">Chambre génèré!</h1>
          <p className="text-sm font-normal opacity-50">{"Rejoignez une chambre associé à votre équipe."}</p>
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
