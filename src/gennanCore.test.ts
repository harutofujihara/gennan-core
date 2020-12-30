import { GennanCore } from "./gennanCore";
import { MarkupSymbol, PointState } from "./types";
import { Color } from "./types";

test("toProperties", () => {
  const gc = GennanCore.createFromSgf(
    "(;SZ[19]PB[芝野虎丸]PW[余正麒]AB[ab][cd](;B[jj];W[ii])(;B[ij];W[hi]))"
  );

  expect(gc.nextMoveOptions.length).toBe(2);
  gc.playForward();
  expect(gc.nextMoveOptions.length).toBe(1);
  gc.playBackward();
  expect(gc.nextMoveOptions.length).toBe(2);

  expect(gc.viewBoard.length).toBe(19);
});

test("view board", () => {
  const gc = GennanCore.createFromSgf(
    "(;SZ[19]PB[芝野虎丸]PW[余正麒]AB[ab][cd](;B[jj]CR[aa][bb]TR[aa];W[ii])(;B[ij];W[hi]))"
  );
  expect(gc.viewBoard[1][1]).toEqual({
    circle: false,
    square: false,
    triangle: false,
    cross: false,
    current: false,
    star: false,
  });

  gc.playForward();
  expect(gc.viewBoard[0][0]).toEqual({
    circle: true,
    square: false,
    triangle: true,
    cross: false,
    current: false,
    star: false,
  });
  expect(gc.viewBoard[1][1]).toEqual({
    circle: true,
    square: false,
    triangle: false,
    cross: false,
    current: false,
    star: false,
  });
  expect(gc.viewBoard[9][9]).toEqual({
    color: PointState.Black,
    circle: false,
    square: false,
    triangle: false,
    cross: false,
    current: true,
    star: true,
  });
});

test("create from gridnum", () => {
  const gc = GennanCore.create(19);
  expect(gc.nextMoveOptions.length).toBe(0);
});

test("playToPath", () => {
  const gc = GennanCore.createFromSgf(
    "(;SZ[19]PB[芝野虎丸]PW[余正麒]AB[ab][cd](;B[jj]CR[aa][bb]TR[aa];W[ii])(;B[ij];W[hi]))"
  );

  gc.playToPath([0, 1, 0]);
  expect(gc.viewBoard[7][8].current).toBeTruthy();
});

test("add move", () => {
  const gc = GennanCore.createFromSgf(
    "(;SZ[19]PB[芝野虎丸]PW[余正麒]AB[ab][cd](;B[jj]CR[aa][bb]TR[aa];W[ii])(;B[ij];W[hi]))"
  );

  gc.playForward();
  gc.addMove({ color: Color.White, point: { x: 3, y: 3 } });
  expect(gc.nextMoveOptions.length).toBe(2);
  gc.playForward(gc.nextMoveOptions.length - 1);
  expect(gc.nextMoveOptions.length).toBe(0);
  gc.addMove({ color: Color.Black, point: { x: 2, y: 2 } });
  expect(gc.nextMoveOptions.length).toBe(1);
});

test("set and remove circle", () => {
  const gc = GennanCore.createFromSgf(
    "(;SZ[19]PB[芝野虎丸]PW[余正麒]AB[ab][cd](;B[jj]CR[aa][bb]TR[aa];W[ii])(;B[ij];W[hi]))"
  );
  gc.setSymbol({ x: 1, y: 1 }, MarkupSymbol.Circle);
  expect(gc.viewBoard[0][0].circle).toBeTruthy();

  gc.removeSymbol({ x: 1, y: 1 }, MarkupSymbol.Circle);
  expect(gc.viewBoard[0][0].circle).toBeFalsy();
});

// test("set alpha", () => {
//   const gc = GennanCore.createFromSgf(
//     "(;SZ[19]PB[芝野虎丸]PW[余正麒]AB[ab][cd](;B[jj]CR[aa][bb]TR[aa];W[ii])(;B[ij];W[hi]))"
//   );
//   gc.setAlpha({ x: 1, y: 1 });
//   gc.setAlpha({ x: 2, y: 2 });
//   expect(gc.viewBoard[0][0].text).toBe("A");
//   expect(gc.viewBoard[1][1].text).toBe("B");
// });

// test("set increment", () => {
//   const gc = GennanCore.createFromSgf(
//     "(;SZ[19]PB[芝野虎丸]PW[余正麒]AB[ab][cd](;B[jj]CR[aa][bb]TR[aa];W[ii])(;B[ij];W[hi]))"
//   );
//   gc.setIncrement({ x: 1, y: 1 });
//   gc.setIncrement({ x: 2, y: 2 });
//   expect(gc.viewBoard[0][0].text).toBe("1");
//   expect(gc.viewBoard[1][1].text).toBe("2");
// });

test("viewBoard reactivity", () => {
  const gc = GennanCore.createFromSgf(
    "(;SZ[19]PB[芝野虎丸]PW[余正麒]AB[ab][cd];B[aa];W[bb])"
  );
  // forward
  expect(gc.viewBoard[0][0].color).toEqual(undefined);
  gc.playForward();
  expect(gc.viewBoard[0][0].color).toEqual(Color.Black);

  // set circle
  let viewBoard;
  viewBoard = gc.viewBoard;
  expect(viewBoard[1][1].circle).toBeFalsy();
  gc.setSymbol({ x: 2, y: 2 }, MarkupSymbol.Circle);
  viewBoard = gc.viewBoard;
  expect(viewBoard[1][1].circle).toBeTruthy();
});
