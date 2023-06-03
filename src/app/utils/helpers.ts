interface Hero {
  name: string | null;
  selected: boolean;
}

export function generateArray(key: string, length: number) {
  return new Array(length).fill({ [key]: null });
}


export function allNamesNotNull(array: Hero[]): boolean {
  return array.every(item => item.name !== null);
}
