type Point = {
  x: number;
  y: number;
};

function leftP(point: Point): Point {
  return {
    x: point.x - 1,
    y: point.y,
  };
}
function upperP(point: Point): Point {
  return {
    x: point.x,
    y: point.y - 1,
  };
}
function rightP(point: Point): Point {
  return {
    x: point.x + 1,
    y: point.y,
  };
}
function lowerP(point: Point): Point {
  return {
    x: point.x,
    y: point.y + 1,
  };
}

export { Point, leftP, upperP, rightP, lowerP };
