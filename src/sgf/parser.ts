import { Point, Property, Properties, isProperty } from "../types";
import { assertIsDefined, randmStr } from "../utils";
import { Tree } from "./tree";
import { Node, RootNode, InternalNode } from "./node";

class SGFFormatError extends Error {
  constructor(message?: string) {
    super(message);
    this.name = "ValidationError";
  }
}

// SGFの構造例
// (;ルート
//   (;着手1a;着手2a(;着手3aa)
//                  (;着手3ab;着手4ab))
//   (;着手1b(;着手2ba;着手3ba;着手4ba)
//           (;着手3bb)))

function escapeSgfString(sgf: string): string {
  return sgf.toString().replace(/]/g, "\\]");
}

function unescapeSgfString(sgf: string): string {
  return sgf.toString().replace(/\\]/g, "]");
}

function toTree(sgf: string): Tree {
  const rootNode = toNode(sgf);
  return new Tree({ rootNode });
}

function toNode(sgf: string, parent?: Node): Node {
  if (!sgf.startsWith("(") || !sgf.endsWith(")")) throw new SGFFormatError();
  // 先頭と末尾の()を取り除く
  const sgfStr = sgf.slice(1).slice(0, -1);

  // 親ノードを作成
  let firstLeftBracketIdx = -1;
  let isInSquareBracket = false;
  // const firstLeftBracketIdx = sgfStr.indexOf("(");
  for (let i = 0; i < sgfStr.length; i++) {
    if (sgfStr.charAt(i) === "[") isInSquareBracket = true;
    if (sgfStr.charAt(i) === "]") isInSquareBracket = false;
    if (
      sgfStr.charAt(i) === "(" &&
      !isInSquareBracket
      // (i === 0 && sgfStr.charAt(i) === "(") ||
      // (sgfStr.charAt(i) === "(" && sgfStr.charAt(i - 1) !== "\\")
    ) {
      firstLeftBracketIdx = i;
      break;
    }
  }

  const branchSgf =
    firstLeftBracketIdx !== -1 ? sgfStr.slice(0, firstLeftBracketIdx) : sgfStr;

  const nodeSgfs = branchSgf.split(";").filter((s) => s !== "");

  let top;
  if (parent == null) {
    top = new RootNode({
      id: randmStr(),
      properties: toProperties(nodeSgfs[0]),
    });
  } else {
    top = new InternalNode({
      id: randmStr(),
      properties: toProperties(nodeSgfs[0]),
      parent,
    });
  }

  nodeSgfs.shift();

  let bottom = top;
  for (const nodeSgf of nodeSgfs) {
    const properties = toProperties(nodeSgf);
    const node = new InternalNode({
      id: randmStr(),
      properties,
      parent: bottom,
    });
    bottom.addChild(node);
    bottom = node;
  }

  // childrenの生成
  const children: Array<InternalNode> = [];
  let leftBracketIdx = -1;
  let leftBracketCount = 0;
  let rightBracketCount = 0;
  isInSquareBracket = false;
  for (let i = 0; i < sgfStr.length; i++) {
    if (sgfStr.charAt(i) === "[") isInSquareBracket = true;
    if (sgfStr.charAt(i) === "]") isInSquareBracket = false;

    if (sgfStr.charAt(i) === "(" && !isInSquareBracket) {
      if (leftBracketIdx === -1) leftBracketIdx = i;
      leftBracketCount += 1;
    }

    if (sgfStr.charAt(i) === ")" && !isInSquareBracket) {
      if (leftBracketIdx === -1) throw new SGFFormatError();
      rightBracketCount += 1;
      if (leftBracketCount === rightBracketCount) {
        // 再帰
        const child = toNode(sgfStr.substring(leftBracketIdx, i + 1), bottom);
        children.push(child as InternalNode);
        leftBracketIdx = -1;
        leftBracketCount = 0;
        rightBracketCount = 0;
      }
    }
  }

  if (
    leftBracketIdx !== -1 ||
    leftBracketCount !== 0 ||
    rightBracketCount !== 0
  ) {
    throw new SGFFormatError(); // 対応する')'が見つからなかった場合
  }

  for (const child of children) {
    bottom.addChild(child);
  }

  return top;
}

// SZ[19]PB[芝野虎丸]PW[余正麒]AB[ab][cd] => {SZ: ["19"], PB: ["芝野虎丸"], PW: ["余正麒"], AB: ["ab", "cd"]}
function toProperties(nodeSgf: string): Properties {
  const regexp = new RegExp("(.*?])(?=[A-Z])|(.*?])$", "gs");
  // const props = nodeSgf.match(regexp); nodeSgfの末尾に改行コードが含まれていたりした場合うまくいかない

  const props = nodeSgf.trim().match(regexp);

  assertIsDefined(props);
  const properties: Properties = {};
  props.map((p) => {
    // const regexp = new RegExp("(.*?)(?=\\[)", "g");
    // const result = p.match(regexp);

    // assertIsDefined(result);

    // if (!isProperty(result[0])) throw new Error(); // Propertyが正しい値かどうか

    // properties[result[0]] = [];

    // 後読みがSafariなど一部の環境でエラーになる
    // const regexp2 = new RegExp("(?<=\\[).*?(?=])", "g");
    // const result2 = p.match(regexp2);
    // assertIsDefined(result2);
    // result2.map((r) => properties[result[0] as Property]?.push(r));

    // ので、正規表現を一旦諦めてシンプルなsplitで対応

    const propKey = p.slice(0, p.indexOf("["));
    properties[propKey as Property] = [];

    const valueStrs = p.slice(p.indexOf("["));
    let buf = "";
    let isInSquareBracket = false;
    for (var i = 0; i < valueStrs.length; i++) {
      // valueの始まりのSquare Bracketなら次に進む
      if (valueStrs.charAt(i) === "[" && !isInSquareBracket) {
        isInSquareBracket = true;
      }
      // valueの終わりのSquare Bracketなら値を追加して次に進む
      else if (
        valueStrs.charAt(i) === "]" &&
        valueStrs.charAt(i - 1) !== "\\"
      ) {
        properties[propKey as Property]?.push(buf);
        buf = "";
        isInSquareBracket = false;
      } else buf += valueStrs.charAt(i);
    }
  });

  return properties;
}

function toPoint(point: string): Point {
  const alpha = "abcdefghijklmnopqrs".split("");
  const pointArr = point.toLowerCase().split("");
  return {
    x: alpha.indexOf(pointArr[0]) + 1,
    y: alpha.indexOf(pointArr[1]) + 1,
  };
}

function pointTo(point: Point): string {
  const alpha = "abcdefghijklmnopqrs";
  return alpha.substr(point.x - 1, 1) + alpha.substr(point.y - 1, 1);
}

export { toProperties, toTree, toPoint, pointTo };
