import supabase from "@/app/services/supabase";

interface Hero {
  name: string | null;
  selected: boolean;
}

export function generateArray(key: string, length: number) {
  return new Array(length).fill({ [key]: null, selected: false });
}

export function allNamesNotNull(array: Hero[]): boolean {
  return array.every(item => item.name !== null);
}

export async function purgeAllRooms() {
  await supabase.from('rooms').delete().gt('id', 0);

  return 'Purged all rooms!'
}