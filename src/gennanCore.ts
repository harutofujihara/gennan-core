import {
  Color,
  GridNum,
  isGridNum,
  Move,
  Point,
  PointState,
  Stone,
} from "./types";
import {
  Tree,
  TreePath,
  pointTo,
  toPoint,
  toTree,
  nodeToMove,
  addProperty,
  Property,
  removeProperty,
} from "./sgf";
import { Board } from "./rule";
import { nextAlpha } from "./utils";

export type MoveOption = {
  idx: number;
  move: Move;
};

export type ViewPointState = {
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

export type ViewBoard = Array<Array<ViewPointState>>;

const STAR_POINTS = {
  9: [{ x: 5, y: 5 }],
  13: [
    { x: 4, y: 4 },
    { x: 4, y: 10 },
    { x: 7, y: 7 },
    { x: 10, y: 4 },
    { x: 10, y: 10 },
  ],
  19: [
    { x: 4, y: 4 },
    { x: 4, y: 10 },
    { x: 4, y: 16 },
    { x: 10, y: 4 },
    { x: 10, y: 10 },
    { x: 10, y: 16 },
    { x: 16, y: 4 },
    { x: 16, y: 10 },
    { x: 16, y: 16 },
  ],
};

class GennanCore {
  private tree: Tree;
  private board: Board;

  private constructor(tree: Tree) {
    this.tree = tree;
    this.board = new Board({
      gridNum: this.gridNum,
      fixedStones: this.fixedStones,
    });
  }

  /**
   * Factory
   * @param gridNum
   */
  static create(gridNum: GridNum = 19): GennanCore {
    const sgf = "(;CA[utf-8]FF[4]GM[1]SZ[" + String(gridNum) + "])";
    return new GennanCore(toTree(sgf));
  }

  /**
   * Factory
   * @param sgf
   */
  static createFromSgf(sgf: string): GennanCore {
    return new GennanCore(toTree(sgf));
  }

  /**
   * BoardState for View
   */
  get viewBoard(): ViewBoard {
    const viewBoard: ViewBoard = this.board.boardState
      .filter((_, i) => i !== 0 && i !== this.board.boardState.length - 1)
      .map((v) => {
        return v
          .filter((_, i) => i !== 0 && i !== this.board.boardState.length - 1)
          .map((vv) => {
            let color;
            if (vv === PointState.Black) color = Color.Black;
            if (vv === PointState.White) color = Color.White;
            return {
              color,
              circle: false,
              square: false,
              triangle: false,
              cross: false,
              current: false,
              star: false,
            };
          });
      });

    // markups
    this.tree.properties[Property.CR]?.map((sp) => {
      const point = toPoint(sp);
      viewBoard[point.x - 1][point.y - 1].circle = true; // viewBoardは1から始まるので地点をずらす
    });
    this.tree.properties[Property.TR]?.map((sp) => {
      const point = toPoint(sp);
      viewBoard[point.x - 1][point.y - 1].triangle = true;
    });
    this.tree.properties[Property.SQ]?.map((sp) => {
      const point = toPoint(sp);
      viewBoard[point.x - 1][point.y - 1].square = true;
    });
    this.tree.properties[Property.MA]?.map((sp) => {
      const point = toPoint(sp);
      viewBoard[point.x - 1][point.y - 1].cross = true;
    });
    this.tree.properties[Property.LB]?.map((sp) => {
      const spl = sp.split(":");
      const point = toPoint(spl[0]);
      viewBoard[point.x - 1][point.y - 1].text = spl[1];
    });

    // star
    STAR_POINTS[this.gridNum].map(
      (p) => (viewBoard[p.x - 1][p.y - 1].star = true)
    );

    // current
    if (!this.tree.atRoot()) {
      const move = nodeToMove(this.tree.node);
      if (move.point != null) {
        viewBoard[move.point.x - 1][move.point.y - 1].current = true;
      }
    }

    // next
    const nos = this.nextMoveOptions.filter((no) => no.move.point != null);
    if (nos.length > 0) {
      nos.map((no) => {
        if (no.move.point != null) {
          viewBoard[no.move.point.x - 1][no.move.point.y - 1].nextIndex =
            no.idx;
        }
      });
    }

    return viewBoard;
  }

  get sgf(): string {
    return this.tree.toSgf();
  }

  get currentPath(): TreePath {
    return this.tree.getCurrentPath();
  }

  get nextMoveOptions(): Array<MoveOption> {
    return this.tree.nextNodes.map((v, i) => {
      return {
        idx: i,
        move: nodeToMove(v),
      };
    });
  }

  get gridNum(): GridNum {
    const sz = this.tree.rootProperties[Property.SZ];
    if (sz != null) {
      const gn = Number(sz[0]);
      if (isGridNum(gn)) return gn;
    }
    return this.board.gridNum;
  }

  get teban(): Color {
    return this.board.teban;
  }

  get fixedStones(): Array<Stone> {
    const stones: Array<Stone> = [];
    const blacks = this.tree.rootProperties[Property.AB];
    if (blacks != null) {
      blacks.map((v) => stones.push({ color: Color.Black, point: toPoint(v) }));
    }

    const whites = this.tree.rootProperties[Property.AW];
    if (whites != null) {
      whites.map((v) => stones.push({ color: Color.White, point: toPoint(v) }));
    }

    return stones;
  }

  get gameName(): string | undefined {
    const gn = this.tree.rootProperties[Property.GN];
    if (gn != null) {
      return gn[0];
    }
  }
  public setGameName(gameName: string): void {
    if (this.gameName != null) {
      this.removeRootProp(Property.GN, this.gameName);
    }
    this.setRootProp(Property.GN, gameName);
  }

  get blackPlayer(): string | undefined {
    const bp = this.tree.rootProperties[Property.PB];
    if (bp != null) {
      return bp[0];
    }
  }
  public setBlackPlayer(blackPlayer: string): void {
    if (this.blackPlayer != null) {
      this.removeRootProp(Property.PB, this.blackPlayer);
    }
    this.setRootProp(Property.PB, blackPlayer);
  }

  get whitePlayer(): string | undefined {
    const qp = this.tree.rootProperties[Property.PW];
    if (qp != null) {
      return qp[0];
    }
  }
  public setWhitePlayer(whitePlayer: string): void {
    if (this.whitePlayer != null) {
      this.removeRootProp(Property.PW, this.whitePlayer);
    }
    this.setRootProp(Property.PW, whitePlayer);
  }

  get komi(): number | undefined {
    const km = this.tree.rootProperties[Property.KM];
    if (km != null) {
      return Number(km[0]);
    }
  }
  public setKomi(komi: number): void {
    if (this.komi != null) {
      this.removeRootProp(Property.KM, this.komi.toString());
    }
    this.setRootProp(Property.KM, komi.toString());
  }

  get comment(): string | undefined {
    const c = this.tree.properties[Property.C];
    if (c != null) {
      return c[0];
    }
  }
  public setComment(comment: string): void {
    if (this.comment != null) {
      this.removeProp(Property.C, this.comment);
    }
    this.setProp(Property.C, comment);
  }

  private initBoard(): void {
    this.board = new Board({
      gridNum: this.gridNum,
      fixedStones: this.fixedStones,
    });
  }

  public playForward(idx = 0): void {
    if (this.tree.atLeaf()) throw new Error("There are not next moves.");
    if (!this.tree.nextNodes[idx]) throw new Error("Move index is invalid.");

    this.board.takeMove(nodeToMove(this.tree.nextNodes[idx]));
    this.tree.down(idx);
  }

  public playBackward(): void {
    if (this.tree.atRoot()) throw new Error("This is root now.");

    this.board.undoMove();
    this.tree.up();
  }

  public playToPath(path_: TreePath): void {
    // 初期化
    this.tree = toTree(this.sgf);
    this.board = new Board({});

    // 移動
    const path = [...path_];
    if (path.length > 0) path.shift(); // 最初がrootNode
    while (path.length > 0) {
      this.playForward(path.shift());
    }
  }

  // 一手追加する
  public addMove(move: Move): void {
    const child = this.tree.createChildNode({
      [move.color === Color.Black ? "B" : "W"]:
        move.point != null ? [pointTo(move.point)] : [],
    });
    this.tree.addNode(child);
  }

  // 一手削除する
  public removeMove(): void {
    if (this.existsBackMove()) {
      this.tree.removeNode();
      this.board.undoMove();
    }
  }

  public existsNextMove(): boolean {
    return this.tree.nextNodes.length > 0;
  }
  public existsBackMove(): boolean {
    return !this.tree.atRoot();
  }

  private setProp(property: Property, sgf: string): void {
    const newProps = addProperty(this.tree.properties, property, sgf);
    this.tree.setProps(newProps);
  }
  private removeProp(property: Property, sgf: string): void {
    const newProps = removeProperty(this.tree.properties, property, sgf);
    this.tree.setProps(newProps);
  }

  private setRootProp(property: Property, sgf: string): void {
    const newProps = addProperty(this.tree.rootProperties, property, sgf);
    this.tree.setRootProps(newProps);
  }
  private removeRootProp(property: Property, sgf: string): void {
    const newProps = removeProperty(this.tree.rootProperties, property, sgf);
    this.tree.setRootProps(newProps);
  }

  public setCircle(point: Point): void {
    this.setProp(Property.CR, pointTo(point));
  }
  public removeCircle(point: Point): void {
    this.removeProp(Property.CR, pointTo(point));
  }
  public setSquare(point: Point): void {
    this.setProp(Property.SQ, pointTo(point));
  }
  public removeSquare(point: Point): void {
    this.removeProp(Property.SQ, pointTo(point));
  }
  public setTriangle(point: Point): void {
    this.setProp(Property.TR, pointTo(point));
  }
  public removeTriangle(point: Point): void {
    this.removeProp(Property.TR, pointTo(point));
  }
  public setCross(point: Point): void {
    this.setProp(Property.MA, pointTo(point));
  }
  public removeCross(point: Point): void {
    this.removeProp(Property.MA, pointTo(point));
  }

  public setAlpha(point: Point): void {
    const ps = pointTo(point);
    const properties = this.tree.properties;
    const LB = properties[Property.LB];

    let next = "A";
    if (LB != null) {
      const regex = /[^a-z]/gi; // a-z(lower,upperは無視)以外の文字が含まれているか判定する正規表現
      const alphas = LB.filter((v) => !v.slice(-1).match(regex));
      if (alphas.length > 0) {
        const last = alphas.map((v) => v.slice(-1)).sort()[alphas.length - 1];
        next = nextAlpha(last).toUpperCase();
      }
    }

    this.setProp(Property.LB, ps + ":" + next);
  }

  public setIncrement(point: Point): void {
    const ps = pointTo(point);
    const properties = this.tree.properties;
    const LB = properties[Property.LB];

    let next = 1;
    if (LB != null) {
      const nums = LB.filter((v) => {
        return !isNaN(v.split(":")[1] as any);
      });
      if (nums.length > 0) {
        const last = nums
          .map((v) => Number(v.split(":")[1]))
          .sort((a, b) => a - b)[nums.length - 1];
        next = Number(last) + 1;
      }
    }

    this.setProp(Property.LB, ps + ":" + next.toString());
  }

  public removeText(point: Point): void {
    const sgf = pointTo(point);
    const properties = this.tree.properties;
    const LB = properties[Property.LB];

    if (LB != null) {
      // 取り除く
      properties[Property.LB] = LB.filter((v) => v.slice(0, 2) !== sgf);
    }

    // 更新
    this.tree.setProps(properties);
  }

  /**
   * 置石をセットする
   * @param stone
   */
  public addFixedStone(stone: Stone): void {
    const newProps = addProperty(
      this.tree.rootProperties,
      stone.color === Color.Black ? "AB" : "AW",
      pointTo(stone.point)
    );
    this.tree.setProps(newProps);

    this.initBoard();
  }

  public removeFixedStone(stone: Stone): void {
    const newProps = removeProperty(
      this.tree.rootProperties,
      stone.color === Color.Black ? "AB" : "AW",
      pointTo(stone.point)
    );
    this.tree.setProps(newProps);

    this.initBoard();
  }
}

export { GennanCore };
