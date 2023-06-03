"use client";

import { useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import supabase from "@/app/services/supabase";
import RoomInfo from "@/app/components/RoomInfo";
import TeamView from "@/app/components/TeamView";
import useSocket from "@/app/hooks/useSocket";
import { allNamesNotNull } from "@/app/utils/helpers";

export default function Room({
  params,
}: {
  params: { roomid: string; teamid: string };
}) {
  const roomid = params.roomid;
  const teamid = params.teamid;
  const [roomNotFound, setRoomNotFound] = useState(false);
  const [loading, setLoading] = useState(true);
  const [selectedChampion, setSelectedChampion] = useState<string>("");

  const socket = useSocket(roomid, teamid);

  const findRoom = useCallback(async () => {
    
    const { data: room, error } = await supabase
      .from("rooms")
      .select('id')
      .eq("id", roomid)
      .single();
  
    if (error || !room) {
      console.error("Error fetching data:", error);
      setRoomNotFound(true);
    } else {
      setLoading(false);
    }
  }, [roomid]);

  useEffect(() => {
    if (socket) {
      socket.on("welcome", (arg: any) => {
        console.log("Server says:", arg);
      });
    }
    findRoom();
  }, [findRoom, roomid, socket]);

  const handleConfirmSelection = async () => {
    if (!selectedChampion) return;
    const { data: team } = await supabase
      .from("teams")
      .select("id, heroes_pool, number_of_pick, heroes_selected")
      .eq("room", roomid)
      .eq("isTurn", true)
      .single();

    if (!team) return;

    const { heroes_pool, heroes_selected } = team;

    if (allNamesNotNull(heroes_selected)) {
      throw new Error("All heroes are selected");
    }

    let hero;
    if (selectedChampion) {
      hero = heroes_pool.find((hero: any) => hero.name === selectedChampion);
    } else {
      const unselectedHeroes = heroes_pool.filter(
        (hero: any) => !hero.selected
      );
      if (unselectedHeroes.length === 0)
        throw new Error("No unselected heroes left");
      hero =
        unselectedHeroes[Math.floor(Math.random() * unselectedHeroes.length)];
    }

    hero.selected = true;

    const nullSlotIndex = heroes_selected.findIndex(
      (hero: any) => hero.name === null
    );
    if (nullSlotIndex !== -1) {
      heroes_selected[nullSlotIndex] = hero;
    }

    const updatedHeroesPool = heroes_pool.map((hero: any) =>
      hero.name === selectedChampion ? { ...hero, selected: true } : hero
    );

    await Promise.all([
      supabase.from("teams").update({ heroes_selected }).eq("id", team.id),
      supabase
        .from("teams")
        .update({ heroes_pool: updatedHeroesPool })
        .eq("room", roomid),
      supabase.from("teams").update({ selected_hero: null }).eq("id", team.id),
      supabase
        .from("teams")
        .update({ number_of_pick: team.number_of_pick - 1 })
        .eq("id", team.id),
    ]);

    setSelectedChampion("");
  };

  if (loading) {
    return <p className="font-bold">Loading room...</p>;
  }

  return (
    <div>
      {!roomNotFound && (
        <>
          <RoomInfo roomid={roomid} />
          <TeamView
            teamid={teamid}
            handleConfirmSelection={handleConfirmSelection}
            setSelectedChampion={setSelectedChampion}
            selectedChampion={selectedChampion}
          />
        </>
      )}
    </div>
  );
}
