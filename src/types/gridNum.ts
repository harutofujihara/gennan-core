const Gridnum = [9, 13, 19] as const;
export type GridNum = typeof Gridnum[number];
export function isGridNum(n: number): n is GridNum {
  return Gridnum.indexOf(n as any) !== -1;
}
