import { Color } from "./";

const PointState = {
  Black: Color.Black,
  White: Color.White,
  Empty: "Empty",
  Edge: "Edge",
} as const;
type PointState = typeof PointState[keyof typeof PointState];

export { PointState };
