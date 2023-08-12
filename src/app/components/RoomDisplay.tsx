import { CopyIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import copyToClipboard from "@/app/utils/copyToClipboard"
import Link from "next/link";
import { Button } from "@/app/components/ui/button";
import LoadingCircle from "@/app/components/common/LoadingCircle";
import { Database } from "@/app/types/supabase";

interface Room {
  id: number;
  name: string;
  blue: { id: number; name: string };
  red: { id: number; name: string };
  status: string;
  [key: string]: any;
}

interface BlueTeam {
  id: number;
  name: string;
}

interface RedTeam {
  id: number;
  name: string;
}

interface RoomDisplayProps {
  room: Room;
  blueTeam: BlueTeam;
  redTeam: RedTeam;
  copyLink: { [key: string]: boolean };
  setCopyLink: React.Dispatch<React.SetStateAction<{ [key: string]: boolean }>>;
}

export const RoomDisplay: React.FC<RoomDisplayProps> = ({ room, blueTeam, redTeam, copyLink, setCopyLink }) => {
  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="relative"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{
          duration: 0.5,
          ease: [0.4, 0.0, 0.2, 1],
          delay: 0.2,
        }}
        key="home-page"
      >
        <div className="flex flex-row gap-6">
          {/* Blue Team */}
          <div className="border border-blue-700 bg-blue-700 bg-opacity-10 p-4 flex flex-col items-center">
            <h1 className="text-4xl font-medium mb-4 uppercase">
              {blueTeam.name}
            </h1>
            <div className="flex flex-row justify-center items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      onClick={() => {
                        copyToClipboard(`/room/${room.id}/${blueTeam.id}`, `${blueTeam.id}`, setCopyLink)
                      }}
                    >
                      {copyLink[`${blueTeam.id}`] ? (
                        <LoadingCircle variant="black" size="w-4 h-4" />
                      ) : (
                        <CopyIcon className="w-4 h-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy URL</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Link
                href={`/room/${room.id}/${blueTeam.id}`}
                target="_blank"
              >
                <Button>Rejoindre Bleue</Button>
              </Link>
            </div>
          </div>
          
          {/* Red Team */}
          <div className="border border-red-700 bg-red-700 bg-opacity-10 p-4 flex flex-col items-center">
            <h1 className="text-4xl font-medium mb-4 uppercase">
              {redTeam.name}
            </h1>
            <div className="flex flex-row justify-center items-center gap-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger>
                    <Button
                      onClick={() => {
                        copyToClipboard(`/room/${room.id}/${redTeam.id}`, `${redTeam.id}`, setCopyLink)
                      }}
                    >
                      {copyLink[`${redTeam.id}`] ? (
                        <LoadingCircle variant="black" size="w-4 h-4" />
                      ) : (
                        <CopyIcon className="w-4 h-4" />
                      )}
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Copy URL</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <Link
                href={`/room/${room.id}/${redTeam.id}`}
                target="_blank"
              >
                <Button>Rejoindre Rouge</Button>
              </Link>
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
