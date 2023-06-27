  const champions = [
    { name: "Aatrox", selected: false },
    { name: "Ahri", selected: false },
    { name: "Akali", selected: false },
    { name: "Alistar", selected: false },
    { name: "Amumu", selected: false },
    { name: "Anivia", selected: false },
    { name: "Annie", selected: false },
    { name: "Aphelios", selected: false },
    { name: "Ashe", selected: false },
    { name: "Aurelion Sol", selected: false },
    { name: "Azir", selected: false },
    { name: "Bard", selected: false },
    { name: "Blitzcrank", selected: false },
    { name: "Brand", selected: false },
    { name: "Braum", selected: false },
    { name: "Caitlyn", selected: false },
    { name: "Camille", selected: false },
    { name: "Cassiopeia", selected: false },
    { name: "Cho'Gath", selected: false },
    { name: "Corki", selected: false },
    { name: "Darius", selected: false },
    { name: "Diana", selected: false },
    { name: "Dr. Mundo", selected: false },
    { name: "Draven", selected: false },
    { name: "Ekko", selected: false },
    { name: "Elise", selected: false },
    { name: "Evelynn", selected: false },
    { name: "Ezreal", selected: false },
    { name: "Fiddlesticks", selected: false },
    { name: "Fiora", selected: false },
    { name: "Fizz", selected: false },
    { name: "Galio", selected: false },
    { name: "Gangplank", selected: false },
    { name: "Garen", selected: false },
    { name: "Gnar", selected: false },
    { name: "Gragas", selected: false },
    { name: "Graves", selected: false },
    { name: "Gwen", selected: false },
    { name: "Hecarim", selected: false },
    { name: "Heimerdinger", selected: false },
    { name: "Illaoi", selected: false },
    { name: "Irelia", selected: false },
    { name: "Ivern", selected: false },
    { name: "Janna", selected: false },
    { name: "Jarvan IV", selected: false },
    { name: "Jax", selected: false },
    { name: "Jayce", selected: false },
    { name: "Jhin", selected: false },
    { name: "Jinx", selected: false },
    { name: "Kai'Sa", selected: false },
    { name: "Kalista", selected: false },
    { name: "Karma", selected: false },
    { name: "Karthus", selected: false },
    { name: "Kassadin", selected: false },
    { name: "Katarina", selected: false },
    { name: "Kayle", selected: false },
    { name: "Kayn", selected: false },
    { name: "Kennen", selected: false },
    { name: "Kha'Zix", selected: false },
    { name: "Kindred", selected: false },
    { name: "Kled", selected: false },
    { name: "Kog'Maw", selected: false },
    { name: "LeBlanc", selected: false },
    { name: "Lee Sin", selected: false },
    { name: "Leona", selected: false },
    { name: "Lillia", selected: false },
    { name: "Lissandra", selected: false },
    { name: "Lucian", selected: false },
    { name: "Lulu", selected: false },
    { name: "Lux", selected: false },
    { name: "Malphite", selected: false },
    { name: "Malzahar", selected: false },
    { name: "Maokai", selected: false },
    { name: "Master Yi", selected: false },
    { name: "Miss Fortune", selected: false },
    { name: "Mordekaiser", selected: false },
    { name: "Morgana", selected: false },
    { name: "Nami", selected: false },
    { name: "Nasus", selected: false },
    { name: "Nautilus", selected: false },
    { name: "Neeko", selected: false },
    { name: "Nidalee", selected: false },
    { name: "Nocturne", selected: false },
    { name: "Nunu & Willump", selected: false },
    { name: "Olaf", selected: false },
    { name: "Orianna", selected: false },
    { name: "Ornn", selected: false },
    { name: "Pantheon", selected: false },
    { name: "Poppy", selected: false },
    { name: "Pyke", selected: false },
    { name: "Qiyana", selected: false },
    { name: "Quinn", selected: false },
    { name: "Rakan", selected: false },
    { name: "Rammus", selected: false },
    { name: "Rek'Sai", selected: false },
    { name: "Rell", selected: false },
    { name: "Renekton", selected: false },
    { name: "Rengar", selected: false },
    { name: "Riven", selected: false },
    { name: "Rumble", selected: false },
    { name: "Ryze", selected: false },
    { name: "Samira", selected: false },
    { name: "Sejuani", selected: false },
    { name: "Senna", selected: false },
    { name: "Seraphine", selected: false },
    { name: "Sett", selected: false },
    { name: "Shaco", selected: false },
    { name: "Shen", selected: false },
    { name: "Shyvana", selected: false },
    { name: "Singed", selected: false },
    { name: "Sion", selected: false },
    { name: "Sivir", selected: false },
    { name: "Skarner", selected: false },
    { name: "Sona", selected: false },
    { name: "Soraka", selected: false },
    { name: "Swain", selected: false },
    { name: "Sylas", selected: false },
    { name: "Syndra", selected: false },
    { name: "Tahm Kench", selected: false },
    { name: "Taliyah", selected: false },
    { name: "Talon", selected: false },
    { name: "Taric", selected: false },
    { name: "Teemo", selected: false },
    { name: "Thresh", selected: false },
    { name: "Tristana", selected: false },
    { name: "Trundle", selected: false },
    { name: "Tryndamere", selected: false },
    { name: "Twisted Fate", selected: false },
    { name: "Twitch", selected: false },
    { name: "Udyr", selected: false },
    { name: "Urgot", selected: false },
    { name: "Varus", selected: false },
    { name: "Vayne", selected: false },
    { name: "Veigar", selected: false },
    { name: "Vel'Koz", selected: false },
    { name: "Vi", selected: false },
    { name: "Viego", selected: false },
    { name: "Viktor", selected: false },
    { name: "Vladimir", selected: false },
    { name: "Volibear", selected: false },
    { name: "Warwick", selected: false },
    { name: "MonkeyKing", selected: false },
    { name: "Xayah", selected: false },
    { name: "Xerath", selected: false },
    { name: "Xin Zhao", selected: false },
    { name: "Yasuo", selected: false },
    { name: "Yone", selected: false },
    { name: "Yorick", selected: false },
    { name: "Yuumi", selected: false },
    { name: "Zac", selected: false },
    { name: "Zed", selected: false },
    { name: "Ziggs", selected: false },
    { name: "Zilean", selected: false },
    { name: "Zoe", selected: false },
    { name: "Zyra", selected: false },
  ];

  import { createClient } from "@supabase/supabase-js";
  import { NextResponse } from "next/server";
  import type { NextRequest } from "next/server";
  import { generateArray } from "@/app/utils/helpers";
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
          heroes_pool: champions.list,
          heroes_selected: generateArray("name", 5),
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
          heroes_pool: champions.list,
          heroes_selected: generateArray("name", 5),
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
