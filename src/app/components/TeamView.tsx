import { useState, useEffect, useCallback, useContext } from "react";
import supabase from "@/app/services/supabase";
import Image from "next/image";
import clsx from "clsx";
import useFetchTeam from "@/app/hooks/useFetchTeam";
import { roomStore } from "@/app/stores/roomStore";
import SocketContext from "../context/SocketContext";
import { Button } from "@/app/components/ui/button";
import Timer from "@/app/components/Timer";

interface TeamViewProps {
  teamid: string;
  roomid: string;
}

const TeamView: React.FC<TeamViewProps> = ({ teamid, roomid }) => {
  const { rooms } = roomStore();
  const room = rooms[roomid];
  const [selectedChampion, setSelectedChampion] = useState<string>("");
  const [canSelect, setCanSelect] = useState(true);
  const [hoverIndex, setHoverIndex] = useState(-1);
  const [clickedHero, setClickedHero] = useState<string | null>(null);

  const socket = useContext(SocketContext);
  const { data: team } = useFetchTeam(teamid);

  function getOppositeColor(color: string) {
    if (color.toLowerCase() === "red") {
      return "blue";
    } else if (color.toLowerCase() === "blue") {
      return "red";
    } else {
      return "Unknown color"; // or you may throw an error here
    }
  }

  const handleSocketEvents = useCallback((event: string, msg: any) => {
    setCanSelect(event !== "TIMER" || msg !== "00:00");
    if (event === "CHAMPION_SELECTED") {
      setSelectedChampion("");
      setClickedHero(null);
    }
  }, []);

  useEffect(() => {
    const events = ["TIMER", "CHAMPION_SELECTED", "TIMER_RESET"];

    events.forEach((event) => {
      socket?.on(event, (msg: any) => handleSocketEvents(event, msg));
    });

    return () => {
      events.forEach((event) => {
        socket?.off(event, handleSocketEvents);
      });
    };
  }, [socket, handleSocketEvents]);

  const handleConfirmSelection = async () => {
    setCanSelect(false);

    socket?.emit("STOP_TIMER", { roomid: roomid });
    const champion = selectedChampion;
    let updated_heroes_pool = team?.heroes_pool.map((hero: any) =>
      hero.name === champion ? { ...hero, selected: true } : hero
    );
    await supabase
      .from("teams")
      .update({ heroes_pool: updated_heroes_pool, pick: true })
      .eq("id", teamid);

    socket?.emit("SELECT_CHAMPION", {
      roomid: roomid,
      selectedChampion: champion,
    });
    setSelectedChampion("");
    setClickedHero(null);
  };

  const handleClickedHero = async (hero: any) => {
    setClickedHero(hero.name);
    await supabase
      .from("teams")
      .update({ clicked_hero: hero.name })
      .eq("id", teamid);
  };

  const getImageSrc = (hero: any, isSplash: boolean) => {
    const heroName = hero.name.replace(/\s/g, "").toLowerCase();
    return `/images/champions/${isSplash ? "splash" : "tiles"}/${heroName}.jpg`;
  };

  useEffect(() => {
    if (team) {
      setClickedHero(team.clicked_hero);
      setSelectedChampion(team.clicked_hero);
    }
  }, [team]);

  if (!team) return null;

  return (
    <>
      <div className="flex mb-6 gap-6">
        <div
          className={` z-0 top-0 h-6 w-1/2 left-0 bg-blue-500 ${
            team.isTurn
              ? team.color === "blue"
                ? "opacity-100"
                : "opacity-25"
              : team.color === "red"
              ? "opacity-100"
              : "opacity-25"
          }`}></div>
        <div
          className={` top-0 h-6 w-1/2 right-0 bg-red-500 ${
            team.isTurn
              ? team.color === "red"
                ? "opacity-100"
                : "opacity-25"
              : team.color === "blue"
              ? "opacity-100"
              : "opacity-25"
          }`}></div>
      </div>
      <Timer roomid={roomid} teamid={teamid} />
      <div className="flex flex-col">
        <div className="grid grid-cols-6 lg:grid-cols-12 gap-3 cursor-pointer">
          {team.heroes_pool.map((hero: any, index: number) => (
            <div
              key={index}
              className={clsx("", {
                "bg-gray-800": hero.name === selectedChampion,
                "opacity-40 pointer-events-none": hero.selected || !team.isTurn,
                "border-2 z-50 border-white hero-selected":
                  hero.name === clickedHero,
              })}
              onClick={() => {
                // Add an additional condition to check if hero is not selected
                if (canSelect && !hero.selected) {
                  handleClickedHero(hero);
                  setSelectedChampion(hero.name);
                  //setClickedHero(hero.name);
                }
              }}>
              <div
                key={index}
                onMouseEnter={() => {
                  // Add an additional condition to check if hero is not selected
                  if (!hero.selected) {
                    setHoverIndex(index);
                  }
                }}
                onMouseLeave={() => {
                  // Add an additional condition to check if hero is not selected
                  if (!hero.selected) {
                    setHoverIndex(-1);
                  }
                }}
                className="relative overflow-hidden">
                <Image
                  src={`/images/champions/tiles/${hero.name
                    .replace(/\s/g, "")
                    .toLowerCase()}.jpg`}
                  alt={hero.name}
                  sizes="100vw"
                  width={0}
                  height={0}
                  style={{ width: "100%", height: "auto" }}
                  className="mx-auto"
                />

                <div className="flex items-center justify-center my-auto overflow-hidden">
                  <p
                    className={`font-bold text-sm hero-name text-white absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 ${
                      hoverIndex === index || hero.name === selectedChampion
                        ? "z-50 animated-text-hover animated-text-visible"
                        : "z-10 animated-text"
                    }`}>
                    {hero.name}
                  </p>
                  <div
                    className={`${
                      hoverIndex === index || hero.name === selectedChampion
                        ? "bg-gradient-to-t absolute z-10 from-black to-transparent bg-clip-content w-full h-full top-0 left-0"
                        : ""
                    }`}></div>
                  <Image
                    src={getImageSrc(hero, true)}
                    alt={hero.name}
                    width={800}
                    height={800}
                    className={`mx-auto rounded splash-image ${
                      hoverIndex === index || hero.name === selectedChampion
                        ? "splash-image-hover"
                        : ""
                    }`}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="py-10">
        {team.isTurn ? (
          <Button
            size="lg"
            className={clsx("py-2 px-4", {
              "pointer-events-none": !selectedChampion || !canSelect,
            })}
            onClick={handleConfirmSelection}
            disabled={!selectedChampion || !canSelect}>
            Confirm Selection
          </Button>
        ) : (
          <Button
            variant="ghost"
            size="lg"
            className={clsx({
              "pointer-events-none":
                !selectedChampion || !canSelect || !team.isTurn,
            })}>
            <p className="pr-0.5 text-xl">{`It's ${getOppositeColor(
              team.color
            )} team to pick`}</p>
            <div className="sending-animation">
              <span className="sending-animation-dot">.</span>
              <span className="sending-animation-dot">.</span>
              <span className="sending-animation-dot">.</span>
            </div>
          </Button>
        )}
      </div>
    </>
  );
};

export default TeamView;
