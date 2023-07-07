"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { Input } from "@/app/components/ui/input";
import { Button } from "@/app/components/ui/button";
import LoadingCircle from "@/app/components/LoadingCircle";
import { SunIcon, CopyIcon } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";

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

function Home() {
  const [room, setRoom] = useState<Room | null>(null);
  const [redTeam, setRedTeam] = useState<RedTeam | null>(null);
  const [blueTeam, setBlueTeam] = useState<BlueTeam | null>(null);
  const [copyLink, setCopyLink] = useState<{ [key: string]: boolean }>({});

  const [formData, setFormData] = useState({
    blueTeamName: "",
    redTeamName: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event: { target: { name: any; value: any } }) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const createRoom = async (event: { preventDefault: () => void }) => {
    event.preventDefault();

    // Check if any of the input fields are empty
    if (!formData.blueTeamName || !formData.redTeamName) {
      alert("Please fill in all the fields.");
      return; // Stop form submission
    }

    setLoading(true);

    const response1 = await fetch(`/api/generateroom/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(formData),
    });

    const data = await response1.json();

    setRoom(data.value.room); // Update the room state with the fetched room ID
    setBlueTeam(data.value.blue);
    setRedTeam(data.value.red);

    setLoading(false);
  };

  const handleCopyLink = (link: string, teamId: string) => {
    const copy = window.location.href + link;

    setCopyLink((prevState) => ({ ...prevState, [teamId]: true }));

    navigator.clipboard
      .writeText(copy)
      .then(() => {
        setCopyLink((prevState) => ({ ...prevState, [teamId]: false }));
      })
      .catch((err) => {
        console.error("Could not copy text: ", err);
        setCopyLink((prevState) => ({ ...prevState, [teamId]: false }));
      });
  };

  if (loading)
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-24">
        <LoadingCircle />
      </div>
    );

  return (
    <main className="flex h-screen flex-col items-center justify-center">
      {room && blueTeam && redTeam ? (
        <AnimatePresence mode="wait">
          <motion.div
            className="relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, ease: [0.4, 0.0, 0.2, 1], delay: 0.2 }}
            key="home-page" // Add a unique key prop
          >
            <div className="flex flex-row gap-6">
              <div className="border border-blue-700 bg-blue-700 bg-opacity-10 p-4 flex flex-col items-center">
                <h1 className="text-4xl font-medium mb-4 uppercase">{blueTeam.name}</h1>
                <div className="flex flex-row justify-center items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          onClick={() =>
                            handleCopyLink(
                              `/room/${room.id}/${blueTeam.id}`,
                              `${blueTeam.id}`
                            )
                          }>
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
                    target="_blank">
                    <Button>Rejoindre Bleue</Button>
                  </Link>
                </div>
              </div>
              <div className="border border-red-700 bg-red-700 bg-opacity-10 p-4 flex flex-col items-center">
                <h1 className="text-4xl font-medium mb-4 uppercase">{redTeam.name}</h1>
                <div className="flex flex-row justify-center items-center gap-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger>
                        <Button
                          onClick={() =>
                            handleCopyLink(
                              `/room/${room.id}/${redTeam.id}`,
                              `${redTeam.id}`
                            )
                          }>
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
                  <Link href={`/room/${room.id}/${redTeam.id}`} target="_blank">
                    <Button>Rejoindre Rouge</Button>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <>
          <div className="flex flex-col gap-6">
            <div>
              <label htmlFor="blueTeamName">Blue team name:</label>
              <Input
                type="text"
                name="blueTeamName"
                className="bg-blue-600 bg-opacity-10 mt-2"
                onChange={handleInputChange}
                value={formData.blueTeamName}
              />
            </div>
            <div>
              <label htmlFor="redTeamName">Red team name:</label>
              <Input
                type="text"
                name="redTeamName"
                className="bg-red-600 bg-opacity-10 mt-2"
                value={formData.redTeamName}
                onChange={handleInputChange}
              />
            </div>
            <Button
              variant={"outline"}
              onClick={createRoom}
              disabled={!formData.blueTeamName || !formData.redTeamName}
              className={`mt-6 ${
                !formData.blueTeamName || !formData.redTeamName
                  ? "opacity-10"
                  : ""
              }`}>
              Create room
            </Button>
          </div>
        </>
      )}
    </main>
  );
}

export default Home;
