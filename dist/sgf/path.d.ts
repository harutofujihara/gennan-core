export declare type TreePath = Array<number>;
export declare function toInitPathString(path: TreePath, isEnd?: boolean): string;
export declare function toFragmentString(path: TreePath): string;
export declare function parseInitialPath(initPos: string): TreePath;
export declare function parseFragment(pathStr: string): TreePath;
