// api.ts
import supabase from "@/app/services/supabase";

export async function getTeam(teamid: string) {
  const { data: teamData, error } = await supabase
    .from("teams")
    .select("*")
    .eq("id", teamid)
    .single();

  if (error) throw error;
  
  return teamData;
}

export async function getRoom(roomid: string) {
  const { data: roomData, error } = await supabase
    .from("rooms")
    .select('*, red("*"), blue("*")')
    .eq("id", roomid)
    .single();

  if (error) throw error;

  return roomData;
}
