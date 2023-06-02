export function generateArray(key: string, length: number) {
  return new Array(length).fill({ [key]: null });
}