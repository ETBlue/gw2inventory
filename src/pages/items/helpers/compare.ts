const RARITY_MAP: { [key: string]: number } = {
  Junk: 0,
  Basic: 1,
  Fine: 2,
  Masterwork: 3,
  Rare: 4,
  Exotic: 5,
  Ascended: 6,
  Legendary: 7,
}
export const compareRarity = (_a: string, _b: string): number => {
  const a = RARITY_MAP[_a]
  const b = RARITY_MAP[_b]
  return compare(a, b)
}
export const compare = (a: string | number, b: string | number): number => {
  if (a > b) return 1
  if (a < b) return -1
  return 0
}
