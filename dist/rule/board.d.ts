import { Stone, GridNum, Move, Point, Color, PointState } from "../types";
declare type BoardState = Array<Array<PointState>>;
declare type props = {
    gridNum?: GridNum;
    fixedStones?: Array<Stone>;
    teban?: Color;
};
declare class Board {
    private _gridNum;
    private _boardState;
    private _fixedStones;
    private _kou?;
    private _phase;
    private _teban;
    private history;
    capturesCount: {
        [Color.Black]: number;
        [Color.White]: number;
    };
    constructor({ gridNum, fixedStones, teban, }: props);
    get boardState(): BoardState;
    get gridNum(): GridNum;
    get teban(): Color;
    get phase(): Number;
    private setFixedStones;
    getPointState(point: Point): PointState;
    /**
     * initialize rule board using gridNum
     *
     * @return void
     */
    private initBoardState;
    takeMove(move: Move): void;
    undoMove(): void;
    /**
     * (同じ色の)繋がっている石の地点の配列を取得する
     * @param point
     */
    private static getConnectedStones;
    private isSuicide;
    /**
     * 地点に石があり、かつその石が単体でが敵石に囲まれているかどうかを判定
     * @param point
     * @param boardState
     */
    private static isSurroundedByEnemy;
    /**
     * 地点に石があり、かつその石を含むグループが敵石に囲まれているかどうかを判定
     * @param point
     * @param boardState
     */
    private static isGroupSurroundedByEnemy;
}
export { Board };
