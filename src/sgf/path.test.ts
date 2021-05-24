import { GennanCore } from "../gennanCore";
import {
  parseFragment,
  parseInitialPath,
  toFragmentString,
  toInitPathString,
} from "./path";

test("toInitPathString", () => {
  let path = [0, 0, 0, 1];
  let initPathString = "3.1";
  expect(toInitPathString(path)).toEqual(initPathString);

  path = [0, 0, 0, 0];
  initPathString = "4";
  expect(toInitPathString(path)).toEqual(initPathString);

  path = [0, 0, 0, 0, 1, 1, 1];
  initPathString = "4.1:3";
  expect(toInitPathString(path)).toEqual(initPathString);

  path = [0, 0, 0, 0, 1, 1, 1, 0, 0, 0, 0, 0, 0, 0];
  initPathString = "4.1:3+";
  expect(toInitPathString(path, true)).toEqual(initPathString);
});

test("toFragmentString", () => {
  let path = [2, 0, 1, 2, 6];
  let initPathString = "2.0.1.2.6";
  expect(toFragmentString(path)).toEqual(initPathString);
  path = [0, 0, 0, 0];
  initPathString = "0:4";
  expect(toFragmentString(path)).toEqual(initPathString);
  path = [0, 0, 0, 0, 1, 1, 1];
  initPathString = "0:4.1:3";
  expect(toFragmentString(path)).toEqual(initPathString);
});

test("parseInitialPath", () => {
  let initPathStr = "0.2.6+";
  let path = [2, 6].concat(new Array(500).fill(0));
  expect(parseInitialPath(initPathStr)).toEqual(path);

  initPathStr = "+";
  expect(parseInitialPath(initPathStr)).toEqual(new Array(500).fill(0));
});

test("parseFragment", () => {
  let initPathStr = "3.2.1";
  let path = [3, 2, 1];
  expect(parseFragment(initPathStr)).toEqual(path);
});

test("test", () => {
  const sgf =
    "(;SZ[19]PB[芝野虎丸]PW[余正麒](;B[jj];W[ii];B[js];W[ie](;B[ad];W[ac];B[ab])(;B[ab];W[ac];B[ad])))";
  const gc = GennanCore.createFromSgf(sgf);

  let currentPath = gc.currentPath;
  let initPath = toInitPathString(currentPath, !gc.existsNextMove);
  expect(currentPath).toEqual([]);
  expect(initPath).toEqual("0");

  gc.playForward();
  gc.playForward();
  gc.playForward();
  gc.playForward();
  gc.playForward(1);
  gc.playForward();
  gc.playForward();

  currentPath = gc.currentPath;
  initPath = toInitPathString(currentPath, !gc.existsNextMove);

  expect(currentPath).toEqual([0, 0, 0, 0, 1, 0, 0]);
  // expect(initPath).toEqual("4.1.0:2");
  expect(initPath).toEqual("4.1+");

  const gc2 = GennanCore.createFromSgf(sgf);
  expect(gc2.currentPath).toEqual([]);

  gc2.setFromInitPath(parseInitialPath(initPath));
  currentPath = gc2.currentPath;
  initPath = toInitPathString(currentPath, !gc2.existsNextMove);
  expect(initPath).toEqual("4.1+");
  expect(gc2.viewBoard).toEqual(gc.viewBoard);
});
