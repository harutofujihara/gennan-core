import { propertiesToSgf } from "./stringifier";
import { toTree } from "./parser";

test("node to sgf", () => {
  const props = {
    SZ: ["19"],
    PB: ["芝野虎丸"],
    PW: ["余正麒"],
    AB: ["ab", "cd"],
  };
  expect(propertiesToSgf(props)).toBe(
    ";SZ[19]PB[芝野虎丸]PW[余正麒]AB[ab][cd]"
  );
});

test("tree to sgf", () => {
  const sgf =
    "(;SZ[19]PB[芝野虎丸]PW[余正麒]AB[ab][cd](;B[jj];W[ii])(;B[ij];W[hi]))";
  const tree = toTree(sgf);
  expect(tree.toSgf()).toBe(sgf);
});
