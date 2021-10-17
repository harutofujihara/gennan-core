import { Move } from "../types";
import { Node, InternalNode } from "./node";
declare function nodeToMove(node: Node): Move;
declare function moveToInternalNode(move: Move, parent: Node): InternalNode;
export { nodeToMove, moveToInternalNode };
