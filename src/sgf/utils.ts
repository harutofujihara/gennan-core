import { Color, Move, Property } from "../types";
import { toPoint, pointTo } from "./parser";
import { Node, InternalNode } from "./node";
import { randmStr } from "../utils";

function nodeToMove(node: Node): Move {
  const b = node.properties[Property.B];
  const w = node.properties[Property.W];
  let move: Move;
  if (b != null && b.length > 0) {
    if (b[0] == null || b[0] == "tt") {
      move = {
        color: Color.Black,
      };
    } else {
      move = {
        color: Color.Black,
        point: toPoint(b[0]),
      };
    }
  } else if (w != null && w.length > 0) {
    if (w[0] == null || w[0] == "tt") {
      move = {
        color: Color.White,
      };
    } else {
      move = {
        color: Color.White,
        point: toPoint(w[0]),
      };
    }
  } else {
    throw new Error("");
  }
  return move;
}

function moveToInternalNode(move: Move, parent: Node): InternalNode {
  return new InternalNode({
    id: randmStr(),
    properties: {
      [move.color === Color.Black ? "B" : "W"]:
        move.point != null ? [pointTo(move.point)] : [],
    },
    parent,
  });
}

export { nodeToMove, moveToInternalNode };
