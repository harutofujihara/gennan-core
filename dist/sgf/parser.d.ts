import { Point, Properties } from "../types";
import { Tree } from "./tree";
declare function toTree(sgf: string): Tree;
declare function toProperties(nodeSgf: string): Properties;
declare function toPoint(point: string): Point;
declare function pointTo(point: Point): string;
export { toProperties, toTree, toPoint, pointTo };
