import { InternalNode } from "./node";
import { toTree } from "./parser";

test("Nodeのコピーができていることを確認する", () => {
  const tree = toTree(
    "(;SZ[19]PB[芝野虎丸]PW[余正麒]AB[ab][cd](;B[jj];W[ii])(;B[ij];W[hi]))"
  );

  expect(tree.nextNodes.length).toEqual(2); // 最初の分岐は2

  const newNode = new InternalNode({
    id: "testtest",
    properties: {},
    parent: tree.node,
  });

  tree.node.addChild(newNode); // treeからgetterで取得した現在のnode
  expect(tree.nextNodes.length).toEqual(2); // これにchildNodeを追加しても、treeのnextNodesは変化していない

  tree.addNode(newNode); // treeのchild Node追加メソッド
  expect(tree.nextNodes.length).toEqual(3); // カプセル化がうまくいっていることを確認
});
