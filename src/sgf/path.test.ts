import { toPathString, toTreePath } from "./path";

test("TreePath to pathString", () => {
  let path = [0, 0, 0, 0, 1, 0, 0];
  let ans = "0:4.1+";
  expect(toPathString(path)).toEqual(ans);

  path = [0, 1, 0, 0, 0];
  ans = "0.1+";
  expect(toPathString(path)).toEqual(ans);

  path = [0];
  ans = "0";
  expect(toPathString(path)).toEqual(ans);

  path = [0, 1, 2, 0, 2, 2, 2];
  ans = "0.1.2.0.2:3";
  expect(toPathString(path)).toEqual(ans);

  path = [0, 1, 3, 0, 0, 1, 1, 1, 1];
  ans = "0.1.3.0:2.1:4";
  expect(toPathString(path)).toEqual(ans);
});

test("PathString to TreePath", () => {
  let pathString = "0:4.1+";
  let treePath = [0, 0, 0, 0, 1].concat(new Array(500).fill(0));
  expect(toTreePath(pathString)).toEqual(treePath);

  pathString = "0.1+";
  treePath = [0, 1].concat(new Array(500).fill(0));
  expect(toTreePath(pathString)).toEqual(treePath);

  pathString = "0";
  treePath = [0];
  expect(toTreePath(pathString)).toEqual(treePath);

  pathString = "0.1.2.0.2:3";
  treePath = [0, 1, 2, 0, 2, 2, 2];
  expect(toTreePath(pathString)).toEqual(treePath);

  pathString = "0.1.3.0:2.1:4";
  treePath = [0, 1, 3, 0, 0, 1, 1, 1, 1];
  expect(toTreePath(pathString)).toEqual(treePath);
});
