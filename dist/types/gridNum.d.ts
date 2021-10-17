declare const Gridnum: readonly [9, 13, 19];
export declare type GridNum = typeof Gridnum[number];
export declare function isGridNum(n: number): n is GridNum;
export {};
