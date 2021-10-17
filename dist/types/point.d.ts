declare type Point = {
    x: number;
    y: number;
};
declare function leftP(point: Point): Point;
declare function upperP(point: Point): Point;
declare function rightP(point: Point): Point;
declare function lowerP(point: Point): Point;
export { Point, leftP, upperP, rightP, lowerP };
