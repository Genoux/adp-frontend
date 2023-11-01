import supabase from "@/app/services/supabase";
import { champions } from "@/app/utils/champions";

async function resetTeamHeroSelection(roomId: string): Promise<void> {
  try {
    const { data: teams, error: teamsError } = await supabase
      .from("teams")
      .select("id")
      .eq("room", roomId);

    if (teamsError) throw teamsError;
    if (!teams || teams.length === 0) throw new Error(`No teams found for room ID ${roomId}`);

    const resetPromises = teams.map(async (team: { id: any; }) => {
      const heroes_selected = new Array(5).fill({ name: null, selected: false });
      const { error: updateError } = await supabase
        .from("teams")
        .update({ heroes_selected })
        .eq("id", team.id);

      if (updateError) throw updateError;
    });

    await Promise.all(resetPromises);

    console.log(`Hero selection reset for all teams in room ${roomId}`);
  } catch (error) {
    console.error('Error resetting team hero selection:', error);
  }
}



async function resetHeroPoolSelection(roomId: string): Promise<void> {
  try {
    const { data: room, error: roomError } = await supabase
      .from("rooms")
      .select("heroes_pool")
      .eq("id", roomId)
      .single();

    if (roomError) throw roomError;
    if (!room) throw new Error(`Room with ID ${roomId} not found`);

    const updatedHeroesPool = room.heroes_pool.map((hero: any) => ({ ...hero, selected: false }));

    const { error: updateHeroesError } = await supabase
      .from("rooms")
      .update({ heroes_pool: updatedHeroesPool })
      .eq("id", roomId);

    if (updateHeroesError) throw updateHeroesError;

    console.log(`Hero pool selection reset for room ${roomId}`);
  } catch (error) {
    console.error('Error resetting hero pool selection:', error);
  }
}

export async function setWaiting(roomid: string) {
  await supabase.from("rooms").update({ cycle: -1, status: "waiting" }).eq("id", roomid);
  await supabase.from("teams").update({ ready: false }).eq("room", roomid);
}

export async function setPlanning(roomid: string) {
  //await resetHeroPoolSelection(roomid);
  //await resetTeamHeroSelection(roomid);
  await supabase.from("rooms").update({ cycle: 0, status: "planning", ready: true }).eq("id", roomid);
  await supabase.from("teams").update({ ready: true }).eq("room", roomid);
}

export async function setBan(roomid: string) {
  await supabase.from("rooms").update({ cycle: 1, status: "ban" }).eq("id", roomid);
  await supabase.from("teams").update({ ready: true }).eq("room", roomid);
  await supabase.from("teams").update({ isturn: true }).eq("room", roomid).eq("color", "blue");
  await supabase.from("teams").update({ isturn: false }).eq("room", roomid).eq("color", "red");
}

export async function setSelect(roomid: string) {
  await supabase.from("rooms").update({ cycle: 2, status: "select" }).eq("id", roomid);
  await supabase.from("teams").update({ ready: true }).eq("room", roomid);
  await supabase.from("teams").update({ isturn: true }).eq("room", roomid).eq("color", "blue");
  await supabase.from("teams").update({ isturn: false }).eq("room", roomid).eq("color", "red");
}


export async function setFinish(roomid: string) {
  // Get 10 random champions using the function you provided
  // const randomSet = await randomChampions();
  // const anotherSet = await randomChampions();

  // const allChampions = [...randomSet.list, ...anotherSet.list].slice(0, 10);

  // // Split the 10 champions into two sets of 5
  // const blueChampions = allChampions.slice(0, 5);
  // const redChampions = allChampions.slice(5, 10);

  // // Modify the list to set selected to true
  // const blueChampionsToUpdate = blueChampions.map(champ => ({
  //   ...champ,
  //   selected: true
  // }));

  // const redChampionsToUpdate = redChampions.map(champ => ({
  //   ...champ,
  //   selected: true
  // }));

  // // Update the teams with the selected champions.
  // await supabase.from("teams").update({ heroes_selected: blueChampionsToUpdate }).eq("room", roomid).eq("color", "blue");
  // await supabase.from("teams").update({ heroes_selected: redChampionsToUpdate }).eq("room", roomid).eq("color", "red");

  // ... Rest of the function remains unchanged ...
  await supabase.from("rooms").update({ cycle: 17, status: "done" }).eq("id", roomid);
  await supabase.from("teams").update({ ready: true }).eq("room", roomid);
  await supabase.from("teams").update({ isturn: false }).eq("room", roomid).eq("color", "blue");
  await supabase.from("teams").update({ isturn: false }).eq("room", roomid).eq("color", "red");
}



export async function randomChampions() {
  const shuffledChampions = champions.sort(() => Math.random() - 0.5);
  const randomChampions = shuffledChampions.slice(0, 5);

  return {
    list: randomChampions,
  };
}