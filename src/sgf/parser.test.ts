import { toProperties, toTree } from "./parser";
test("toProperties", () => {
  expect(
    toProperties(`SZ[19]PB[芝野虎丸]PW[余正麒]AB[ab][cd]C[te\nst]`)
  ).toEqual({
    SZ: ["19"],
    PB: ["芝野虎丸"],
    PW: ["余正麒"],
    AB: ["ab", "cd"],
    C: ["te\nst"],
  });
});

// test("toTree", () => {
//   const tree = toTree(
//     "(;SZ[19]PB[芝野虎丸]PW[余正麒]AB[ab][cd](;B[jj];W[ii])(;B[ij];W[hi]))"
//   );
//   expect(tree.rootProperties).toEqual({
//     SZ: ["19"],
//     PB: ["芝野虎丸"],
//     PW: ["余正麒"],
//     AB: ["ab", "cd"],
//   });

//   // 1手目
//   tree.down(1);
//   expect(tree.properties).toEqual({ B: ["ij"] });
//   // // 親と子がの情報が一致しているか
//   // expect(tree.node).toEqual(tree.nextNodes[0].parent);

//   // 2手目
//   tree.down();
//   expect(tree.properties).toEqual({ W: ["hi"] });
// });
