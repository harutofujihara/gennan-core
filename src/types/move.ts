import { Color } from "../types";
import { Point } from "./point";

export type Move = {
  color: Color;
  point?: Point; // if point is undefined, move represent 'PASS'
};
