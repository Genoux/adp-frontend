
import { champions } from "@/app/utils/champions";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

import {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
  Config,
} from "unique-names-generator";

export const config = {
  runtime: "edge",
};

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL ?? "";
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ?? "";
const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const customConfig: Config = {
  dictionaries: [adjectives, colors, animals],
  separator: " ",
  style: "capital",
};

export async function randomChampions() {
  const shuffledChampions = champions.sort(() => Math.random() - 0.5);
  const randomChampions = shuffledChampions.slice(0, 30);

  return {
    list: randomChampions,
  };
}

function generateArray(key: string, length: number) {
  return new Array(length).fill({ [key]: null, selected: false });
}

async function createRoom(blueTeamName: string, redTeamName: string) {
  const champions = await randomChampions();
  const roomName: string = uniqueNamesGenerator(customConfig);

  try {
    // Step 1: Create room without team_ids
    let { data: room, error: roomError } = await supabase
      .from("rooms")
      .insert({ name: roomName })
      .select("id")
      .single();

    // Check for error
    if (roomError) {
      console.log("createRoom - error:", roomError);
      return;
    }

    const roomId = room.id;
    console.log("createRoom - room.id:", room.id);

    let { data: redTeam, error: redError } = await supabase
      .from("teams")
      .insert({
        color: "red",
        isTurn: false,
        heroes_selected: generateArray("name", 5),
        heroes_ban: generateArray("name", 3),
        name: redTeamName,
        room: roomId, // Use the room ID here
      })
      .select("*")
      .single();

    // Create blue team
    let { data: blueTeam, error: blueError } = await supabase
      .from("teams")
      .insert({
        color: "blue",
        isTurn: true,
        heroes_selected: generateArray("name", 5),
        heroes_ban: generateArray("name", 3),
        name: blueTeamName,
        room: roomId, // Use the room ID here
      })
      .select("*")
      .single();

    if (redError || blueError) {
      console.log("createRoom - error:", redError, blueError);
      return;
    }

    const teamRedId = redTeam.id;
    const teamBlueId = blueTeam.id;

    let { data: updatedRoom, error: updateError } = await supabase
      .from("rooms")
      .update({
        red: teamRedId,
        blue: teamBlueId,
        heroes_pool: champions.list,
        status: "waiting",
      })
      .eq("id", roomId)
      .select("*")
      .single();

    if (updateError) {
      console.log("updateRoom - error:", updateError);
      return;
    }

    return { room: updatedRoom, red: redTeam, blue: blueTeam };
  } catch (error) {
    console.log("createRoom - error:", error);
  }
}

async function generateRoom(blueTeamName: string, redTeamName: string) {
  const champions = await randomChampions();

  const teamRedId = Math.floor(Math.random() * 1000000);
  const teamBlueId = Math.floor(Math.random() * 1000000);
  const roomID = Math.floor(Math.random() * 1000000);
  const roomName: string = uniqueNamesGenerator(customConfig);

  try {
    const { redError } = await supabase.from("teams").insert({
      id: teamRedId,
      color: "red",
      isTurn: false,
      heroes_pool: champions.list,
      heroes_selected: generateArray("name", 5),
      name: redTeamName,
    });

    const { blueError } = await supabase.from("teams").insert({
      id: teamBlueId,
      color: "blue",
      isTurn: true,
      heroes_pool: champions.list,
      heroes_selected: generateArray("name", 5),
      name: blueTeamName,
    });

    const { room: newRoom, roomError } = await supabase.from("rooms").insert({
      id: roomID,
      name: roomName,
      blue: teamBlueId,
      red: teamRedId,
      heroes_pool: champions.list,
      status: "waiting",
    });

    await supabase
      .from("teams")
      .update({
        room: roomID,
      })
      .eq("id", teamRedId);

    await supabase
      .from("teams")
      .update({
        room: roomID,
      })
      .eq("id", teamBlueId);

    if (redError || blueError || roomError) {
      console.log("createRoom - error:", redError, blueError, roomError);
      return;
    }

    const { data: room, error } = await supabase
      .from("rooms")
      .select("id, name, blue(id, name), red(id, name)")
      .eq("id", roomID);
    if (error) {
      console.log("createRoom - error:", error);
      return;
    }

    return room;
  } catch (error) {
    console.log("createRoom - error:", error);
  }
}

export default async function MyEdgeFunction(request: NextRequest) {
  // get body from request
  const { blueTeamName, redTeamName } = await request.json();
  const value = await createRoom(blueTeamName, redTeamName);
  // const room = await generateRoom(blueTeamName, redTeamName);
  return NextResponse.json({ value });
}
