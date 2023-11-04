'use client'

import supabase from "@/app/services/supabase";
import useEnsureContext from "@/app/hooks/useEnsureContext";
import SocketContext from "@/app/context/SocketContext";
import { Button } from "@/app/components/ui/button";
import { roomStore } from "@/app/stores/roomStore";
import useTeams from "@/app/hooks/useTeams";
import TeamStatus from "@/app/components/common/TeamStatus";

import { Inter } from "next/font/google";
const inter = Inter({
  subsets: ["latin-ext"],
  weight: "500"
})

const ReadyView = () => {
  const socket = useEnsureContext(SocketContext);

  const { room, error } = roomStore(state => ({
    room: state.room,
    error: state.error,
    isLoading: state.isLoading
  }));

  const { currentTeam, otherTeam, redTeam, blueTeam } = useTeams();

  if (!room || error) {
    return <div>Room not found</div>;
  }

  if(!currentTeam || !otherTeam || !redTeam || !blueTeam) return <div>Team not found</div>

  const handleReadyClick = async () => {
    const { data, error } = await supabase
      .from("teams")
      .update({ ready: true })
      .select("*, room(*)")
      .eq("id", currentTeam?.id)
      .single();

    if (data && !error) {
      socket.emit("TEAM_READY", { roomid: room.id, teamid: currentTeam?.id });
    }
  };

  return (
    <div className="flex flex-col items-center justify-center absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 overflow-y-hidden text-3xl">
      <div className="text-center mb-6">
        <h1 className="text-4xl font-bold mb-2">{`Salle d'attente`}</h1>
        <p className="text-base">{`Les joueurs attendent dans la salle jusqu'à ce que tout le monde soit prêt.`}</p>
        <div className="flex items-center mt-6 justify-center">
          <div className={`h-6 w-1 bg-${currentTeam.color} rounded-full`}></div>
          <p className={`${inter.className}  text-white text-base font-bold p-2 rounded-md`}>{`Vous êtes l'équipe ${currentTeam.name.toUpperCase()}`}</p>
          <div className={`h-6 w-1 bg-${currentTeam.color} rounded-full`}></div>

        </div>
      </div>
      <div className="border border-opacity-10 rounded-md w-full mb-12">
        <div className="grid grid-cols-2 text-base">
          <p className={`${inter.className} flex flex-col items-center gap-2 p-6 border-r`}>{blueTeam.name.toUpperCase()}<TeamStatus team={blueTeam} showReadyState={true} />
          </p>

          <p className={`${inter.className} flex flex-col items-center gap-2 p-6`}>{redTeam.name.toUpperCase()}<TeamStatus team={redTeam} showReadyState={true} />
          </p>
        </div>
      </div>
      {currentTeam.ready ? (
        <div>
          <span className="pr-0.5 text-base">{`En attende de ${otherTeam.name}`}</span>
          <div className="sending-animation">
            <span className="sending-animation-dot">.</span>
            <span className="sending-animation-dot">.</span>
            <span className="sending-animation-dot">.</span>
          </div>
        </div>
      ) : (
        <Button
        size="lg"
        className={`bg-yellow hover:bg-yellow-hover px-24 text-sm uppercase text-yellow-text rounded-sm font-bold mt-6`}
        onClick={handleReadyClick}
      >
        {"Nous sommes prêt"}
      </Button>
      )}
    </div>
  );
};

export default ReadyView;
