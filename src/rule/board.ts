import {
  Stone,
  GridNum,
  Move,
  Point,
  leftP,
  upperP,
  rightP,
  lowerP,
  Color,
  oppositeColor,
  PointState,
} from "../types";
import { copyMatrix } from "../utils";

type BoardState = Array<Array<PointState>>;

type props = {
  gridNum?: GridNum;
  fixedStones?: Array<Stone>;
  teban?: Color;
};

class Board {
  gridNum: GridNum;
  private _boardState: BoardState = [[]];
  fixedStones: Array<Stone> = [];
  kou?: Point;
  phase = 0;
  teban: Color;
  private history: Array<{
    move: Move;
    capturedStones: Array<Stone>;
    kou?: Point;
  }> = [];
  capturesCount: {
    [Color.Black]: number;
    [Color.White]: number;
  } = {
    [Color.Black]: 0,
    [Color.White]: 0,
  };

  public constructor({
    gridNum = 19,
    fixedStones = [],
    teban = Color.Black,
  }: props) {
    this.gridNum = gridNum;
    this.initBoardState();
    this.setFixedStones(fixedStones);
    this.teban = teban;
  }

  get boardState(): BoardState {
    return this._boardState;
  }

  private setFixedStones(fixedStones: Array<Stone>): void {
    this.fixedStones = fixedStones;
    fixedStones.map((s) => (this._boardState[s.point.x][s.point.y] = s.color));
  }

  public getPointState(point: Point): PointState {
    // clone
    return PointState[this._boardState[point.x][point.y]];
  }

  /**
   * initialize rule board using gridNum
   *
   * @return void
   */
  private initBoardState(): void {
    const board: BoardState = [];
    for (let i = 0; i < this.gridNum + 2; i++) {
      const line: Array<PointState> = [];
      if (i === 0 || i === this.gridNum + 1) {
        for (let y = 0; y < this.gridNum + 2; y++) {
          line[y] = PointState.Edge;
        }
      } else {
        for (let y = 0; y < this.gridNum + 2; y++) {
          if (y === 0 || y === this.gridNum + 1) {
            line[y] = PointState.Edge;
          } else {
            line[y] = PointState.Empty;
          }
        }
      }

      board[i] = line;
    }

    this._boardState = board;
  }

  public takeMove(move: Move): void {
    if (this.teban !== move.color) throw new Error("Teban color is invalid.");
    const prevKou = this.kou;
    const capturedStones: Array<Stone> = [];
    // パスでない場合
    if (move.point != null) {
      // Validation
      // nonempty is illegal
      if (this._boardState[move.point.x][move.point.y] !== PointState.Empty) {
        throw new Error("The point is not empty.");
      }
      // check kou
      if (
        this.kou != null &&
        this.kou.x === move.point.x &&
        this.kou.y === move.point.y
      ) {
        throw new Error("The point is kou.");
      }
      // suicide is illegal
      if (this.isSuicide(move.color, move.point)) {
        throw new Error("The point is suicide.");
      }

      // 仮に石を先に置く
      const clonedBoardState: BoardState = copyMatrix(this._boardState);
      clonedBoardState[move.point.x][move.point.y] = move.color;

      // 石を取れるかの確認
      const oppoColor = oppositeColor(move.color);
      const capture = (p: Point): void => {
        if (
          clonedBoardState[p.x][p.y] === oppoColor &&
          Board.isSurroundedByEnemy(p, clonedBoardState)
        ) {
          // 石が取れたら重複を排除しつつ追加する
          Board.getConnectedStones(p, clonedBoardState).map((s) => {
            if (
              capturedStones.findIndex(
                (cs) => s.point.x === cs.point.x && s.point.y === cs.point.y
              ) === -1
            ) {
              capturedStones.push(s);
            }
          });
        }
      };
      // 上下左右をチェック
      capture(leftP(move.point));
      capture(upperP(move.point));
      capture(rightP(move.point));
      capture(lowerP(move.point));

      // コウを記録
      this.kou = undefined;
      if (
        capturedStones.length === 1 &&
        Board.isSurroundedByEnemy(move.point, clonedBoardState)
      ) {
        this.kou = capturedStones[0].point;
      }

      // 取られた地点を空にする
      capturedStones.map((cs) => {
        clonedBoardState[cs.point.x][cs.point.y] = PointState.Empty;
      });
      // 取られた石数を加算
      this.capturesCount[oppoColor] += capturedStones.length;

      // 状態を反映
      this._boardState = clonedBoardState;
    }

    // History
    this.history.push({
      move,
      capturedStones,
      kou: prevKou,
    });
    this.phase += 1; // 手数を進める
    this.teban = oppositeColor(move.color); // 手番を変える
  }

  public undoMove(): void {
    const history = this.history.pop();
    if (history == null) return;

    // 打った石を取り除く
    if (history.move.point != null) {
      this._boardState[history.move.point.x][history.move.point.y] =
        PointState.Empty;
    }
    // 取られた石を戻す
    history.capturedStones.map((s) => {
      this._boardState[s.point.x][s.point.y] = s.color;
    });
    this.capturesCount[oppositeColor(history.move.color)] -=
      history.capturedStones.length; // 取られた石数を戻す
    this.kou = history.kou; // コウをセット
    this.phase -= 1; // 手数を戻す
    this.teban = history.move.color; // 手番を戻す
  }

  /**
   * (同じ色の)繋がっている石の地点の配列を取得する
   * @param point
   */
  private static getConnectedStones(
    point: Point,
    boardState: BoardState
  ): Array<Stone> {
    const color = boardState[point.x][point.y];
    if (color !== PointState.Black && color !== PointState.White) {
      return [];
    }

    const stones: Array<Stone> = [];
    const loop = (point_: Point): void => {
      // すでにチェックされていたら終了
      if (
        stones.find((s) => s.point.x === point_.x && s.point.y === point_.y)
      ) {
        return;
      }

      stones.push({ color, point: point_ });
      // 左
      const lp = leftP(point_);
      if (boardState[lp.x][lp.y] === color) loop(lp);
      // 上
      const up = upperP(point_);
      if (boardState[up.x][up.y] === color) loop(up);
      // 右
      const rp = rightP(point_);
      if (boardState[rp.x][rp.y] === color) loop(rp);
      // 下
      const lowP = lowerP(point_);
      if (boardState[lowP.x][lowP.y] === color) loop(lowP);
    };

    loop(point);

    return stones;
  }

  private isSuicide(color: Color, point: Point): boolean {
    // 仮に石を置いてみる
    const clonedBoardState = copyMatrix(this._boardState);
    clonedBoardState[point.x][point.y] = color;

    // - 置いた石が敵石に囲まれていなければ自殺手ではない
    if (!Board.isSurroundedByEnemy(point, clonedBoardState)) {
      return false;
    }

    // - 置いた石が敵石に囲まれているが、敵石のいずれかを囲めるなら自殺手ではない
    const left = leftP(point);
    const upper = upperP(point);
    const right = rightP(point);
    const lower = lowerP(point);
    if (
      // 左
      (clonedBoardState[left.x][left.y] === oppositeColor(color) &&
        Board.isSurroundedByEnemy(left, clonedBoardState)) ||
      // 上
      (clonedBoardState[upper.x][upper.y] === oppositeColor(color) &&
        Board.isSurroundedByEnemy(upper, clonedBoardState)) ||
      // 右
      (clonedBoardState[right.x][right.y] === oppositeColor(color) &&
        Board.isSurroundedByEnemy(right, clonedBoardState)) ||
      // 下
      (clonedBoardState[lower.x][lower.y] === oppositeColor(color) &&
        Board.isSurroundedByEnemy(lower, clonedBoardState))
    ) {
      return false;
    }

    return true;
  }

  /**
   * 地点に石があり、かつその石が敵石に囲まれているかどうかを判定
   * @param point
   * @param boardState
   */
  private static isSurroundedByEnemy(point: Point, boardState: BoardState) {
    if (
      boardState[point.x][point.y] === PointState.Empty ||
      boardState[point.x][point.y] === PointState.Edge
    ) {
      return false;
    }

    const checked: Array<Point> = [];
    const color = boardState[point.x][point.y];
    const loop = (point_: Point): boolean => {
      // すでにチェックされていたら終了
      if (checked.find((c) => c.x === point_.x && c.y === point_.y)) {
        return true;
      }
      checked.push(point_);
      // 空きが見つかったら終了
      if (boardState[point_.x][point_.y] === PointState.Empty) {
        return false;
      }
      // 同じ手番色なら、隣を再帰的に調べる
      if (boardState[point_.x][point_.y] === color) {
        // 左
        if (!loop(leftP(point_))) return false;
        // 上
        if (!loop(upperP(point_))) return false;
        // 右
        if (!loop(rightP(point_))) return false;
        // 下
        if (!loop(lowerP(point_))) return false;
      }
      return true;
    };

    return loop(point);
  }
}

export { Board };
