import { useState } from "react";
import { CopyIcon, CheckIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import copyToClipboard from "@/app/utils/copyToClipboard";
import Link from "next/link";
import { Button } from "@/app/components/ui/button";

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
  const [showTooltip, setShowTooltip] = useState(false);

  const handleCopyClick = () => {
    copyToClipboard(`/room/${roomId}/${team.id}`, `${team.id}`, setCopyLink);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000); // Reset after 2 seconds
  };


  return (
    <div className={`bg-${team.color}-500 ${team.borderColor} bg-opacity-5 hover:bg-opacity-10 border border-l-white border-b-white border-r-white border-opacity-10 rounded-sm flex flex-col items-center justify-between w-full p-12`}>
      <h1 className="text-4xl font-medium mb-4 uppercase">{team.name}</h1>
      <div className="flex flex-row justify-center items-center gap-2">
      <Link href={`/room/${roomId}/${team.id}`} target="_blank">
          <Button
            size="lg"
            className={`bg-yellow hover:bg-yellow-hover text-sm uppercase text-yellow-text rounded-sm font-bold`}
          >
            {team.btnText}
          </Button>
        </Link>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger>
              <div className="bg-transparent text-yellow hover:opacity-90 border-yellow border rounded-sm p-3" onMouseLeave={() => setCopied(false)} onClick={handleCopyClick}>
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
      </div>
    </div>
  );
};


export const RoomDisplay: React.FC<RoomDisplayProps> = ({ room, blueTeam, redTeam, copyLink, setCopyLink }) => (
  <AnimatePresence mode="wait">
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1], delay: 0.2 }}
      key="home-page"
    >
      <div className="flex flex-row w-full justify-center gap-6">
        <TeamDisplay team={blueTeam} roomId={room.id} copyLink={copyLink} setCopyLink={setCopyLink} />
        <TeamDisplay team={redTeam} roomId={room.id} copyLink={copyLink} setCopyLink={setCopyLink} />
      </div>
    </motion.div>
  </AnimatePresence>
);
