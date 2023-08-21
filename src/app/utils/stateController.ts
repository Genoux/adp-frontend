import supabase from "@/app/services/supabase";
import { champions } from "@/app/utils/champions";

export async function setWaiting(roomid: string) {
  await supabase.from("rooms").update({ cycle: -1, status: "waiting" }).eq("id", roomid);
  await supabase.from("teams").update({ ready: false }).eq("room", roomid);
}

export async function setPlanning(roomid: string) {
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
  const randomSet = await randomChampions();
  const anotherSet = await randomChampions();
  
  const allChampions = [...randomSet.list, ...anotherSet.list].slice(0, 10);

  // Split the 10 champions into two sets of 5
  const blueChampions = allChampions.slice(0, 5);
  const redChampions = allChampions.slice(5, 10);

  // Modify the list to set selected to true
  const blueChampionsToUpdate = blueChampions.map(champ => ({
    ...champ,
    selected: true
  }));

  const redChampionsToUpdate = redChampions.map(champ => ({
    ...champ,
    selected: true
  }));

  // Update the teams with the selected champions.
  await supabase.from("teams").update({ heroes_selected: blueChampionsToUpdate }).eq("room", roomid).eq("color", "blue");
  await supabase.from("teams").update({ heroes_selected: redChampionsToUpdate }).eq("room", roomid).eq("color", "red");

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