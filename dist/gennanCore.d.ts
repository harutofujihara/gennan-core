import { Color, GridNum, Move, Point, Stone, MarkupSymbol } from "./types";
import { TreePath } from "./sgf";
export declare type MoveOption = {
    idx: number;
    move: Move;
};
export declare type ViewPointState = {
    color?: Color;
    circle: boolean;
    square: boolean;
    triangle: boolean;
    cross: boolean;
    text?: string;
    current: boolean;
    star: boolean;
    nextIndex?: number;
};
export declare type ViewBoard = Array<Array<ViewPointState>>;
declare class GennanCore {
    private tree;
    private board;
    private constructor();
    /**
     * Factory
     * @param gridNum
     */
    static create(gridNum?: GridNum): GennanCore;
    /**
     * Factory
     * @param sgf
     */
    static createFromSgf(sgf: string): GennanCore;
    /**
     * BoardState for View
     */
    get viewBoard(): ViewBoard;
    get sgf(): string;
    get snapshotSgf(): string;
    get currentPath(): TreePath;
    get nextMoveOptions(): Array<MoveOption>;
    get gridNum(): GridNum;
    get teban(): Color;
    get phase(): Number;
    get fixedStones(): Array<Stone>;
    get gameName(): string | undefined;
    setGameName(gameName: string): void;
    get blackPlayer(): string | undefined;
    setBlackPlayer(blackPlayer: string): void;
    get whitePlayer(): string | undefined;
    setWhitePlayer(whitePlayer: string): void;
    get komi(): string | undefined;
    setKomi(komi: string): void;
    get gameDate(): string | undefined;
    setGameDate(date: string): void;
    get gameResult(): string | undefined;
    setGameResult(result: string): void;
    get comment(): string | undefined;
    setComment(comment: string): void;
    private initBoard;
    get existsNextMove(): boolean;
    get existsBackMove(): boolean;
    clone(): GennanCore;
    playForward(idx?: number): void;
    playForwardTimes(times?: number, stopOnComment?: boolean): void;
    playBackward(): void;
    playBackwardTimes(times?: number, stopOnComment?: boolean): void;
    setFromInitPath(initPath: TreePath): void;
    setFromFragment(path: TreePath): void;
    addMove(move: Move): void;
    removeMove(): void;
    private setProp;
    private removeProp;
    private setRootProp;
    private removeRootProp;
    setSymbol(point: Point, symbol: MarkupSymbol): void;
    removeSymbol(point: Point, symbol: MarkupSymbol): void;
    setText(point: Point, text: string): void;
    removeText(point: Point): void;
    setAlpha(point: Point): void;
    setIncrement(point: Point): void;
    /**
     * 置石をセットする
     * @param stone
     */
    addFixedStone(stone: Stone): void;
    removeFixedStone(stone: Stone): void;
}
export { GennanCore };
