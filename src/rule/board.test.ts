import { Color, PointState } from "../types";
import { Board } from "./board";
test("check init rule board", () => {
  const board = new Board({ gridNum: 9 });

  expect(board.boardState.length).toEqual(11);

  expect(board.boardState[0]).toEqual([
    PointState.Edge,
    PointState.Edge,
    PointState.Edge,
    PointState.Edge,
    PointState.Edge,
    PointState.Edge,
    PointState.Edge,
    PointState.Edge,
    PointState.Edge,
    PointState.Edge,
    PointState.Edge,
  ]);

  expect(board.boardState[1]).toEqual([
    PointState.Edge,
    PointState.Empty,
    PointState.Empty,
    PointState.Empty,
    PointState.Empty,
    PointState.Empty,
    PointState.Empty,
    PointState.Empty,
    PointState.Empty,
    PointState.Empty,
    PointState.Edge,
  ]);

  expect(board.boardState[10]).toEqual([
    PointState.Edge,
    PointState.Edge,
    PointState.Edge,
    PointState.Edge,
    PointState.Edge,
    PointState.Edge,
    PointState.Edge,
    PointState.Edge,
    PointState.Edge,
    PointState.Edge,
    PointState.Edge,
  ]);
});

test("add move to nonempty point", () => {
  const board = new Board({
    gridNum: 9,
    fixedStones: [
      { color: Color.White, point: { x: 2, y: 1 } },
      { color: Color.White, point: { x: 1, y: 1 } },
    ],
  });

  expect(() => {
    board.takeMove({ color: Color.Black, point: { x: 1, y: 1 } });
  }).toThrow(Error("The point is not empty."));
});

test("add move and capture stone", () => {
  const board = new Board({
    gridNum: 9,
    fixedStones: [
      { color: Color.Black, point: { x: 3, y: 4 } },
      { color: Color.Black, point: { x: 4, y: 3 } },
      { color: Color.Black, point: { x: 4, y: 5 } },
      { color: Color.White, point: { x: 4, y: 4 } },
    ],
  });

  // capture white stone
  expect(board.getPointState({ x: 4, y: 4 })).toBe(PointState.White);
  board.takeMove({ color: Color.Black, point: { x: 5, y: 4 } });
  expect(board.getPointState({ x: 4, y: 4 })).toBe(PointState.Empty);
});

test("kou point can not placed soon", () => {
  const board = new Board({
    gridNum: 9,
    fixedStones: [
      { color: Color.Black, point: { x: 3, y: 4 } },
      { color: Color.Black, point: { x: 4, y: 3 } },
      { color: Color.Black, point: { x: 4, y: 5 } },
      { color: Color.White, point: { x: 4, y: 4 } },
      { color: Color.White, point: { x: 5, y: 3 } },
      { color: Color.White, point: { x: 6, y: 4 } },
      { color: Color.White, point: { x: 5, y: 5 } },
    ],
  });

  board.takeMove({ color: Color.Black, point: { x: 5, y: 4 } });
  expect(board.getPointState({ x: 4, y: 4 })).toBe(PointState.Empty);
  expect(() => {
    board.takeMove({ color: Color.White, point: { x: 4, y: 4 } });
  }).toThrow(Error("The point is kou."));
});

test("Snapback(Uttegaesi) is not kou", () => {
  const board = new Board({
    gridNum: 9,
    fixedStones: [
      { color: Color.Black, point: { x: 3, y: 4 } },
      { color: Color.Black, point: { x: 4, y: 3 } },
      { color: Color.Black, point: { x: 5, y: 3 } },
      { color: Color.Black, point: { x: 6, y: 4 } },
      { color: Color.Black, point: { x: 6, y: 5 } },
      { color: Color.Black, point: { x: 5, y: 6 } },

      { color: Color.White, point: { x: 4, y: 4 } },
      { color: Color.White, point: { x: 5, y: 4 } },
      { color: Color.White, point: { x: 3, y: 5 } },
      { color: Color.White, point: { x: 4, y: 6 } },
    ],
  });

  board.takeMove({ color: Color.Black, point: { x: 4, y: 5 } });
  board.takeMove({ color: Color.White, point: { x: 5, y: 5 } });
  board.takeMove({ color: Color.Black, point: { x: 4, y: 5 } });
  expect(board.getPointState({ x: 4, y: 4 })).toBe(PointState.Empty);
  expect(board.getPointState({ x: 5, y: 4 })).toBe(PointState.Empty);
  expect(board.getPointState({ x: 5, y: 5 })).toBe(PointState.Empty);
  // expect(() => {
  //   board.takeMove({ color: Color.White, point: { x: 4, y: 4 } });
  // }).toThrow(Error("The point is kou."));
});

test("undo", () => {
  const board = new Board({
    gridNum: 9,
    fixedStones: [
      { color: Color.Black, point: { x: 3, y: 4 } },
      { color: Color.Black, point: { x: 4, y: 3 } },
      { color: Color.Black, point: { x: 4, y: 5 } },
      { color: Color.White, point: { x: 4, y: 4 } },
    ],
  });

  // capture white stone
  expect(board.getPointState({ x: 4, y: 4 })).toBe(PointState.White);
  board.takeMove({ color: Color.Black, point: { x: 5, y: 4 } });
  expect(board.getPointState({ x: 4, y: 4 })).toBe(PointState.Empty);
  expect(board.capturesCount[Color.White]).toBe(1);

  // undo
  board.undoMove();
  expect(board.getPointState({ x: 4, y: 4 })).toBe(PointState.White);
  expect(board.capturesCount[Color.White]).toBe(0);
});

test("suicide", () => {
  const board = new Board({
    gridNum: 9,
    fixedStones: [
      { color: Color.White, point: { x: 2, y: 1 } },
      { color: Color.White, point: { x: 1, y: 2 } },
      { color: Color.White, point: { x: 1, y: 3 } },
      { color: Color.White, point: { x: 3, y: 2 } },
      { color: Color.White, point: { x: 3, y: 3 } },
      { color: Color.White, point: { x: 2, y: 4 } },
      { color: Color.Black, point: { x: 2, y: 2 } },
    ],
  });

  expect(() =>
    board.takeMove({ color: Color.Black, point: { x: 2, y: 3 } })
  ).toThrow();
});
